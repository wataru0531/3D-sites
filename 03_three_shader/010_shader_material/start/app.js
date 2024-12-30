/**
  Three.js
  https://threejs.org/
*/
import * as THREE from "three";


// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// renderer
const renderer = new THREE.WebGLRenderer({ 
  antialias: true // 物体の輪郭を滑らかにする。ギザギザをなくす。
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// geometry ... ただ、頂点(attribute)を定義しているだけ。
//              position、uvだけでなく任意にさまざまな頂点を持たせることが可能
const geometry = new THREE.PlaneGeometry(2, 2, 1);
console.log(geometry)
// position...画面に表示されている位置情報

// uv...テクスチャ座標
// → z軸がなくx、yのみ。
//   0〜1の範囲で表す。
//   左下を原点とする。

// normal...三角形で結んだ面の垂直、直行を貫くような線のベクトル情報が入る


// material...シェーダーを定義
// position...頂点の座標。(-1, 1, 0) (1, 1, 0) (-1, -1, 0) (1, -1, 0)
// uv座標...テクスチャを読み込む時の座標。(0, 1) (1, 1) (0, 0) (1, 0)

const material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main (){
      vUv = uv;
      vPosition = position;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
  `,

  // 頂点座標positionをvarying
  // → 各フラグメントでは線形補間された値が渡る
  // uv座標をvarying
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main(){
      // uv座標...(0, 1) (1, 1) (0, 0) (1, 0)
      // gl_FragColor = vec4(vUv, 0.0, 1.0);

      // 頂点座標...(-1, 1, 0) (1, 1, 0) (-1, -1, 0) (1, -1, 0)
      //        →  (0, 1, 0) (1, 1, 0) (0, 0, 0) (1, 0, 0) に変換(-1は0に、1より大きな値は1)
      gl_FragColor = vec4(vPosition, 1.0);
    }
  `,
  wireframe: true,
});


// mesh化...頂点とシェーダーを紐づける。
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;


// animate
let i = 0;
function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x = cube.rotation.x + 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
