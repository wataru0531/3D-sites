
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


import Lenis from 'lenis';
import gsap from 'gsap';
import { CustomEase } from 'gsap/all';
import { 
  Mesh, 
  Texture,
  TextureLoader,
  PerspectiveCamera,
  Scene,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  GLSL3, // (WebGL2.0のこと)
  // GLSL2は存在しない
  // GLSL1, // WebGL1.0のこと
  WebGLRenderer,
  LinearFilter,
  ClampToEdgeWrapping,
} from 'three'

import { utils } from './utils.js';

import baseVertex from './shaders/baseVertex.glsl'
import baseFragment from './shaders/baseFragment.glsl'
import effectVertex from './shaders/effectVertex.glsl'
import effectFragment from './shaders/effectFragment.glsl'

const CAMERA_POS = 500;
let observer = null; // intersectionObserver
let scene = null;
let geometry = null;
let material = null;

let scroll = null; // スクロール量と、瞬間的なスクロール量を格納するオブジェクト
let cursorRafId = null; // カーソルのrafのid
let mediaStores = null; // mesh, materialなどのデータを一元管理

const lenis = new Lenis();
const texLoader = new TextureLoader();

let cursorPos = { // カーソルの位置
  current: { x: 0.5, y: 0.5 },
  target: { x: 0.5, y: 0.5 }
}

const $ = {}; // DOMを格納
$.medias = [...document.querySelectorAll('[data-webgl-media]')];
// console.log($.medias); // (5) [img.img, img.img, img.img, img.img, img.img]
$.canvas = document.getElementById('js-canvas');

// 初期化
window.addEventListener('load', init);

// マウスの更新
// lerpCursorPosをrafし、targetの値を更新 → 補間値を取得していく
window.addEventListener('pointermove', ({ clientX, clientY }) => {
  cursorPos.target.x = (clientX / window.innerWidth)
  cursorPos.target.y = (clientY / window.innerHeight)

  if (!cursorRafId) { // マウスを動かせばこのブロックに入る
    cursorRafId = requestAnimationFrame(lerpCursorPos);
  }
});

// リサイズ処理
window.addEventListener('resize', utils.debounce(() => {
  const fov = utils.calcFov(CAMERA_POS);

  utils.resizeThreeCanvas({ camera, fov, renderer }); // fov, rendererの更新
  
  mediaStores.forEach((object) => {
    const { width, height, top, left,  } = object.media.getBoundingClientRect();

    object.mesh.scale.set(width, height, 1)
    object.width = width;
    object.height = height;
    object.top = top + scroll.scrollY;
    object.left = left;
    object.isInView = top >= 0 && top <= window.innerHeight;
    object.material.uniforms.uNaturalSize.value.x = object.media.naturalWidth;
    object.material.uniforms.uNaturalSize.value.y = object.media.naturalHeight;
    object.material.uniforms.uRectSize.value.x = width;
    object.material.uniforms.uRectSize.value.y = height;
    object.material.uniforms.uBorderRadius.value = getComputedStyle(object.media).borderRadius.replace('px', '');
  });
}));

// 初期化
async function init(){
  gsap.registerPlugin(CustomEase);

  initScroll(); // スクロール関連の処理
  requestAnimationFrame(scrollRaf); // lenisのrafを更新

  initObserver(); // ioの初期化
  
  await setMediaStores(scroll.scrollY); // 

  mediaStores.forEach(story => { // ioの監視対象にする
    // console.log(story);
    observer.observe(story.media);
  });

  render();

  document.body.classList.remove('loading'); // ローディング終わり
}


// スクロール関連の処理
function initScroll(){
  scroll = {
    scrollY: window.scrollY,
    scrollVelocity: 0 // その瞬間的なスクロール量。deltaは差分
  }
  
  lenis.on('scroll', (e) => {
    // console.log(e); // Lenis {__isScrolling: 'smooth', __isStopped: false, __isLocked: false, direction: 1, onPointerDown: ƒ, …}
    // console.log(e.velocity); // 
    scroll.scrollY = window.scrollY;
    scroll.scrollVelocity = e.velocity;
  });
}

 // lenisのスクロール処理をフレーム単位で更新するために設置
// → 内部で慣性や速度の補間などを計算し、スクロールのアニメーションをスムーズに制御していて、
//   このような計算を行うためには、フレーム単位で更新する必要があります。
function scrollRaf(_time) { 
  lenis.raf(_time)
  requestAnimationFrame(scrollRaf)
}


// 画像、mesh, materialなどのデータを一元管理するオブジェクトを生成。ここでは5つ
async function setMediaStores(_scrollY) {
  mediaStores = await Promise.all($.medias.map(async (media, idx) => {
    // console.log(media); // imgのdom
    // observer.observe(media); // ioの監視対象に設定

    // console.log(typeof idx); // number
    // console.log(typeof String(idx)); // string
    // console.log(idx, String(idx)); // 0 "0"
    media.dataset.index = String(idx); // → ここで、data-index="1" を付与
    media.addEventListener('pointerenter', () => handleMouseEnter(idx));
    media.addEventListener('pointermove', e => handleMousePos(e, idx)); 
    media.addEventListener('pointerleave', () => handleMouseLeave(idx));

    const { width, height, top, left } = media.getBoundingClientRect();
    const imageMaterial = material.clone(); // 個別のmaterialを生成
    // console.log(imageMaterial); // ShaderMaterial {isMaterial: true, uuid: '9ebe8382-de8d-42f2-a0b2-ae609d75ca5d', name: '', type: 'ShaderMaterial', blending: 1, …}
    // console.log(imageMaterial === material); // false

    const imageMesh = new Mesh(geometry, imageMaterial); // mesh

    let texture = null;

    try {
      texture = await loadImg(media.src);
    } catch(e) {
      console.log("Failed to load texture", e);
      return null;
    }

    // uniformの設定
    imageMaterial.uniforms.uTexture.value = texture; 
    // console.log(width, height); // 176.296875 264.671875
    // console.log(media.naturalWidth, media.naturalHeight); // 387 581
    imageMaterial.uniforms.uNaturalSize.value.x = media.naturalWidth; // 元々の画像の大きさ
    imageMaterial.uniforms.uNaturalSize.value.y = media.naturalHeight;
    imageMaterial.uniforms.uRectSize.value.x = width; // ブラウザに表示されている画像の大きさ
    imageMaterial.uniforms.uRectSize.value.y = height;
    // borderの太さも考慮してuniformsに渡す
    // console.log(getComputedStyle(media)); // CSSStyleDeclaration {0: 'accent-color', 1: 'align-content', ... }
    // console.log(getComputedStyle(media).borderRadius.replace("px", ""));
    imageMaterial.uniforms.uBorderRadius.value = getComputedStyle(media).borderRadius.replace('px', ''); // 

    imageMesh.scale.set(width, height, 1);

    // topの位置が0以上 && topの位置がウインドウの高さよりも小さい
    // これの逆 → ここでは画面幅に入りきれていないmedia
    // 主にパフォーマンス最適化のため。レンダリング対象から外す
    if (!(top >= 0 && top <= window.innerHeight)) {
      // console.log(idx);
      imageMesh.position.y = 2 * window.innerHeight; // 中央が(0, 0)の位置からかなり上に配置
      // console.log(imageMesh.position.y);
    }

    scene.add(imageMesh);

    return {
      media,
      material: imageMaterial,
      mesh: imageMesh,
      width,
      height,
      top: top + _scrollY,
      left,
      // -500px <= top <= ビューポートの高さから500px までを監視対象にする
      isInView: top >= -100 && top <= window.innerHeight + 100,
      mouseEnter: 0,
      mouseOverPos: { // handleMousePosのpointermoveで更新
        current: { x: 0.5, y: 0.5 },
        target: { x: 0.5, y: 0.5 }
      }
    }
  }));
  // console.log(mediaStores); // (5) [{…}, {…}, {…}, {…}, {…}]

   // nullを除外してmediaStoresを更新
  mediaStores = mediaStores.filter(store => store !== null);
}

// テクスチャを非同期で読み込む関数
async function loadImg(url) {
  try {
    const tex = await texLoader.loadAsync(url);
    tex.magFilter = LinearFilter;
    tex.minFilter = LinearFilter;
    tex.wrapS = ClampToEdgeWrapping;
    tex.wrapT = ClampToEdgeWrapping;
    tex.needsUpdate = true;
    // → テクスチャデータが更新されたことをThree.jsに通知するために使用するプロパティ。
    //   これを使うことで、動的なテクスチャ(例えば動画やcanvasベー$.スの内容)を正しくレンダリングに反映させることができる
    //   ここではmediaの参照は渡されているが、テクスチャとしてGPUにアップロードはされていないので何も表示されない

    return tex;
  } catch (error) {
    console.error(`Error loading texture from ${url}`, error);
    throw error;
  }
}

// カーソルの位置を線形補間で取得 左上が(0, 0)
function lerpCursorPos(){
  const x = utils.lerp(cursorPos.current.x, cursorPos.target.x, 0.05);
  const y = utils.lerp(cursorPos.current.y, cursorPos.target.y, 0.05);
  // console.log(x, y);

  cursorPos.current.x = x;
  cursorPos.current.y = y;

  // カーソルの移動距離の差分(delta)を取得
  // Math.sqrt ... 直角三角形の斜辺を算出。ピタゴラスの定理
  // **2 → 2乗
  const delta = Math.sqrt(
    ((cursorPos.target.x - cursorPos.current.x) ** 2) +
    ((cursorPos.target.y - cursorPos.current.y) ** 2)
  )

  if (delta < 0.001 && cursorRafId) { // 差分が.001未満になると発火を止める
    cancelAnimationFrame(cursorRafId);
    cursorRafId = null;
    return
  }

  cursorRafId = requestAnimationFrame(lerpCursorPos)
}

// テクスチャにカーソルが入った時の処理
function handleMouseEnter(_idx) {
  gsap.to(mediaStores[_idx],{ 
    mouseEnter: 1, // mouseEnterに1にする
    duration: 0.6,
    ease: CustomEase.create('custom', '0.4, 0, 0.2, 1') 
  });
}

// テクスチャ乗でカーソルを動かした時の処理 
// 左上から0〜1を取得
function handleMousePos({ offsetX, offsetY }, _idx) {
  // console.log(offsetX, offsetY); // 対象の要素の左上を(0, 0)とした座標を取得
  const { width, height } = mediaStores[_idx].media.getBoundingClientRect();
  const x = offsetX / width;
  const y = offsetY / height;
  // console.log(`x: ${x}px, y: ${y}px`)

  mediaStores[_idx].mouseOverPos.target.x = x;
  mediaStores[_idx].mouseOverPos.target.y = y;
}

// テクスチャからカーソルが抜けた時の処理
function handleMouseLeave(_idx) {
  gsap.to(mediaStores[_idx], { // 
    mouseEnter: 0, 
    duration: 0.6, 
    ease: CustomEase.create('custom', '0.4, 0, 0.2, 1') 
  });

  // マウスに関する位置情報を元に戻す
  gsap.to(mediaStores[_idx].mouseOverPos.target, { 
    x: 0.5, 
    y: 0.5, 
    duration: 0.6, 
    ease: CustomEase.create('custom', '0.4, 0, 0.2, 1') 
  });
}

// ブラウザ座標からワールド座標に変換し適用させる
function setPositions() {
  mediaStores.forEach((object) => {
    // console.log(object)
    // console.log(object.isInView);
    if (object.isInView) {
      object.mesh.position.x = (object.left + object.width / 2) - window.innerWidth / 2;
      object.mesh.position.y = - (object.top + object.height / 2) + window.innerHeight / 2 + scroll.scrollY;
    }
  })
}


// intersection observer
function initObserver(){
  // → 画像1枚１枚を監視対象とする
  observer = new IntersectionObserver((entries) => {
    // console.log(entries); // (5) [IntersectionObserverEntry, IntersectionObserverEntry, IntersectionObserverEntry, IntersectionObserverEntry, IntersectionObserverEntry]
      
    entries.forEach((entry) => {
      // console.log(entry); // IntersectionObserverEntry {time: 444.19999998807907, rootBounds: DOMRectReadOnly, boundingClientRect: DOMRectReadOnly, intersectionRect: DOMRectReadOnly, isIntersecting: false, …}
      // console.log(entry.target.dataset.index); // 0 1 2 3 4
      const index = entry.target.dataset.index; 

      if(index) {
        mediaStores[parseInt(index)].isInView = entry.isIntersecting; // parseInt 数値型に
        entry.target.classList.add("js-inview");
      } else {
        entry.target.classList.remove("js-inview");
      }
    });
  },
  // ブラウザのビューポートの上下方向に100px分拡張され、これを監視の範囲とする
  { rootMargin: '100px 0px 100px 0px' }
  );
}



/**************************************************************
shader関連
***************************************************************/
scene = new Scene(); // scene

// camera
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 10, 1000)
camera.position.z = CAMERA_POS;
camera.fov = utils.calcFov(CAMERA_POS);
camera.updateProjectionMatrix();

// geometry and material
geometry = new PlaneGeometry(1, 1, 100, 100);

// setMediaStores()で、このmaterialは上書きされる
material = new ShaderMaterial({ 
  uniforms: {
    uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) }, // resolution 解像度
    uTime: { value: 0 },
    uCursor: { value: new Vector2(0.5, 0.5) }, // 線形補間の値。カーソルの位置
    uScrollVelocity: { value: 0 },
    uTexture: { value: null },
    uNaturalSize: { value: new Vector2(100, 100) }, // 元々の画像の大きさ
    uRectSize: { value: new Vector2(100, 100) }, // ブラウザでのサイズ
    uBorderRadius: { value: 0 }, 
    uMouseEnter: { value: 0 }, // 入ったら1,でたら0。.6のdurationで切り替え
    uMouseOverPos: { value: new Vector2(0.5, 0.5) } // 線形補間の値。画像の左上を(0, 0)とした座表
  },
  // vertexShader: Vertex,
  // fragmentShader: baseFragment,
  vertexShader: effectVertex,
  fragmentShader: effectFragment,

  glslVersion: GLSL3,
  // GLSL3は、WebGL2に対応したGLSLのバージョンを指定
  // GLSL1.0（WebGL1）に比べ、GLSL3.0（WebGL2）はパフォーマンスが向上し、書き方が簡潔になる
  // 新しい構文（in, outを使ったデータのやり取り）や、より多くのシェーダー機能をサポートしている
  // glslVersion: GLSL1
})

// renderer
const renderer = new WebGLRenderer({ canvas: $.canvas, alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// render
function render(_time = 0) {
  _time /= 1000; 
  // _time = _time / 1000;

  mediaStores.forEach((object) => {
    if (object.isInView) { // 監視対象に入った画像のみ
      object.mouseOverPos.current.x = utils.lerp(object.mouseOverPos.current.x, object.mouseOverPos.target.x, 0.05)
      object.mouseOverPos.current.y = utils.lerp(object.mouseOverPos.current.y, object.mouseOverPos.target.y, 0.05)

      object.material.uniforms.uResolution.value.x = window.innerWidth
      object.material.uniforms.uResolution.value.y = window.innerHeight
      object.material.uniforms.uTime.value = _time
      object.material.uniforms.uCursor.value.x = cursorPos.current.x
      object.material.uniforms.uCursor.value.y = cursorPos.current.y
      object.material.uniforms.uScrollVelocity.value = scroll.scrollVelocity
      object.material.uniforms.uMouseOverPos.value.x = object.mouseOverPos.current.x
      object.material.uniforms.uMouseOverPos.value.y = object.mouseOverPos.current.y
      object.material.uniforms.uMouseEnter.value = object.mouseEnter
    } else {
      object.mesh.position.y = 2 * window.innerHeight;
    }
  })

  setPositions(); // ブラウザ座標をワールド座標に適用

  renderer.render(scene, camera)

  requestAnimationFrame(render);
}



// import Lenis from 'lenis';
// import gsap from 'gsap';
// import { CustomEase } from 'gsap/all';
// import { 
//   Mesh, 
//   Texture,
//   PerspectiveCamera,
//   Scene,
//   PlaneGeometry,
//   ShaderMaterial,
//   Vector2,
//   GLSL3, // (WebGL2.0のこと)
//   // GLSL2は存在しない
//   // GLSL1, // WebGL1.0のこと
//   WebGLRenderer,
//   LinearFilter,
//   ClampToEdgeWrapping,
// } from 'three'

// import { utils } from './utils.js';

// import baseVertex from './shaders/baseVertex.glsl'
// import baseFragment from './shaders/baseFragment.glsl'
// import effectVertex from './shaders/effectVertex.glsl'
// import effectFragment from './shaders/effectFragment.glsl'

// const CAMERA_POS = 500;
// let observer = null; // intersectionObserver
// let scene = null;
// let geometry = null;
// let material = null;

// let scroll = null; // スクロール量と、瞬間的なスクロール量を格納するオブジェクト
// let cursorRafId = null; // カーソルのrafのid
// let mediaStores = null; // mesh, materialなどのデータを一元管理

// const lenis = new Lenis();

// let cursorPos = { // カーソルの位置
//   current: { x: 0.5, y: 0.5 },
//   target: { x: 0.5, y: 0.5 }
// }

// const $ = {}; // DOMを格納
// $.medias = [...document.querySelectorAll('[data-webgl-media]')];
// // console.log($.medias); // (5) [img.img, img.img, img.img, img.img, img.img]
// $.canvas = document.getElementById('js-canvas');


// // 初期化
// window.addEventListener('load', init);

// // マウスの更新
// // lerpCursorPosをrafし、targetの値を更新 → 補間値を取得していく
// window.addEventListener('pointermove', ({ clientX, clientY }) => {
//   cursorPos.target.x = (clientX / window.innerWidth)
//   cursorPos.target.y = (clientY / window.innerHeight)

//   if (!cursorRafId) { // マウスを動かせばこのブロックに入る
//     cursorRafId = requestAnimationFrame(lerpCursorPos);
//   }
// });

// // リサイズ処理
// window.addEventListener('resize', utils.debounce(() => {
//   const fov = utils.calcFov(CAMERA_POS);

//   utils.resizeThreeCanvas({ camera, fov, renderer }); // fov, rendererの更新
  
//   mediaStores.forEach((object) => {
//     const { width, height, top, left,  } = object.media.getBoundingClientRect();

//     object.mesh.scale.set(width, height, 1)
//     object.width = width;
//     object.height = height;
//     object.top = top + scroll.scrollY;
//     object.left = left;
//     object.isInView = top >= 0 && top <= window.innerHeight;
//     object.material.uniforms.uNaturalSize.value.x = object.media.naturalWidth;
//     object.material.uniforms.uNaturalSize.value.y = object.media.naturalHeight;
//     object.material.uniforms.uRectSize.value.x = width;
//     object.material.uniforms.uRectSize.value.y = height;
//     object.material.uniforms.uBorderRadius.value = getComputedStyle(object.media).borderRadius.replace('px', '');
//   })
// }))

// // 初期化処理をまとめる
// function init(){
//   gsap.registerPlugin(CustomEase);

//   initScroll(); // スクロール関連の処理
//   requestAnimationFrame(scrollRaf); // lenisのrafを更新
  
//   setMediaStores(scroll.scrollY); // 

//   requestAnimationFrame(render);

//   document.body.classList.remove('loading'); // ローディング終わり
// }


// // スクロール関連の処理
// function initScroll(){
//   scroll = {
//     scrollY: window.scrollY,
//     scrollVelocity: 0 // その瞬間的なスクロール量。deltaは差分
//   }
  
//   lenis.on('scroll', (e) => {
//     // console.log(e); // Lenis {__isScrolling: 'smooth', __isStopped: false, __isLocked: false, direction: 1, onPointerDown: ƒ, …}
//     // console.log(e.velocity); // 
//     scroll.scrollY = window.scrollY;
//     scroll.scrollVelocity = e.velocity;
//   });
// }

//  // lenisのスクロール処理をフレーム単位で更新するために設置
// // → 内部で慣性や速度の補間などを計算し、スクロールのアニメーションをスムーズに制御していて、
// //   このような計算を行うためには、フレーム単位で更新する必要があります。
// function scrollRaf(_time) { 
//   lenis.raf(_time)
//   requestAnimationFrame(scrollRaf)
// }

// // mesh, materialなどのデータを一元管理
// function setMediaStores(_scrollY) {
//   mediaStores = $.medias.map((media, idx) => {
//     // console.log(media); // imgのdom
//     observer.observe(media); // ioの監視対象に設定

//     // console.log(typeof idx); // number
//     // console.log(typeof String(idx)); // string
//     // console.log(idx, String(idx)); // 0 "0"
//     media.dataset.index = String(idx); // → ここで、data-index="1" を付与
//     media.addEventListener('pointerenter', () => handleMouseEnter(idx));
//     media.addEventListener('pointermove', e => handleMousePos(e, idx)); 
//     media.addEventListener('pointerleave', () => handleMouseLeave(idx));

//     const { width, height, top, left } = media.getBoundingClientRect();
//     const imageMaterial = material.clone(); // 個別のmaterialを生成
//     // console.log(imageMaterial); // ShaderMaterial {isMaterial: true, uuid: '9ebe8382-de8d-42f2-a0b2-ae609d75ca5d', name: '', type: 'ShaderMaterial', blending: 1, …}
//     // console.log(imageMaterial === material); // false

//     const imageMesh = new Mesh(geometry, imageMaterial); // mesh

//     let texture = null;
//     texture = new Texture(media);
//     // texture.needsUpdate = true;
//     // → テクスチャデータが更新されたことをThree.jsに通知するために使用するプロパティ。
//     //   これを使うことで、動的なテクスチャ(例えば動画やcanvasベー$.スの内容)を正しくレンダリングに反映させることができる
//     //   ここではmediaの参照は渡されているが、テクスチャとしてGPUにアップロードはされていないので何も表示されない
//     // console.log(texture);

//     // uniformを渡していく
//     imageMaterial.uniforms.uTexture.value = texture; 
//     // console.log(width, height); // 176.296875 264.671875
//     // console.log(media.naturalWidth, media.naturalHeight); // 387 581
//     imageMaterial.uniforms.uNaturalSize.value.x = media.naturalWidth; // 元々の画像の大きさ
//     imageMaterial.uniforms.uNaturalSize.value.y = media.naturalHeight;
//     imageMaterial.uniforms.uRectSize.value.x = width; // ブラウザに表示されている画像の大きさ
//     imageMaterial.uniforms.uRectSize.value.y = height;
//     // borderの太さも考慮してuniformsに渡す
//     // console.log(getComputedStyle(media)); // CSSStyleDeclaration {0: 'accent-color', 1: 'align-content', ... }
//     // console.log(getComputedStyle(media).borderRadius.replace("px", ""));
//     imageMaterial.uniforms.uBorderRadius.value = getComputedStyle(media).borderRadius.replace('px', ''); // 

//     imageMesh.scale.set(width, height, 1);

//     // topの位置が0以上 && topの位置がウインドウの高さよりも小さい
//     // これの逆 → ここでは画面幅に入りきれていないmedia
//     // 主にパフォーマンス最適化のため。レンダリング対象から外す
//     if (!(top >= 0 && top <= window.innerHeight)) {
//       // console.log(idx);
//       imageMesh.position.y = 2 * window.innerHeight; // 中央が(0, 0)の位置からかなり上に配置
//       // console.log(imageMesh.position.y);
//     }

//     scene.add(imageMesh);

//     return {
//       media,
//       material: imageMaterial,
//       mesh: imageMesh,
//       width,
//       height,
//       top: top + _scrollY,
//       left,
//       // -500px <= top <= ビューポートの高さから500px までを監視対象にする
//       isInView: top >= -100 && top <= window.innerHeight + 100,
//       mouseEnter: 0,
//       mouseOverPos: { // handleMousePosのpointermoveで更新
//         current: { x: 0.5, y: 0.5 },
//         target: { x: 0.5, y: 0.5 }
//       }
//     }
//   });
//   // console.log(mediaStores);
// }

// // カーソルの位置を線形補間で取得 左上が(0, 0)
// function lerpCursorPos(){
//   const x = utils.lerp(cursorPos.current.x, cursorPos.target.x, 0.05);
//   const y = utils.lerp(cursorPos.current.y, cursorPos.target.y, 0.05);
//   // console.log(x, y);

//   cursorPos.current.x = x;
//   cursorPos.current.y = y;

//   // カーソルの移動距離の差分(delta)を取得
//   // Math.sqrt ... 直角三角形の斜辺を算出。ピタゴラスの定理
//   // **2 → 2乗
//   const delta = Math.sqrt(
//     ((cursorPos.target.x - cursorPos.current.x) ** 2) +
//     ((cursorPos.target.y - cursorPos.current.y) ** 2)
//   )

//   if (delta < 0.001 && cursorRafId) { // 差分が.001未満になると発火を止める
//     cancelAnimationFrame(cursorRafId);
//     cursorRafId = null;
//     return
//   }

//   cursorRafId = requestAnimationFrame(lerpCursorPos)
// }

// // テクスチャにカーソルが入った時の処理
// function handleMouseEnter(_idx) {
//   gsap.to(mediaStores[_idx],{ 
//     mouseEnter: 1, // mouseEnterに1にする
//     duration: 0.6,
//     ease: CustomEase.create('custom', '0.4, 0, 0.2, 1') 
//   });
// }

// // テクスチャ乗でカーソルを動かした時の処理 
// // 左上から0〜1を取得
// function handleMousePos({ offsetX, offsetY }, _idx) {
//   // console.log(offsetX, offsetY); // 対象の要素の左上を(0, 0)とした座標を取得
//   const { width, height } = mediaStores[_idx].media.getBoundingClientRect();
//   const x = offsetX / width;
//   const y = offsetY / height;
//   // console.log(`x: ${x}px, y: ${y}px`)

//   mediaStores[_idx].mouseOverPos.target.x = x;
//   mediaStores[_idx].mouseOverPos.target.y = y;
// }

// // テクスチャからカーソルが抜けた時の処理
// function handleMouseLeave(_idx) {
//   gsap.to(mediaStores[_idx], { // 
//     mouseEnter: 0, 
//     duration: 0.6, 
//     ease: CustomEase.create('custom', '0.4, 0, 0.2, 1') 
//   });

//   // マウスに関する位置情報を元に戻す
//   gsap.to(mediaStores[_idx].mouseOverPos.target, { 
//     x: 0.5, 
//     y: 0.5, 
//     duration: 0.6, 
//     ease: CustomEase.create('custom', '0.4, 0, 0.2, 1') 
//   });
// }

// // ブラウザ座標からワールド座標に変換し適用させる
// function setPositions() {
//   mediaStores.forEach((object) => {
//     // console.log(object)
//     // console.log(object.isInView);
//     if (object.isInView) {
//       object.mesh.position.x = (object.left + object.width / 2) - window.innerWidth / 2;
//       object.mesh.position.y = - (object.top + object.height / 2) + window.innerHeight / 2 + scroll.scrollY;
//     }
//   })
// }

// /**************************************************************
// shader関連
// ***************************************************************/


// // intersection observer
// // → 画像1枚１枚を監視対象とする
// observer = new IntersectionObserver((entries) => {
//     // console.log(entries); // (5) [IntersectionObserverEntry, IntersectionObserverEntry, IntersectionObserverEntry, IntersectionObserverEntry, IntersectionObserverEntry]
      
//     entries.forEach((entry) => {
//       // console.log(entry); // IntersectionObserverEntry {time: 444.19999998807907, rootBounds: DOMRectReadOnly, boundingClientRect: DOMRectReadOnly, intersectionRect: DOMRectReadOnly, isIntersecting: false, …}
//       // console.log(entry.target.dataset.index); // 0 1 2 3 4
//       const index = entry.target.dataset.index; 

//       if(index) {
//         mediaStores[parseInt(index)].isInView = entry.isIntersecting; // parseInt 数値型に
//         entry.target.classList.add("js-inview");
//       } else {
//         entry.target.classList.remove("js-inview");
//       }
//     });
//   },
//   // ブラウザのビューポートの上下方向に100px分拡張され、これを監視の範囲とする
//   { rootMargin: '100px 0px 100px 0px' }
// )

// scene = new Scene(); // scene

// // camera
// const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 10, 1000)
// camera.position.z = CAMERA_POS;
// camera.fov = utils.calcFov(CAMERA_POS);
// camera.updateProjectionMatrix();

// // geometry and material
// geometry = new PlaneGeometry(1, 1, 100, 100);

// // setMediaStores()で、このmaterialは上書きされる
// material = new ShaderMaterial({ 
//   uniforms: {
//     uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) }, // resolution 解像度
//     uTime: { value: 0 },
//     uCursor: { value: new Vector2(0.5, 0.5) }, // 線形補間の値。カーソルの位置
//     uScrollVelocity: { value: 0 },
//     uTexture: { value: null },
//     uNaturalSize: { value: new Vector2(100, 100) }, // 元々の画像の大きさ
//     uRectSize: { value: new Vector2(100, 100) }, // ブラウザでのサイズ
//     uBorderRadius: { value: 0 }, 
//     uMouseEnter: { value: 0 }, // 入ったら1,でたら0。.6のdurationで切り替え
//     uMouseOverPos: { value: new Vector2(0.5, 0.5) } // 線形補間の値。画像の左上を(0, 0)とした座表
//   },
//   // vertexShader: Vertex,
//   // fragmentShader: baseFragment,
//   vertexShader: effectVertex,
//   fragmentShader: effectFragment,

//   glslVersion: GLSL3,
//   // GLSL3は、WebGL2に対応したGLSLのバージョンを指定
//   // GLSL1.0（WebGL1）に比べ、GLSL3.0（WebGL2）はパフォーマンスが向上し、書き方が簡潔になる
//   // 新しい構文（in, outを使ったデータのやり取り）や、より多くのシェーダー機能をサポートしている
//   // glslVersion: GLSL1
// })

// // renderer
// const renderer = new WebGLRenderer({ canvas: $.canvas, alpha: true, antialias: true })
// renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// // render
// function render(_time = 0) {
//   _time /= 1000; 
//   // _time = _time / 1000;

//   mediaStores.forEach((object) => {
//     if (object.isInView) { // 監視対象に入った画像のみ
//       object.mouseOverPos.current.x = utils.lerp(object.mouseOverPos.current.x, object.mouseOverPos.target.x, 0.05)
//       object.mouseOverPos.current.y = utils.lerp(object.mouseOverPos.current.y, object.mouseOverPos.target.y, 0.05)

//       object.material.uniforms.uResolution.value.x = window.innerWidth
//       object.material.uniforms.uResolution.value.y = window.innerHeight
//       object.material.uniforms.uTime.value = _time
//       object.material.uniforms.uCursor.value.x = cursorPos.current.x
//       object.material.uniforms.uCursor.value.y = cursorPos.current.y
//       object.material.uniforms.uScrollVelocity.value = scroll.scrollVelocity
//       object.material.uniforms.uMouseOverPos.value.x = object.mouseOverPos.current.x
//       object.material.uniforms.uMouseOverPos.value.y = object.mouseOverPos.current.y
//       object.material.uniforms.uMouseEnter.value = object.mouseEnter
//     } else {
//       object.mesh.position.y = 2 * window.innerHeight;
//     }
//   })

//   setPositions(); // ブラウザ座標をワールド座標に適用

//   renderer.render(scene, camera)

//   requestAnimationFrame(render);
// }


