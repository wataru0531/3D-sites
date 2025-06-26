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


import { slides } from "./slides";
import { vertexShader, fragmentShader } from "./shaders.js";

import {


} from "three";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);
gsap.config({ nullTargetWarn: false });
// 無効なターゲットに対する警告を出さないようにする。to()などで対象が見つからなくても警告はださない。


let currentSlideIndex = 0;
let isTransitioning = false;
let slideTexture = [];
let shaderMaterial;
let renderer;

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