import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui';
import { TessellateModifier } from './TessellateModifier';
import { update } from 'firebase/database';


function createScene () {
	const  scene = new THREE.Scene()
	const  camera = new THREE.PerspectiveCamera(60,  window.innerWidth / window.innerHeight, 1, 100)
	camera.position.z = 30
   
	const  renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
	    //LIGHT//
const color = 0xFFFFFF
const intensity = 0.75
const light = new THREE.PointLight(color, intensity)
light.position.set(-15, -10, 30)

scene.add(light)
const directionallLight = new THREE.DirectionalLight(0xFFFFFF,1);
scene.add(directionallLight);
directionallLight.position.set(2, 2, 5);
directionallLight.castShadow = true;
directionallLight.shadow.camera.bottom = -12;
	    //LIGHT//



const vshader = `
uniform vec3 u_gravity;
uniform float u_time;
attribute vec3 velocity;
void main() {
  vec3 acc = u_gravity * 0.1 * u_time * u_time;
  vec3 vel = velocity * u_time;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position + acc + vel, 0.5 );
  gl_PointSize = 5.0;
}
`
const fshader = `
void main(){
  vec3 color = vec3(1.0);
  gl_FragColor = vec4( color, 1.0 );
}
`
const clock = new THREE.Clock();
const COUNT = 3000;
const positions = new Float32Array(COUNT*7);
const velocity = new Float32Array(COUNT*7);
const geometry = new THREE.BufferGeometry();


const size = 0;
const speed = 18;
for(let i=0; i<positions.length; i++) {
  positions[i] = (Math.random()-0.5) * size;
  velocity[i] = (Math.random()-0.5) * speed;
  
}
geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ));
geometry.setAttribute( 'velocity', new THREE.BufferAttribute( velocity, 3 ));

const uniforms ={
  u_gravity: { value: new THREE.Vector3(0, 0, 0)},
  u_time: { value: 0 },

};

const material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader
});
const mesh = new THREE.Points(geometry, material);
scene.add(mesh);

onWindowResize();
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize( event ) {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

    // function explodeUpdate() {

    //     requestAnimationFrame( update );
    //     uniforms.u_time.value += clock.getDelta();
    //     if (uniforms.u_time.value> 3.0) uniforms.u_time.value = 0;
    //     // renderer.render( scene, camera );
    //   }

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
//LIGHT//
    return {
		scene,
		camera,
		renderer
	}
}


// const vshader = `
// uniform vec3 u_gravity;
// uniform float u_time;
// attribute vec3 velocity;
// void main() {
//   vec3 acc = u_gravity * 0.1 * u_time * u_time;
//   vec3 vel = velocity * u_time;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4( position + acc + vel, 0.5 );
//   gl_PointSize = 5.0;
// }
// `
// const fshader = `
// void main(){
//   vec3 color = vec3(1.0);
//   gl_FragColor = vec4( color, 1.0 );
// }
// `
// const clock = new THREE.Clock();
// const COUNT = 3000;
// const positions = new Float32Array(COUNT*7);
// const velocity = new Float32Array(COUNT*7);
// const geometry = new THREE.BufferGeometry();

// const size = 0;
// const speed = 18;
// for(let i=0; i<positions.length; i++) {
//   positions[i] = (Math.random()-0.5) * size;
//   velocity[i] = (Math.random()-0.5) * speed;
// }
// geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ));
// geometry.setAttribute( 'velocity', new THREE.BufferAttribute( velocity, 3 ));

// const uniforms ={
//   u_gravity: { value: new THREE.Vector3(0, 0, 0)},
//   u_time: { value: 0 }
// };

// const material = new THREE.ShaderMaterial( {
//   uniforms: uniforms,
//   vertexShader: vshader,
//   fragmentShader: fshader
// });

// const mesh = new THREE.Points(geometry, material);
// scene.add(mesh);

// onWindowResize();
// window.addEventListener( 'resize', onWindowResize, false );

// function onWindowResize( event ) {
//     camera.aspect = window.innerWidth/window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize( window.innerWidth, window.innerHeight );
//   }

//     function explodeUpdate() {

//         requestAnimationFrame( update );
//         uniforms.u_time.value += clock.getDelta();
//         if (uniforms.u_time.value> 3.0) uniforms.u_time.value = 0;
//         // renderer.render( scene, camera );
//       }	



function useCoordinates () {
  const vertices = [
    new THREE.Vector3(0, 0, 0), // point C
    new THREE.Vector3(0, 5, -1.5),
    new THREE.Vector3(5, 5, 0), // point A
    new THREE.Vector3(9, 9, 0),
    new THREE.Vector3(5, 9, 2),
    new THREE.Vector3(7, 13, 0),
    new THREE.Vector3(3, 13, 0),
    new THREE.Vector3(0, 11, 0),
    new THREE.Vector3(5, 9, -2),
    new THREE.Vector3(0, 8, -3),
    new THREE.Vector3(0, 8, 3),
    new THREE.Vector3(0, 5, 1.5), // point B
    new THREE.Vector3(-9, 9, 0),
    new THREE.Vector3(-5, 5, 0),
    new THREE.Vector3(-5, 9, -2),
    new THREE.Vector3(-5, 9, 2),
    new THREE.Vector3(-7, 13, 0),
    new THREE.Vector3(-3, 13, 0),
  ];
  const trianglesIndexes = [
  // face 1
    2,11,0, // This represents the 3 points A,B,C which compose the first triangle
    2,3,4,
    5,4,3,
    4,5,6,
    4,6,7,
    4,7,10,
    4,10,11,
    4,11,2,
    0,11,13,
    12,13,15,
    12,15,16,
    16,15,17,
    17,15,7,
    7,15,10,
    11,10,15,
    13,11,15,
  // face 2
    0,1,2,
    1,9,2,
    9,8,2,
    5,3,8,
    8,3,2,
    6,5,8,
    7,6,8,
    9,7,8,
    14,17,7,
    14,7,9,
    14,9,1,
    9,1,13,
    1,0,13,
    14,1,13,
    16,14,12,
    16,17,14,
    12,14,13
  ]
  return {
    vertices,
    trianglesIndexes
  }
}

function createHeartMesh (coordinatesList, trianglesIndexes) {
	const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshPhongMaterial( { color: 0xad0c00 } )
  let points = []
	for (let i in trianglesIndexes) {
		if ((i+1)%3 === 0) {
			points.push(coordinatesList[trianglesIndexes[i-2]], coordinatesList[trianglesIndexes[i-1]], coordinatesList[trianglesIndexes[i]])
			// geo.faces.push(new THREE.Face3(i-2, i-1, i))
		}
       
	}

    geometry.setFromPoints(points)
	geometry.computeVertexNormals()
	const heartMesh = new THREE.Mesh(geometry, material)
	return {
		geometry,
		material,
		heartMesh
	}
}

function addWireFrameToMesh (mesh, geometry) {
	const wireframe = new THREE.WireframeGeometry( geometry )
	const lineMat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } )
	const line = new THREE.LineSegments( wireframe, lineMat )
	mesh.add(line)
}

const beatingIncrement = 0.008
let scaleThreshold = false
function beatingAnimation (mesh) {
    console.log(mesh)
	 // while the scale value is below the max,
	 // and the threshold is not reached, we increase it
	 if (mesh.scale.x < 1.4 && !scaleThreshold) {
	  mesh.scale.x += beatingIncrement * 2
	  mesh.scale.y += beatingIncrement * 2
	  mesh.scale.z += beatingIncrement * 2
    //   mesh.position.x +=0.2
    //   mesh.position.y +=0.2
      mesh.position.z +=0.2
	  // When max value is reached, the flag can be switched
	  if (mesh.scale.x >= 1.4) scaleThreshold = true
	 } else if (scaleThreshold) {
	  mesh.scale.x -= beatingIncrement
	  mesh.scale.y -= beatingIncrement
	  mesh.scale.z -= beatingIncrement
    //   mesh.position.x -=0.2
    //   mesh.position.y -=0.2
      mesh.position.z -=0.2
	  // The mesh got back to its initial state
	  // we can switch back the flag and go through the increasing path next time
	  if (mesh.scale.x <= 1) {
	   scaleThreshold = startAnim = false
	  }
	 }
}

let startAnim = false

function handleMouseIntersection (camera, scene, meshUuid) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseIntersection( event ) {
      const coordinatesObject = event.changedTouches ? event.changedTouches[0] : event
      mouse.x = ( coordinatesObject.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( coordinatesObject.clientY / window.innerHeight ) * 2 + 1;

      raycaster.setFromCamera( mouse, camera );
      const intersects = raycaster.intersectObjects( scene.children );

      if (intersects.length && intersects[0].object.uuid === meshUuid) {
          startAnim = true
      }
  }

  mouse.x = 1
  mouse.y = 1

  return {
      onMouseIntersection
  }
}



function setControls (camera, domElement, deviceOrientationMode) {
//   const controls = deviceOrientationMode ? new DeviceOrientationControls(camera) : new THREE.OrbitControls( camera, domElement )
  const controls = new OrbitControls(camera, domElement)
	controls.update()
  return {
    controls
  }
}

// function explodeFun (){
// //     var geometry = new THREE.IcosahedronGeometry( 200, 1 );
// // var material = new THREE.MeshPhongMaterial( { shading: THREE.FlatShading } );

// // var explodeModifier = new THREE.ExplodeModifier();
// // explodeModifier.modify( geometry );

// // var mesh = new THREE.Mesh( geometry, material );
// // scene.addChild( mesh );
// // }
// //EXPLODE//
// const vshader = `
// uniform vec3 u_gravity;
// uniform float u_time;
// attribute vec3 velocity;
// void main() {
//   vec3 acc = u_gravity * 0.1 * u_time * u_time;
//   vec3 vel = velocity * u_time;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4( position + acc + vel, 0.5 );
//   gl_PointSize = 5.0;
// }
// `
// const fshader = `
// void main(){
//   vec3 color = vec3(1.0);
//   gl_FragColor = vec4( color, 1.0 );
// }
// `
// const clock = new THREE.Clock();
// const COUNT = 3000;
// const positions = new Float32Array(COUNT*7);
// const velocity = new Float32Array(COUNT*7);
// const geometry = new THREE.BufferGeometry();

// const size = 0;
// const speed = 18;
// for(let i=0; i<positions.length; i++) {
//   positions[i] = (Math.random()-0.5) * size;
//   velocity[i] = (Math.random()-0.5) * speed;
// }
// geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ));
// geometry.setAttribute( 'velocity', new THREE.BufferAttribute( velocity, 3 ));

// const uniforms ={
//   u_gravity: { value: new THREE.Vector3(0, 0, 0)},
//   u_time: { value: 0 }
// };

// const material = new THREE.ShaderMaterial( {
//   uniforms: uniforms,
//   vertexShader: vshader,
//   fragmentShader: fshader
// });

// const mesh = new THREE.Points(geometry, material);
// scene.add(mesh);

// onWindowResize();
// window.addEventListener( 'resize', onWindowResize, false );

// function onWindowResize( event ) {
//     camera.aspect = window.innerWidth/window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize( window.innerWidth, window.innerHeight );
//   }

//     function explodeUpdate() {
//         requestAnimationFrame( update );
//         uniforms.u_time.value += clock.getDelta();
//         if (uniforms.u_time.value> 3.0) uniforms.u_time.value = 0;
//         renderer.render( scene, camera );
//       }

//       return {
//         explodeUpdate
//       }


  
// //EXPLODE//
// }



//EXPLODE//

// function handleExploreEvent (camera, scene, renderer){
//     const vshader = `
//     uniform vec3 u_gravity;
//     uniform float u_time;
//     attribute vec3 velocity;
//     void main() {
//       vec3 acc = u_gravity * 0.1 * u_time * u_time;
//       vec3 vel = velocity * u_time;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4( position + acc + vel, 0.5 );
//       gl_PointSize = 5.0;
//     }
//     `
//     const fshader = `
//     void main(){
//       vec3 color = vec3(1.0);
//       gl_FragColor = vec4( color, 1.0 );
//     }
//     `
//     const clock = new THREE.Clock();
//     const COUNT = 3000;
//     const positions = new Float32Array(COUNT*7);
//     const velocity = new Float32Array(COUNT*7);
//     const geometry = new THREE.BufferGeometry();
    
//     const size = 0;
//     const speed = 18;
//     for(let i=0; i<positions.length; i++) {
//       positions[i] = (Math.random()-0.5) * size;
//       velocity[i] = (Math.random()-0.5) * speed;
//     }
//     geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ));
//     geometry.setAttribute( 'velocity', new THREE.BufferAttribute( velocity, 3 ));
    
//     const uniforms ={
//       u_gravity: { value: new THREE.Vector3(0, 0, 0)},
//       u_time: { value: 0 }
//     };
    
//     const material = new THREE.ShaderMaterial( {
//       uniforms: uniforms,
//       vertexShader: vshader,
//       fragmentShader: fshader
//     });
    
//     const mesh = new THREE.Points(geometry, material);
//     scene.add(mesh);
    
//     onWindowResize();
//     window.addEventListener( 'resize', onWindowResize, false );
    
//     function onWindowResize( event ) {
//         camera.aspect = window.innerWidth/window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize( window.innerWidth, window.innerHeight );
//       }

//     function explodeUpdate() {
//         requestAnimationFrame( update );
//         uniforms.u_time.value += clock.getDelta();
//         if (uniforms.u_time.value> 3.0) uniforms.u_time.value = 0;
//         renderer.render( scene, camera );
//       }

//       return {
//         explodeUpdate
//       }

//     }

(function init () {
  const {scene, camera, renderer} = createScene()
  const { controls } = setControls(camera, renderer.domElement, window.location.hash.includes('deviceOrientation'))
  const { vertices, trianglesIndexes} = useCoordinates()
  const { geo, material, heartMesh } = createHeartMesh(vertices, trianglesIndexes)
  scene.add(heartMesh)
  addWireFrameToMesh(heartMesh, geo)
  const { onMouseIntersection } = handleMouseIntersection(camera, scene, heartMesh.uuid)
  // const { explodeUpdate } = handleExploreEvent(camera, scene,renderer)
  window.addEventListener( 'click', onMouseIntersection, false )
  // window.addEventListener( 'click', explodeUpdate, false )

  const animate = function () {
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
    heartMesh.rotation.y -= 0.005
    startAnim && beatingAnimation(heartMesh)
    controls.update()
  }
  animate()
})()

// (function init() {

//     const {scene, camera, renderer} = createScene()
//       const { controls } = setControls(camera, renderer.domElement, window.location.hash.includes('deviceOrientation'))
//       const { vertices, trianglesIndexes} = useCoordinates()
//       const { geometry, material, heartMesh } = createHeartMesh(vertices, trianglesIndexes)
//       scene.add(heartMesh)
//       addWireFrameToMesh(heartMesh, geometry)
//       const { onMouseIntersection } = handleMouseIntersection(camera, scene, heartMesh.uuid)
//       window.addEventListener( 'click', onMouseIntersection, false )
//     // material = new THREE.MeshPhongMaterial({
//     //     color: 0xffffff,
//     //     shading: THREE.FlatShading,
//     //     side: THREE.DoubleSide,
//     //     transparent: false,
//     //     opacity: 0.5
//     // });
//     // geometry = new THREE.IcosahedronGeometry(300, 1);
//     // var explodeModifier = new THREE.ExplodeModifier();
//     // explodeModifier.modify(geo);
 
//    let tesselateModifier = new TessellateModifier();
//    tesselateModifier.modify(geometry)
//    console.log(geometry)
//     console.log('total', geometry.vertices.length)
//     for (var i = 0; i < geometry.vertices.length; i += 3) {
//         var A = geometry.vertices[i + 0]
//         var B = geometry.vertices[i + 1]
//         var C = geometry.vertices[i + 2]

//         var scale = 1 + Math.random() * 0.4;
//         A.multiplyScalar(scale);
//         B.multiplyScalar(scale);
//         C.multiplyScalar(scale);

//     }

//     mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//    const light = new THREE.PointLight(0xffffff);
//     light.position.set(0, 1000, 1000);
//     scene.add(light);

//    const light1 = new THREE.PointLight(0xffffff);
//     light1.position.set(0, -1000, 1000);
//     scene.add(light1);

//     renderer = new THREE.WebGLRenderer();
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     document.body.appendChild(renderer.domElement);
// })()




// `varying vec2 vUv;
// varying vec3 vPos;
//  varying vec2 vCoordinates;
//  attribute vec3 aCoordinates;
//  attribute float aSpeed;
//  attribute float aOffset;
//  attribute float aDirection;
//  attribute float aPress;
//  uniform float move;
//  uniform float time;
//  uniform vec2 mouse;
//  uniform float mousePressed;
//  uniform vec3 u_gravity;
// uniform float u_time;
// attribute vec3 velocity;
//  void main(){
//  vUv = uv;
//  vec3 pos = position;
//  pos.x += sin(move*aSpeed)*3.;
//  pos.y += sin(move*aSpeed)*3.;
//  pos.z = mod(position.z + move*20. * aSpeed + aOffset, 2000.) - 1000.;
//  vec3 stable = position;
//  float dist = distance(stable.xy, mouse);
//  float area = 1. - smoothstep(0.,300.,dist);
//  stable.x +=50.*sin(0.1*time*aPress)*aDirection*mousePressed;
//  stable.y +=50.*sin(0.1*time*aPress)*aDirection*mousePressed;
//  stable.z +=200.*cos(0.1*time*aPress)*aDirection*mousePressed;
//  // vec4 mvPosition = modelViewMatrix *  vec4(pos,1.);
// // vec3 acc = u_gravity * 0.1 * u_time * u_time;
// // vec3 vel = velocity * u_time;
//  //vec4 mvPosition  = projectionMatrix * modelViewMatrix * vec4( position + acc + vel, 0.5 );
//  gl_PointSize = 1300. * (1. / - mvPosition.z );
//  gl_Position = projectionMatrix * mvPosition;
//  vCoordinates = aCoordinates.xy;
//  vPos = pos;
//  }`,