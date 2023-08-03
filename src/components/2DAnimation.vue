<template>
  <canvas id="canvas2D" class="canvas2D" ref="experiance2D">
    <div id="model2D" ref="model2D"></div>
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
const experiance2D = ref<HTMLCanvasElement | null>(null)
const model = ref<HTMLElement | null>(null)
let clicked = ref<boolean>(false)
scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 3000)
camera.position.z = 1000
const mouse = new THREE.Vector2()
const point = new THREE.Vector2()

const directionallLight = new THREE.DirectionalLight(0xffffff, 1)
scene.add(directionallLight)
directionallLight.position.set(2, 2, 5)
directionallLight.castShadow = true
directionallLight.shadow.camera.bottom = -12
//   const geometryPlane = new THREE.PlaneGeometry(30, 20, 1, 1)
//   const plane = new THREE.Mesh(
//     geometryPlane,
//     new THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false })
//   )
//   plane.position.set(0, 0, 0)
//   scene.add(plane)
const test = new THREE.Mesh(
  new THREE.PlaneGeometry(1100, 1100),
  new THREE.MeshBasicMaterial({ visible: true, color: 0x00ff00 })
)
// scene.add(test)
const textures = [
  new THREE.TextureLoader().load('../public/burger.jpg'),
  new THREE.TextureLoader().load('../public/mask.jpg')
]
const imageMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
   depthTest: false,
//  depthWrite: false,
  transparent:true,
  vertexShader: `varying vec2 vUv;
  varying vec3 vPos;
  varying vec2 vCoordinates;
  attribute vec3 aCoordinates;
  attribute float aSpeed;
  attribute float aOffset;
  attribute float aDirection;
  attribute float aPress;
  uniform sampler2D t1;
  uniform float move;
  uniform float time;
  uniform vec2 mouse;
  uniform float mousePressed;

  
  void main() {
    vUv =uv;   
    vec3 pos = position;
    // NOT STABLE
    pos.x += sin(move *aSpeed)*3.;
    pos.y  += sin(move *aSpeed)*3.;
     pos.z = mod(position.z + move*20. * aSpeed + aOffset, 2000.)-1000.;

 
      vec3 stable = position;
       float dist = distance(stable.xy,mouse);
       float area = 1. - smoothstep(0.,300.,dist);
       //float area = 1. - smoothstep(0.,300.,0.0003);


    //   stable.x += 50.*sin(0.1 * time * aPress)* aDirection * area;
    //   stable.y += 50.*sin(0.1 * time * aPress)* aDirection * area;
    //   stable.z += 200.*cos(0.1 * time * aPress)* aDirection * area;
    stable.x += 50.*sin(0.1 * time * aPress)* aDirection * area* mousePressed;
      stable.y += 50.*sin(0.1 * time * aPress)* aDirection * area* mousePressed;
      stable.z += 200.*cos(0.1 * time * aPress)* aDirection * area* mousePressed;

      //STABLE
  vec4 mvPosition =  modelViewMatrix * vec4( stable, 1.0 );
     gl_PointSize = 5000. * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vCoordinates = aCoordinates.xy;
    vPos = pos;

  }`,
  fragmentShader: `
  varying vec2 vCoordinates;
  varying vec3 vPos;
  uniform sampler2D t1;
  uniform sampler2D mask;

    void main() {
        vec4 maskTexture = texture2D(mask, gl_PointCoord);
        vec2 myUV = vec2(vCoordinates.x/512.,vCoordinates.y/512.);
        vec4 image = texture2D(t1,myUV);
      gl_FragColor = image;
      float alpha = 1. - clamp(0.,1.,abs(vPos.z/900.));
      gl_FragColor.a *= maskTexture.r *alpha;
   
       }`,

  uniforms: {
    progress: { value: 0 },
    t1: { value: textures[0] },
    mask: { value: textures[1] },
    move: { value: 0 },
    time: { value: 0 },
    mouse: { value: mouse },
    mousePressed: { value: 0 }
  }
})
const final = new THREE.Group()
scene.add(final)
let clock = new THREE.Clock()

//loadMouse();
addMesh()

function updateRenderer() {
  //renderer.outputColorSpace = THREE.SRGBColorSpace
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
  time++
  //   final.rotation.x += 0.001;
  //   final.rotation.y += 0.002;
  const elapsedTime = clock.getElapsedTime()
  imageMaterial.uniforms.move.value = move
  imageMaterial.uniforms.time.value = time
  imageMaterial.uniforms.mouse.value = mouse
  imageMaterial.uniforms.mouse.value = point
  // starsMaterial.uniforms.uTime.value = elapsedTime
  animation()
  requestAnimationFrame(loop)
}
function animation() {
  window.addEventListener('mousemove', onMouseMove, false)
  window.addEventListener('mousewheel', onMouseWheel, false)
  window.addEventListener('mousedown', onMouseDown, false)
  window.addEventListener('mouseup', onMouseUp, false)
}

onMounted(() => {
  renderer = new THREE.WebGLRenderer({
    canvas: experiance2D.value as unknown as HTMLCanvasElement,
    antialias: true,
    alpha: true
  })
  renderer.setClearColor(0x000000, 0)
  const controls = new OrbitControls(camera, renderer.domElement)
  updateRenderer()
  updateCamera()
  loop()
  // animation()
})

function loadMouse() {
  function onMouseMove(event: { clientX: number; clientY: number }) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    //  animation()
  }
  window.addEventListener('mousemove', onMouseMove, false)
}

function addMesh() {
  let number = 512 * 512
  const geometry = new THREE.BufferGeometry()

  const positions = new THREE.BufferAttribute(new Float32Array(number * 3), 3)
  const coordinates = new THREE.BufferAttribute(new Float32Array(number * 3), 3)
  const speeds = new THREE.BufferAttribute(new Float32Array(number), 1)
  const offset = new THREE.BufferAttribute(new Float32Array(number), 1)
  const direction = new THREE.BufferAttribute(new Float32Array(number), 1)
  const press = new THREE.BufferAttribute(new Float32Array(number), 1)
  function rand(a, b) {
    return a + (b - a) * Math.random()
  }
  let index = 0
  for (let i = 0; i < 512; i++) {
    let posX = i - 256
    for (let j = 0; j < 512; j++) {
      positions.setXYZ(index, posX * 2, (j - 256) * 2, 0)
      coordinates.setXYZ(index, i, j, 0)
      offset.setX(index, rand(-1000, 1000))
      speeds.setX(index, rand(0.4, 1))
      direction.setX(index, Math.random() > 0.5 ? 1 : -1)
      press.setX(index, rand(0.4, 1))
      index++
    }
  }
  geometry.setAttribute('position', positions)
  geometry.setAttribute('aCoordinates', coordinates)
  geometry.setAttribute('aOffset', offset)
  geometry.setAttribute('aSpeed', speeds)
  geometry.setAttribute('aPress', press)
  geometry.setAttribute('aDirection', direction)
  //const material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
  const mesh = new THREE.Points(geometry, imageMaterial)
  //const mesh = new THREE.Mesh(geometry,material)
  //scene.add(mesh)
  final.add(mesh)
}

// function mouseEffect(){
//     // const test = new THREE.Mesh(
//     //     new THREE.PlaneGeometry(2000,2000),
//     //     new THREE.MeshBasicMaterial({visible:true})

//     // )
// window.addEventListener('mousewheel',(e)=>{
//     move += e.wheelDeltaY/1000;
// })
// // window.addEventListener('mousemove',(event)=>{
// //   mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
// //   mouse.y = -(event.clientY/window.innerHeight) * 2 + 1;
// //   raycaster.setFromCamera(mouse,camera);
// //   let intersects = raycaster.intersectObjects([test]);

// //   point.x = intersects[0].point.x;
// //   point.y = intersects[0].point.y;

// // },false)
// }

function onMouseWheel(event) {
  move += event.wheelDeltaY / 1000
}
function onMouseMove(event) {
  // const test = new THREE.Mesh(
  //     new THREE.PlaneGeometry(100,100),
  //     new THREE.MeshBasicMaterial({visible:true,color:0x00FF00})
  // )
  // scene.add(test)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  let intersects = raycaster.intersectObjects([test])
  point.x = intersects[0].point.x
  point.y = intersects[0].point.y
}

function onMouseDown(event) {
  gsap.to(imageMaterial.uniforms.mousePressed, {
    duration: 1,
    value: 1
  })
}
function onMouseUp(event) {
  gsap.to(imageMaterial.uniforms.mousePressed, {
    duration: 1,
    value: 0
  })
}
</script>
<!-- <style scoped>
canvas {
  position: absolute;
}
</style> -->
