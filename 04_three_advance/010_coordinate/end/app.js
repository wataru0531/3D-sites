/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry1 = new THREE.PlaneGeometry(200, 200, 1, 1);
const material1 = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;

    void main() {
      gl_FragColor = vec4(vUv, 0.5, 0.1);
    }
  `,
  wireframe: true
});

const geometry2 = new THREE.PlaneGeometry(30, 30, 10, 10);
const material2 = material1.clone();

const plane1 = new THREE.Mesh(geometry1, material1);
const plane2 = new THREE.Mesh(geometry2, material2);
plane1.position.y -= 1;
// plane2.position.x += 1;
// plane2.position.z -= 10;
scene.add(plane1, plane2);

// camera.lookAt(1, 0, -1)
camera.position.z = 500;
// camera.scale.z = 1.2;

printMat(geometry1.attributes.position, 3, 'position1')
// printMat(geometry2.attributes.position, 3, 'position2')
printMat(plane1.modelViewMatrix, 4, 'modelViewMatrix1');
// printMat(plane2.modelViewMatrix, 4, 'modelViewMatrix2');
printMat(camera.projectionMatrix, 4, 'projectionMatrix');

let i = 0;
function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x = cube.rotation.x + 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

function printMat(targetMatrix, col = 4, label = '') {
  const mat1D = targetMatrix?.elements ?? targetMatrix?.array ?? targetMatrix;
  console.log(mat1D)
  if(!mat1D instanceof Array) return;
  setTimeout(() => { // 非同期でマトリクスが更新されるため、非同期で実行
    let mat2D = mat1D.reduce((arry2D, v, i) => {
      if (i % col === 0) {
        arry2D.push([]);
      }
      const lastArry = arry2D[arry2D.length - 1];
      lastArry.push(v);
      return arry2D;
    }, []);
    console.log(`%c${label}`, 'font-size: 1.3em; color: red; background-color: #e4e4e4;')
    console.table(mat2D)
  })
}