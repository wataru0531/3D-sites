/**
 * GSAP
 * https://greensock.com/
 * 
 * GSAP Eases
 * https://greensock.com/docs/v3/Eases
**/
import { gsap } from "gsap";

const btn = document.querySelector(".startBtn");
const box = document.querySelector(".box");

btn.addEventListener("click", init);

async function init(){
  
  gsap.to(".box", {
    y: 200,
    duration: 2,
    borderRadius: "50%",
    scale: 2,
    background: "#ff0000",
    rotate: 360,
    ease: "power3.inOut",

    // delay: 1,
    repeat: 1,
    yoyo: true,

  })

  

  const obj = {
    value: 0,
  }

  // オブジェクトのvalueを動かす
  gsap.to(obj, {
    value: 1,
    duration: 2,
    // delay: 1,

    onUpdate: () => {
      console.log(obj.value);
    }
  })

};
