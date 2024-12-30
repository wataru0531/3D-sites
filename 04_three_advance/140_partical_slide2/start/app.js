/**
 * Threejs
 * https://threejs.org/
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  BufferGeometry,
  PlaneGeometry,
  Float32BufferAttribute,
  DoubleSide,
  ShaderMaterial,
  Points,
  AxesHelper,

} from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import GUI from "lil-gui";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { get } from "lodash";

init();
async function init() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    10,
    3000
  );

  camera.position.z = 1000;

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);

  const control = new OrbitControls(camera, renderer.domElement);

  async function loadTex(url) {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(url);
    return texture;
  }

  // geometry
  function setupGeometry() {
    const width = 600;
    const height = 300;
    const wSeg = width /  2;
    const hSeg = height / 2;

    const plane = new PlaneGeometry(width, height, wSeg, hSeg);
    
    // ランダムな数値(0〜1500)の頂点データ
    const intensityVertices = getDiagonalVertices(hSeg, wSeg, getIntensity, 0);
    //  printMat(intensityVertices, wSeg + 1, '遅延時間行列');

    // 粒子を乱数で取得
    function getIntensity() {
      // カメラからオブジェクトまでの距離が1000。
      // カメラをカメラを飛び越えて手前に1500くらいまで粒子が飛べばいい感じになる
      return random(0, 1500);
    }

    // 乱数を返す関数(ランダムな値を返す関数)
    // aからbの乱数を返す
    function random(a, b){
      // a + (b -  a) * Math.random();
      return Math.random() * (b - a) + a;
    }

    // 対角線上に頂点を詰めた配列を返す
    function getDiagonalVertices(hSeg, wSeg, getIntensity, defaultValue) {
      const hSeg1 = hSeg + 1;
      const wSeg1 = wSeg + 1;

      let arry = [],
        currentValue = defaultValue;
      for (let i = 0; i < hSeg1 + wSeg1 - 1; i++) {
        for (
          let j = Math.min(hSeg1, i + 1) - 1;
          j >= Math.max(0, i - wSeg1 + 1);
          j--
        ) {
          let currentIndex = j * wSeg1 + i - j;
          currentValue = getIntensity(currentValue, currentIndex);
          arry[currentIndex] = currentValue;
        }
      }
      return arry;
    }

    // console.log(intensityVertices);

    // 乱数を頂点として格納する
    // この乱数も頂点としてgeometryに紐づく
    plane.setAttribute("aIntensity", new Float32BufferAttribute(intensityVertices, 1));

    return plane;
  }

  const geometry = setupGeometry();
  window.geometry = geometry;

  console.log(geometry)

  // material
  const material = new ShaderMaterial({
    uniforms: {
      uTexCurrent: { value: await loadTex("/img/kaneki.avif") },
      uTexNext: { value: await loadTex("/img/touka.avif") },
      uTick: { value: 0 },
      uProgress: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    side: DoubleSide,
    transparent: true
    //  wireframe: true,
  });

  // mesh  
  // const material1 = new PointsMaterial({ color: 0xff0000 });
  const plane = new Points(geometry, material);
  scene.add(plane);

  console.log(plane)

  // plane.position.z = 300;

  // ヘルパー
  // 軸ヘルパー
  const axis = new AxesHelper(300);
  scene.add(axis);

  // lil gui
  const gui = new GUI();
  gui.add(material.uniforms.uProgress, "value", 0, 1, 0.0001).name("progress").listen();
  const datObj = { next: !!material.uniforms.uProgress.value };
  gui
    .add(datObj, "next")
    .name("Animate")
    .onChange(function () {
      gsap.to(material.uniforms.uProgress, {
        value: +datObj.next,
        duration: 3,

        // vertexだけで緩急をつけたいので取り除く
        // ease: "power2.out",
        ease: "none",
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
