/**
 * Three.js
 * https://threejs.org/
 */
 import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);


const renderer = new THREE.WebGLRenderer({ 
  antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(3, 3, 3);
const geometry = new THREE.PlaneGeometry(3, 3, 3);
console.log(geometry)

// position ... 中央が(0, 0)。頂点では左から右に並ぶ
// uv ... 左下が原点(0, 0)で右上が(1, 1)。頂点では、左から右に並ぶ。
// vertexShaderからFragmentにvaryingした値は線形補間された値が渡される
const material = new THREE.ShaderMaterial({ 
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main(){
      vUv = uv;
      vPosition = position;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    }
  `,
  fragmentShader: ` 

    varying vec2 vUv;
    varying vec3 vPosition;

    void main(){
      // gl_FragColor = vec4(vUv, 0, 1.0);
      gl_FragColor = vec4(vPosition, 1.0);
    }
  `,
  // transparent: true,
  wireframe: true,
});


const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

let i = 0;
function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x = cube.rotation.x + 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
