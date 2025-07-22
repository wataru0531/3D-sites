/**************************************************************

液体ガラスのようにフレームを歪ませる、最も美しいコンテンツスライダー（GSAP & Three JS）
https://www.youtube.com/watch?v=7TcfWFh4ATA

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


import { slides } from "./slides.js";
import { vertexShader, fragmentShader } from "./shaders.js";

import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  ShaderMaterial,
  Vector2,
  PlaneGeometry,
  Mesh,
  TextureLoader,
  LinearFilter,


} from "three";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText) 
gsap.config({ nullTargetWarn: false });
// 無効なターゲットに対する警告を出さないようにする。to()などで対象が見つからなくても警告はださない。

let currentSlideIndex = 0;
let isTransitioning = false;
let slideTextures = [];
let shaderMaterial;
let renderer;

// 
function createCharacterElements(_element){
  if(_element.querySelectorAll(".char").length > 0) return;
  const words = _element.textContent.split(" ");
  _element.innerHTML = "";

  words.forEach((word, idx) => {
    const wordDiv = document.createElement("div");
    wordDiv.className = "word";

    [...word].forEach(char => {
      const charDiv = document.createElement("div");
      charDiv.className = "char";
      charDiv.innerHTML = `<span>${ char }</span>`;
      wordDiv.appendChild(charDiv);
    });

    _element.appendChild(wordDiv);

    if(idx < words.length - 1){
      const spaceChar = document.createElement("div");
      spaceChar.className = "word";
      spaceChar.innerHTML = `<div class="char"><span> </span></div>`;
      _element.appendChild(spaceChar);
    }
  });
}

// 
function createLineElements(_element) {
  new SplitText(_element, { type: "lines", linesClass: "line" });

  _element.querySelectorAll(".line").forEach(line => {
    line.innerHTML = `<span>${line.textContent}</span>`;
  });
}

// 
function processTextElements(_container) {
  const title = _container.querySelector(".slide-title h1");

  if(title) createCharacterElements(title); //

  _container.querySelectorAll(".slider-description p").forEach(createLineElements);
}

// 
function createSliderElement(_sliderData){
  const content = document.createElement("div");
  content.className = "slider-content";
  content.style.opacity = "0";

  content.innerHTML = `
    <div class="slider-title">
      <h1>${ _sliderData.title }</h1>
    </div>
    <div class="slider-description">
      <p>${ _sliderData.description }</p>
      <div class="slider-info">
        <p>${ _sliderData.type }</p>
        <p>${ _sliderData.field }</p>
        <p>${ _sliderData.data }</p>
      </div>
    </div>
  `;

  return content;
}

// 
function animateSlideTransition(_nextIndex) {
  const currentContent = document.querySelector(".slider-content");
  const slider = document.querySelector(".slider");

  const timeline = new gsap.timeline();
  timeline.to([...currentContent.querySelectorAll(".char span")], {
    y: "-100%",
    duration: .6,
    stagger: 0.025,
    ease: "power2.inOut",
  }, .1)
  .call(() => {
    const newContent = createSliderElement(slides[_nextIndex]);

    timeline.kill();
    currentContent.remove();
    slider.appendChild(newContent);

    gsap.set(newContent.querySelectorAll("span"), { y: "100%" });

    setTimeout(() => {
      processTextElements(newContent);

      const newChars = newContent.querySelectorAll(".char span");
      const newLines = newContent.querySelectorAll(".line span");

      gsap.set([newChars, newLines], { y: "100%" });
      gsap.set(newContent, { opacity: 1 });

      gsap.timeline({
        onComplete: () => {
          isTransitioning = false;
          currentSlideIndex = _nextIndex;
        }
      })
      .to(newChars, {
        y: "0%",
        duration: .5,
        stagger: 0.025,
        ease: "power2.inOut",
      })
      .to(newLines, {
        y: "0%",
        duration: .5,
        stagger: .1,
        ease: "power2.inOut",
      }, .3);
    }, 100);
  }, null, .5);
}

// 
function setupInitialSlide(){
  const content = document.querySelector(".slider-content");
  processTextElements(content); // 

  const chars = content.querySelectorAll(".char span");
  const lines = content.querySelectorAll(".line span");

  gsap.fromTo(chars,
    {
      y: "100%",
    },
    {
      y: "100%",
      duration: .8,
      stagger: .025,
      ease: "power2.out",
    }
  );

  gsap.fromTo(
    lines,
    {
      y: "100%",
    },
    {
      y: "0%",
      duration: .8,
      stagger: .025,
      ease: "power2.out",
      delay: "power2.out",
    }
  )
}


// 
async function initializeRenderer() {
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  renderer = new WebGLRenderer({
    canvas: document.querySelector("canvas"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  shaderMaterial = new ShaderMaterial({
    uniforms: {
      uTexture1: { value: null },
      uTexture2: { value: null },
      uProgress: { value: 0.0 },
      uResolution: {
        value: new Vector2(window.innerWidth, window.innerHeight),
      },
      uTexture1Size: { value: new Vector2(1, 1) },
      uTexture2Size: { value: new Vector2(1, 1) }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  scene.add(new Mesh(new PlaneGeometry(2, 2), shaderMaterial));

  const loader = new TextureLoader();
  for(const slide of slides) {
    const texture = await new Promise(resolve => {
      loader.load(slide.image, resolve); //
    });

    texture.magFilter = texture.magFilter = LinearFilter;
    texture.userData = {
      size: new Vector2(texture.image.width, texture.image.height),
    }

    slideTextures.push(texture);
  }


  shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
  shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
  shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
  shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;

  function render(){
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  render();
}


// 
function handleSlideChange(){
  if(isTransitioning) return;

  isTransitioning = true;
  const nextIndex = (currentSlideIndex + 1) % slides.length;

  shaderMaterial.uniforms.uTexture1.value = slideTextures[currentSlideIndex];
  shaderMaterial.uniforms.uTexture2.value = slideTextures[nextIndex];
  shaderMaterial.uniforms.uTexture1Size.value = slideTextures[currentSlideIndex].userData.size;
  shaderMaterial.uniforms.uTexture2Size.value = slideTextures[nextIndex].userData.size;

  animateSlideTransition(nextIndex);

  gsap.fromTo(
    shaderMaterial.uniforms.uProgress,
    { value: 0 },
    {
      value: 1,
      duration: 2.5,
      ease: "power2.inOut",
      onComplete: () => {
        shaderMaterial.uniforms.uProgress.value = 0;
        shaderMaterial.uniforms.uTexture1.value = slideTextures[nextIndex];
        shaderMaterial.uniforms.uTexture1Size.value = slideTextures[nextIndex].userData.size;
      },
    }
  );
}

function handleResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  shaderMaterial.uniforms.uResolution.value.set(
    window.innerWidth, window.innerHeight
  );
}

window.addEventListener("load", () => {
  setupInitialSlide();
  initializeRenderer();
});

document.addEventListener("click", handleSlideChange);
window.addEventListener("resize", handleResize);