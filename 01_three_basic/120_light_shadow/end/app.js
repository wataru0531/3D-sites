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
   renderer.shadowMap.enabled = true;
   document.body.appendChild(renderer.domElement);
 
   // 床
   const floor = new THREE.Mesh(
     new THREE.PlaneGeometry(1000, 1000),
     new THREE.MeshStandardMaterial({
       color: 0xf4f4f4,
       side: THREE.DoubleSide,
     })
   );
   // radian = degree * Math.PI / 180;
   floor.rotation.x = THREE.Math.degToRad(90);
   floor.position.y = -50;
   floor.receiveShadow = true;
   scene.add(floor);
 
   // メッシュ作成
   const geometry = new THREE.TorusKnotGeometry(5, 1.5, 100, 100);
   const basic = new THREE.MeshBasicMaterial({ color: 0x3f7b9d });
   const lambert = new THREE.MeshLambertMaterial({ color: 0x3f7b9d });
   const standard = new THREE.MeshStandardMaterial({
     color: 0x3f7b9d,
     roughness: 0,
   });
 
   const mesh1 = new THREE.Mesh(geometry, basic);
   mesh1.position.x -= 20;
   mesh1.castShadow = true;
   const mesh2 = new THREE.Mesh(geometry, lambert);
   mesh2.castShadow = true;
   
   const mesh3 = new THREE.Mesh(geometry, standard);
   mesh3.position.x += 20;
   mesh3.castShadow = true;
   
   scene.add(mesh1, mesh2, mesh3);
 
   // 軸ヘルパー
   const axis = new THREE.AxesHelper(20);
   scene.add(axis);
 
   camera.position.z = 30;
 
   const control = new OrbitControls(camera, renderer.domElement);
   
   // ライト
   // 均等に照らすライト
  //  const amlight = new THREE.AmbientLight( 0xffffff ); // soft white amlight
  //   scene.add( amlight );

  // 平行に照らすライト
  // const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  // directionalLight.position.set(0, 4, 10);
  // // directionalLight.target.position.set(0, 10, 5);
  // const dHelper = new THREE.DirectionalLightHelper(directionalLight);
  // scene.add( directionalLight, directionalLight.target, dHelper );

  // 点光源
  const plight = new THREE.PointLight( 0xffffff, 1, 0 );
  const spherical = new THREE.Spherical(30, 0.5, 1);
  plight.position.setFromSpherical(spherical);
  plight.castShadow = true;
  plight.shadow.mapSize.width = 1024;
  plight.shadow.mapSize.height = 1024;
  const pHelper = new THREE.PointLightHelper(plight);
  scene.add( plight, pHelper );

   let i = 0;
   function animate() {
     requestAnimationFrame(animate);
     spherical.theta += 0.01;
     plight.position.setFromSpherical(spherical);
    //  dHelper.update();
     
     control.update();
 
     renderer.render(scene, camera);
   }
 
   animate();
 }
 