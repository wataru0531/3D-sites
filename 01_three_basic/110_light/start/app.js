/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

init();
async function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // レンダラーの影を有効化
  document.body.appendChild(renderer.domElement);

  // 床
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({
      color: 0xf4f4f4,
      side: THREE.DoubleSide,
    })
  );
  floor.rotation.x = THREE.Math.degToRad(90);
  floor.position.y = -50;
  floor.receiveShadow = true; // 影を受け止めるようにする

  scene.add(floor);

  // メッシュ作成
  const geometry = new THREE.TorusKnotGeometry(5, 1.5, 100, 100);
  const basic = new THREE.MeshBasicMaterial({ color: 0x3f7b9d });     // 光源はいらない
  const lambert = new THREE.MeshLambertMaterial({ color: 0x3f7b9d }); // シックな感じ
  const standard = new THREE.MeshStandardMaterial({ // 光沢あり
    color: 0x3f7b9d,
    roughness: 0,    // 0に行くほどテカテカな状態。
  });

  const mesh1 = new THREE.Mesh(geometry, basic);
  mesh1.castShadow = true; // 影ができるようになる
  mesh1.position.x -= 20;

  const mesh2 = new THREE.Mesh(geometry, lambert);
  
  const mesh3 = new THREE.Mesh(geometry, standard);
  mesh3.position.x += 20;
  
  scene.add(mesh1, mesh2, mesh3);

  /**************************************************************
  ヘルパー
  ***************************************************************/
  const axis = new THREE.AxesHelper(20);
  scene.add(axis);

  camera.position.z = 80;

  const control = new OrbitControls(camera, renderer.domElement);


  /**************************************************************
  ライト
  ***************************************************************/
  // AmbientLight ... 均等に照らすライト
  const amLight = new THREE.AmbientLight(0xFFFFFF);
  

  // 平行に照らすライト ... 基本は原点に向かって照らす
  const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
  directionalLight.position.set(0, 10, 10);

  directionalLight.target.position.set(0, 10, 0);


  // ポイントライト
  const pointLight = new THREE.PointLight(0xfffff, 1, 1000);
  pointLight.position.set(15, 15, 15);
  pointLight.castShadow = true; // 影ができるようになる
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;

  scene.add(
    amLight,
    // directionalLight,
    pointLight,
  );

  // ヘルパー
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight)

  scene.add(
    // directionalLightHelper,
    // directionalLight.target,
    pointLightHelper
  );


  /**************************************************************
  animate
  ***************************************************************/
  let i = 0;
  function animate() {
    // directionalLightHelper.update(); //directionalLightの向きを変更する

    requestAnimationFrame(animate);

    i++;
    // 20 ... 半径
    pointLight.position.x = 20 * Math.cos(i * 0.01); // X軸
    pointLight.position.z = 20 * Math.sin(i * 0.01); // Y軸
    
    control.update();

    renderer.render(scene, camera);
  }

  animate();
}
