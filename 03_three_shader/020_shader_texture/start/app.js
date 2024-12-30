/**
 * Three.js
 * https://threejs.org/
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneGeometry,
  SphereGeometry,
  TextureLoader,
  ShaderMaterial,
  Mesh,
  
} from "three";
import { objectDirection } from "three/examples/jsm/nodes/Nodes.js";

init();
async function init () {

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
  document.body.appendChild(renderer.domElement);

  // geometry
  const geometry = new PlaneGeometry(4, 2);
  // const geometry = new SphereGeometry(15, 32, 16);

  // material
  const url = "/img/output2.jpg";
  // const url = "/img/uv.jpg";

  // テクスチャ読み込み
  const loadTex = async (_url) => {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(_url);

    return texture;
  }

  const material = new ShaderMaterial({
    uniforms: {
      // valueの値を取ってくる仕様となっている。
      uTex: { value: await loadTex(url) }
    },

    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main(){
        vUv = uv;
        vPosition = position;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      }

    `,

    // 左右左右の順で格納
    // position...(-1, 1, 0) (1, 1, 0) (-1, -1, 0) (1, -1, 0)
    // uv...(0, 1) (1, 1) (0, 0) (1, 0)
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;

      // sampler2D...テクスチャの型
      uniform sampler2D uTex;

      void main(){
        // uTex ... 各フラグメントに対しての色が配列で格納
        // テクスチャuTexの中のvUv座標に対応する色を取得し、それをtexColorに格納。
        // texColorには各フラグメントのrgbaの色情報が4次元ベクトルとして入る。
        // UV座標というものはテクスチャマッピングを行うための専用の座標系と考える
        vec4 texColor = texture(uTex, vUv);

        // vec4 texColor = texture(uTex, vec2((vUv.x - .5)* .5 + .5, (vUv.y - .5) * .5 + .5));

        gl_FragColor = texColor;
        // gl_FragColor = vec4(vUv, 0., 1.);
        // gl_FragColor = vec4(vPosition, 1.);
      }
    `,
    // wireframe: true
  });
  // console.log(material.uniforms.uTex)
  
  // mesh
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  console.log(geometry);

  camera.position.z = 5;

  let i = 0;
  function animate() {
    requestAnimationFrame(animate);

    // cube.rotation.x = cube.rotation.x + 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();

};