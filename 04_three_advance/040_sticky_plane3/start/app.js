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

     // 対角線上に詰められた遅延時間用の頂点データ
    const delayVertices = getDiagonalVertices(hSeg, wSeg, getValue, 0);
    printMat(delayVertices, wSeg + 1, '遅延時間行列');
    
    // 0~1までの値をstep毎に返す
    function getValue(previousValue, currentIndex) {
      let step = 1 / (hSeg + 1) / (wSeg + 1);

      return previousValue + step;
    }

    // 対角線上に頂点を詰めた配列を取得する関数
    function getDiagonalVertices(hSeg, wSeg, getValue, defaultValue) {
      const hSeg1 = hSeg + 1;
      const wSeg1 = wSeg + 1;
      let arry = [];

      let currentValue = defaultValue;
      
      // 左下から右上に対角線上に値をループ処理させるfor文
      for (let i = 0; i < hSeg1 + wSeg1 - 1; i++) {
        // 
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

    // 0〜1までの対角線の頂点データを格納
    // 頂点に登録したら、position同様に左から右へと値が割り振られる。
    geometry.setAttribute("aDelay", new Float32BufferAttribute(delayVertices, 1));

    return geometry;
  }

  const geometry = setupGeometry();
  console.log(geometry)
  
  window.geometry = geometry;

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

  // lil gui
  const gui = new GUI();
  const folder1 = gui.addFolder("Animation");
  folder1.open();

  folder1
    .add(material.uniforms.uProgress, "value", 0, 1, 0.01)
    .name("progess")
    .listen();

  const datData = { next: !!material.uniforms.uProgress.value };
  folder1.add(datData, "next").onChange(() => {
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


function printMat(targetMatrix, col = 4, label = '') {
  const mat1D = targetMatrix?.elements ?? targetMatrix?.array ?? targetMatrix;
  console.log(mat1D)

  if(!mat1D instanceof Array) return;
  setTimeout(() => { // 非同期でマトリクスが更新されるため、非同期で実行
    let mat2D = mat1D.reduce((arry2D, v, i) => {
      if (i % col === 0) {
        arry2D.push([]);
      }
      const lastArry = arry2D[arry2D.length - 1];
      lastArry.push(v);
      return arry2D;
    }, []);

    console.log(`%c${label}`, 'font-size: 1.3em; color: red; background-color: #e4e4e4;')
    console.table(mat2D)
  })
}