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
  BufferGeometry,
  Float32BufferAttribute,
  ShaderMaterial,
  DoubleSide,
  Points,
  Mesh,
  AxesHelper,
} from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import GUI from "lil-gui";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

init();
async function init() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    10,
    3000
  );

  camera.position.z = 500;

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

  // Geometry生成
  function setupGeometry() {
    // 粒子になるので画像のセグメントの数を高めておく
    const wSeg = 350;
    const hSeg = 90;

    const plane = new  PlaneGeometry(313, 75, wSeg, hSeg);
    
    const geometry = new PlaneGeometry(313, 75, wSeg, hSeg);
    geometry.setAttribute("position", plane.getAttribute("position"));
    geometry.setAttribute("uv", plane.getAttribute("uv"));

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
      uTex: { value: await loadTex("/img/codemafia.png") },
      uTick: { value: 0 },
      uProgress: { value: 0 },

      uSaturation: { value: 0.7 },
      uLightness: { value: 0.67 },
      
      uColorDelay: { value: 0 },
      uColorTime: { value: 0.005 },
      uScaleDelay: { value: 4 },
      uScaleTime: { value: 0.04 },
    },
    vertexShader,
    fragmentShader,
    side: DoubleSide,
    //  wireframe: true,

    transparent: true, // 透明度をつける(右斜め上に粒子になり消えていくときに透明にするため)
  });

  // mesh化  Points使用
  // 各頂点がポイント(点)として描画されるため、通常のメッシュとは異なり、
  // 各頂点が独立した点として扱われる。このため、それぞれの点が指定された大きさで表示される
  // → Meshとは異なり、Pointsは頂点間の接続を描画しない
  // 　Mesh → 頂点間をつなげてポリゴンを形成し、複雑な形状を描画
  //   Points → は各頂点を独立した点として描画


  const sphere = new Points(geometry, material);
  // const sphere = new Mesh(geometry, material);
  console.log(sphere);

  scene.add(sphere);

  // 軸ヘルパー
  // const axis = new AxesHelper(300);
  // scene.add(axis);

  // lil gui
  const gui = new GUI();
  gui.add(material.uniforms.uProgress, "value", 0, 1, 0.01).name("progress").listen();
  const datObj = { next: !!material.uniforms.uProgress.value };
  gui
    .add(datObj, "next")
    .name("Animate")
    .onChange(function () {
      gsap.to(material.uniforms.uProgress, {
        value: +datObj.next,
        duration: 2,
        ease: "power2.out",
      });
    });

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
