/**
 * Three.js
 * https://threejs.org/
 */

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  Mesh,

} from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import GUI from "lil-gui";
import { gsap } from "gsap";

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
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);
  
  async function loadTex(url) {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(url);
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = MirroredRepeatWrapping;
    
    return texture;
  }

  // geometry ... 頂点を決めている
  const geometry = new PlaneGeometry(20, 10);
  console.log(geometry)

  // material
  const material = new ShaderMaterial({
    uniforms: {
      uTexCurrent: { value: await loadTex("/img/output1.jpg") },
      uTexNext: { value: await loadTex("/img/output2.jpg") },
      uTexDisp: { value: await loadTex("/img/displacement/3.png") },

      uTick: { value: 0 },
      uProgress: { value: 0 },
      uNoiseScale: { value: new Vector2(10, 10) },
    },
    vertexShader,
    fragmentShader,

    // wireframe: true,
  });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  
  camera.position.z = 30;
  
  // lil-gui
  const gui = new GUI();
  const folder1 = gui.addFolder("Noise");
  folder1.open();

  folder1.add(material.uniforms.uNoiseScale.value, "x", 0, 10, 0.1);
  folder1.add(material.uniforms.uNoiseScale.value, "y", 0, 10, 0.1);
  folder1.add(material.uniforms.uProgress, "value", 0, 1, 0.01).name('progess').listen();
  
  
  const datData = { 
    next: !!material.uniforms.uProgress.value 
  }

  folder1.add(datData, "next").onChange(() => {
    gsap.to(material.uniforms.uProgress, 1.5, {
      value: +datData.next,
      // 単項プラス演算子
      // → 真偽値や文字列を数値に変換する

      ease: "power3.inOut"
    })
  });

  // animation
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
