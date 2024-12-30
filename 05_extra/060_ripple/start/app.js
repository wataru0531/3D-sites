/**
 * js
 * https://threejs.org/
 */
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,

} from "three";

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ripple ... 波紋やさざ波のことを表す
class Ripple {
  constructor(_tex){
    const ripple = { width: 100, height: 100 };
    this.geometry = new PlaneGeometry(ripple.width, ripple.height);
    this.material = new MeshBasicMaterial({  // 光源必要なし
      transparent: true,
      map: _tex,
    });
    this.mesh = new Mesh(this.geometry, this.material);

    this.mesh.visible = false; // 初期表示はfalse(まだ使っていない)
    this.isUsed = false; // 使ったかどうか。このフラグで見分ける
  }

  start(_mouse){
    const { material, mesh } = this;

    // 取得できた場合
    this.isUsed  = true;  // もうこのrippleオブジェクトは使ったよということ
    mesh.visible = true;  // メッシュを可視化できるようにする

    // 位置、大きさ、透明度、回転
    mesh.position.x = _mouse.x;
    mesh.position.y = _mouse.y;
    mesh.scale.x = mesh.scale.y = .2;
    material.opacity = .8;
    mesh.rotation.z = 2 * Math.PI * Math.random(); // 360 * 0から1未満の値。回転させる

    this.animate();
  }

  animate(){
    const { mesh, material } = this;
    
    // 大きさ、透明度、回転
    mesh.scale.x = mesh.scale.y = mesh.scale.x + 0.03; // ループが繰り返されるうちに0.03づつ大きくなる
    material.opacity *= .95; // ループが繰り返されるうちに.95倍で透明度が下がっていく
    mesh.rotation.z += 0.003;

    // マテリアルの透明度が0.01以下になれば非表示にして、再利用できるようにする
    if(material.opacity <= 0.01){
      // ループ終了
      mesh.visible = false; // 画面上に表示されなくなる
      this.isUsed = false; // もうこのメッシュは使ってませんということにして再利用できるようにする。
      
    } else{
      // マテリアルの透明度が0.01以上であればanimate()をループさせる
      requestAnimationFrame(() => {
        // console.log(this)
        this.animate();
      })
    }

  }
}



(async () => {
  const scene = new Scene();

  const camera = new OrthographicCamera( // 遠近感を加味しない
    - window.innerWidth / 2,  // 左
    window.innerWidth / 2,    // 右
    window.innerHeight / 2,   // 上
    - window.innerHeight / 2, // 下
    - window.innerHeight,     // near
    window.innerHeight        // far
  );

  camera.position.z = 10;

  const renderer = new WebGLRenderer({ antialias: true }); // レンダラー
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const texLoader = new TextureLoader(); // テクスチャローダー
  const tex = await texLoader.loadAsync("/img/displacement/ripple.png");
  // console.log(tex);

  const ripples = []; // rippleのオブジェクト
  const rippleCount = 50;

  // 逆ループさせる
  // → ・i >= 0 ... 0で比較するため簡潔でCPUで高速に評価される
  // 　・i-- ... マイナスの方がCPUにとって効率的
  //   ・逆順ループでは、データが逆順にアクセスされるため、キャッシュの利用効率が向上することがある
  //   ・ブランチ予測の精度を向上させる
  //     → CPUが分岐命令(if文やループなどの条件分岐)に遭遇した際に、どちらの分岐が選ばれるかを予測して事前に処理を進める仕組みのこと
  for(let i = rippleCount - 1; i >= 0; i--){ 
  // for(let i = 0; i < rippleCount; i++){
    const ripple = new Ripple(tex);
    // console.log(ripple)

    scene.add(ripple.mesh); // シーンに追加
    ripples.push(ripple);   // 配列に追加
  }

  const mouse = { tick: 0 }  // マウスの位置の制御

  // 座標の更新、isUsedがfalseのリップルを対象にアニメーションさせる
  renderer.domElement.addEventListener("mousemove", ({ clientX, clientY }) => {
    // console.log(clientX, clientY);

    // マウスの座標に、中央が(0, 0)の座表を適用
    mouse.x =   clientX - window.innerWidth  / 2;
    mouse.y = - clientY + window.innerHeight / 2;
    // console.log(`x: ${mouse.x}px, y: ${mouse.y}px`);

    // まだ使ってないメッシュを選択し、透明度を少しづつ上げ、波紋を大きくしていく
    // 5で割った時の余りが0の時のみ生成(5の倍数の時)。あまり波紋を作ってもうっとうしいので
    if(mouse.tick % 5 === 0){ 
      // find...ripplesから条件に合う最初のrippleリップルオブジェクトを1つのみ取得。
      //        → 配列の先頭から順に要素を要素をチェックしていく
      // trueのもの(start()を発火せたたripple)は対象から外す
      const _ripple = ripples.find(ripple => !ripple.isUsed); // isUsedはデフォルトでfalse
      // console.log(_ripple)

      if(!_ripple) return; // もし50個使い切った場合、後続の処理に進めたくないので処理を止める

      _ripple.start(mouse); // 位置、透明度、大きさ、回転などの初期化
    }
  })

  animate();
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    mouse.tick++;
  }
  
})();

