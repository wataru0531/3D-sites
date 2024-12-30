
/**************************************************************

THREE JS: image RGB Split / Distortion On Scroll
https://www.youtube.com/watch?v=DdQn82X1G3I&t=39s

// GSAPライブラリ
https://cdnjs.com/libraries/gsap

gsap easings  https://gsap.com/docs/v3/Eases/

***************************************************************/
// "数値" 指定時間後にトゥイーン。タイムラインの先頭からの時間（秒）で開始
// "+=1"  直前のトゥイーンの終了後に何秒だけ離すか delay: 1 と同じ
// "-=1"  直前のトゥイーンの終了に何秒だけ重ねるか delay: -1　と同じ

// ">"    直前のトゥイーンの終了時
// ">3"   直前のトゥイーンの終了後に何秒だけ離すか。3秒後にトゥイーンする
// "<"    直前のトゥイーンの開始時
// "<4"   直前のトゥイーンの開始時の何秒後か。4秒後にトゥイーン

// "ラベル名"  指定したラベルと同じタイミングでトゥイーン
// "ラベル名 += 数値"
// "ラベル名 -= 数値"

// stagger... each   ... デフォルト、1つ１つの要素に効く
//            amount ... 全体で何秒か

// Custom ease の使用例
// gsap.registerPlugin(CustomEase)
// CustomEase.create(
//   "hop",
//   "M0,0 C0,0 0.056,0.442 0.175,0.442 0.294,0.442 0.332,0 0.332,0 0.332,0 0.414,1 0.671,1 0.991,1 1,0 1,0"
// );

// //now you can reference the ease by ID (as a string):
// gsap.to(element, { duration: 1, y: -100, ease: "hop" });

// LenisとScrollTriggerの更新を連動させる仕組みを構築 ///////////////////
// 慣性スクロール
// const lenis = new Lenis()

// ScrollTriggerがページのスクロール位置に応じて適切に更新
// lenis.on('scroll', ScrollTrigger.update)

// GSAPのtickerにカスタムアニメーションループを追加毎フレーム自動的に発火
//   Lenisのスムーズスクロールの更新がGSAPのアニメーションフレームと一致し、全体の動作がスムーズかつ一貫性のあるものになる
// gsap.ticker.add((time)=>{   // lenis.raf() → Lenisのスクロールアニメーションを更新
//   // console.log(time)
//   lenis.raf(time * 1000)
// });

// GSAPのtickerは通常、パフォーマンスのために遅延補正(ラグスムージング)を行うが、遅延補正を無効にしている
// これにより、LenisとGSAPのアニメーションがより正確に同期する
// gsap.ticker.lagSmoothing(0)
///////////////////////////////


// TODO
// ・スクロールの時のスロットル？を入れてみる
// 慣性スクロールもクラス化。共通の変数あるので注意

import { utils } from "./utils.js";

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector2,
  PlaneGeometry,
  TextureLoader,
  ShaderMaterial,
  DoubleSide,
  Mesh
} from 'three';
import vertex from'./shaders/vertex.glsl';
import fragment from'./shaders/fragment.glsl';

let scrollable = document.getElementById('js-scrollable');

let current = 0;
let target = 0;
let ease = .075;

function init(){
    document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
}

function smoothScroll(){
  target = window.scrollY;
  current = utils.lerp(current, target, ease);

  scrollable.style.transform = `translate3d(0,${-current}px, 0)`;
}

class EffectCanvas{
  constructor(){
    this.main = document.getElementById('js-main');
    this.images = [...document.querySelectorAll("#js-img")];
    this.meshItems = [];
    this.timerId = null;
    this._onResize();

    this.setupCamera();
    this.createMeshItems();
    this.render()
  }

  // Getter function used to get screen dimensions used for the camera and mesh materials
  get viewport(){
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspectRatio = width / height;

    return { width, height, aspectRatio };
  }

  setupCamera(){
    this.scene = new Scene(); 
    let perspective = 1000;
    const fov = ((2 * (Math.atan(window.innerHeight / 2 / perspective)))) * 180 / Math.PI; // 度数法に変換
    this.camera = new PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000)
    this.camera.position.set(0, 0, perspective); // カメラの位置と、
    
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.main.appendChild(this.renderer.domElement);
  }

  _onResize(){
    window.addEventListener('resize', () => {
      // console.log(this.timerId)
      this.onWindowResize.bind(this);

      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => { // ここで確実にリサイズする
        // console.log(this.timerId)
        this.onWindowResize.bind(this);
      }, 500);
    });
    
  }

  onWindowResize(){
    init();
    this.camera.aspect = this.viewport.aspectRatio; 
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height); 
  }

  createMeshItems(){
    this.images.forEach(image => {
      // シーンに
      let meshItem = new MeshItem(image, this.scene);
      this.meshItems.push(meshItem);
    })
  }

  render(){
    smoothScroll(); // 慣性スクロール

    for(let i = 0; i < this.meshItems.length; i++){
      // console.log(this)
      this.meshItems[i].render();
    }
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}

// 
class MeshItem{
  constructor(_image, _scene){ // image, this.scene
    this.image = _image;
    this.scene = _scene;
    this.offset = new Vector2(0,0); // meshのx, yの位置 (中心が0, 0の座表)
    this.sizes = new Vector2(0,0);  // 画像のwidth, height

    this.createMesh();
  }

  // 位置と大きさを取得
  getDimensions(){
    // 画像のそれぞれの位置、幅を取得。top はページの上からの距離
    const { width, height, top, left } = this.image.getBoundingClientRect();
    // console.log(width, height, top, left);

    this.sizes.set(width, height); // 画像の大きさ → meshの大きさとする
    // ブラウザの位置(左上が0, 0)から、WebGLの座標(中央が0, 0)に変換
    this.offset.set(
      left - window.innerWidth / 2 + width / 2,   // x座標の位置
      -top + window.innerHeight / 2 - height / 2  // y座標の位置
    ); 
  }

  createMesh(){
    this.geometry = new PlaneGeometry(1, 1, 100, 100);
    this.imageTexture = new TextureLoader().load(this.image.src);
    this.uniforms = {
      uTexture: { value: this.imageTexture },
      uOffset: { value: new Vector2(.0, .0) }, // (x: .0, -(target - current) * .0003)
      uAlpha: { value: 1. }
    };

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      // wireframe: true,
      side: DoubleSide
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.getDimensions(); // 位置と大きさを取得
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1); // planeの大きさは1なので
    this.scene.add(this.mesh);
  }

  render(){
    this.getDimensions(); // 画像の位置と大きさを取得
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
    
    // console.log(-(target - current) * .0003);
    this.uniforms.uOffset.value.set(this.offset.x * .0, -(target - current) * .0005 )
  }
}

init()
new EffectCanvas()
