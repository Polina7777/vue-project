import * as THREE from 'three';

			import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

			import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
			let camera, scene, renderer;

	        let object = [];

			init();


			function init() {

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );
				camera.position.z = 2.5;
                //let object;
				// scene
            
				scene = new THREE.Scene();

				const ambientLight = new THREE.AmbientLight( 0xffffff );
				scene.add( ambientLight );

				const pointLight = new THREE.PointLight( 0xffffff, 15 );
				camera.add( pointLight );
				scene.add( camera );

				// manager


				// model

				function onProgress( xhr ) {

					if ( xhr.lengthComputable ) {

						const percentComplete = xhr.loaded / xhr.total * 100;
						console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

					}

				}

				// function onError() {}
                function onError(){
                    console.log('error')
                }

                const manager = new THREE.LoadingManager( loadModel );
				const loader = new GLTFLoader( manager );
				loader.load( '../../public/cheeseburger.glb', function ( obj ) {
                   
					object = obj;
        
				}, onProgress, onError );

				//
                function loadModel() {
                 if(object.length){
                    object.traverse( function ( child ) {

						if ( child.isMesh ) child.material.map = texture;

					} );

					// object.position.y = - 0.95;
					// object.scale.setScalar( 0.01 );
                    console.log(object)
					scene.add( object );

					render();
                 }
				

				}

	

				// texture

				const textureLoader = new THREE.TextureLoader( manager );
				const texture = textureLoader.load( '../../public/texture.jpg', render );
				texture.colorSpace =  THREE.SRGBColorSpace;

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				//

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 2;
				controls.maxDistance = 5;
				controls.addEventListener( 'change', render );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function render() {

				renderer.render( scene, camera );

			}
