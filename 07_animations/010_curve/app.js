// /**************************************************************

// Make Your Site Pop With This Mousemove Animation (JavaScript Only)
// https://www.youtube.com/watch?v=oqTpc76-TtQ

// // GSAPライブラリ
// https://cdnjs.com/libraries/gsap

// gsap easings  https://gsap.com/docs/v3/Eases/

// ***************************************************************/
// // "数値" 指定時間後にトゥイーン。タイムラインの先頭からの時間（秒）で開始
// // "+=1"  直前のトゥイーンの終了後に何秒だけ離すか delay: 1 と同じ
// // "-=1"  直前のトゥイーンの終了に何秒だけ重ねるか delay: -1　と同じ

// // ">"    直前のトゥイーンの終了時
// // ">3"   直前のトゥイーンの終了後に何秒だけ離すか。3秒後にトゥイーンする
// // "<"    直前のトゥイーンの開始時
// // "<4"   直前のトゥイーンの開始時の何秒後か。4秒後にトゥイーン

// // "ラベル名"  指定したラベルと同じタイミングでトゥイーン
// // "ラベル名 += 数値"
// // "ラベル名 -= 数値"

// // stagger... each   ... デフォルト、1つ１つの要素に効く
// //            amount ... 全体で何秒か

// // Custom ease の使用例
// // gsap.registerPlugin(CustomEase)
// // CustomEase.create(
// //   "hop",
// //   "M0,0 C0,0 0.056,0.442 0.175,0.442 0.294,0.442 0.332,0 0.332,0 0.332,0 0.414,1 0.671,1 0.991,1 1,0 1,0"
// // );

import "./styles/style.css";

import gsap from "gsap";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  ShaderMaterial,
  PlaneGeometry,
  PlaneBufferGeometry,
  Mesh,
  Color,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import GUI from "lil-gui";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";


window.addEventListener("load", () => {
  const canvas = document.getElementById("js-canvas");
  const gl = new Main(canvas);
  console.log(gl);

  let timerId = null;
  window.addEventListener("resize", () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      // console.log(timerId);
      gl.onResize();
    }, 500);
  });

})



export default class Main {
    constructor(webgl){ // webgl → canvasタグ
    this.webgl = webgl;
    this.scene = new Scene();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer = new WebGLRenderer({
      antialias: true
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    this.renderer.setClearColor( new Color( 0xCCCCCCC ))
    this.renderer.setSize(this.width,this.height);

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.camera = null;
    this.cameraZ = 100;

    this.init();
  }

  init(){
    this.setting();
    this.onRaf();

    this.tl = gsap.timeline();
    this.tl.to(this.material.uniforms.progress, {
      value: 1,
      duration: 1,
      delay: 1,
      ease: "circ.inOut",
    })
    .to(".text span", {
      y: "0%",
      duration: .9,
      ease: "circ.inOut",
      stagger: {
        each: .05, // 1つづつの要素に
      }
    }, "-=.4") // 直前のトゥイーンに何秒だけこのトゥイーンを重ねるか
  }

  setting(){
    // console.log(this.renderer.domElement);
    this.webgl.appendChild(this.renderer.domElement);
    this.camera = new PerspectiveCamera(
      // atan → 辺の長さの比から角度(radian)を取得。
      // tan  → 角度(radian)から辺の比を取得
      // * 180 / Math.PI → 度数法に変換
      2 * Math.atan((this.height / 2) / this.cameraZ) * (180 / Math.PI),
      this.width / this.height,
      1,
      1000,
    );
    this.camera.position.set(0, 0, this.cameraZ);
    this.camera.updateProjectionMatrix();

    this._setMesh();
  }

  _setMesh(){
    this.geometry = new PlaneGeometry(this.width, this.height, 100, 100);
    // this.geometry = new PlaneBufferGeometry(this.width, this.height, 100, 100);
    this.material = new ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      // wireframe: true,

      uniforms: {
        progress: { value: 0 },
      }
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  onResize(){
    // this.width = window.innerWidth
    // this.height = window.innerHeight
    // this.mesh.scale.x = this.width
    // this.mesh.scale.y = this.height
    // this.camera.aspect = window.innerWidth / window.innerHeight
    // this.renderer.setSize( window.innerWidth,window.innerHeight)
    // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    // this.camera.updateProjectionMatrix()

    // ウィンドウのサイズを取得
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // カメラのアスペクト比を更新
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // レンダラーのサイズを更新
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // geometryのサイズ更新が面倒なので新しいgeometryを生成
    this.mesh.geometry.dispose();  // 古いジオメトリを破棄
    this.mesh.geometry = new PlaneGeometry(this.width, this.height, 100, 100);
  }

  onRaf(){
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => {
      // console.log(this)
      this.onRaf()
    });
  }
}




// import * as THREE from 'three'

// import vertexShader from "./vertex.glsl";
// import fragmentShader from "./fragment.glsl";
// import gsap from 'gsap'



// export default class main {
//   constructor(webgl) {
//     this.webgl = webgl
//     this.scene = new THREE.Scene()
//     this.width = window.innerWidth
//     this.height = window.innerHeight
//     this.renderer = new THREE.WebGLRenderer({
//       antialias: true
//     })
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
//     this.renderer.setClearColor( new THREE.Color( 0xCCCCCCC ))
//     this.renderer.setSize(this.width,this.height)
//     this.geometry = null
//     this.material = null
//     this.mesh = null
//     this.camera = null

//     this.init()
//   }

//   init() {
//     this.setting()
//     this.onRaf()
//     this.tl = gsap.timeline()
//     .to(this.material.uniforms.progress, {
//       value:1,
//       duration:1,
//       delay:1.,
//       ease:'circ.inOut'
//     })
//     .to('.text span', {
//       y:'0%',
//       duration:0.9,
//       stagger:0.05,
//       ease:'circ.inOut'
//     },'-=0.4')
//   }

//   setting() {

//     this.webgl.appendChild(this.renderer.domElement)

//     this.camera = new THREE.PerspectiveCamera(
//       2 * Math.atan((this.height / 2) / 100) * 180 / Math.PI,
//       this.width / this.height,
//       1,
//       1000
//     )    

//     this.camera.position.set(
//       0,
//       0,
//       100
//     )
//     this.camera.updateProjectionMatrix()

//     this._setMesh()

//   }

//   _setMesh() {
//     this.geometry = new THREE.PlaneBufferGeometry(this.width,this.height,100,100)
//     this.material = new THREE.ShaderMaterial({
//       vertexShader: vertexShader,
//       fragmentShader: fragmentShader,
//       transparent:true,
//       uniforms: {
//         progress: {
//           value:0.0
//         },
//       }
//     })

//     this.mesh = new THREE.Mesh(this.geometry,this.material);
//     this.scene.add(this.mesh);
//   }

//   onResize() {
//     this.width = window.innerWidth
//     this.height = window.innerHeight
//     this.mesh.scale.x = this.width
//     this.mesh.scale.y = this.height
//     this.camera.aspect = window.innerWidth / window.innerHeight
//     this.renderer.setSize( window.innerWidth,window.innerHeight)
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
//     this.camera.updateProjectionMatrix()
//   }

//   onRaf() {
//     this.renderer.render(this.scene, this.camera);
//     window.requestAnimationFrame(() => {
//       this.onRaf();
//     })
//   }
// }

// window.addEventListener('load', () => {
//     const gl = new main(document.querySelector('#js-canvas'));

//     window.addEventListener('resize',() => {
//       gl.onResize();
//     })
// });