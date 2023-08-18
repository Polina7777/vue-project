<template>
  <div class="animation_wrapper">
    <canvas id="canvas2D" class="canvas2D" ref="experiance2D"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { computed, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'

let container: HTMLElement | null,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  width: number,
  height: number
width = window.innerWidth
height = window.innerHeight
let time = 0
let move = 0
const aspectRatio = computed(() => width / height)
const experiance2D = ref<HTMLCanvasElement | null>(null)
scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(100, width / height, 0.01, 4000)
camera.position.z = 3000
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const point = new THREE.Vector2()

const textures = [
  new THREE.TextureLoader().load('../public/burger2.png'),
  new THREE.TextureLoader().load('../public/mask.jpg')
]
const imageMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
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

 //STABLE
      vec3 stable = position;
       float dist = distance(stable.xy,mouse);
       float area = 1. - smoothstep(0.,300.,dist) ;

    stable.x += 100.*sin(0.1 * time * aPress)* aDirection * area * mousePressed;
    stable.y += 50.*sin(0.1 * time * aPress)* aDirection * area * mousePressed;
   // stable.z += 200.*cos(0.1 * time * aPress)* aDirection * area * mousePressed;

      //STABLE
  vec4 mvPosition =  modelViewMatrix * vec4( stable, 1.0 );
     gl_PointSize = 2700. * (1. / -mvPosition.z);
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
      // gl_FragColor.a *= maskTexture.r *alpha;
   
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
final.updateMatrix()
final.updateMatrixWorld(true)
scene.updateMatrixWorld(true)
camera.updateMatrix()
scene.add(final)
let clock = new THREE.Clock()
addMesh()
animation()

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
  time++
  const elapsedTime = clock.getElapsedTime()
  imageMaterial.uniforms.move.value = move
  imageMaterial.uniforms.time.value = time
  imageMaterial.uniforms.mouse.value = point
  requestAnimationFrame(loop)
}
function animation() {
  requestAnimationFrame(animation)
  window.addEventListener('mousemove', onMouseMove, false)
 // window.addEventListener('mousewheel', onMouseWheel, false)
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
  controls.enableRotate = false
  controls.enableZoom = false
  updateRenderer()
  updateCamera()

  loop()
})
function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
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
  function rand(a: number, b: number) {
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
  const mesh = new THREE.Points(geometry, imageMaterial)

  mesh.position.set(width / 0.5, height / 0.31, 0)
  scene.updateWorldMatrix(true, true)

  mesh.updateMatrix()
  mesh.updateMatrixWorld(true)
  mesh.updateMorphTargets()
  mesh.updateWorldMatrix(true, true)
  scene.updateMatrixWorld(true)
  scene.matrixWorldNeedsUpdate = true
  scene.add(mesh)
}

function onMouseWheel(event: { wheelDeltaY: number }) {
  move += event.wheelDeltaY / 1000
}
function onMouseMove(event: any) {
  camera.updateMatrixWorld()
  point.x = (event.clientX / window.innerWidth) * 2 - 1
  point.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(point, camera)
  let intersects = raycaster.intersectObjects(scene.children, true)
  if (intersects.length) {
    const pointX = intersects[0].point.x - width / 0.5
    const pointY = intersects[0].point.y - height / 0.31
    point.x = pointX
    point.y = pointY
  }
}

function onMouseDown() {
  gsap.to(imageMaterial.uniforms.mousePressed, {
    duration: 1,
    value: 1
  })
}
function onMouseUp() {
  gsap.to(imageMaterial.uniforms.mousePressed, {
    duration: 1,
    value: 0
  })
}
</script>
<style scoped>
canvas {
  position: absolute;
  height: 100vh;
  z-index: 1000;
}
</style>
