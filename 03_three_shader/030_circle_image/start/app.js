/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

init();
async function init() {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  renderer.setClearColor(0xff0000);
  
  // geometry 頂点を決定するものと考える
  
  const geometry = new THREE.PlaneGeometry(20, 20);
  console.log(geometry)

  
  // material
  async function loadTex(url) {
    const texLoader = new THREE.TextureLoader();
    const texture = await texLoader.loadAsync(url);
    return texture;
  };

  const material = new THREE.ShaderMaterial({
    uniforms: {
      // uTex: { value: await loadTex('/img/uv.jpg') }
      uTex: { value: await loadTex("/img/output2.jpg") },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,

    // wireframe: true,
  });
  
  // mesh
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  camera.position.z = 30;
  
  let i = 0;
  function animate() {
    requestAnimationFrame(animate);
  
    // cube.rotation.x = cube.rotation.x + 0.01;
    // cube.rotation.y += 0.01;
  
    renderer.render(scene, camera);
  }
  
  animate();
}
