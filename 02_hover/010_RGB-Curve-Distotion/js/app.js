
/**************************************************************

THREE JS / WebGL: RGB Curve Distortion Effect on Mouse Move
https://www.youtube.com/watch?v=V8GnInBUMLo&t=26s

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
// リサイズ
// pointerに変更

import {
    TextureLoader,
    Scene,
    Vector2,
    PerspectiveCamera,
    WebGLRenderer,
    PlaneGeometry,
    ShaderMaterial,
    Mesh,
    DoubleSide,

} from 'three';
import { utils } from "./utils.js";
import images from './images';

import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

class HoverImage{
  constructor(){
    this.container = document.getElementById('js-container');
    this.itemsContainer = document.getElementById("js-items-container");
    this.items = [...document.querySelectorAll("#js-item")];
    this.scene = new Scene();
    this.perspective = 1000;
    this.targetX = 0;
    this.targetY = 0;
    this.sizes = new Vector2(0, 0);
    this.current = new Vector2(0, 0); // 差分
    this.timerId = null;
    this.uniforms = {
      uTexture: { value: null },
      uAlpha: { value: 0.0 },
      uOffset: { value: new Vector2(0.0, 0.0) }, // vertexに渡す差分
      uTick: { value: 0 },
    };

    // テクスチャのロード
    this.loadImages().then((textures) => {
      // console.log(textures)
      this.textures = textures;
      this.uniforms.uTexture.value = this.textures[2]; // 初期値として imageThree を設定
    });

    this.items.forEach((link, idx) => {
      link.addEventListener('pointerenter', () => {
        this.uniforms.uTexture.value = this.textures[idx];

        // switch文
        // → 一致する値が見つかるまで順番に評価され、一致する case があればその処理を実行。
        //   breakがない場合、次のcaseの処理も続けて実行されてしまう(フォールスルー)
        // switch(idx){ // 条件定義 → idx
        //   case 0: // 条件分岐 → idxが0の時に発火
        //     this.uniforms.uTexture.value = this.textures[idx];
        //     break;
        //     // break → caseが実行された後にswitch文から抜け出すためのキーワード。
        //     // 　　　　　breakがないと、次のcaseの処理まで実行されてしまう。
        //   case 1:
        //     this.uniforms.uTexture.value = this.textures[idx];
        //     break;
        //   case 2:
        //     this.uniforms.uTexture.value = this.textures[idx];
        //     break;
        //   case 3:
        //     this.uniforms.uTexture.value = this.textures[idx];
        //     break;
        // }
      });

      link.addEventListener('pointerleave', () => {
          this.uniforms.uAlpha.value = utils.lerp(this.uniforms.uAlpha.value, 0.0, 0.1);
      });
    });

    this.addEventListeners(this.itemsContainer);
    this.setUpCamera();
    this.onMouseMove();
    this.createMesh();
    this.resize();
    this.render();
  }

  // 画像読み込み
  async loadImage(src) {
    return new Promise((resolve, reject) => {
        // load(パス, 成功時に呼ばれるコールバック, ロード中に進行状況を追跡するためのコールバック, エラーが発生した時に発火するコールバック)
        new TextureLoader().load(src, resolve, undefined, reject);
    });
  }

  // すべての画像を非同期にロード
  async loadImages() {
    const texturePromises = [
        this.loadImage(images.imageOne),
        this.loadImage(images.imageTwo),
        this.loadImage(images.imageThree),
        this.loadImage(images.imageFour)
    ];
    // console.log(texturePromises); // (4) [Promise, Promise, Promise, Promise]
    return Promise.all(texturePromises);
  }

  // get → ゲッター
  //       プロパティにアクセスする際に関数を自動的に呼び出すための方法
  //       プロパティのように呼び出せる 
  get viewport(){
      let width = window.innerWidth;
      let height = window.innerHeight;
      // アスペクトの基準 → 幅が高さに対してどのくらい が通常の考え方
      let aspectRatio = width / height;

      return{ width, height, aspectRatio }
  }

  addEventListeners(_element){
      _element.addEventListener('pointerenter', () => {
          this.linkHovered = true;
      })
      _element.addEventListener('pointerleave', () => {
          this.linkHovered = false;
      })
  };

  setUpCamera(){
    // atan → tan(radianを引数に比を出す)の逆
    //        長さの比から角度を算出する
    // radian * 180 / Math.PI → ラジアンを度数法変換
    let fov = ((2 * Math.atan(this.viewport.height / 2 / this.perspective))) * 180 / Math.PI;
    // console.log(fov); // 50.25315465660766
    this.camera = new PerspectiveCamera(fov, this.viewport.aspectRatio, 0.1, 1000);
    this.camera.position.set(0, 0 , this.perspective);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
  };

  createMesh(){
    this.geometry = new PlaneGeometry(1 ,1 ,20 ,20);
    this.material = new ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        // wireframe: true,
        // side: DoubleSide
    })
    this.mesh = new Mesh(this.geometry, this.material);
    this.sizes.set(this.viewport.width / 2, this.viewport.height / 2, 1); // 初期化時は、Vector2(0,0);

    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1); // TODO 大きさも動的に
    this.mesh.position.set(this.current.x, this.current.y, 0); // 位置は動的に
    this.scene.add(this.mesh);
  };

  onMouseMove(){
      window.addEventListener('pointermove', ({ clientX, clientY }) => {
        this.targetX = clientX;
        this.targetY = clientY;
      })
  };

  resize(){
    window.addEventListener('resize', () => {
      // console.log(this); // WebGL {container: main#js-container.container, items: ul#js-items.items, item: Array(4), scene: Scene, perspective: 1000, …}
      this.onWindowResize.bind(this);
      clearTimeout(this.timerId);

      this.timerId = setTimeout(() => { // 確実にリサイズするように500ms後に発火させる
        // console.log("resize done!!");
        this.onWindowResize.bind(this);
      }, 500);
    });
  }

  onWindowResize(){
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;
    this.renderer.setSize(this.viewport.width, this.viewport.height);   
    this.camera.updateProjectionMatrix();
  };

  render(){
    // 時間軸
    this.uniforms.uTick.value++;
    // console.log(this.uniforms.uTick.value);

    // オフセット → ずれ、基準、差分
    this.current.x = utils.lerp(this.current.x, this.targetX, 0.1);
    this.current.y = utils.lerp(this.current.y, this.targetY, 0.1);

    // 差分
    // console.log(this.targetX - this.current.x); 
    this.uniforms.uOffset.value.set(
      (this.targetX - this.current.x) * 0.0005, 
      -(this.targetY - this.current.y) * 0.0005 
    );

    // 位置の更新
    this.mesh.position.set(
      this.current.x - (window.innerWidth / 2),
      -this.current.y + (window.innerHeight / 2),
      0
    );

    // ホバー時
    this.linkHovered 
    ? this.uniforms.uAlpha.value = utils.lerp(this.uniforms.uAlpha.value, 1.0, 0.1)
    : this.uniforms.uAlpha.value = utils.lerp(this.uniforms.uAlpha.value, 0.0, 0.1);

    // ホバー時のli
    // for(let i = 0; i < this.items.length; i++){
    for(let i = this.items.length - 1; i >= 0; i--){
      this.items[i].addEventListener('pointerenter', () => {
        for (let j = this.items.length - 1; j >= 0; j--) {
          // ホバーしている要素だけ 1、それ以外は 0.2
          this.items[j].style.opacity = (i === j) ? 1 : 0.2;  
        }
      });

      // ホバーが外れたときにすべての opacity を元に戻す
      this.items[i].addEventListener('pointerleave', () => {
        for (let j = this.items.length - 1; j >= 0; j--) {
          this.items[j].style.opacity = 1;  // 元に戻す
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => {
      // this.render.bind(this)
      this.render();
    });
  };
}

new HoverImage()