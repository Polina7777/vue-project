<template>
    <canvas id="canvasText" class="canvas" ref="experianceText">
      <div id="modelText" ref="model"></div>
    </canvas>
  </template>
  
  <script setup lang="ts">
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
  import { computed, onMounted, ref, watch } from 'vue'
  import texture from '../../public/texture.jpg';
  import gsap from 'gsap'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { formatTimeAgo } from '@vueuse/core';
import {TerrainCutout} from '../../src/Terrain.js';

  
  let container: HTMLElement | null,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    content,
    colorValue: THREE.ColorRepresentation | undefined,
    width: number,
    height: number
  width = window.innerWidth
  height = window.innerHeight
  let time = 0
  let move = 0
  let updatables: never[] = [];
  
  const aspectRatio = computed(() => width / height)
  const raycaster = new THREE.Raycaster()
  const experianceText = ref<HTMLCanvasElement | null>(null)
  const modelText = ref<HTMLElement | null>(null)
  let clicked = ref<boolean>(false)
  scene = new THREE.Scene()
  scene.background = new THREE.Color('aliceblue')
  const camera = new THREE.PerspectiveCamera(70, aspectRatio.value, 0.01, 400)
  camera.position.set(1, 0, 100)
  const mouse = new THREE.Vector2();
  const group = new THREE.Group();
  scene.add(group)
  const directionallLight = new THREE.DirectionalLight(0xffffff, 1)
  scene.add(directionallLight)
  directionallLight.position.set(2, 2, 5)
  directionallLight.castShadow = true
  directionallLight.shadow.camera.bottom = -12

  let clock = new THREE.Clock()
//   const materialPoint1 = new THREE.ShaderMaterial({
//   extensions: {
//     // derivatives: "#extension GL_OES_standard_derivatives : enable"
//     derivatives: true
//   },
//   side: THREE.DoubleSide,
//   uniforms: {
//     mousePos: { value: new THREE.Vector3(0, 0, 0) },
//     time: { value: 0 },
//     move: { value: 0 },
//     // texture3:{value:textures[0]},
//     pixels: {
//       value: new THREE.Vector2(width, height)
//     },
//     uvRate1: {
//       value: new THREE.Vector2(1, 1)
//     }
//   },
//   depthTest: false,
//   vertexShader: `uniform float time;
//             varying vec4 vPosition;
//             uniform float move;
//             uniform sampler2D texture1;
//             uniform sampler2D texture2;
//             //  uniform sampler3D texture3;
//             uniform vec2 pixels;
//             uniform vec2 uvRate1;
//             uniform vec3 mousePos;
              
//             void main(){
//           float distance = 100.;
//             vec3 newpos = position;
//             float koef = length(position - mousePos)/distance;
//             newpos.y  -=  0.16 ;
//             newpos.x  -=  0.075;


//             // newpos.x *= position.x + 5. ;
//             // newpos.y *= position.y + 5.  ;
//             // newpos.z *= position.z + 5. ;

//             newpos.x *= position.x + move ;
//             newpos.y *= position.y + move  ;
//             newpos.z *= position.z + move ;
         

//             // vec3 noisePos;
//             // vec3 newpos = 100.*curlNoise(position);
//         //  noisePos.x = 1.*cnoise(vec4(position.x, position.y, position.z, time/10.));
//         //  noisePos.y = newpos.y *cnoise(vec4(position.x, position.y, position.z, time/10.));
//         //  noisePos.z = 1.*cnoise(vec4(position.x*0.1, position.y*0.1, position.z*0.1, time/10.));

//             //  if(length(position - mousePos)<distance){
//             //     float koef = length(position - mousePos)/distance;
//             //     koef = sqrt(koef);
//             //     //  newpos *= vec3(1.+ koef,1.,2. + koef);
//                 //  newpos = mix(newpos,noisePos,1. - koef);
//             //    
//             // };


//             if(length(position - mousePos)<distance){
//                 float koef = length(position - mousePos)/distance;
//                 // newpos *=vec3(2.,2.,2.); 
//                  newpos = mix(position,newpos,koef);
//             }


//             vec4 mvPosition = modelViewMatrix * vec4(newpos,1.);
//             gl_PointSize = 300. * (1. / - mvPosition.z );
//              gl_Position = projectionMatrix * mvPosition;
//             }`,
//   fragmentShader: `
//             precision mediump float; 
//         //  precision mediump sampler3D;
//             precision highp int;
//             varying vec3 eye;
//             varying vec3 vNormal; 
//             varying vec3 vReflect;
//             varying vec2 vCoordinates;
//             uniform float time;
//             uniform float progress;
//             uniform sampler2D texture1;
//             uniform sampler2D texture2;
//             // uniform sampler3D Texture;
//             varying vec2 pixels;
//             varying vec2 uvRate1;
//             varying vec2 accel;
//             varying vec4 vPosition;
//             void main()	{
//            vec3 myUV = vec3(200.,200.,200.);
//         //   mediump vec3 image = texture3D(tex3D, myUV);
//      //  mediump vec3 image = texture3D(Texture,myUV);

//           //  mediump vec4 v3 = texture(Texture, myUV);
//             gl_FragColor = vec4(0.728,0.592,0.677,1.);
//             }`
//   // },
// })

  loadMouse();
  createPlane();
  addTerrain();
//   loadText();
  
  function updateRenderer() {
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
  }
  function updateCamera() {
    camera.aspect = aspectRatio.value
    camera.updateProjectionMatrix()
  }
  watch(aspectRatio, updateRenderer)
  watch(aspectRatio, updateCamera)
  
  const loop = () => {
    renderer.render(scene, camera)
    time++;
    const elapsedTime = clock.getElapsedTime()
    requestAnimationFrame(loop)
  }
  function createPlane(){
    const loader = new THREE.TextureLoader();
 const height = loader.load("../../public/texture.jpg");
 //                                        w    h 
 const geometry = new THREE.BufferGeometry();
 
 const material = new THREE.MeshStandardMaterial({
//    color: 'blue',
 });
 
 
 
 const plane = new THREE.Mesh(geometry, material);
 plane.position.set(0, 0, 0);
 plane.rotation.x -= Math.PI * 0.35;
 
 let frame = 0;
//  plane.tick = (delta) => {
 
//  };
  }

  function addTerrain(){
    let terrain = new TerrainCutout(20, 2, 20, 200, 200, height);
terrain.material.displacementScale = 5;
scene.add(terrain);
  }
  function animation() {
    // window.addEventListener('mouseup', onMouseUp, false)
    // window.addEventListener('mousedown', onMouseDown, false)
    // window.addEventListener('mousemove', onMouseMove, false)
  
  }
  
  onMounted(() => {
    renderer = new THREE.WebGLRenderer({
      canvas: experianceText.value as unknown as HTMLCanvasElement,
      antialias: true,
      alpha: true
    })
    renderer.setClearColor(0x000000, 0)
    const controls = new OrbitControls(camera, renderer.domElement)
    updateRenderer()
    updateCamera()
    loop()
    animation()
  })
  
  function start() {
 renderer.setAnimationLoop(() => {
       tick();
       // render a frame
       renderer.render(scene, camera);
   });
 }
 
 function stop() {
   renderer.setAnimationLoop(null);
 }
 
 function tick() {
   const delta = clock.getDelta();
   for (const object of updatables) {
       object.tick(delta);
   }
}
  function loadMouse() {
    function onMouseMove(event: { clientX: number; clientY: number }) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      move = 5
      animation()
    }
    window.addEventListener('mousemove', onMouseMove, false)
  }
  function loadModel() {
    const textures = [new THREE.TextureLoader().load('../public/cheeseburger.glb')]
    const material1 = new THREE.ShaderMaterial({
      extensions: {
        // derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        mousePos: { value: new THREE.Vector3(0, 0, 0) },
        time: { value: 0 },
        Texture: { value: textures[0] },
        pixels: {
          value: new THREE.Vector2(width, height)
        },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },
      vertexShader: `uniform float time;
              varying vec4 vPosition;
              precision mediump sampler3D;
              uniform sampler2D texture1;
              uniform sampler2D texture2;
               uniform sampler3D Texture;
              uniform vec2 pixels;
              uniform vec2 uvRate1;
              uniform vec3 mousePos;
                
              void main(){
            float distance = 100.;
              vec3 newpos = position;
              float koef = length(position - mousePos)/distance;
              newpos.y  -=  0.14 ;
              newpos.x  -=  0.07 ;
  
  
              newpos.x *= position.x + 5. ;
              newpos.y *= position.y + 5.  ;
              newpos.z *= position.z + 5. ;
           
  
              // vec3 noisePos;
              // vec3 newpos = 100.*curlNoise(position);
          //  noisePos.x = 1.*cnoise(vec4(position.x, position.y, position.z, time/10.));
          //  noisePos.y = newpos.y *cnoise(vec4(position.x, position.y, position.z, time/10.));
          //  noisePos.z = 1.*cnoise(vec4(position.x*0.1, position.y*0.1, position.z*0.1, time/10.));
  
              //  if(length(position - mousePos)<distance){
              //     float koef = length(position - mousePos)/distance;
              //     koef = sqrt(koef);
              //     //  newpos *= vec3(1.+ koef,1.,2. + koef);
                  //  newpos = mix(newpos,noisePos,1. - koef);
              //    
              // };
  
  
              if(length(position - mousePos)<distance){
                  float koef = length(position - mousePos)/distance;
                  // newpos *=vec3(2.,2.,2.); 
                   newpos = mix(position,newpos,koef);
              }
  
  
              vec4 mvPosition = modelViewMatrix * vec4(newpos,1.);
              gl_PointSize = 500. * (1. / - mvPosition.z );
               gl_Position = projectionMatrix * mvPosition;
              }`,
      fragmentShader: `
              precision mediump float; 
            precision mediump sampler3D;
              precision highp int;
              varying vec3 eye;
              varying vec3 vNormal; 
              varying vec3 vReflect;
              varying vec2 vCoordinates;
              uniform float time;
           uniform float progress;
              uniform sampler2D texture1;
              uniform sampler2D texture2;
               uniform sampler3D Texture;
              varying vec2 pixels;
              varying vec2 uvRate1;
              varying vec2 accel;
              varying vec4 vPosition;
              void main()	{
             vec3 myUV = vec3(200.,200.,200.);
          //mediump vec3 image = texture3D(tex3D, myUV);
       mediump vec3 image = (Texture,myUV);
  
            //  mediump vec4 v3 = texture(Texture, myUV);
              gl_FragColor = vec4(0.8,0.2,0.7,1.);
              }`
      // },
    })
  
    let loader = new GLTFLoader()
    loader.load('../../public/cheeseburger.glb', function (gltf) {
      gltf.scene.scale.set(10, 10, 10)
      // scene.add(gltf.scene)
      gltf.scene.traverse(function (child) {
        console.log(gltf)
        //         const food = gltf.scene.children[0];
        // // food.position.set(50,50,0)
        // food.scale.set(30, 30, 30);
        if (child.isMesh) {
          //    console.log(child);
  
          //             // if (child.name == "cloth") {
          //             //     child.material = new THREE.MeshPhongMaterial({
          //             // color: colorValue,    // red (can also use a CSS color string here)
          //             // flatShading: false
          //             // });
  
          //             // }
  
          child.material = material1
          const particlesMaterials = new THREE.PointsMaterial({ color: 0x31c48d, size: 0.02 })
          const particles = new THREE.Points(child.geometry, particlesMaterials)
          console.log(particles)
          scene.add(particles)
          //   final.add(gltf.scene)
        }
      })
    })
  }

//   function loadText(){
//     const loader = new FontLoader();

// loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
// 	const textGeo = new TextGeometry( 'Hello three.js!', {
// 		font: font,
// 		size: 3,
// 		height: 2,
// 		curveSegments: 5,
// 		// bevelEnabled: true,
// 		bevelThickness: 5,
// 		bevelSize: 5,
// 		bevelOffset: 5,
// 		bevelSegments: 5
// 	} );
//     textGeo.computeBoundingBox();
//     const materials = new THREE.PointsMaterial({color:0x00ff00,side:THREE.DoubleSide})
//     // const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
//  const   textMesh1 = new THREE.Mesh( textGeo, materials );

// 				// textMesh1.position.x = centerOffset;
// 				// textMesh1.position.y = hover;
// 				// textMesh1.position.z = 0;

// 				// textMesh1.rotation.x = 0;
// 				// textMesh1.rotation.y = Math.PI * 2;
//                 const message = 'Hello three.js!';
// const shapes = font.generateShapes( message, 100 );
// const geometry = new THREE.ShapeGeometry( shapes );
//                 const pos1 = textMesh1.geometry.attributes.position.array;
//                 let geo1 = new THREE.BufferGeometry()
//       geo1.setAttribute('position', new THREE.BufferAttribute(pos1, 3))
//       const pointsMesh1 = new THREE.Points(geo1, materialPoint1)
//     //   pointsMesh1.position.set(0, 0.15, 0)
//     //   pointsMesh1.rotation.z = Math.PI
//       const count1 = geo1.attributes.position.count //number of vertices in the geometry
//       const randoms1 = new Float32Array(count1)
//       for (let i = 0; i < count1; i++) {
//         randoms1[i] = Math.random()
//       }
//       geo1.setAttribute('aRandom', new THREE.BufferAttribute(randoms1, 1))
//             //   console.log(textMesh1)
//             //   textMesh1.add(pointsMesh1)
//             pointsMesh1.scale.set(0.07,0.07,0.07)
//             group.add(pointsMesh1)
// 				group.add( textMesh1 );
//                 console.log(group)

// } );
//   }

  
//   function onMouseDown(event) {
//     mouse.x = (event.clientX / width) * 2 - 1
//     mouse.y = -(event.clientY / height) * 2 + 1
  
//     raycaster.setFromCamera(mouse, camera)
  
//     const clickIntersects = raycaster.intersectObjects([final])
  
//     if (clickIntersects.length > 0) {
//       clicked.value = true
//       gsap
//         .timeline()
//         .to(final.scale, {
//           x: 6,
//           y: 6,
//           z: 6,
//           ease: 'expo.in'
//         })
//         // .to(object1.scale, {
//         //   x: 2,
//         //   y: 2,
//         //   z: 2,
//         //   ease: 'expo.in'
//         // })
//         .to(starsMaterial.uniforms.uScale, {
//           value: 0,
//           duration: 3,
//           ease: 'expo.in'
//         })
//     }
//   }
//   function clikedFun() {
//     clicked.value = !clicked.value
//   }
//   window.addEventListener('click', clikedFun, false)
//   function onMouseUp(event) {
//     if (clicked) {
//       gsap
//         .timeline()
//         .to(final.scale, {
//           x: 1,
//           y: 1,
//           z: 1,
//           ease: 'expo.in'
//         })
//         // .to(object1.scale, {
//         //   x: 0,
//         //   y: 0,
//         //   z: 0,
//         //   ease: 'expo.in'
//         // })
//         .to(starsMaterial.uniforms.uScale, {
//           value: 1,
//           ease: 'expo.in'
//         })
//       clicked.value = false
//     }
//   }
  
//   function onMouseMove(event) {
//     mouse.x = (event.clientX / width) * 2 - 1
//     mouse.y = -(event.clientY / height) * 2 + 1
  
//     raycaster.setFromCamera(mouse, camera)
  
//     const objects = [final]
//     const intersects = raycaster.intersectObjects(objects)
//     if (intersects.length > 0) {
//       gsap.to(material.uniforms.uHoverState, {
//         value: 1,
//         ease: 'expo.inOut'
//       })
//     } else {
//       gsap.to(material.uniforms.uHoverState, {
//         value: 0,
//         ease: 'expo.inOut'
//       })
//     }
//   }
  </script>
  <style scoped >
  canvasText {
    position: absolute;
  }
  </style>
  