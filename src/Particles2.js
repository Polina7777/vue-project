// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// // init

// const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
// camera.position.z = 10;

// const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

// const renderer = new THREE.WebGLRenderer( { antialias: true } );
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setAnimationLoop( animation );
// document.getElementById("container").appendChild(renderer.domElement );


// const color = 0xFFFFFF;
// const time = 0;
// const controls = new OrbitControls(camera,renderer.domElement)
// document.body.appendChild( renderer.domElement );



// function addMesh() {
//   const materialShader = new THREE.ShaderMaterial({
//         uniforms: {
//             progress:{
//                 type:'f',values:0
//             },
//         },
//         vertexShader:
//         `varying vec2 vUv;
//         void main(){
//         vUv = uv;
//         vec4 mvPosition = modelViewMatrix *  vec4(position,1.)
//          gl_PointSize = 5000. * (1. / - mvPosition.z);
//          gl_Position = projectionMatrix * mvPosition;
//         }`,
//         fragmentShader:
//         `void main(){
//           vec3 color = vec3(1.0);
//        gl_FragColor = vec4( color, 1.0 );
//         }`,
//         side:THREE.DoubleSide,
//     });
//     const number = 512*512;
//    const geometryShader = new THREE.BufferGeometry();
//      const positions = new THREE.BufferAttribute(new Float32Array(number*3),3);
     
//      let index = 0;
//      for(let i = 0; i < 512; i++){
//         let posX = i - 256;
//         for(let j = 0; j < 512; j++) {
//         positions.setXYZ(index, i, j, 0)
//         index++;
//         }
//      }

//  geometryShader.setAttribute("position",positions);
//  const meshShader = new THREE.Points( geometryShader, materialShader );
//   scene.add( meshShader );
// }

// animation
// window.addEventListener('click',addMesh,true)
// function animation( time ) {
// 	mesh.rotation.x = time / 2000;
// 	mesh.rotation.y = time / 1000;

// 	renderer.render( scene, camera );

// }


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui';
import { TessellateModifier } from './TessellateModifier';
import { gsap } from 'gsap';
import red from './image/red.jpg';
import mask from './image/mask.jpg';



function createScene () {
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 3000 );
camera.position.z = 1000;
const scene = new THREE.Scene();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let point = new THREE.Vector2();
let time = 1;
let move = 0;
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("container").appendChild(renderer.domElement );
// let time = 1;
// let move = 0;
let explode = false;
const textures =[
  new THREE.TextureLoader().load(red),
]

const mouseEffect=()=>{
  let state;
   window.addEventListener('mousewheel',(e)=>{
    //  window.addEventListener('click',(e)=>{
      // console.log(e)

      move += e.wheelDeltaY/4000;
 state.move = move;
      // console.log(move)
  // return move;
  })
  return state
}


const mouseEffect2=()=>{
  let test = new THREE.Mesh(
    new THREE.PlaneGeometry(2000,2000),
    new THREE.MeshBasicMaterial(),
);

  window.addEventListener('click',(event)=>{
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
	let intersects = raycaster.intersectObjects([test]);

 point.x = intersects[0].point.x;
   point.y = intersects[0].point.y;
 return point;
  // return mouse;
  },false)

}

const mouseEffect3=()=>{
  window.addEventListener('mouseup',(e)=>{
    gsap.to(materialShader.uniforms.mousePressed,{
      duration:1,
      value:0
    })
  }),
  window.addEventListener('mousedown',(e)=>{
gsap.to(materialShader.uniforms.mousePressed,{
  duration:1,
  value:1
})
  })
}
const mouseEffect4=()=>{
  window.addEventListener('mouseup',(e)=>{
    gsap.to(materialShader.uniforms.mousePressed,{
      duration:1,
      value:0
    })
  })
}
 const mask1 = new THREE.TextureLoader().load(mask);
const materialShader = new THREE.ShaderMaterial({
          uniforms: {
              progress:{
                  type:'f',values:0
              },
              red:{type:'t',value:textures[0]},
              mask:{type:'t',value:mask1},
              mouse:{type:'v2',value:null},
              mousePressed:{type:'f',value:0},
              move:{type:'f',value:0},
              time:{type:'f',value:0},
              // u_gravity: { value: new THREE.Vector3(0, 0, 0)},
          },
    
          vertexShader:
         `varying vec2 vUv;
         varying vec3 vPos;
          varying vec2 vCoordinates;
          attribute vec3 aCoordinates;
          attribute float aSpeed;
          attribute float aOffset;
          attribute float aDirection;
          attribute float aPress;
          uniform float move;
          uniform float time;
          uniform vec2 mouse;
          uniform float mousePressed;

          void main(){
          vUv = uv;
          vec3 pos = position;
          pos.x += sin(move*aSpeed)*3.;
          pos.y += sin(move*aSpeed)*3.;
          pos.z = mod(position.z + move*20. * aSpeed + aOffset, 2000.) - 1000.;
          vec3 stable = position;
          float dist = distance(stable.xy, mouse);
          // float area = 1. - smoothstep(0.,100.,dist);
          
          // stable.x +=50.*sin(0.1*time*aPress)*aDirection*mousePressed;
          // stable.y +=50.*sin(0.1*time*aPress)*aDirection*mousePressed;
          // stable.z +=200.*cos(0.1*time*aPress)*aDirection*mousePressed;
          stable.x +=10.*sin(time);
          stable.y +=10.*sin(time);
          stable.z +=100.*cos(time);
           vec4 mvPosition = modelViewMatrix *  vec4(pos,1.);
          gl_PointSize = 1000. * (1. / - mvPosition.z );
          gl_Position = projectionMatrix * mvPosition;
          vCoordinates = aCoordinates.xy;
          vPos = pos;
          }`,
          fragmentShader:
          `varying vec2 vCoordinates;
          varying vec3 vPos;
          uniform sampler2D red;
          uniform sampler2D mask;
          uniform float move;
          void main(){
          vec4 maskTexture = texture2D(mask,gl_PointCoord);
          vec2 myUV = vec2(vCoordinates.x/512.,vCoordinates.y/512.);
          vec4 image = texture2D(red,myUV);
          float alpha = 1. - clamp(0.,1.,abs(vPos.z/900.));
          gl_FragColor = image;
          gl_FragColor.a *= maskTexture.r*alpha;
          }`,
          side:THREE.DoubleSide,
          transparent:true,
          depthTest:false,
          depthWrite:false,
      });
      const number = 512*512;
     const geometryShader = new THREE.BufferGeometry();
     const positions = new THREE.BufferAttribute(new Float32Array(number*3),3);
     const coordinates = new THREE.BufferAttribute(new Float32Array(number*3),3);
     const speeds = new THREE.BufferAttribute(new Float32Array(number),1);
     const offset = new THREE.BufferAttribute(new Float32Array(number),1);
     const direction = new THREE.BufferAttribute(new Float32Array(number),1);
     const press = new THREE.BufferAttribute(new Float32Array(number),1);
     const velocity =  new THREE.BufferAttribute(new Float32Array(number),1);
     function rand(a,b){
      return a+(b-a)*Math.random();
     }
     let index = 0;
     for(let i = 0; i < 512; i++){
        let posX = i - 256;
        for(let j = 0; j < 512; j++) {
        positions.setXYZ(index, posX*2, (j-256)*2, 0)
        coordinates.setXYZ(index,i,j,0)
        speeds.setX(index,rand(0.4,1))
        offset.setX(index,rand(-1000,1000))
        direction.setX(index,Math.random()>0.5?1:-1)
        press.setX(index,rand(0.4,1))
        // velocity.setXYZ(index,(Math.random()-0.5))
        index++;
        }
     }

 geometryShader.setAttribute("position",positions);
 geometryShader.setAttribute("aCoordinates",coordinates);
 geometryShader.setAttribute("aSpeed",speeds);
 geometryShader.setAttribute("aOffset",offset);
 geometryShader.setAttribute("aDirection",direction);
 geometryShader.setAttribute("aPress",press);
 geometryShader.setAttribute("velocity",velocity);
const mesh = new THREE.Points(geometryShader, materialShader);
scene.add(mesh);

onWindowResize();
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize( event ) {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

    return {
		scene,
		camera,
		renderer,
    time,
    materialShader,
    mouseEffect,
   mouseEffect3,
   mouseEffect4,
     mouseEffect2,
     move
	}
}


let startAnim = false;


function setControls (camera, domElement, deviceOrientationMode) {
  //   const controls = deviceOrientationMode ? new DeviceOrientationControls(camera) : new THREE.OrbitControls( camera, domElement )
    const controls = new OrbitControls(camera, domElement)
    controls.update()
    return {
      controls
    }
  }

(function init () {
  const {scene, camera, renderer, time,materialShader,move,mouseEffect,mouseEffect2,mouseEffect3,mouseEffect4} = createScene()
  const { controls } = setControls(camera, renderer.domElement, window.location.hash.includes('deviceOrientation'))
  // window.addEventListener('mousewheel',mouseEffect)

move = mouseEffect()

  const animate = function () {
    requestAnimationFrame( animate )

    // console.log(move)
    materialShader.uniforms.time.value = time;

    //  materialShader.uniforms.move.value = mouseEffect();
    materialShader.uniforms.move.value = move;
       materialShader.uniforms.mousePressed.value = mouseEffect3();

      materialShader.uniforms.mouse.value = mouseEffect2();
    renderer.render( scene, camera )
    // heartMesh.rotation.y -= 0.005
    // startAnim && beatingAnimation(heartMesh)
    controls.update(materialShader)
  }
  animate()
})()


