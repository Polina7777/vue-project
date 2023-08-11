<template>
  <canvas id="canvasCursor" class="canvasCursor" ref="experianceCursor">
    <div id="modelCursor" ref="modelCursor"></div>
  </canvas>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { computed, onMounted, ref, watch } from 'vue'


let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera
let pointclouds: THREE.Points<
  THREE.BufferGeometry<THREE.NormalBufferAttributes>,
  THREE.PointsMaterial
>[]
let raycaster: THREE.Raycaster
let intersection = null
let spheresIndex = 0
let clock: THREE.Clock
let toggle = 0
const experianceCursor = ref<HTMLCanvasElement | null>(null)
const pointer = new THREE.Vector2()
const spheres: any[] = []
 const width = window.innerWidth
 const height = window.innerHeight
//const width = document.documentElement.clientWidth
//const height = document.documentElement.clientHeight

const aspectRatio = computed(() => width / height)
const threshold = 0.1
const pointSize = 0.01

scene = new THREE.Scene()
clock = new THREE.Clock()

// camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000)
camera = new THREE.PerspectiveCamera(25,document.documentElement.clientWidth / document.documentElement.clientHeight, 1, 1000)
camera.position.set(15, 0, 0)
camera.lookAt(scene.position)
camera.updateMatrix()
createPlane()

onMounted(() => {
  renderer = new THREE.WebGLRenderer({
    canvas: experianceCursor.value as unknown as HTMLCanvasElement,
    antialias: true,
    alpha: true
  })
  renderer.setClearColor(0x000000, 0)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableRotate = false;
  controls.autoRotate = false;   
  controls.enablePan = false;
  controls.enableZoom = false;
  camera.aspect = aspectRatio.value
  camera.updateMatrix()
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  // updateRenderer()
  // updateCamera()
  init()
  // animate()
})
function updateRenderer() {
   renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  camera.updateMatrix()
  camera.aspect = aspectRatio.value
  camera.updateProjectionMatrix()
}
function updateCamera() {
  camera.aspect = aspectRatio.value
  camera.updateProjectionMatrix()
}
watch(aspectRatio, updateRenderer)
watch(aspectRatio, updateCamera)

function generatePointCloudGeometry(
  color: { r: number; g: number; b: number },
  width: number,
  length: number
) {
  const geometry = new THREE.BufferGeometry()
  const numPoints = width * length
  const positions = new Float32Array(numPoints * 3)
  const colors = new Float32Array(numPoints * 3)

  let k = 0

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < length; j++) {
      const u = i / width
      const v = j / length
      const x = u - 0.5
      // const y = ( Math.cos( u * Math.PI * 4 ) + Math.sin( v * Math.PI * 8 ) ) / 20;
      const y = 0.5
      const z = v - 0.5

      positions[3 * k] = x
      positions[3 * k + 1] = y
      positions[3 * k + 2] = z

      const intensity = (y + 0.1) * 5
      colors[3 * k] = color.r * intensity
      colors[3 * k + 1] = color.g * intensity
      colors[3 * k + 2] = color.b * intensity

      k++
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.computeBoundingBox()
  return geometry
}

function generatePlane(color: THREE.Color, width: number, length: number) {
  const geometry = generatePointCloudGeometry(color, width, length)
  const material = new THREE.PointsMaterial({ size: pointSize, vertexColors: true, sizeAttenuation: true})
// scene.updateMatrix()
// scene.updateMatrixWorld(true)
// scene.updateWorldMatrix(true,true)
  return new THREE.Points(geometry, material)
}

function createPlane() {
  const pcPlane = generatePlane(new THREE.Color(0, 0, 0), 200, 100)
  pcPlane.scale.set(5, 10, 10)
  pcPlane.position.set(5, 2, 0)
  pcPlane.rotation.z = Math.PI - 20
  pcPlane.scale.set(10, 10, 10)
  scene.add(pcPlane)
  pointclouds = [pcPlane]

  const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32)
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 'white' })

  for (let i = 0; i < 70; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(sphere)
    spheres.push(sphere)
  }

  raycaster = new THREE.Raycaster()
  raycaster.params.Points.threshold = threshold
//   scene.updateMatrix()
// scene.updateMatrixWorld(true)
// scene.updateWorldMatrix(true,true)
}
function init() {
  window.addEventListener('resize', onWindowResize,false)
  document.addEventListener('pointermove', onPointerMove,false)
  animate()
}

// function updateRenderer() {
//   renderer.setPixelRatio(window.devicePixelRatio)
//   renderer.setSize(window.innerWidth, window.innerHeight)
// }
function onPointerMove(event) {
	event.stopPropagation();
  pointer.x = (event.clientX / width) * 2 - 1
  pointer.y = -(event.clientY / height) * 2 + 1
}

function onWindowResize() {
  // camera.aspect = window.innerWidth / window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

function render() {
  camera.updateMatrixWorld()
  raycaster.setFromCamera(pointer, camera)
  const intersections = raycaster.intersectObjects(pointclouds, false)
  intersection = intersections.length > 0 ? intersections[0] : null

  if (toggle > 0.02 && intersection !== null) {
    spheres[spheresIndex].position.copy(intersection.point)
    spheres[spheresIndex].scale.set(0.7, 0.7, 0.7)
    spheresIndex = (spheresIndex + 1) % spheres.length

    toggle = 0
  }

  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i]
    sphere.scale.multiplyScalar(0.9)
    sphere.scale.clampScalar(0.03, 1)
  }

  toggle += clock.getDelta()

  renderer.render(scene, camera)
}
</script>
<style scoped>
canvas {
  position: absolute;
}
</style>
