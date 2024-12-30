/**
 * Three.js
 * https://threejs.org/
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  Points,
  TextureLoader,
  Float32BufferAttribute,
  ShaderMaterial,
  AxesHelper,
  DoubleSide,

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
    const wSeg = 30
    const hSeg = 30;
    const geometry = new SphereGeometry(200, wSeg, hSeg);

    // 対角線上に詰められた遅延時間用の頂点データ
    const delayVertices = getDiagonalVertices(hSeg, wSeg, getValue, 0);
    //  printMat(delayVertices, wSeg + 1, '遅延時間行列');

    // 0~1までの値をstep毎に返す
    function getValue(previousValue, currentIndex) {
      let step = 1 / (hSeg + 1) / (wSeg + 1);
      return previousValue + step;
    }

    // 対角線上に頂点を詰めた配列を返す
    function getDiagonalVertices(hSeg, wSeg, getValue, defaultValue) {
      const hSeg1 = hSeg + 1,
        wSeg1 = wSeg + 1;
      let arry = [],
        currentValue = defaultValue;
      for (let i = 0; i < hSeg1 + wSeg1 - 1; i++) {
        for (
          let j = Math.min(hSeg1, i + 1) - 1;
          j >= Math.max(0, i - wSeg1 + 1);
          j--
        ) {
          let currentIndex = j * wSeg1 + i - j;
          currentValue = getValue(currentValue, currentIndex);
          arry[currentIndex] = currentValue;
        }
      }
      return arry;
    }

    console.log(delayVertices);

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
      uSaturation: { value: 0.7 },
      uLightness: { value: 0.67 },
      uColorTime: { value: 0.05 },
      uColorDelay: { value: 3.3 },

      // 大きさに関するuniforms
      uScaleTime: { value: 0.04 },
      uScaleDelay: { value: 4.0 },
    },
    vertexShader,
    fragmentShader,
    side: DoubleSide,
    //  wireframe: true,
  });
  // const material1 = new PointsMaterial({ color: 0xff0000 });
  const sphere = new Points(geometry, material);
  scene.add(sphere);

  // helper
  const axis = new AxesHelper(300);
  scene.add(axis);

  // lil-gui
  const gui = new GUI();
  const folder1 = gui.addFolder("Color");
  folder1.open();
  // folder1.close();

  folder1.add(material.uniforms.uSaturation, "value", 0, 1, 0.01).name('Saturation');
  folder1.add(material.uniforms.uLightness, "value", 0, 1, 0.01).name('Lightness');
  folder1.add(material.uniforms.uColorDelay, "value", 0, 100, 1).name('ColorDelay');
  folder1.add(material.uniforms.uColorTime, "value", 0.001, 1, 0.01).name('time');

  // 大きさ
  const folder2 = gui.addFolder("Scale");
  folder2.add(material.uniforms.uScaleTime, "value", 0.001, 1, 0.01).name("ScaleTime");
  folder2.add(material.uniforms.uScaleDelay, "value", 0.0, 10, 1).name("ScaleDelay");

  // 時間
  const folder3 = gui.addFolder("Extra");
  folder3.add(material.uniforms.uTick, "value", 0, 100, 0.01).name("tick");
  folder3.open();

  // animation
  function animate() {
    requestAnimationFrame(animate);

    control.update();

    material.uniforms.uTick.value++;

    renderer.render(scene, camera);
  }

  animate();
}



function printMat(targetMatrix, col = 4, label = "") {
  const mat1D = targetMatrix?.elements ?? targetMatrix?.array ?? targetMatrix;
  console.log(mat1D);
  if (!mat1D instanceof Array) return;
  setTimeout(() => {
    // 非同期でマトリクスが更新されるため、非同期で実行
    let mat2D = mat1D.reduce((arry2D, v, i) => {
      if (i % col === 0) {
        arry2D.push([]);
      }
      const lastArry = arry2D[arry2D.length - 1];
      lastArry.push(v);
      return arry2D;
    }, []);
    console.log(
      `%c${label}`,
      "font-size: 1.3em; color: red; background-color: #e4e4e4;"
    );
    console.table(mat2D);
  });
}
