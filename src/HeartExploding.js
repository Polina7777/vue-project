import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui';
import { TessellateModifier } from './TessellateModifier';


let scene, camera, renderer;
let fragments = [];
let ADD = 0.05;
const dt = 0.02;

class Fragment {
    constructor(position, velocity, g) {
        this.velocity = velocity;
        this.velocity.multiplyScalar(dt);

        let material = new THREE.MeshPhongMaterial({
                        side: THREE.DoubleSide,
                        color: 0xffffff,
                        emissive: 0xfafafa,
                        emissiveIntensity: 0.4,
                        shininess: 100,
                        specular: 0x9d0a00,
                        vertexColors: true
                        });
        
        this.shape = new THREE.Mesh(g, material);
        this.shape.position.copy(position);
    }
    
    move() {
        this.shape.position.add(this.velocity);
        this.shape.rotation.x += ADD;
    }
};
const points = [];
// let createTriangle = function(p1, p2, p3) {
//     points.push(p1,p2,p3);
//     let geometry = new  THREE.BufferGeometry().setFromPoints(points)
//     // let geometry = new THREE.Geometry();

//     // geometry.vertices.push(p1, p2, p3);
//     // geometry.faces.push( new THREE.Face3(0, 1, 2));
//     // geometry.computeFaceNormals();
//     geometry.computeVertexNormals();
//     return geometry;
// };
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


// let createGeometry = function() {
//     // let p1 = new THREE.Vector3(0, 1, 0);
//     // let p2 = new THREE.Vector3(1, 0, 1);
//     // let p3 = new THREE.Vector3(-1, 0, 1);
//     // let p4 = new THREE.Vector3(-1, 0, -1);
//     // let p5 = new THREE.Vector3(1, 0, -1);
//     // let p6 = new THREE.Vector3(0, -1, 0);
//   let p1 =  new THREE.Vector3(0, 0, 0); // point C
//   let p2 =  new THREE.Vector3(0, 5, -1.5);
//   let p3 =  new THREE.Vector3(5, 5, 0); // point A
//   let p4 =  new THREE.Vector3(9, 9, 0);
//   let p5 =  new THREE.Vector3(5, 9, 2);
//   let p6 =  new THREE.Vector3(7, 13, 0);
//   let p7 =  new THREE.Vector3(3, 13, 0);
//   let p8 =  new THREE.Vector3(0, 11, 0);
//   let p9 =  new THREE.Vector3(5, 9, -2);
//   let p10 =  new THREE.Vector3(0, 8, -3);
//   let p11 =  new THREE.Vector3(0, 8, 3);
//   let p12 =  new THREE.Vector3(0, 5, 1.5); // point B
//   let p13 =  new THREE.Vector3(-9, 9, 0);
//   let p14 =  new THREE.Vector3(-5, 5, 0);
//   let p15 =  new THREE.Vector3(-5, 9, -2);
//   let p16 =  new THREE.Vector3(-5, 9, 2);
//   let p17 =  new THREE.Vector3(-7, 13, 0);
//   let p18 =  new THREE.Vector3(-3, 13, 0);


//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(2, 11, 0), createTriangle(p1, p2, p3)));
    
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0),
//                 new THREE.Vector3(2, 3, 4), createTriangle(p1, p2, p14)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(5, 4, 3), createTriangle(p2, p5, p3)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(4, 5, 6), createTriangle(p2, p16, p14)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(4, 6, 7), createTriangle(p2, p11, p5)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(4, 7, 10), createTriangle(p2, p11, p16)));
//      fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(4, 11, 2), createTriangle(p3, p5, p4)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(4, 10, 11), createTriangle(p14, p13, p16)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(4, 11, 2), createTriangle(p11, p8, p5)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(0, 11, 13), createTriangle(p11, p8, p16)));
//      fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(12, 15, 16), createTriangle(p8, p7, p5)));
//      fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(12, 13, 15), createTriangle(p8, p18, p11)));
//      fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(16, 15, 17), createTriangle(p7, p6, p5)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(17, 15, 7), createTriangle(p18, p17, p16)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(7, 15, 10), createTriangle(p6, p4, p5)));
//      fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(11, 10, 15), createTriangle(p17, p13, p16)));
//      fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(13, 11, 15), createTriangle(p16, p13, p14)));
//     fragments.forEach(f => scene.add(f.shape));  
// };


// set up the environment - 
// initiallize scene, camera, objects and renderer
let init = function() {
    // create the scene
    const { vertices, trianglesIndexes} = useCoordinates()
    const { geo, material, heartMesh } = createHeartMesh(vertices, trianglesIndexes)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // create an locate the camera
    camera = new THREE.PerspectiveCamera(75, 
                    window.innerWidth / window.innerHeight, 
                    10, 3000);
    camera.position.z = 100;
    
    let directionalLightUp = new THREE.DirectionalLight( 0xffffff);
    scene.add(directionalLightUp);
    scene.add(heartMesh)
    // createGeometry();
    
    // create the renderer   
    renderer = new THREE.WebGLRenderer();   
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
    
};


// main animation loop - calls 50-60 times per second.
let mainLoop = function() { 
    fragments.forEach(f => f.move());
     
    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

///////////////////////////////////////////////
init();
mainLoop();



// let scene, camera, renderer;
// let fragments = [];
// let ADD = 0.05;
// const dt = 0.02;

// class Fragment {
//     constructor(position, velocity, g) {
//         this.velocity = velocity;
//         this.velocity.multiplyScalar(dt);

//         let material = new THREE.MeshPhongMaterial({
//                         side: THREE.DoubleSide,
//                         color: 0xffffff,
//                         emissive: 0xfafafa,
//                         emissiveIntensity: 0.4,
//                         shininess: 100,
//                         specular: 0x9d0a00,
//                         vertexColors: true
//                         });
        
//         this.shape = new THREE.Mesh(g, material);
//         this.shape.position.copy(position);
//     }
    
//     move() {
//         this.shape.position.add(this.velocity);
//         this.shape.rotation.x += ADD;
//     }
// };

// let createTriangle = function(p1, p2, p3) {
//     let geometry = new THREE.Geometry();
//     geometry.vertices.push(p1, p2, p3);
//     geometry.faces.push( new THREE.Face3(0, 1, 2));
//     geometry.computeFaceNormals();
//     geometry.computeVertexNormals();
//     return geometry;
// };


// let createGeometry = function() {
//     let p1 = new THREE.Vector3(0, 1, 0);
//     let p2 = new THREE.Vector3(1, 0, 1);
//     let p3 = new THREE.Vector3(-1, 0, 1);
//     let p4 = new THREE.Vector3(-1, 0, -1);
//     let p5 = new THREE.Vector3(1, 0, -1);
//     let p6 = new THREE.Vector3(0, -1, 0);
    
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(0, 0, 6), createTriangle(p1, p2, p3)));
    
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0),
//                 new THREE.Vector3(-2, 4, 0), createTriangle(p1, p3, p4)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(0, 5, -4), createTriangle(p1, p4, p5)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(2, 3, 0), createTriangle(p1, p5, p2)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(0, -5, 3), createTriangle(p3, p2, p6)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(-4, -3, 0), createTriangle(p6, p3, p4)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(0, -4, -4), createTriangle(p6, p4, p5)));
//     fragments.push(new Fragment(new THREE.Vector3(0, 0, 0), 
//                 new THREE.Vector3(3, -3, 0), createTriangle(p6, p2, p5)));
    
//     fragments.forEach(f => scene.add(f.shape));  
// };


// // set up the environment - 
// // initiallize scene, camera, objects and renderer
// let init = function() {
//     // create the scene
//     scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x000000);
    
//     // create an locate the camera
//     camera = new THREE.PerspectiveCamera(75, 
//                     window.innerWidth / window.innerHeight, 
//                     1, 1000);
//     camera.position.z = 20;
    
//     let directionalLightUp = new THREE.DirectionalLight( 0xffffff);
//     scene.add(directionalLightUp);
    
//     createGeometry();
    
//     // create the renderer   
//     renderer = new THREE.WebGLRenderer();   
//     renderer.setSize(window.innerWidth, window.innerHeight);
    
//     document.body.appendChild(renderer.domElement);
    
// };


// // main animation loop - calls 50-60 times per second.
// let mainLoop = function() { 
//     fragments.forEach(f => f.move());
     
//     renderer.render(scene, camera);
//     requestAnimationFrame(mainLoop);
// };

// ///////////////////////////////////////////////
// init();
// mainLoop();