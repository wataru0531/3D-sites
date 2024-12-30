/**
 * Three.js
 * https://threejs.org/
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  PlaneGeometry,
  Float32BufferAttribute,
  ShaderMaterial,
  Mesh,

} from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import GUI from "lil-gui";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

init();
async function init() {
  // scene
  const scene = new Scene();

  // camera
  const camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      10,
      3000
  );

  camera.position.z = 1000;

  // renderer
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);

  const control = new OrbitControls(camera, renderer.domElement);

  async function loadTex(url) {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(url);

    return texture;
}

  // geometry
  function setupGeometry() {
    const wSeg = 30;
    const hSeg = 30;

    const geometry = new PlaneGeometry(600, 300, wSeg, hSeg);
    // 頂点の数：(widthSegment + 1) * (heightSegment + 1)

    const delayVertices = [];
    const maxCount = (wSeg + 1) * (hSeg + 1);

    // 左上から右に遅延をもった頂点を生成
    for(let i = 0; i < maxCount; i++) {
      // 遅延時間は、0 ~ 1 の範囲に変更
      const delayDuration = (1 / maxCount) * i;
      
      delayVertices.push(delayDuration);
    }

    // console.log(delayVertices);
    geometry.setAttribute("aDelay", new Float32BufferAttribute(delayVertices, 1));

    return geometry;
  }

  const geometry = setupGeometry();
  window.geometry = geometry;

  console.log(geometry)

  // material
  const material = new ShaderMaterial({
    uniforms: {
      uTex: { value: await loadTex("/img/output1.jpg") },
      uTick: { value: 0 },
      uProgress: { value: 0 },
    },
    vertexShader,
    fragmentShader,

    wireframe: true,
  });

  // mesh
  const plane = new Mesh(geometry, material);
  scene.add(plane);

  // lil-gui
  const gui = new GUI();
  const folder1 = gui.addFolder("Animation");
  folder1.open();

  folder1
    .add(material.uniforms.uProgress, "value", 0, 1, 0.01)
    .name("progess")
    .listen();

  const datData = { next: !!material.uniforms.uProgress.value };

  folder1.add(datData, "next").onChange(() => {
    // gsapでeasingをかけれるのは、uniformの値のみ
    // JavaScript側から頂点にeasingをかけるのはパフォーマンスが悪い。→ GPU上でeasingをかける

    gsap.to(material.uniforms.uProgress, {
      value: +datData.next,
      duration: 2,
      ease: "power2.inOut",
    });
  });

  // animate
  function animate() {
    requestAnimationFrame(animate);

    control.update();

    material.uniforms.uTick.value++;

    renderer.render(scene, camera);
  }

  animate();
}
