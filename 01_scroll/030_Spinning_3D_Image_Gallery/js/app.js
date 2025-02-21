
/**************************************************************

I Finally Nailed The Spinning 3D Image Gallery (After Dodging It Forever)
https://www.youtube.com/watch?v=fY1jqR86ThI&t=431s

// GSAPライブラリ
https://cdnjs.com/libraries/gsap

gsap easings  https://gsap.com/docs/v3/Eases/

***************************************************************/
import Lenis from 'lenis';

import { 
  Mesh, 
  TextureLoader,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BufferGeometry,
  LinearFilter,
  AmbientLight,
  AxesHelper,
  Group,
  CylinderGeometry,
  MeshPhongMaterial,
  DoubleSide,
  LinearMipmapLinearFilter,
  Float32BufferAttribute,
} from 'three'


const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});
// devicePixelRatio → 1つのCSSピクセルが何個の物理ピクセルで表現されるかを示す比率
//                    DPR = 物理ピクセル / CSSピクセル
//                    例: DPR = 1の場合: 1つのCSSピクセル = 1つの物理ピクセル（通常のディスプレイ）。
//                        DPR = 2の場合: 1つのCSSピクセル = 2x2（4個）の物理ピクセル（高解像度の「Retinaディスプレイ」など）。
// CSSピクセル → Webページを設計・レンダリングするときに使われる論理的な単位で、開発者がレイアウトやスタイリングで指定する「ピクセル」
//              デバイスごとに決められているが、ブラウザがDPRを利用して計算している。
//              ブラウザはデバイスのDPR情報を読み取り、CSSピクセルの数を算出します。
// 物理ピクセル → 画面を構成する、物理的な小さな点のことです。これらはハードウェア（ディスプレイパネル）のレベルで固定されており、デバイスによって異なる
//              例えば、スマートフォンのディスプレイ解像度が「1920x1080」なら、その画面には1920個の横方向の物理ピクセルと、1080個の縦方向の物理ピクセル
// なぜDPRが重要なのか？
// → DPRが高いと、1つのCSSピクセルに割り当てられる物理ピクセル数が増えるため、画像や文字がより細かく滑らかに表示される
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
// レンダラーの背景色を黒に。第2引数は透明度。1で完全に色がつく
renderer.setClearColor(0x000000, 0); 
document.body.appendChild(renderer.domElement);

camera.position.z = 12;
camera.position.y = 0;

// AmbientLight → シーン全体を照らす光。故にヘルパーは存在しない
const ambientLight = new AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const axesHelper = new AxesHelper(20);
scene.add(axesHelper);

// Groupメッシュ → シーン内の複数のオブジェクトを一緒に管理し、まとめて操作できるようにするために使用
//                ここでは、galleryGroup.rotation.y のようにひとまとめに回転させることができる
const galleryGroup = new Group();
scene.add(galleryGroup);


const cylinderRadius = 6;
const cylinderHeight = 30;
const segments = 30;

const cylinderGeometry = new CylinderGeometry(
  cylinderRadius, // topの半径
  cylinderRadius, // bottomの半径
  cylinderHeight, // 高さ
  segments, // 縦と横のセグメント
  1,
  true, // エッジ部分を開けるか
);

const cylinderMaterial = new MeshPhongMaterial({
  color: 0xffffff,
  // color: "#76f785",
  transparent: true, 
  opacity: 0,
  side: DoubleSide,
});

const cylinder = new Mesh(cylinderGeometry, cylinderMaterial);
galleryGroup.add(cylinder);
// console.log(galleryGroup); // Group {isObject3D: true, uuid: 'bef95482-792e-478c-a036-9d7eee830105', name: '', type: 'Group', parent: Scene, …}

const textureLoader = new TextureLoader();

let currentScroll = 0;

// 総スクロール量
// console.log(document.documentElement); // html。ルート要素
// console.log(document.documentElement.scrollHeight); // 5440
const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
// console.log(totalScroll);

let rotationSpeed = 0;
const baseRotationSpeed = .0025;
const maxRotationSpeed = .05;

// Lenis 初期化
const lenis = new Lenis({
  // Lenis の自動的なアニメーション更新を有効にするかどうか
  // Lenis は、スムーズスクロールを提供するために、ブラウザのスクロールイベントを制御する。
  // しかし、スムーズスクロールを実現するには、アニメーションを更新するタイミングを正しく制御する必要があり、
  // これを実現するために、requestAnimationFrameを使って、ブラウザの描画サイクルに合わせてスクロールの位置を更新する必要がある
  autoRaf: true,
});

lenis.on("scroll", (e) => {
  // currentScroll = window.pageYOffset;
  currentScroll = window.scrollY;
  // console.log(currentScroll);

  // console.log(e.velocity);
  // velocity → スクロールをしたときの スクロールの速さ を示しており、スクロールのスピードに比例して値が大きくなる
  //            Lenis特有のプロパティで、標準のscrollイベントには存在しない
  rotationSpeed = e.velocity * .005;
});


window.addEventListener("DOMContentLoaded", init);

async function init(){
  initializeBlocks();
  render();
}

const numVerticalBlocks = 12; // 何段にするか(円柱全体を何分割(ブロック)するか)
const imagesPerBlocks = 2; // 各ブロックで何枚の画像を配置するか
const blockHeight = 3.25; // 縦方向の間隔(各ブロック自体の高さ。ブロック間の隙間も含める)
const blocks = []; // 生成されたブロックを格納

const totalBlocksHeight = numVerticalBlocks * blockHeight; // ブロック全体の高さ
// console.log(totalBlocksHeight); // 39
const verticalMargin = (cylinderHeight - totalBlocksHeight) / 2; // cylinderHeight: 30。 余った高さを上と下に均等に分けるための値。
// console.log(verticalMargin); // -4.5

// initialBlockPos ... 最下段のブロックの「開始位置」
// y軸が-19.5の位置でブロックのbottomがくるように実装している。
// verticalMargin → 円柱から飛び出しているブロックの高さ
// blockHeight → 最下層のラインに対して画像のtopが配置されるから上にずらす
// ⭐️3D空間ではy軸下に行けばマイナスなので、ここでは-16.25の位置から始まる
const initialBlockPos = (- cylinderHeight / 2) + verticalMargin + blockHeight;
// console.log(initialBlockPos); // -16.25

// Math.PI * 2 → 円周全体の角度
const anglePerImage = (Math.PI * 2) / imagesPerBlocks; // 1つの画像が占める角度
const maxRandomAngle = anglePerImage * .3; // 1枚の画像を配置するときの誤差


// 3Dシーンに「カーブした平面(ブロック)」を段階的に配置して、円柱の形状を持つギャラリーを構成する
// numVerticalBlocks。画像の行数 12
async function initializeBlocks(){
  for(let block = 0; block < numVerticalBlocks; block++){
    // baseY → 各ブロックの位置。
    // initialBlockPos → 以下層のブロックの位置
    const baseY = initialBlockPos + block * blockHeight; // -16.25
    // console.log(baseY); // -16.25 -13 -9.75 ... 19.5

    // 各ブロックを生成し挿入。各ブロックに配置する画像の枚数分をループする
    for(let i = 0; i < imagesPerBlocks; i++) { // imagesPerBlocks: 2
    
      const yOffset = Math.random() * .2 - .1; // -.1 〜 .1。ランダムな位置ずれを入れることで自然なずれを実現
      const blockContainer = await createBlock(baseY, yOffset, block, i);
      // console.log(blockContainer);

      blocks.push(blockContainer);
      // console.log(blocks); // [{isObject3D: true, uuid: '56ed5338-39c5-41d1-824a-11e87c42f007', name: '', type: 'Group', parent: Group, …}, Group, ...]
      galleryGroup.add(blockContainer);
    }
  }
}

// 各ブロックを生成
// _baseY: 各ブロックのy軸の位置。-16.25 -13 -9.75 ... 19.5
// _yOffset: 各画像を配置する際の少しのずれ(-.1 〜 .1)
// _blockIndex: 各ブロックのインデックス。0 1 2 3 ... 11
// _imageIndex: 各ブロックに配置する画像のインデックス。0 1
async function createBlock(_baseY, _yOffset, _blockIndex, _imageIndex){
  // 短い円柱の断面を生成
  const blockGeometry = createCurvedPlane(5, 3, cylinderRadius, 10); // width, height, cylinderRadius: 6, segments

  const imageNumber = getRandomNumber(1, 50);
  // console.log(imageNumber)
  const texture = await loadImageTexture(imageNumber);
  // console.log(texture);

  const blockMaterial = new MeshPhongMaterial({
    map: texture,
    side: DoubleSide,
    toneMapped: false, // トーンマッピングを無効にし、色調整をしない
  });

  const block = new Mesh(blockGeometry, blockMaterial);
  // block.position.y = _baseY + _imageIndex;
  block.position.y = _baseY + _yOffset;
  
  const blockContainer = new Group();
  const baseAngle = anglePerImage * _imageIndex;
  const randomAngleOffset = (Math.random() * 2 - 1) * maxRandomAngle; // -1〜1。ランダムなずれをつける

  const finalAngle = baseAngle + randomAngleOffset;

  blockContainer.rotation.y = finalAngle;
  blockContainer.add(block);

  // 画像が貼り付けられた曲面(ブロック)をグループごと返す
  return blockContainer;
}


// カーブした平面のgeometryを生成
// → 平面上に配置された頂点を円柱の側面に配置するという処理を行う
// _width: 5, 平面の横幅
// _height: 3, 平面の高さ。ブロックの高さは3.5
// _radius 6, シリンダーの半径（円柱の曲率）。
// _segments: 10, セグメント数
function createCurvedPlane(_width, _height, _radius, _segments){
  const geometry = new BufferGeometry();
  // console.log(geometry); // BufferGeometry {isBufferGeometry: true, uuid: 'e787efc3-61ce-4bdc-8880-d07b7530b49d', name: '', type: 'BufferGeometry', index: null, …}
  const vertices = []; // 頂点
  const indices = [];  // 頂点を結んで三角形を定義するインデックス情報
  const uvs = []; // uv座表

  const segmentsX = _segments * 4; // 横方向のsegment
  const segmentsY = Math.floor(_height * 12); // 縦方向のsegment
  // console.log(segmentsX, segmentsY); // 40 36

  // 平面の横幅を曲げるための角度
  // 横幅(_width)が、円弧のどのくらいの角度（ラジアン単位）を占めるか
  // 円弧の長さ = 半径 × 中心角(ラジアン)で計算できる。つまり→　角度(ラジアン) = 円弧の長さ / 半径
  const theta = _width / _radius; // 5 / 6
  // console.log(theta); // 0.8333333333333334

  // 頂点と UV 座標の計算
  // yループ: 縦方向（Y軸）の頂点を生成。
  for(let y = 0; y <= segmentsY; y++){ // 36
    // 縦方向の頂点座標を計算。
    // (y / segmentsY - 0.5) によって -0.5～0.5 の範囲を生成し、高さ _height にスケール。
    const yPos = (y / segmentsY - .5) * _height; // _height: 3
    // console.log(yPos); // -1.5 〜 1.5 の範囲

    // y軸に対しての、横方向（X軸および Z軸）の頂点を生成していく
    for(let x = 0; x <= segmentsX; x++){ // segmentsX: 40
      // 曲面の横方向の角度（ラジアン）を計算
      // (x / segmentsX - 0.5)により中心を基準に左右対象の角度
      const xAngle = (x / segmentsX - .5) * theta; 

      // x,z座標を計算
      // _radius に基づき、x方向を円周に沿った位置（sin）、z方向を奥行き（cos）に設定
      const xPos = Math.sin(xAngle) * _radius;
      const zPos = Math.cos(xAngle) * _radius;

      vertices.push(xPos, yPos, zPos);

      // uv座表。
      // 横方向xのuv座標は、.1 〜 .9
      // 縦方向yのuv座標は、0 〜 1
      uvs.push((x / segmentsX) * .8 + .1, y / segmentsY);
    }
  }

  // 頂点インデックスの計算
  // → 頂点インデックスを用いて三角形を定義し、平面を構成。
  // 
  for(let y = 0; y < segmentsY; y++){ // 36
    for(let x = 0; x < segmentsX; x++){ // 40
      // 各セグメントを4つの頂点（a, b, c, d）で囲む四辺形に分割。
      // 四辺形を2つの三角形（a-b-d と b-c-d）に分割。
      const a = x + (segmentsX + 1) * y;
      const b = x + (segmentsX + 1) * (y + 1);
      const c = x + 1 + (segmentsX + 1) * ( y + 1);
      const d = x + 1 + (segmentsX + 1) * y;

      // indices → OpenGLでは、頂点インデックスを参照して描画するため、インデックスを格納。
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();  // 頂点法線を計算して、ライティング効果を正確にす

  return geometry;
}

// ランダムに
function getRandomNumber(_minNum, _maxNum){
  return Math.floor(Math.random() * _maxNum) + _minNum; // Math.random() 1は含まない
}

// 画像を非同期で読み込み、テクスチャを生成
function loadImageTexture(_number){
  // console.log(_number)

  return new Promise(resolve => {
    const texture = textureLoader.load(
      `/img/images/${_number}.avif`,
      (loadedTexture) => {
        // 読み込みが完了した後に実行されるコールバック
        // generateMipmaps → テクスチャの品質を向上させるために使います。Mipmaps は異なる解像度の画像を使って、3Dオブジェクトがカメラから遠ざかるときに、パフォーマンスを向上させるために使用され
        loadedTexture.generateMipmaps = true;
        loadedTexture.minFilter = LinearMipmapLinearFilter;
        // → テクスチャが縮小される（遠くにある場合など）ときにどのようにサンプリング（ピクセルを選んで表示するか）するか
        loadedTexture.magFilter = LinearFilter;
        // →  テクスチャが拡大される（近くにある場合など）ときのサンプリング方法を指定する設定
        //    LinearFilter は線形補完を使い、画像を拡大した際に滑らかに表示されるようにする
        loadedTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        // anisotropy はテクスチャの異方性フィルタリング（anisotropic filtering）を設定する
        // このフィルタリングは、角度をつけて遠くのテクスチャを見たときに、テクスチャが歪んで見えないようにするための技術
        // getMaxAnisotropy() → 使用するハードウェア（GPU）がサポートする最大異方性フィルタリングのレベルを取得するメソッド。
        //                      これにより、利用可能な最適な異方性フィルタリングレベルが自動的に設定される
        resolve(loadedTexture);
      }
    )
  })
}


function render(){
  // console.log("render running");
  requestAnimationFrame(render);

  const scrollFraction = currentScroll / totalScroll; // 総スクロール量に対するスクロール量の割合
  const targetY = scrollFraction * cylinderHeight - cylinderHeight / 2;
  
  camera.position.y = -targetY;

  galleryGroup.rotation.y += baseRotationSpeed + rotationSpeed; // 0.0025, rotationSpeedは初めは0
  rotationSpeed *= 2;

  renderer.render(scene, camera);
}

