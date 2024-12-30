/**
 * Three.js
 * https://threejs.org/
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  RepeatWrapping,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,

} from "three";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

init();

async function init() {

  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);
  
  async function loadTex(url) {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(url);

    // S...x軸
    // texture.wrapS = RepeatWrapping;
    // texture.wrapS = MirroredRepeatWrapping;
    // texture.wrapS = ClampToEdgeWrapping; // デフォルト
    
    // T...y軸
    // texture.wrapT = RepeatWrapping;
    // texture.wrapT = MirroredRepeatWrapping; // 反転させながらくり返す
    // texture.wrapT = ClampToEdgeWrapping;

    return texture;
  }

  // geometry
  const geometry = new PlaneGeometry(20, 10);
  console.log(geometry);

  // material
  const material = new ShaderMaterial({
    uniforms: {
      uTex: { value: await loadTex('/img/output2.jpg') },
      uTick: { value: 0 }
    },
    vertexShader,
    fragmentShader,
  });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  
  camera.position.z = 30;

  // animate
  let i = 0;
  function animate() {
    requestAnimationFrame(animate);
  
    // cube.rotation.x = cube.rotation.x + 0.01;
    // cube.rotation.y += 0.01;
    material.uniforms.uTick.value++;
    renderer.render(scene, camera);
  }
  
  animate();
}
