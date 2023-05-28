//Import the THREE.js librarys
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import {RGBELoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';
import {STLExporter} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/STLExporter.js';

//Create a Three.JS Scene
const scene = new THREE.Scene();

// Background
const textureBG = new THREE.TextureLoader().load('/assets/Img/three/fondo.png');
scene.background = textureBG; 

// create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(
  -0.35823489125295016,
  3.1498296464322113,
  14.725779301728066
);

// Render
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
//controls.enableZoom = false;
controls.enableChangeTarget = false;
controls.enableTilt = false;
controls.minPolarAngle = Math.PI / 5;
controls.maxPolarAngle = Math.PI / 2; 
controls.update();

//CargarHDR
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/assets/unity.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
}); 


// Importacion de modelos
const gltfLoader = new GLTFLoader();
function cargarModelo(url) {
  //Load the file
  gltfLoader.load(url,
    function (gltf) {
      //If the file is loaded, add it to the scene
      let model = gltf.scene;
      scene.add(model);
    },
    function (xhr) {
      //While it is loading, log the progress
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      //If there is an error, log it
      console.error(error);
    }
  );
}

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Render the scene
function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  console.log(scene)
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight); 
const topLight2 = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight2.position.set(-500, 500, -500); // Cambia la posición a la parte trasera
topLight2.castShadow = true;
scene.add(topLight2);

//Start the 3D rendering
animate();

//Exportador stl
const exporter = new STLExporter();
var exportButton = document.getElementById('download.stl');
exportButton.addEventListener('click', function() {
    scene.remove(base);
    var stlData = exporter.parse(scene);
    var link = document.createElement('a');
    link.href = 'data:application/octet-stream,' + encodeURIComponent(stlData);
    link.download = 'mi_monono.stl';
    link.click();
    scene.add(base);
});

var cambiarAccesorio = document.getElementById('cambiarAccesorio');
let aux = true;
cambiarAccesorio.addEventListener('click', function() {
    if (aux) {
        cargarModelo('/assets/models/monono/gorra.gltf');
        aux = false;
    } else {
        scene.remove(scene.getObjectByName('pCylinder1').parent);
        aux = true;
    }
})



var cambiarMaterial = document.getElementById('cambiarMaterial');
cambiarMaterial.addEventListener('click', function(){
    /*scene.getObjectByName('cuerpo').material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('/assets/models/monono/textures/image.png'),
    });*/
    scene.getObjectByName('cuerpo').material = new THREE.MeshStandardMaterial({ color: 0xd9b59c, });
    scene.getObjectByName('cara').material = new THREE.MeshStandardMaterial({ color: 0xd9b59c, });
    scene.getObjectByName('pelo').material = new THREE.MeshStandardMaterial({ color: 0x964B00 , });
    scene.getObjectByName('zapas').material = new THREE.MeshStandardMaterial({ color: 0x000000, });
    //scene.getObjectByName('cuerpo').material.map.repeat.y = -1; // Invierte la textura verticalmente
    //scene.getObjectByName('cuerpo').material.map.wrapT = THREE.RepeatWrapping; // Habilita el envoltorio de repetición vertical
    /* ejemplo de poner maps
    object.getObjectByName('polySurface5').material.metalnessMap = new THREE.TextureLoader().load('/assets/models/viejo/textures/testlow_polySurface5_Metallic.png');
    object.getObjectByName('polySurface5').material.roughness = new THREE.TextureLoader().load('/assets/models/viejo/textures/testlow_polySurface5_Roughness.png');*/
})

cargarModelo('/assets/models/monono/base.gltf');
cargarModelo('/assets/models/monono/cabeza.gltf');
cargarModelo('/assets/models/monono/cuerpo.gltf');
cargarModelo('/assets/models/monono/pelo.gltf');
cargarModelo('/assets/models/monono/zapas.gltf');