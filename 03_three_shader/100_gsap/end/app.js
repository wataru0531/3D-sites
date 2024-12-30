/**
 * GSAP
 * https://greensock.com/
 * 
 * GSAP Eases
 * https://greensock.com/docs/v3/Eases
 */
 import { gsap } from "gsap";

 init();
 async function init() {
   gsap.to('.box', {
     y: 200,
     borderRadius: "50%",
     scale: 2,
     rotate: 360,
     background: "#ff0000",
     duration: 2,
     delay: 1,
     ease: "power3.inOut",
     repeat: -1,
     yoyo: true
   });

   const obj = { value: 0 };
   gsap.to(obj, {
    value: 1,
    duration: 2,
    delay: 1,
    ease: "back.inOut(1.7)",
    onUpdate() {
      console.log(obj.value);
    },
    onComplete() {
      // alert('animation end');
    }
   });
 }
 