/**
 * js
 * https://threejs.org/
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  PlaneGeometry,
  TorusGeometry,
  Color,
  MeshLambertMaterial,
  DoubleSide,
  Mesh,
  AmbientLight,
  PointLight,
  PointLightHelper,
  AxesHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


window.addEventListener("DOMContentLoaded", init);

async function init() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xf3f3f3);
  document.body.appendChild(renderer.domElement); // canvasタグで挿入

  // 最小値から最大値までのランダムな値を取得
  function mapRand(min, max, isInt = false) {
    // Math.random 0 〜 1未満
    // Math.round  四捨五入
    let rand = Math.random() * (max - min) + min;
    rand = isInt ? Math.round(rand) : rand; // 整数で欲しい取得する場合

    return rand;
  }

  const meshes = [];      // メッシュの配列

  const MESH_NUM = 50;    // メッシュの数
  const POS_RANGE = 100;  // 位置の範囲
  const MAX_SCALE = 1.5;  // 最大の大きさ
  const TARGET_MESH_NUM = 10; // 動かすメッシュの数

  // 
  function randomMesh() {
    const geometries = [ // この３つの内、後から1つを使う
      new BoxGeometry(10, 10, 10),
      new PlaneGeometry(20, 20),
      new TorusGeometry(10, 3, 200, 20),
    ];
    // console.log(geometries)

    const color = new Color(
      mapRand(0.7, 1),
      mapRand(0.7, 1),
      mapRand(0.7, 1)
    );
    // console.log(color)

    const pos = {
      x: mapRand(-POS_RANGE, POS_RANGE),
      y: mapRand(-POS_RANGE, POS_RANGE),
      z: mapRand(-POS_RANGE, POS_RANGE),
    };

    const material = new MeshLambertMaterial({ color: color, side: DoubleSide });

    // 0, 1, 2の整数をランダムで取得し、メッシュを生成
    const gIndex = mapRand(0, geometries.length - 1, true);
    // console.log(gIndex)
    const mesh = new Mesh(geometries[gIndex], material);

    mesh.position.set(pos.x, pos.y, pos.z); // ランダムに配置
    const scale = mapRand(1, MAX_SCALE); // ランダムに大きさを取得。1以上
    mesh.geometry.scale(scale, scale, scale);

    return mesh;
  }

  for(let i = MESH_NUM - 1; i >= 0; i--){ // 逆ループ
    const mesh = randomMesh();
    meshes.push(mesh);
  }
  // console.log(meshes); // (50) [Mesh, Mesh, ...]

  scene.add(...meshes);

  camera.position.z = 30;

  const control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;

  // ライト
  const amlight = new AmbientLight(0xe4e4e4, .6);
  scene.add(amlight);

  const pointLight = new PointLight(0xe4e4e4, 1, 400);
  pointLight.position.set(10, 100, 110);
  const pHelper = new PointLightHelper(pointLight);
  pHelper.visible = false;

  const pointLight2 = new PointLight(0xeeeeee, 1, 300);
  pointLight2.position.set(-200, -100, 200);
  const pHelper2 = new PointLightHelper(pointLight2);
  pHelper2.visible = false;

  const axesHelper = new AxesHelper(20);

  scene.add(pointLight, pHelper, pointLight2, pHelper2, axesHelper);

  // ランダムにx, y, z軸に動かす関数を作り、どれかの関数を取得
  function getAction({ x, y, z }) {
    const rand = mapRand(0.7, 1.3); // 動かす範囲

    const ACTIONS = [
      function() {
        // xがプラスの位置にあるならマイナスに動かす。y, zも同様
        // 例えば、x座表が74なら、x軸をマイナスに動かす
        const direction = x < 0 ? rand : -rand; 
        this.position.x += direction;
      },
      function() {
        const direction = y < 0 ? rand : -rand;
        this.position.y += direction;
      },
      function() {
        const direction = z < 0 ? rand : -rand;
        this.position.z += direction;
      },
    ];

    // ACTIONSの内どれかの関数を取得
    // console.log(mapRand(0, ACTIONS.length - 1, true));
    const action = ACTIONS[mapRand(0, ACTIONS.length - 1, true)];
    return action;
  }

  // 物体の移動
  let targetMeshes = [];

  // 2秒ごとに動かす関数を切り替える
  setInterval(() => {
    targetMeshes.forEach(mesh => mesh.__action = null); // 初期化

    targetMeshes = []; // 動かすmeshを空に

    for(let i = 0; i < TARGET_MESH_NUM; i++) { // ここでは10個のmeshを動かす
      // 動かすmeshを50の内から、ランダムに取得
      const mesh = meshes[mapRand(0, meshes.length - 1, true)]; 
      console.log(mesh); // Mesh { position: x: 74.05116128528402, y: -36.305605069932106, z: -52.70052656700641}

      // x, y, z軸のどれかに動かす関数をmeshに持たせる
      mesh.__action = getAction(mesh.position); 
  
      targetMeshes.push(mesh);
    }

  }, 2000);
  
  let angle = 0;
  let direction = .03; // カメラの移動方向と速度
  // let i = 0;

  function animate() {
    // i++;

    targetMeshes.forEach(mesh => mesh.__action());

    camera.position.z += direction;
    
    // cameraの位置がPOS_RANGE以上、もしくは、デフォルトの30になれば、移動方向を変更する
    if(camera.position.z >= POS_RANGE || camera.position.z <= 30){
      direction = - direction;
    }
    
    angle += 0.01;
    camera.position.x = 30 * Math.cos(angle);
    camera.position.y = 30 * Math.sin(angle);
    camera.lookAt(0, 0, 0);

    // console.log(camera.position.z)

    control.update();

    // debugger
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}

