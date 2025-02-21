
// Meshを生成
// const mesh1 = MeshItem(1000, 667)

import {
  PlaneGeometry,
  ShaderMaterial,
  Uniform,
  Vector2,
  Mesh
} from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';


// 無名関数をexport defaultしているので呼び出し先で新たに命名して呼び出していい
export default function(w, h) {
  // const u = new Uniform();
  // console.log(u); // _Uniform {value: undefined}

  const geometry = new PlaneGeometry(w, h, 128, 128)

  const material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uProgress: new Uniform(0.0),
      uSize: new Uniform(new Vector2(w, h)),
      uTexture: new Uniform(),
    },
    defines: { PI: Math.PI }, // glslのなかで定義しなくても使える
  })

  const mesh = new Mesh(geometry, material);
  // console.log(mesh);
  // Mesh {isObject3D: true, uuid: 'e2b9a2c1-0814-49f8-b85b-efc523470cac', name: '', type: 'Mesh', parent: null, …}

  return mesh;
}