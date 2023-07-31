import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import { gsap } from 'gsap';
// import vertex from './shader/vertex.glsl';
// import fragment from './shader/fragment.glsl';



export default class Sketch{
    constructor(){
        this.scene = new THREE.Scene();
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize( this.width, this.height);
        this.renderer.setClearColor(0x272526,1);
        document.getElementById('container').appendChild(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
        this.camera = new THREE.PerspectiveCamera(70,this.width/this.height,0.001,1000);
        this.camera.position.set(0,0,400);
        this.camera.aspect = this.width/this.height;
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.time = 0;
       this.paused = false;
       this.textureCoordinates=[];
        this.loader = new GLTFLoader();


        this.directionallLight = new THREE.DirectionalLight(0xFFFFFF,1);
        this.scene.add(this.directionallLight);
        this.directionallLight.position.set(2, 2, 5);
        this.directionallLight.castShadow = true;
        this.directionallLight.shadow.camera.bottom = -12;
        // controls.update();
        this.textures =[
            new THREE.TextureLoader().load("../public/cheeseburger.glb"),
          ]

this.material1 = new THREE.ShaderMaterial({
    extensions:{
        derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side:THREE.DoubleSide,
        uniforms: {
            mousePos:{type:'v3',value: new THREE.Vector3(0,0,0)},
            time:{type:'f',value:0},
            texture3:{type:'t',value:this.textures[0]},
            pixels:{
                type:"v2",
                value:new THREE.Vector2(this.width,this.height)
            },
            uvRate1:{
                value:new THREE.Vector2(1,1)
            },
            // wireframe:true,
          },
          depthTest: false,
            // wireframe:true,
            vertexShader:
            `uniform float time;
            varying vec4 vPosition;

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
            fragmentShader:`
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
            }`,
        // },
    });
 this.material2 = new THREE.ShaderMaterial({
        extensions:{
            derivatives: "#extension GL_OES_standard_derivatives : enable"
        },
        side:THREE.DoubleSide,
            uniforms: {
                mousePos:{type:'v3',value: new THREE.Vector3(0,0,0)},
                time:{type:'f',value:0},
                texture3:{type:'t',value:this.textures[0]},
                pixels:{
                    type:"v2",
                    value:new THREE.Vector2(this.width,this.height)
                },
                uvRate1:{
                    value:new THREE.Vector2(1,1)
                },
                // wireframe:true,
              },
              depthTest: false,
                // wireframe:true,
                vertexShader:
                `uniform float time;
                varying vec4 vPosition;
    
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
                newpos.y -=  0.14 ;
             
    
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
                //      newpos = mix(newpos,noisePos,1. - koef);
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
                fragmentShader:`
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
                }`,
            // },
        });
 this.material3 = new THREE.ShaderMaterial({
            extensions:{
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side:THREE.DoubleSide,
                uniforms: {
                    mousePos:{type:'v3',value: new THREE.Vector3(0,0,0)},
                    time:{type:'f',value:0},
                    texture3:{type:'t',value:this.textures[0]},
                    pixels:{
                        type:"v2",
                        value:new THREE.Vector2(this.width,this.height)
                    },
                    uvRate1:{
                        value:new THREE.Vector2(1,1)
                    },
                    // wireframe:true,
                  },
                  depthTest: false,
                    // wireframe:true,
                    vertexShader:
                    `uniform float time;
                    varying vec4 vPosition;
        
                    uniform sampler2D texture1;
                    uniform sampler2D texture2;
                    //  uniform sampler3D texture3;
                    uniform vec2 pixels;
                    uniform vec2 uvRate1;
                    uniform vec3 mousePos;
                    
                    void main(){
                  float distance = 100.;
                    vec3 newpos = position;
        
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
                    //      newpos = mix(newpos,noisePos,1. - koef);
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
                    fragmentShader:`
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
                    }`,
                // },
            });
        this.example = new THREE.Object3D();
        this.loader.setDRACOLoader();
         let that = this;
        this.loader.load(
            '../public/cheeseburger.glb',
            function ( glb ) {
                glb.scene.traverse(function(child){
                    if(child.isMesh){
                        // child.material = mat;
                        // child.material.wireframe = true;
                    }
                })
                console.log(glb)
                that.food = glb.scene.children[0];
                that.food.position.set(50,50,0)
                that.food.scale.set(100, 100, 100);
                that.scene.add(glb.scene)
         let pos1 = glb.scene.children[0].children[0].geometry.attributes.position.array;
         let pos2 = glb.scene.children[0].children[1].geometry.attributes.position.array;
         let pos3 = glb.scene.children[0].children[2].geometry.attributes.position.array;
        //  let pos = new Float32Array([...pos1,...pos2,...pos3]);
        that.textureCoordinates = [...pos1,...pos2,...pos3];
        // console.log(pos)
          // let example = new THREE.Object3D();
        // loader.load(objects.exampleGLTF, function (object){
        //     example = object;
        //     scene.add(example);
        // });
        let geo1 = new THREE.BufferGeometry();
        let material1 = new THREE.PointsMaterial({ color: 0xdca241 } );
        geo1.setAttribute('position', new THREE.BufferAttribute(pos1,3))
        // that.pointsMesh1 = new THREE.Points(geo1,that.materialMat1);
        that.pointsMesh1 = new THREE.Points(geo1,that.material1);
        that.pointsMesh1.position.set( 0, 0.15, 0 );
        that.pointsMesh1.rotation.z = Math.PI;


        let geo2 = new THREE.BufferGeometry();
        let material2 = new THREE.PointsMaterial({ color: 0xdca241 } );
        geo2.setAttribute('position', new THREE.BufferAttribute(pos2,3))
        // that.pointsMesh2 = new THREE.Points(geo2,material2);
        that.pointsMesh2 = new THREE.Points(geo2,that.material2);
        that.pointsMesh2.position.set( 0, 0.5, 0 );
        let geo3 = new THREE.BufferGeometry();

        let material3 = new THREE.PointsMaterial({ color: 0xefd141 } );
        geo3.setAttribute('position', new THREE.BufferAttribute(pos3,3))
        // that.pointsMesh3 = new THREE.Points(geo3,material3);
        that.pointsMesh3 = new THREE.Points(geo3,that.material3);
        that.pointsMesh2.position.set( 0, -0.15, 0 );

        that.object = new THREE.Object3D();
        that.object.scale.set(100, 100, 100);

that.object.add(that.pointsMesh3);
that.object.add(that.pointsMesh2);
that.object.add(that.pointsMesh1);
// console.log(that.object)

that.object.rotation.z = Math.PI;
//  that.scene.add(that.object)


that.final = new THREE.Group();
// that.finalGeo = new THREE.BufferGeometry();
// let pos = new Float32Array([...pos1,...pos2,...pos3]);
// that.finalGeo.setAttribute('position', new THREE.BufferAttribute(pos,3))
//  that.final = new THREE.Points(that.finalGeo,that.material);
 that.final.add(that.object)

that.scene.add(that.final)
console.log(that.final)

            },
            undefined,
           function(e){
            console.log(e)
           }
        );

    
 this.setupResize();
 this.resize();
//  this.createParticles()
 this.addObjects();
this.time = 0;
this.mouse();
this.render();
 }

//  createParticles() {
//     console.log(this.textureCoordinates)
//    this.geometry = new THREE.BufferGeometry();
// //    this.material = new THREE.PointsMaterial({
// //         color: 0xff0000,
// //         size: 2
// //     });
//     this.vertices = [];
//     for (let i = 0; i < this.textureCoordinates.length; i ++) {
//         this.vertices.push(this.textureCoordinates[i].x, this.textureCoordinates[i].y, 5 * Math.random());
//     }
//     this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
//    this.particles = new THREE.Points(this.geometry, this.material);
//    console.log(this.particles)
//     this.scene.add(this.particles);
// }
setupResize(){
  window.addEventListener("resize",this.resize.bind(this));
}
resize(){
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.renderer.setSize(this.width,this.height);
  this.camera.aspect = this.width/this.height;
  this.camera.updateProjectionMatrix();
}
addObjects(){

// this.textures =[
//     new THREE.TextureLoader().load("../public/cheeseburger.glb"),
//   ]
  // let that = this;
//   this.material = new THREE.ShaderMaterial({
//     extensions:{
//         derivatives: "#extension GL_OES_standard_derivatives : enable"
//     },
//     side:THREE.DoubleSide,
//         uniforms: {
//             mousePos:{type:'v3',value: new THREE.Vector3(0,0,0)},
//             time:{type:'f',value:0},
//             texture3:{type:'t',value:this.textures[0]},
//             pixels:{
//                 type:"v2",
//                 value:new THREE.Vector2(this.width,this.height)
//             },
//             uvRate1:{
//                 value:new THREE.Vector2(1,1)
//             },
//             // wireframe:true,
//           },
//           depthTest: false,
//             // wireframe:true,
//             vertexShader:
//             `uniform float time;
//             varying vec4 vPosition;

//             uniform sampler2D texture1;
//             uniform sampler2D texture2;
//             // uniform sampler3D texture3;
//             uniform vec2 pixels;
//             uniform vec2 uvRate1;
//             uniform vec3 mousePos;

//             vec4 mod289(vec4 x)
//             {
//               return x - floor(x * (1.0 / 289.0)) * 289.0;
//             }
            
//             vec4 permute(vec4 x)
//             {
//               return mod289(((x*34.0)+1.0)*x);
//             }
            
//             vec4 taylorInvSqrt(vec4 r)
//             {
//               return 1.79284291400159 - 0.85373472095314 * r;
//             }
            
//             vec4 fade(vec4 t) {
//               return t*t*t*(t*(t*6.0-15.0)+10.0);
//             }
            
//             // Classic Perlin noise
//             float cnoise(vec4 P)
//             {
//               vec4 Pi0 = floor(P); // Integer part for indexing
//               vec4 Pi1 = Pi0 + 1.0; // Integer part + 1
//               Pi0 = mod289(Pi0);
//               Pi1 = mod289(Pi1);
//               vec4 Pf0 = fract(P); // Fractional part for interpolation
//               vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
//               vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
//               vec4 iy = vec4(Pi0.yy, Pi1.yy);
//               vec4 iz0 = vec4(Pi0.zzzz);
//               vec4 iz1 = vec4(Pi1.zzzz);
//               vec4 iw0 = vec4(Pi0.wwww);
//               vec4 iw1 = vec4(Pi1.wwww);
            
//               vec4 ixy = permute(permute(ix) + iy);
//               vec4 ixy0 = permute(ixy + iz0);
//               vec4 ixy1 = permute(ixy + iz1);
//               vec4 ixy00 = permute(ixy0 + iw0);
//               vec4 ixy01 = permute(ixy0 + iw1);
//               vec4 ixy10 = permute(ixy1 + iw0);
//               vec4 ixy11 = permute(ixy1 + iw1);
            
//               vec4 gx00 = ixy00 * (1.0 / 7.0);
//               vec4 gy00 = floor(gx00) * (1.0 / 7.0);
//               vec4 gz00 = floor(gy00) * (1.0 / 6.0);
//               gx00 = fract(gx00) - 0.5;
//               gy00 = fract(gy00) - 0.5;
//               gz00 = fract(gz00) - 0.5;
//               vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
//               vec4 sw00 = step(gw00, vec4(0.0));
//               gx00 -= sw00 * (step(0.0, gx00) - 0.5);
//               gy00 -= sw00 * (step(0.0, gy00) - 0.5);
            
//               vec4 gx01 = ixy01 * (1.0 / 7.0);
//               vec4 gy01 = floor(gx01) * (1.0 / 7.0);
//               vec4 gz01 = floor(gy01) * (1.0 / 6.0);
//               gx01 = fract(gx01) - 0.5;
//               gy01 = fract(gy01) - 0.5;
//               gz01 = fract(gz01) - 0.5;
//               vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
//               vec4 sw01 = step(gw01, vec4(0.0));
//               gx01 -= sw01 * (step(0.0, gx01) - 0.5);
//               gy01 -= sw01 * (step(0.0, gy01) - 0.5);
            
//               vec4 gx10 = ixy10 * (1.0 / 7.0);
//               vec4 gy10 = floor(gx10) * (1.0 / 7.0);
//               vec4 gz10 = floor(gy10) * (1.0 / 6.0);
//               gx10 = fract(gx10) - 0.5;
//               gy10 = fract(gy10) - 0.5;
//               gz10 = fract(gz10) - 0.5;
//               vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
//               vec4 sw10 = step(gw10, vec4(0.0));
//               gx10 -= sw10 * (step(0.0, gx10) - 0.5);
//               gy10 -= sw10 * (step(0.0, gy10) - 0.5);
            
//               vec4 gx11 = ixy11 * (1.0 / 7.0);
//               vec4 gy11 = floor(gx11) * (1.0 / 7.0);
//               vec4 gz11 = floor(gy11) * (1.0 / 6.0);
//               gx11 = fract(gx11) - 0.5;
//               gy11 = fract(gy11) - 0.5;
//               gz11 = fract(gz11) - 0.5;
//               vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
//               vec4 sw11 = step(gw11, vec4(0.0));
//               gx11 -= sw11 * (step(0.0, gx11) - 0.5);
//               gy11 -= sw11 * (step(0.0, gy11) - 0.5);
            
//               vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
//               vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
//               vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
//               vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
//               vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
//               vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
//               vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
//               vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
//               vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
//               vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
//               vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
//               vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
//               vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
//               vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
//               vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
//               vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);
            
//               vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
//               g0000 *= norm00.x;
//               g0100 *= norm00.y;
//               g1000 *= norm00.z;
//               g1100 *= norm00.w;
            
//               vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
//               g0001 *= norm01.x;
//               g0101 *= norm01.y;
//               g1001 *= norm01.z;
//               g1101 *= norm01.w;
            
//               vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
//               g0010 *= norm10.x;
//               g0110 *= norm10.y;
//               g1010 *= norm10.z;
//               g1110 *= norm10.w;
            
//               vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
//               g0011 *= norm11.x;
//               g0111 *= norm11.y;
//               g1011 *= norm11.z;
//               g1111 *= norm11.w;
            
//               float n0000 = dot(g0000, Pf0);
//               float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
//               float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
//               float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
//               float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
//               float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
//               float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
//               float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
//               float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
//               float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
//               float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
//               float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
//               float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
//               float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
//               float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
//               float n1111 = dot(g1111, Pf1);
            
//               vec4 fade_xyzw = fade(Pf0);
//               vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
//               vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
//               vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
//               vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
//               float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
//               return 2.2 * n_xyzw;
//             }
            
              
//             void main(){
//                 float distance = 50.;
//             vec3 newpos = position;
//             vec3 noisePos;
//             // vec3 newpos = 100.*curlNoise(position);
//          noisePos.x = 1.*cnoise(vec4(position.x, position.y, position.z, time/10.));
//          noisePos.y = newpos.y *cnoise(vec4(position.x, position.y, position.z, time/10.));
//          noisePos.z = 1.*cnoise(vec4(position.x*0.1, position.y*0.1, position.z*0.1, time/10.));
    
//              if(length(position - mousePos)<distance){
//                 float koef = length(position - mousePos)/distance;
//                 koef = sqrt(koef);
//                 // newpos *= vec3(1.+ koef,1.,2. + koef);
//                 newpos = mix(newpos,noisePos,1. - koef);
//             };
//             vec4 mvPosition = modelViewMatrix * vec4(newpos,1.);
//             gl_PointSize = 500. * (1. / - mvPosition.z );
//              gl_Position = projectionMatrix * mvPosition;
//             }`,
//             fragmentShader:`
//             precision highp float; 
//             // precision mediump sampler3D;
//             precision highp int;
//             varying vec3 eye;
//             varying vec3 vNormal; 
//             varying vec3 vReflect;
//             varying vec2 vCoordinates;
//             uniform float time;
//             uniform float progress;
//             uniform sampler2D texture1;
//             uniform sampler2D texture2;
//             // uniform sampler3D tex3D;
//             varying vec2 pixels;
//             varying vec2 uvRate1;
//             varying vec2 accel;
//             varying vec4 vPosition;
//             void main()	{
//         //    vec2 myUV = vec2(200.);
//         //   mediump vec3 image = texture3D(tex3D, myUV);
//         //    vec4 image = texture3D(Texture,myUV);
//         //    mediump vec4 v3 = texture(Texture, myUV);
//        // vec4 image = texture3D(Texture,myUV);
//     //    gl_FragColor = vec4(cnoise3(position), 1.0);
//             gl_FragColor = vec4(0.728,0.592,0.677,1.);
//             }`,
//         // },
//     });
    // this.geometry = new THREE.PlaneGeometry( 400,600,1,1 );
    // this.points = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.points)
    this.geometry = new THREE.PlaneGeometry( 130,80,1,1 );
    this.plane = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({color:0x00ff00,visible:false}));
    // console.log(this.plane)
    this.scene.add(this.plane);
    
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
//   if(this.paused) return;
//    this.time += 0.05;
 this.material1.uniforms.time.value = this.time;
 this.material2.uniforms.time.value = this.time;
 this.material3.uniforms.time.value = this.time;
  if(this.pointsMesh){
      this.pointsMesh.rotation.y += 0.01;
  }

    //  requestAnimationFrame(this.render);
this.raycaster.setFromCamera(this.mouse,this.camera);
this.intersects = this.raycaster.intersectObjects([this.plane]);
if(this.intersects.length>0){
  this.material1.uniforms.mousePos.value = this.intersects[0].point;
  this.material2.uniforms.mousePos.value = this.intersects[0].point;
  this.material3.uniforms.mousePos.value = this.intersects[0].point;
  console.log('HERE')
}
for(let i=0; i<this.intersects.length; i++){
    this.intersects[i].object.material.color.set(0xff0000);
}

 this.time++;
 this.controls.update();
// this.mesh.rotation.x +=0.01;
// this.mesh.rotation.y +=0.02;
  this.renderer.render( this.scene, this.camera );
window.requestAnimationFrame(this.render.bind(this))
}

}

new Sketch();