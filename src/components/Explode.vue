<template>
  <canvas id="canvas" class="canvas" ref="experiance">
    <div id="model" ref="model"></div>
  </canvas>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { computed, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'

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
const aspectRatio = computed(() => width / height)
const raycaster = new THREE.Raycaster()
const experiance = ref<HTMLCanvasElement | null>(null)
const model = ref<HTMLElement | null>(null)
let clicked = ref<boolean>(false)
scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, aspectRatio.value, 0.01, 400)
camera.position.set(1, 0, 100)
const mouse = new THREE.Vector2()
const directionallLight = new THREE.DirectionalLight(0xffffff, 1)
scene.add(directionallLight)
directionallLight.position.set(2, 2, 5)
directionallLight.castShadow = true
directionallLight.shadow.camera.bottom = -12
const geometryPlane = new THREE.PlaneGeometry(30, 20, 1, 1)
const plane = new THREE.Mesh(
  geometryPlane,
  new THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false })
)
plane.position.set(0, 0, 0)
scene.add(plane)
const final = new THREE.Group()
scene.add(final)
let clock = new THREE.Clock()

const material = new THREE.ShaderMaterial({
  vertexShader: `// uniform type is used for the data that don't change among the vertices (are uniform)
uniform float uTime;
uniform float uHoverState;

// attribute type is used for the data that change among the vertices
attribute float aRandom;

// varying  type is used to make a variable available in both vertex and fragment shader files
varying vec3 vPosition;


void main() {

    vPosition = position;

    //***** https://learnopengl.com/Getting-started/Coordinate-Systems *****//

    vec3 newPos = position;


    newPos.x += sin(uTime * aRandom) * uHoverState;
    newPos.y += cos(uTime * aRandom) * uHoverState;
    newPos.z += cos(uTime * aRandom) * uHoverState;



    // 1)postion our geometry - coordinates your object begins in.
    vec4 localPosition = vec4(newPos, 1.0);

    // 2)transform the local coordinates to world-space coordinates
    vec4 worldPosition = modelMatrix * localPosition;
    
    // 3)transform the world coordinates to view-space coordinates - seen from the camera/viewer point of view
    vec4 viewPosition = viewMatrix * worldPosition;

    // 4)project view coordinates to clip coordinates and transform to screen coordinates
    vec4 clipPosition = projectionMatrix * viewPosition;

    gl_Position = clipPosition;

    //************ OR ****************//
    // everything in one line:

    //OPTION 1: 
 // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    //OPTION 2 (combine model and view matrices):
  // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
  fragmentShader: `uniform vec3 uColor;
            uniform vec3 uColor1;
           
           // varying  type is used to make a variable available in both vertex and fragment shader files
           varying vec3 vPosition;
           
           
           void main() {
           
               //**** simple color - a vector of rgba
               // vec4 color = vec4(1., 0.0, .0, 1.);
               // gl_FragColor = color;
               //******
           
               //***** use mix function
           
               float depth = vPosition.x;
           
               // vec3 color1 = vec3(1., 1.0, 1.0);
               // vec3 color2 = vec3(0., .0, 1.0);
           
               // vec3 mixedColor = mix(color1, color2, depth);
               vec3 mixedColor = mix(uColor, uColor1, depth);
               gl_FragColor = vec4(mixedColor, 1.0);
           }`,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uHoverState: { value: 0 },
    uColor: { value: new THREE.Color(0x31c48d) },
    uColor1: { value: new THREE.Color(0x6c63ff) }
  }
})

const starsMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color(0x31c48d) },
    uColor1: { value: new THREE.Color(0x6c63ff) },
    uTime: { value: 0 },
    uScale: { value: 0 }
  },
  vertexShader: `uniform float uTime;
            uniform float uScale;
            
            // attribute type is used for the data that change among the vertices
            attribute vec3 aRandom;
            
            // varying  type is used to make a variable available in both vertex and fragment shader files
            varying vec3 vPosition;
            
            void main() {
            
                vPosition = position;
            
                vec3 pos = position;
            
                float time = uTime * 4.0;
            
                pos.x += sin(time * aRandom.x);
                pos.y += cos(time * aRandom.y);
                pos.z += cos(time * aRandom.z);
            
                pos *= uScale;
            
                // 1)postion our geometry - coordinates your object begins in.
                vec4 localPosition = vec4(pos, 1.0);
            
                // 2)transform the local coordinates to world-space coordinates
                vec4 worldPosition = modelMatrix * localPosition;
                
                // 3)transform the world coordinates to view-space coordinates - seen from the camera/viewer point of view
                vec4 viewPosition = viewMatrix * worldPosition;
            
                // 4)project view coordinates to clip coordinates and transform to screen coordinates
                vec4 clipPosition = projectionMatrix * viewPosition;
            
               gl_Position = clipPosition;
            
                gl_PointSize = 20.0 / clipPosition.z;
            
                //************ OR ****************//
                // everything in one line:
            
                //OPTION 1: 
               //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
            
                //OPTION 2 (combine model and view matrices):
              // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
  fragmentShader: ` uniform vec3 uColor;
            uniform vec3 uColor1;
            
            // varying  type is used to make a variable available in both vertex and fragment shader files
            varying vec3 vPosition;
            
            void main() {
            
               //**** simple color - a vector of rgba
               // vec4 color = vec4(1., 0.0, .0, 1.);
               // gl_FragColor = color;
               //******
            
               //***** use mix function
            
               float depth = (vPosition.x + 5.) / 10.0;
            
               // vec3 color1 = vec3(1., 1.0, 1.0);
               // vec3 color2 = vec3(0., .0, 1.0);
            
               // vec3 mixedColor = mix(color1, color2, depth);
               vec3 mixedColor = mix(uColor, uColor1, depth);
               gl_FragColor = vec4(mixedColor, 1.0);
            }`,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending
})

let intersects: any[] = []

const materialPoint1 = new THREE.ShaderMaterial({
  extensions: {
    // derivatives: "#extension GL_OES_standard_derivatives : enable"
    derivatives: true
  },
  side: THREE.DoubleSide,
  uniforms: {
    mousePos: { value: new THREE.Vector3(0, 0, 0) },
    time: { value: 0 },
    move: { value: 0 },
    // texture3:{value:textures[0]},
    pixels: {
      value: new THREE.Vector2(width, height)
    },
    uvRate1: {
      value: new THREE.Vector2(1, 1)
    }
  },
  depthTest: false,
  vertexShader: `uniform float time;
            varying vec4 vPosition;
            uniform float move;
            uniform sampler2D texture1;
            uniform sampler2D texture2;
            //  uniform sampler3D texture3;
            uniform vec2 pixels;
            uniform vec2 uvRate1;
            uniform vec3 mousePos;
              
            void main(){
          float distance = 100.;
            vec3 newpos = position;
            float koef = length(position - mousePos)/distance;
            newpos.y  -=  0.16 ;
            newpos.x  -=  0.075;


            // newpos.x *= position.x + 5. ;
            // newpos.y *= position.y + 5.  ;
            // newpos.z *= position.z + 5. ;

            newpos.x *= position.x + move ;
            newpos.y *= position.y + move  ;
            newpos.z *= position.z + move ;
         

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
            gl_PointSize = 210. * (1. / - mvPosition.z );
             gl_Position = projectionMatrix * mvPosition;
            }`,
  fragmentShader: `
            precision mediump float; 
        //  precision mediump sampler3D;
            precision highp int;
            varying vec3 eye;
            varying vec3 vNormal; 
            varying vec3 vReflect;
            varying vec2 vCoordinates;
            uniform float time;
            uniform float progress;
            uniform sampler2D texture1;
            uniform sampler2D texture2;
            // uniform sampler3D Texture;
            varying vec2 pixels;
            varying vec2 uvRate1;
            varying vec2 accel;
            varying vec4 vPosition;
            void main()	{
           vec3 myUV = vec3(200.,200.,200.);
        //   mediump vec3 image = texture3D(tex3D, myUV);
     //  mediump vec3 image = texture3D(Texture,myUV);

          //  mediump vec4 v3 = texture(Texture, myUV);
            gl_FragColor = vec4(0.728,0.592,0.677,1.);
            }`
  // },
})
const materialPoint2 = new THREE.ShaderMaterial({
  extensions: {
    // derivatives: "#extension GL_OES_standard_derivatives : enable"
    derivatives: true
  },
  side: THREE.DoubleSide,
  uniforms: {
    mousePos: { value: new THREE.Vector3(0, 0, 0) },
    time: { value: 0 },
    move: { value: 0 },
    // texture3:{value:textures[0]},
    pixels: {
      value: new THREE.Vector2(width, height)
    },
    uvRate1: {
      value: new THREE.Vector2(1, 1)
    }
  },
  depthTest: false,
  vertexShader: `uniform float time;
                varying vec4 vPosition;
                uniform float move;
                uniform sampler2D texture1;
                uniform sampler2D texture2;
                //  uniform sampler3D texture3;
                uniform vec2 pixels;
                uniform vec2 uvRate1;
                uniform vec3 mousePos;                  
                void main(){
              float distance = 100.;
                vec3 newpos = position;
    
                float koef = length(position - mousePos)/distance;
                newpos.y -=  0.16 ;
             
    
                // newpos.x *= position.x + 5. ;
                // newpos.y *= position.y + 5.  ;
                // newpos.z *= position.z + 5. ;
               
                newpos.x *= position.x + move ;
            newpos.y *= position.y + move  ;
            newpos.z *= position.z + move ;
            
    
                // vec3 noisePos;
                // vec3 newpos = 100.*curlNoise(position);
            //  noisePos.x = 1.*cnoise(vec4(position.x, position.y, position.z, time/10.));
            //  noisePos.y = newpos.y *cnoise(vec4(position.x, position.y, position.z, time/10.));
            //  noisePos.z = 1.*cnoise(vec4(position.x*0.1, position.y*0.1, position.z*0.1, time/10.));
    
                //  if(length(position - mousePos)<distance){
                //     float koef = length(position - mousePos)/distance;
                //     koef = sqrt(koef);
                //     //  newpos *= vec3(1.+ koef,1.,2. + koef);
                //      newpos = mix(newpos,noisePos,1. - koef);
                //    
                // };
    
    
                if(length(position - mousePos)<distance){
                    float koef = length(position - mousePos)/distance;
                    // newpos *=vec3(2.,2.,2.); 
                    newpos = mix(position,newpos,koef);
    
                }
    
                vec4 mvPosition = modelViewMatrix * vec4(newpos,1.);
                gl_PointSize = 210. * (1. / - mvPosition.z );
                 gl_Position = projectionMatrix * mvPosition;
                }`,
  fragmentShader: `
                precision mediump float; 
            //  precision mediump sampler3D;
                precision highp int;
                varying vec3 eye;
                varying vec3 vNormal; 
                varying vec3 vReflect;
                varying vec2 vCoordinates;
                uniform float time;
                uniform float progress;
                uniform sampler2D texture1;
                uniform sampler2D texture2;
                // uniform sampler3D Texture;
                varying vec2 pixels;
                varying vec2 uvRate1;
                varying vec2 accel;
                varying vec4 vPosition;
                void main()	{
               vec3 myUV = vec3(200.,200.,200.);
            //   mediump vec3 image = texture3D(tex3D, myUV);
         //  mediump vec3 image = texture3D(Texture,myUV);
    
              //  mediump vec4 v3 = texture(Texture, myUV);
        //    gl_FragColor = vec4(cnoise3(position), 1.0);
                gl_FragColor = vec4(0.728,0.592,0.677,1.);
                }`
  // },
})
const materialPoint3 = new THREE.ShaderMaterial({
  extensions: {
    // derivatives: "#extension GL_OES_standard_derivatives : enable",
    derivatives: true
  },
  side: THREE.DoubleSide,
  uniforms: {
    mousePos: { value: new THREE.Vector3(0, 0, 0) },
    time: { value: 0 },
    move: { value: 0 },
    // texture3:{value:textures[0]},
    pixels: {
      value: new THREE.Vector2(width, height)
    },
    uvRate1: {
      value: new THREE.Vector2(1, 1)
    }
  },
  depthTest: false,
  vertexShader: `uniform float time;
                    varying vec4 vPosition;
                    uniform float move;
                    uniform sampler2D texture1;
                    uniform sampler2D texture2;
                    //  uniform sampler3D texture3;
                    uniform vec2 pixels;
                    uniform vec2 uvRate1;
                    uniform vec3 mousePos;
                    
                    void main(){
                  float distance = 100.;
                    vec3 newpos = position;
        
                    // newpos.x *= position.x + 5. ;
                    // newpos.y *= position.y + 5.  ;
                    // newpos.z *= position.z + 5. ;

                    newpos.x *= position.x + move ;
            newpos.y *= position.y + move  ;
            newpos.z *= position.z + move ;
                 
        
                    // vec3 noisePos;
                    // vec3 newpos = 100.*curlNoise(position);
                //  noisePos.x = 1.*cnoise(vec4(position.x, position.y, position.z, time/10.));
                //  noisePos.y = newpos.y *cnoise(vec4(position.x, position.y, position.z, time/10.));
                //  noisePos.z = 1.*cnoise(vec4(position.x*0.1, position.y*0.1, position.z*0.1, time/10.));
        
                    //  if(length(position - mousePos)<distance){
                    //     float koef = length(position - mousePos)/distance;
                    //     koef = sqrt(koef);
                    //     //  newpos *= vec3(1.+ koef,1.,2. + koef);
                    //      newpos = mix(newpos,noisePos,1. - koef);
                    //    
                    // };
        
        
                    if(length(position - mousePos)<distance){
                        float koef = length(position - mousePos)/distance;
                        // newpos *=vec3(2.,2.,2.); 
                        newpos = mix(position,newpos,koef);
        
                    }
        
                    vec4 mvPosition = modelViewMatrix * vec4(newpos,1.);
                    gl_PointSize = 210. * (1. / - mvPosition.z );
                     gl_Position = projectionMatrix * mvPosition;
                    }`,
  fragmentShader: `
                    precision mediump float; 
                //  precision mediump sampler3D;
                    precision highp int;
                    varying vec3 eye;
                    varying vec3 vNormal; 
                    varying vec3 vReflect;
                    varying vec2 vCoordinates;
                    uniform float time;
                    uniform float progress;
                    uniform sampler2D texture1;
                    uniform sampler2D texture2;
                    // uniform sampler3D Texture;
                    varying vec2 pixels;
                    varying vec2 uvRate1;
                    varying vec2 accel;
                    varying vec4 vPosition;
                    void main()	{
                   vec3 myUV = vec3(200.,200.,200.);
                //   mediump vec3 image = texture3D(tex3D, myUV);
             //  mediump vec3 image = texture3D(Texture,myUV);
        
                  //  mediump vec4 v3 = texture(Texture, myUV);
            //    gl_FragColor = vec4(cnoise3(position), 1.0);
                    gl_FragColor = vec4(0.728,0.592,0.677,1.);
                    }`

})
loadMouse()

addPointsObject()

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
  final.rotation.y += 0.003;
  const elapsedTime = clock.getElapsedTime()
  material.uniforms.uTime.value = elapsedTime
  starsMaterial.uniforms.uTime.value = elapsedTime
  requestAnimationFrame(loop)
}
function animation() {
  window.addEventListener('mouseup', onMouseUp, false)
  window.addEventListener('mousedown', onMouseDown, false)
  window.addEventListener('mousemove', onMouseMove, false)

}

onMounted(() => {
  renderer = new THREE.WebGLRenderer({
    canvas: experiance.value as unknown as HTMLCanvasElement,
    antialias: true,
    alpha: true
  })
  renderer.setClearColor(0x000000, 0)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableRotate = false;
  controls.autoRotate = false;   
  controls.enablePan = false;
  controls.enableZoom = false;
  updateRenderer()
  updateCamera()
  loop()
  animation()
})


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

                    if (child.name == "cloth") {
                        child.material = new THREE.MeshPhongMaterial({
                    color: colorValue,    // red (can also use a CSS color string here)
                    flatShading: false
                    });

                    }
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
function addPointsObject() {  
  let loader = new GLTFLoader()
  loader.load(
    '../public/cheeseburger.glb',
    function (glb) {
      const food = glb.scene.children[0]
      food.position.set(50, 50, 0)
      const pos1 = glb.scene.children[0].children[0].geometry.attributes.position.array
      const pos2 = glb.scene.children[0].children[1].geometry.attributes.position.array
      const pos3 = glb.scene.children[0].children[2].geometry.attributes.position.array

      let geo1 = new THREE.BufferGeometry()
      geo1.setAttribute('position', new THREE.BufferAttribute(pos1, 3))
      const pointsMesh1 = new THREE.Points(geo1, materialPoint1)
      pointsMesh1.position.set(0, 0.15, 0)
      pointsMesh1.rotation.z = Math.PI
      const count1 = geo1.attributes.position.count //number of vertices in the geometry
      const randoms1 = new Float32Array(count1)
      for (let i = 0; i < count1; i++) {
        randoms1[i] = Math.random()
      }
      geo1.setAttribute('aRandom', new THREE.BufferAttribute(randoms1, 1))

      let geo2 = new THREE.BufferGeometry()
      geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3))
      const pointsMesh2 = new THREE.Points(geo2, materialPoint2)
      pointsMesh2.position.set(0, 0.5, 0)
      const count2 = geo2.attributes.position.count //number of vertices in the geometry
      const randoms2 = new Float32Array(count2)
      for (let i = 0; i < count2; i++) {
        randoms2[i] = Math.random()
      }

      geo2.setAttribute('aRandom', new THREE.BufferAttribute(randoms2, 1))

      let geo3 = new THREE.BufferGeometry()
      const count3 = geo1.attributes.position.count //number of vertices in the geometry
      const randoms3 = new Float32Array(count3)
      for (let i = 0; i < count3; i++) {
        randoms3[i] = Math.random()
      }
      geo3.setAttribute('aRandom', new THREE.BufferAttribute(randoms3, 1))
      geo3.setAttribute('position', new THREE.BufferAttribute(pos3, 3))
      const pointsMesh3 = new THREE.Points(geo3, materialPoint3)
      pointsMesh2.position.set(0, -0.15, 0)

      const object = new THREE.Object3D()
      object.scale.set(20, 20, 20)

      object.add(pointsMesh3)
      object.add(pointsMesh2)
      object.add(pointsMesh1)
      
      window.addEventListener('mousedown', explode, false)

      function explode() {
        clicked.value = true
        setTimeout(addExplode, 500)
        function addExplode() {
          const vertices1 = []
          const randomForParticles1 = pos1

          for (let i = 0; i < pos1.length; i++) {
            const x = THREE.MathUtils.randFloatSpread(3) //random float between -5 and 5
            const y = THREE.MathUtils.randFloatSpread(3)
            const z = THREE.MathUtils.randFloatSpread(3)

            vertices1.push(x, y, z)

            // randomForParticles1.set([
            //     Math.random() * 2 - 1,// zero to 2 minus 1
            //     Math.random() * 2 - 1,// zero to 2 minus 1
            //     Math.random() * 2 - 1// zero to 2 minus 1

            // ], i * 3)
          }
          const vertices2 = []
          const randomForParticles2 = pos2

          for (let i = 0; i < pos2.length; i++) {
            const x = THREE.MathUtils.randFloatSpread(3) //random float between -5 and 5
            const y = THREE.MathUtils.randFloatSpread(3)
            const z = THREE.MathUtils.randFloatSpread(3)

            vertices2.push(x, y, z)

            // randomForParticles2.set([
            //     Math.random() * 2 - 1,// zero to 2 minus 1
            //     Math.random() * 2 - 1,// zero to 2 minus 1
            //     Math.random() * 2 - 1// zero to 2 minus 1

            // ], i * 3)
          }

          const vertices3 = []
          const randomForParticles3 = pos3
          for (let i = 0; i < pos3.length; i++) {
            const x = THREE.MathUtils.randFloatSpread(3) //random float between -5 and 5
            const y = THREE.MathUtils.randFloatSpread(3)
            const z = THREE.MathUtils.randFloatSpread(3)

            vertices3.push(x, y, z)

            // randomForParticles3.set([
            //     Math.random() * 2 - 1,// zero to 2 minus 1
            //     Math.random() * 2 - 1,// zero to 2 minus 1
            //     Math.random() * 2 - 1// zero to 2 minus 1

            // ], i * 3)
          }
          final.scale.set(7,7,7);
          geo1.setAttribute('position', new THREE.Float32BufferAttribute(vertices1, 3))
          geo1.setAttribute('aRandom', new THREE.BufferAttribute(randomForParticles1, 3))
          geo2.setAttribute('position', new THREE.Float32BufferAttribute(vertices2, 3))
          geo2.setAttribute('aRandom', new THREE.BufferAttribute(randomForParticles2, 3))
          geo3.setAttribute('position', new THREE.Float32BufferAttribute(vertices3, 3))
          geo3.setAttribute('aRandom', new THREE.BufferAttribute(randomForParticles3, 3))
        }
        clicked.value = false
      }
      window.addEventListener('mouseup', returnForm, false)
      function returnForm() {
        setTimeout(returnObj, 500)
        function returnObj() {
          geo1.setAttribute('position', new THREE.BufferAttribute(pos1, 3))
          geo1.setAttribute('aRandom', new THREE.BufferAttribute(pos1, 3))
          geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3))
          geo2.setAttribute('aRandom', new THREE.BufferAttribute(pos2, 3))
          geo3.setAttribute('position', new THREE.BufferAttribute(pos3, 3))
          geo3.setAttribute('aRandom', new THREE.BufferAttribute(pos3, 3))
        }
        clicked.value = false
      }

      object.rotation.z = Math.PI

      scene.add(object)
      final.add(object)
    },
    undefined,
    function (e) {
      console.log(e)
    }
  )
}

function onMouseDown(event) {
  mouse.x = (event.clientX / width) * 2 - 1
  mouse.y = -(event.clientY / height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const clickIntersects = raycaster.intersectObjects([final])

  if (clickIntersects.length > 0) {
    clicked.value = true
    gsap
      .timeline()
      .to(final.scale, {
        x: 6,
        y: 6,
        z: 6,
        ease: 'expo.in'
      })
      // .to(object1.scale, {
      //   x: 2,
      //   y: 2,
      //   z: 2,
      //   ease: 'expo.in'
      // })
      .to(starsMaterial.uniforms.uScale, {
        value: 0,
        duration: 3,
        ease: 'expo.in'
      })
  }
}
function clikedFun() {
  clicked.value = !clicked.value
}
window.addEventListener('click', clikedFun, false)
function onMouseUp(event) {
  if (clicked) {
    gsap
      .timeline()
      .to(final.scale, {
        x: 1,
        y: 1,
        z: 1,
        ease: 'expo.in'
      })
      // .to(object1.scale, {
      //   x: 0,
      //   y: 0,
      //   z: 0,
      //   ease: 'expo.in'
      // })
      .to(starsMaterial.uniforms.uScale, {
        value: 1,
        ease: 'expo.in'
      })
    clicked.value = false
  }
}

function onMouseMove(event) {
  mouse.x = (event.clientX / width) * 2 - 1
  mouse.y = -(event.clientY / height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const objects = [final]
  const intersects = raycaster.intersectObjects(objects)
  if (intersects.length > 0) {
    gsap.to(material.uniforms.uHoverState, {
      value: 1,
      ease: 'expo.inOut'
    })
  } else {
    gsap.to(material.uniforms.uHoverState, {
      value: 0,
      ease: 'expo.inOut'
    })
  }
}
</script>
<style scoped>
canvas {
  position: absolute;
}
</style>
