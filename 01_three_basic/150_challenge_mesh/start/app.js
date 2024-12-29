

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  PointLight,
  DirectionalLight,
  PointLightHelper,
  DirectionalLightHelper,
  BoxGeometry,
  MeshLambertMaterial,
  Mesh,
  AxesHelper,

} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


// 最小値から最大値までの少数をランダムで取得
function mapRand(min, max, isInt = false) {
  let rand = Math.random() * (max - min) + min;
  rand = isInt ? Math.round(rand) : rand;

  return rand;
}

init();

async function init() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 300;
  camera.position.y = 100;

  const renderer = new WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  // 影をつける方法
  // ①rendererの影の有効化 shadowmap.enabled = true
  // ②ライトの影の有効化(影を投げる側) castShadow = true
  // ③オブジェクトの影の設定(影を受ける側) castShadow = true
  document.body.appendChild(renderer.domElement); // canvasタグを挿入
  // console.log(renderer.domElement); // canvas

  // ライト
  const amLight = new AmbientLight(0x3f3f46); // アンビエントライト
  scene.add(amLight);

  const pLight = new PointLight(0xffffff, 1, 200); // ポイントライト
  pLight.position.set(-26, 7, 100);
  scene.add(pLight);
  pLight.castShadow = true; // 影を投影可能とする
  // 影の解像度を設定 デフォルトは512
  pLight.shadow.mapSize.width = 1024; 
  pLight.shadow.mapSize.height = 1024;

  const dLight = new DirectionalLight( 0xaabbff, 0.2); // ディレクショナルライト
  dLight.position.set(0, 0, 1);
  scene.add(dLight);

  // ヘルパー
  const pLightHelper = new PointLightHelper(pLight, 10);
  const dLightHelper = new DirectionalLightHelper(dLight, 10);
  const axes = new AxesHelper(100);
  scene.add(pLightHelper, dLightHelper, axes);

  // メッシュ
  const X_NUM = 10; // x軸の数
  const Y_NUM = 6;  // y軸の数
  const SCALE = 30;
  const COLORS = { MAIN: "#f3f4f6", SUB: "#60a5fa" };

  const boxGeo = new BoxGeometry(SCALE, SCALE, SCALE);
  const mainMate = new MeshLambertMaterial({ color: COLORS.MAIN });
  const subMate = new MeshLambertMaterial({ color: COLORS.SUB });

  const boxes = [];

  for(let y = Y_NUM - 1; y >= 0; y--){ // 逆ループ
    for(let x = X_NUM - 1; x >= 0; x--){
      const material = Math.random() < .2 ? subMate : mainMate;
      const box = new Mesh(boxGeo, material);
      box.position.x = x * SCALE - (X_NUM * SCALE) / 2; // 全てのメッシュのx軸の幅の1/2を左にずらす
      box.position.y = y * SCALE - (Y_NUM * SCALE) / 2;
      // console.log(`x軸: ${box.position.x}、y軸: ${box.position.y}`);
      box.position.z = mapRand(-10, 10);
      box.scale.set(.98, .98, .98); // 隙間を作る

      // 光源から影を受け取り、影を投影するので両方ともtrueにする
      box.castShadow = true;  // ボックスが光源からの光を遮り、その影が他のboxに投影が可能となる
      box.receiveShadow = true;
      boxes.push(box);
    }
  }
  // console.log(boxes)
  scene.add(...boxes);

  // z軸方向に動かす関数
  // function moveMesh(mesh) {
  //   const rand = mapRand(0, .3); // 動かす範囲
    
  //   const direction = mesh.position.z <= 0 ? rand : -rand;
  //   mesh.position.z += direction;
  // }

  // let targetMeshes =[]; // 動かすメッシュの配列
  // const TARGET_MESH_NUM = 15;

  // setInterval(() => {
  //   targetMeshes.forEach(mesh => mesh.__action = null);
  //   targetMeshes = []; // 初期化、空に

  //   for(let i = 0; i < TARGET_MESH_NUM; i++) { 
  //     const mesh = boxes[mapRand(0, boxes.length - 1, true)];  // 整数値で取得
  //     // console.log(mesh)
  //     // console.log(this)
  //     mesh.__action = () => moveMesh(mesh); // 関数を持たせる
  //     targetMeshes.push(mesh);
  //   }

  // }, 2000);


  const control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;

  function animate() {
    // targetMeshes.forEach(mesh => mesh.__action());

    control.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}


/**************************************************************
元のコード
***************************************************************/


// import {
//   Scene,
//   PerspectiveCamera,
//   WebGLRenderer,
//   AmbientLight,
//   PointLight,
//   DirectionalLight,
//   BoxGeometry,
//   MeshLambertMaterial,
//   Mesh

// } from "three";

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


// // 最小値から最大値までの少数をランダムで取得
// function mapRand(min, max, isInt = false) {
//   let rand = Math.random() * (max - min) + min;
//   rand = isInt ? Math.round(rand) : rand;

//   return rand;
// }

// init();

// async function init() {
//   const scene = new Scene();
//   const camera = new PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );
//   camera.position.z = 200;

//   const renderer = new WebGLRenderer({
//     antialias: true,
//   });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.shadowMap.enabled = true;
//   document.body.appendChild(renderer.domElement); // canvasタグを挿入
//   // console.log(renderer.domElement); // canvas

//   // ライト
//   const amLight = new AmbientLight(0x3f3f46);
//   scene.add(amLight);

//   const pLight = new PointLight(0xffffff, 1, 200);
//   pLight.position.set(-26, 7, 100);
//   scene.add(pLight);
//   pLight.castShadow = true; // 影をつける
//   pLight.shadow.mapSize.width = 1024;
//   pLight.shadow.mapSize.height = 1024;

//   const dLight = new DirectionalLight( 0xaabbff, 0.2);
//   dLight.position.set(0,0,1);
//   scene.add(dLight);

//   // ヘルパー


//   // メッシュ
//   const X_NUM = 10,
//     Y_NUM = 6,
//     SCALE = 30,
//     COLORS = { MAIN: "#f3f4f6", SUB: "#60a5fa" };

//   const boxGeo = new BoxGeometry(SCALE, SCALE, SCALE);
//   const mainMate = new MeshLambertMaterial({ color: COLORS.MAIN });
//   const subMate = new MeshLambertMaterial({ color: COLORS.SUB });

//   const boxes = [];
//   for(let y = 0; y < Y_NUM; y++) {
//     for(let x = 0; x < X_NUM; x++) {
//       const material = Math.random() < .2 ? subMate : mainMate;
//       const box = new Mesh(boxGeo, material);
//       box.position.x = x * SCALE - (X_NUM * SCALE) / 2;
//       box.position.y = y * SCALE - (Y_NUM * SCALE) / 2;
//       box.position.z = mapRand(-10, 10);
//       box.scale.set(0.98,0.98,0.98);
//       box.castShadow = true;
//       box.receiveShadow = true;
//       boxes.push(box);
//     }  
//   }
//   scene.add(...boxes);

//   const control = new OrbitControls(camera, renderer.domElement);

//   function animate() {
//     requestAnimationFrame(animate);

//     control.update();

//     renderer.render(scene, camera);
//   }

//   animate();
// }
