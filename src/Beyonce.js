import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui';
import { gsap } from 'gsap';
 import vertex from './shader/vertex.glsl';
// import fragment from './shader/fragment.glsl';



export default class Sketch{
    constructor(selector){
        this.scene = new THREE.Scene();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize( this.width, this.height);
        document.getElementById('container').appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(70,this.width/this.height,0.001,1000);
        this.camera.position.set(0,0,200);
        this.raycaster = new THREE.Raycaster();
    //    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
       this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        this.time = 0;
        this.paused = false;
        this.loadedModel;
        this.loader = new GLTFLoader();
        let that = this;
        this.loader.load(
            '../public/beyonce.glb',
            function ( glb ) {
        // that.scene.add(glb.scene)
       let geo = new THREE.BufferGeometry();
       
      let bBox = geo.computeBoundingBox();
    
let pos = glb.scene.children[0].geometry.attributes.position.array;
     geo.setAttribute('position', new THREE.BufferAttribute(pos,3))
     that.pointsMesh = new THREE.Points(geo,that.material);
      that.scene.add(that.pointsMesh);
            },
            undefined,
           function(e){
            console.log(e)
           }
        );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width,this.height);
        this.renderer.setClearColor(0x272526, 1);
        this.scene.add(this.camera)

      this.materialShader = new THREE.ShaderMaterial({
        extensions:{
            derivatives:"#extension GL_OES_standart_derivatives : enable"
        },
        side:THREE.DoubleSide,
            uniforms: {
                mousePos:{type:'v3',value:new THREE.Vector3(0,0,0)},
                //mousePos:{type:'v3',value:null},
                // mousePressed:{type:'f',value:0},
                // move:{type:'f',value:0},
                time:{type:'f',value:0},
                pixels:{
                    type:"v2",
                    value:new THREE.Vector2(this.width,this.height)
                },
                uvRate1:{
                    value:new THREE.Vector2(1,1)
                },
                wireframe:true,
                vertexShader:
                `uniform float time;
                varying vec4 vPosition;
                
                uniform sampler2D texture1;
                uniform sampler2D texture2;
                uniform vec2 pixels;
                uniform vec2 uvRate1;
                uniform vec3 mousePos;

                vec4 mod289(vec4 x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0; }
                  
                  float mod289(float x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0; }
                  
                  vec4 permute(vec4 x) {
                       return mod289(((x*34.0)+1.0)*x);
                  }
                  
                  float permute(float x) {
                       return mod289(((x*34.0)+1.0)*x);
                  }
                  
                  vec4 taylorInvSqrt(vec4 r)
                  {
                    return 1.79284291400159 - 0.85373472095314 * r;
                  }
                  
                  float taylorInvSqrt(float r)
                  {
                    return 1.79284291400159 - 0.85373472095314 * r;
                  }
                  
                  vec4 grad4(float j, vec4 ip)
                    {
                    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
                    vec4 p,s;
                  
                    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
                    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
                    s = vec4(lessThan(p, vec4(0.0)));
                    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
                  
                    return p;
                    }
                  
                  // (sqrt(5) - 1)/4 = F4, used once below
                  #define F4 0.309016994374947451
                  
                  float snoise(vec4 v)
                    {
                    const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                                          0.276393202250021,  // 2 * G4
                                          0.414589803375032,  // 3 * G4
                                         -0.447213595499958); // -1 + 4 * G4
                  
                  // First corner
                    vec4 i  = floor(v + dot(v, vec4(F4)) );
                    vec4 x0 = v -   i + dot(i, C.xxxx);
                  
                  // Other corners
                  
                  // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
                    vec4 i0;
                    vec3 isX = step( x0.yzw, x0.xxx );
                    vec3 isYZ = step( x0.zww, x0.yyz );
                  //  i0.x = dot( isX, vec3( 1.0 ) );
                    i0.x = isX.x + isX.y + isX.z;
                    i0.yzw = 1.0 - isX;
                  //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
                    i0.y += isYZ.x + isYZ.y;
                    i0.zw += 1.0 - isYZ.xy;
                    i0.z += isYZ.z;
                    i0.w += 1.0 - isYZ.z;
                  
                    // i0 now contains the unique values 0,1,2,3 in each channel
                    vec4 i3 = clamp( i0, 0.0, 1.0 );
                    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
                    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
                  
                    //  x0 = x0 - 0.0 + 0.0 * C.xxxx
                    //  x1 = x0 - i1  + 1.0 * C.xxxx
                    //  x2 = x0 - i2  + 2.0 * C.xxxx
                    //  x3 = x0 - i3  + 3.0 * C.xxxx
                    //  x4 = x0 - 1.0 + 4.0 * C.xxxx
                    vec4 x1 = x0 - i1 + C.xxxx;
                    vec4 x2 = x0 - i2 + C.yyyy;
                    vec4 x3 = x0 - i3 + C.zzzz;
                    vec4 x4 = x0 + C.wwww;
                  
                  // Permutations
                    i = mod289(i);
                    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
                    vec4 j1 = permute( permute( permute( permute (
                               i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                             + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                             + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
                             + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
                  
                  // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
                  // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
                    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
                  
                    vec4 p0 = grad4(j0,   ip);
                    vec4 p1 = grad4(j1.x, ip);
                    vec4 p2 = grad4(j1.y, ip);
                    vec4 p3 = grad4(j1.z, ip);
                    vec4 p4 = grad4(j1.w, ip);
                  
                  // Normalise gradients
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;
                    p4 *= taylorInvSqrt(dot(p4,p4));
                  
                  // Mix contributions from the five corners
                    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
                    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
                    m0 = m0 * m0;
                    m1 = m1 * m1;
                    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                                 + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
                  
                    }
                  
                void main(){
                    float distance = 100.;
                vec3 newpos = position;
                vec3 noisePos
                // vec3 newpos = 100.*curlNoise(position);
             noisePos.x = 300.*snoise(vec4(position.x, position.y, position.z, time/10.));
             noisePos.y = newpos.y + 10.*snoise(vec4(position.x, position.y, position.z, time/10.));
             noisePos.z = 300.*snoise(vec4(position.x*0.5., position.y*0.5., position.z*0.5., time/10.));
                 if(length(position - mousePos)<distance){
                    float koef = length(position - mousePos/)/distance;
                    koef = sqrt(koef);
                    // newpos *= vec3(1.+ koef,1.,2. + koef);
                    newpos = mix(newpos,noisePos,1. - koef);
                };
                vec4 mvPosition = modelViewMatrix * vec4(newpos,1.);
                 gl_pointSize = 500. * (1. / - mvPosition.z);
                 gl_Position = projectionMatrix * mvPosition;
                }`,
                // vertexShader:vertex,
                fragmentShader:`
                varying vec3 eye;
                varying vec3 vNormal;
                varying vec3 vReflect;
                
                uniform float time;
                uniform float progress;
                uniform sampler2D texture1;
                uniform sampler2d texture2;
                varying vec2 pixels;
                varying vec2 uvRate1;
                varying vec2 accel;
                varying vec4 vPosition;
                
                
                void main()	{
                gl_FragColor = vec4(0.728,0.592,0.677,1.);
                }`,
            },
        });
     this.geometry = new THREE.PlaneGeometry( 400,600,1,1 );
	this.plane = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({color:0x00ff00,visible:false}));
	this.scene.add(this.plane)
	// this.scene.add( this.mesh );

// this.addObjects;
// this.addMesh();
// this.setupResize;
// this.resize;
this.time = 0;
this.mouse();
this.render();


}
stop(){
    this.paused = true;
}
play(){
    this.paused = false;
    this.render()
}
mouse(){
    this.mouse = new THREE.Vector2();
    let that = this;

    function onMouseMove(event){
        that.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        that.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
    window.addEventListener('mousemove',onMouseMove,false);
}

render() {
    // if(this.paused) return;
    // this.time += 0.05;
    this.materialShader.uniforms.time.value = this.time;
    if(this.pointsMesh){
        this.pointsMesh.rotation.y += 0.01;
    }


//    requestAnimationFrame(this.render);
this.raycaster.setFromCamera(this.mouse,this.camera);
this.intersects = this.raycaster.intersectObjects([this.plane]);
if(this.intersects.length>0){
    this.materialShader.uniforms.mousePos.value = this.intersects[0].point;
    // console.log('WE HAVE A SITUATION HERE');
    // console.log(this.intersects[0].point);
}
// for(let i=0; i<this.intersects.length; i++){
//     intersects[i].object.material.color.set(0xff0000);
// }

   this.time++;
   this.controls.update();
	// this.mesh.rotation.x +=0.01;
	// this.mesh.rotation.y +=0.02;
	this.renderer.render( this.scene, this.camera );
	window.requestAnimationFrame(this.render.bind(this))
}
}


new Sketch();