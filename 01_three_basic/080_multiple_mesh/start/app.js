/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


init();
async function init() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // camera.position.z = 50;
  camera.position.set(0, 15, 70);

  const canvas = document.getElementById("canvas");

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // document.body.appendChild(renderer.domElement);
  
  const geometry1 = new THREE.BoxGeometry(10, 10, 10, 5, 5); // キューブ
  const geometry2 = new THREE.SphereGeometry(5, 32, 32);      // 球
  const geometry3 = new THREE.TorusGeometry(5, 2, 10, 100);   // ドーナッツ
  const geometry4 = new THREE.PlaneGeometry(100, 100);         // プレーン
  const geometry5 = new THREE.ConeGeometry(5, 15, 64, 64)
  const geometry6 = new THREE.CylinderGeometry(3, 3, 10, 30, 30) // 筒
  
  const texLoader = new THREE.TextureLoader();
  // const texture1 = await texLoader.loadAsync("/img/output1.jpg");
  // const texture2 = await texLoader.loadAsync("/img/output2.jpg");

  // const material = new THREE.MeshBasicMaterial({ 
  //   color: 0xff0000,
  //   // wireframe: true,
  // });

  const material1 = new THREE.MeshStandardMaterial({
    color: "#FF007A",
    // wireframe: true,
  })
  const material2 = new THREE.MeshStandardMaterial({
    color: "#0CAB7F",
    // wireframe: true,
  })
  const material3 = new THREE.MeshStandardMaterial({
    color: "#2C67FE",
    // wireframe: true,
  })
  const material4 = new THREE.MeshStandardMaterial({ // plane
    color: "#FFE600",
    side: THREE.DoubleSide,
    // wireframe: true,
  })
  const material5 = new THREE.MeshStandardMaterial({
    color: "#FBA90B",
    // wireframe: true,
  })
  const material6 = new THREE.MeshStandardMaterial({
    color: "#FFE600",
    // wireframe: true,
  })

  
  const mesh1 = new THREE.Mesh(geometry1, material1); // キューブ
  mesh1.position.set(20, 0, 0);
  
  const mesh2 = new THREE.Mesh(geometry2, material2); //  球
  mesh2.position.set(-20, 0, 0)

  const mesh3 = new THREE.Mesh(geometry3, material3); // ドーナツ
  mesh3.position.set(0, 0, -20);
  
  const mesh4 = new THREE.Mesh(geometry4, material4); // プレーン

  const mesh5 = new THREE.Mesh(geometry5, material5); // コーン

  const mesh6 = new THREE.Mesh(geometry6, material6); // 筒
  mesh6.position.set(0, 0, 20)

  scene.add(
    mesh1, 
    mesh2,
    mesh3, 
    // mesh4, 
    // mesh5,
    mesh6
  );


  console.log(Math.sin(1))
  
  console.log(Math.sin(Math.PI / Math.PI))

  console.log(Math.sin(Math.PI / 2))


// 回転処理
let rotation = 0;

rot();
function rot(){
  rotation += 0.003;
  // console.log(rotation)

  mesh1.position.x = 30 * Math.cos(rotation);
  mesh1.position.z = 30 * Math.sin(rotation);

  mesh2.position.x = 30 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = 30 * Math.sin(rotation + Math.PI / 2);

  mesh3.position.x = 30 * Math.cos(rotation + Math.PI);
  mesh3.position.z = 30 * Math.sin(rotation + Math.PI);

  mesh6.position.x = 30 * Math.cos(rotation + 2 * Math.PI * 3 / 4);
  mesh6.position.z = 30 * Math.sin(rotation + 2 * Math.PI * 3 / 4);


  requestAnimationFrame(rot);
}

  
  // ライト
  const pointLight = new THREE.PointLight(0xffffff, 0.7);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
  scene.add(pointLight, ambientLight, directionalLight);

  // ヘルパー
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  // scene.add(pointLightHelper)

  const axis = new THREE.AxesHelper(20);
  // scene.add(axis);


  const control = new OrbitControls(camera, renderer.domElement);
    
  let i = 0;
  function animate() {
    requestAnimationFrame(animate);

    // 回転
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;
    // mesh.rotateX(0.01);

    // 平行移動
    // mesh.position.x += 0.02;
    // mesh.position.y += 0.02;
    // mesh.position.z += 0.02;
    // mesh.position.set(10, 0, 0);
    // geometry.translate(0.01,0.01,0.01);

    // スケール
    // mesh.scale.x += 0.002;
    // mesh.scale.y += 0.002;
    // geometry.scale(1.02, 1, 1);
    control.update();

    renderer.render(scene, camera);
  }

  animate();
}
