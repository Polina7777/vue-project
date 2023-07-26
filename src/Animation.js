import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import nebula from '../src/image/nebula.jpg';
import stars from '../src/image/stars.jpg';

const renderer = new THREE.WebGLRenderer;

renderer.shadowMap.enabled = true;

renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1 , 1000);
 const orbit = new OrbitControls(camera, renderer.domElement );
// const controls = new OrbitControls( camera, renderer.domElement );
const axesHelper = new THREE.AxesHelper(3);

scene.add(axesHelper);

// camera.position.z = 5;
// camera.position.y = 2;

camera.position.set(-10, 30, 30);
orbit.update();
// controls.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry,boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF,side:THREE.DoubleSide});
const plane = new THREE.Mesh( planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x0000FF, wireframe:false});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);



// const directionallLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionallLight);
// directionallLight.position.set(-30, 50, 0);
// directionallLight.castShadow = true;
// directionallLight.shadow.camera.bottom = -12;


// const dLightHelper = new THREE.DirectionalLightHelper(directionallLight,5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionallLight.shadow.camera);
// scene.add(dLightShadowHelper);


const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// renderer.setClearColor(0xFFEA00);
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//   nebula,
//   nebula,
//   stars,
//   stars,
//   stars,
//   stars,
// ]);
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  // color:0x00FF00,
map:textureLoader.load(nebula)})
// const box2MultiMaterial = [
//   new THREE.MeshBasicMaterial({map:textureLoader.load(stars)})
// ];
const box2 = new THREE.Mesh(box2Geometry,box2Material);
scene.add(box2);
box2.position.set(0, 15, 10);
// scene.background = cubeTextureLoader.load([
//   nebula,
//   nebula, 
//    stars, 
//    stars,
//   stars,
//    stars
// ]);

const gui = new dat.GUI();
const options = {
  sphereColor:'#ffea00',
  wireframe:false,
  speed: 0.01,
  angle: 0.2,
  penumbra:0,
  intensity:1,
}

gui.addColor(options, 'sphereColor' ).onChange(function(e){
  sphere.material.color.set(e);
});

gui.add(options,'wireframe').onChange(function(e){
  sphere.material.wireframe = e;
})

gui.add(options,'speed', 0, 0.1);

gui.add(options,'angle', 0, 1);
gui.add(options,'penumbra', 0, 1);
gui.add(options,'intensity', 0, 1);


let step = 0;



const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

function animate(time){
  box.rotation.x = time/1000;
  box.rotation.y = time/1000;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  orbit.update();
  // controls.update();

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate);
