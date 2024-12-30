/**************************************************************

shincodeのudemy講座 
https://www.udemy.com/course/threejs-beginner/learn/lecture/29874966?start=0#overview

***************************************************************/  
import "./style.css";

import {
  Scene,
  PerspectiveCamera,
  MeshPhysicalMaterial,
  Mesh,
  TorusGeometry,
  OctahedronGeometry,
  TorusKnotGeometry,
  IcosahedronGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  DirectionalLight,
  WebGLRenderer,
  Clock,

} from "three";

import * as dat from "lil-gui";

/**************************************************************
UIデバック lil-gui
****************************************************************/
const gui = new dat.GUI();
// console.log(gui);

/**************************************************************
シーン
****************************************************************/
const scene = new Scene();

/**************************************************************
カメラ
****************************************************************/
// サイズ設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 6;

scene.add(camera);

/**************************************************************
ジオメトリ
****************************************************************/
/**************************************************************
マテリアル
****************************************************************/
const material = new MeshPhysicalMaterial({
  // color: "#3c94d7",
  color: "#3cd794",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});

gui.addColor(material, "color");
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**************************************************************
メッシュ化 ジオメトリ + マテリアル
****************************************************************/
const mesh1 = new Mesh(new TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new Mesh(new OctahedronGeometry(), material);
const mesh3 = new Mesh(new TorusKnotGeometry(0.8, 0.35, 100, 16), material);
const mesh4 = new Mesh(new IcosahedronGeometry(), material);

//  回転用に配置する
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

// メッシュの配列
const meshes = [mesh1, mesh2, mesh3, mesh4];

scene.add(mesh1, mesh2, mesh3, mesh4);

/**************************************************************
パーティクルを追加
****************************************************************/
// バッファジオメトリ
const particlesGeometry = new BufferGeometry();

const count = 100;

//　頂点の位置情報を作っていく
// 3...x,y,zの座標。
const positionArray = new Float32Array(count * 3);

// -5 から 5の範囲で値を格納
for(let i = 0; i < count * 3; i++){
  positionArray[i] = (Math.random() - 0.5) * 10;
};

// 頂点をつくる 頂点、3...itemSize(頂点を3で１つに。x、y、zなど)
const bufferAttribute = new Float32BufferAttribute(positionArray, 3);

// ジオメトリに属性を付与
particlesGeometry.setAttribute('position', bufferAttribute);
// console.log(particlesGeometry)

// マテリアル
const pointsMaterial = new PointsMaterial({
  size: 0.015,
  color: "#ffffff",
});

// メッシュ化...Pointsを使う。
const particles = new Points(particlesGeometry, pointsMaterial);

scene.add(particles);

/**************************************************************
ライトを追加
****************************************************************/
const directionalLight = new DirectionalLight(
  "#ffffff",
  4,
);
directionalLight.position.set(0.5, 1, 0);

scene.add(directionalLight);

/**************************************************************
ブラウザのリサイズ操作
****************************************************************/
window.addEventListener('resize', () => {
  // サイズの更新
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); // 変更を加えたらかならず呼び出す必要がある。

  // レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});


/**************************************************************
レンダラー
****************************************************************/
const canvas = document.querySelector('.webgl');

const renderer = new WebGLRenderer({
  canvas: canvas,
  alpha: true, // 背景画像が見えるようにする
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

/**************************************************************
ホイール...wheelイベントが発火している時の動き
****************************************************************/
let speed = 0;
let rotation = 0;

window.addEventListener('wheel', ({ deltaY }) => {
  // console.log(deltaY)

  // deltaY...どれだけホイールしたか。浮き沈み。
  speed += deltaY * 0.002;

  // console.log(speed)

});

rot()
function rot(){
  rotation += speed;
  speed *= 0.83; // フレームの更新ごとに0.93をかけ続けるので慣性がかかる。

  // メッシュ達を回転させる
  // 2, -3...原点をずらす。
  // 3.8...半径。
  // Math.PI / 2...ラジアン単位で90°
  // 3 * (Math.PI / 2)...270°
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);

  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);

  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);

  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));


  // フレームの更新ごとにrot()を呼び出す。
  window.requestAnimationFrame(rot);
};


/**************************************************************
カーソルの位置を取得
****************************************************************/
const cursor = {
  x: 0,
  y: 0,
};
// console.log(cursor);

// カーソルを、-.5 から .5　の範囲で取得
window.addEventListener('mousemove', ({ clientX, clientY }) => {
  cursor.x = clientX / sizes.width - 0.5; // 幅で割ることで0から1の間で値を取得できる。
  cursor.y = clientY / sizes.height - 0.5; // 上が0。

  // console.log(cursor.x, cursor.y);
});

/**************************************************************
レンダー
****************************************************************/
// Clock()...時間を追跡するためのオブジェクト
const clock = new Clock();
// console.log(clock.elapsedTime)

const render = () => {
  renderer.render(scene, camera);

  // フレームの更新時間を取得する。(パソコンのスペックによって違う)
  let getDeltaTime = clock.getDelta();
  // console.log(getDeltaTime)

  // メッシュを回転させる
  meshes.forEach((mesh) => {
    // デルタタイムをかけることでどのデバイスのスペックでも同じように回転する。
    mesh.rotation.x += getDeltaTime * .1;
    mesh.rotation.y += getDeltaTime * .1; 
  });

  // カメラの制御
  // getDeltaTimeをつけることで各デバイスで一定の負荷をつけることができる。
  // Y軸は上がマイナスになるので、上にカーソルを置いた場合カメラは下に向くのでマイナスをかけてやる。
  camera.position.x += getDeltaTime *   cursor.x * 2;
  camera.position.y += getDeltaTime * - cursor.y * 2;

  // フレームの更新(16.7m秒)毎にrender()が呼ばれる。
  window.requestAnimationFrame(render);
};

render();

