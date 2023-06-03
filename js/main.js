//Import THREE.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import {RGBELoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';
import {STLExporter} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/STLExporter.js';


const scene = new THREE.Scene();

// Background
//scene.background = new THREE.TextureLoader().load('/assets/Img/three/fondo.png');

// Camara
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(
  0,
  0,
  13
);

// Render
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
/* renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1; */
document.body.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.enableChangeTarget = false;
controls.enableTilt = false;
controls.minPolarAngle = Math.PI / 5;
controls.maxPolarAngle = Math.PI / 2; 
controls.update();

/* //CargarHDR
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/assets/roblox.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});  */

// Importacion de modelos
const gltfLoader = new GLTFLoader();
function cargarModelo(url) {
  gltfLoader.load(url, function (gltf) {
      let model = gltf.scene;
      scene.add(model);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error(error);
    }
  );
}

// Agregar render a div
document.getElementById("container3D").appendChild(renderer.domElement);

//Render the scene
function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Auto size de la scena
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  console.log(scene)
});


// Luces
var light = new THREE.AmbientLight( 0xffffff );
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-100, 0, 500);
spotLight.intensity = 0.25; 
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
light.add(spotLight);
var spotLightReverse = new THREE.SpotLight(0xffffff);
spotLightReverse.intensity = 0.25; 
spotLightReverse.position.set(100, 0, -500);
spotLightReverse.castShadow = true;
spotLightReverse.shadow.mapSize.width = 1024;
spotLightReverse.shadow.mapSize.height = 1024;
spotLightReverse.shadow.camera.near = 500;
spotLightReverse.shadow.camera.far = 4000;
spotLightReverse.shadow.camera.fov = 30;
light.add(spotLightReverse);
scene.add(light)

// Iniciar renderizacion 
animate();

//Exportador stl
const exporter = new STLExporter();
var exportButton = document.getElementById('download.stl');
exportButton.addEventListener('click', function() {
    //let base = scene.getObjectByName('base');
    //scene.remove(base.parent);
    var stlData = exporter.parse(scene);
    var link = document.createElement('a');
    link.href = 'data:application/octet-stream,' + encodeURIComponent(stlData);
    link.download = 'mi_monono.stl';
    link.click();
    //scene.add(base)
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
  scene.getObjectByName('Merged_polySurface2_7').material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('/assets/models/image.png')
  })
  /* scene.getObjectByName('polySurface5').material.metalnessMap = new THREE.TextureLoader().load('/assets/models/viejo/textures/testlow_polySurface5_Metallic.png');
  scene.getObjectByName('polySurface5').material.roughness = new THREE.TextureLoader().load('/assets/models/viejo/textures/testlow_polySurface5_Roughness.png');
  scene.getObjectByName('polySurface5').material.map.repeat.y = -1; // Invierte la textura verticalmente
  scene.getObjectByName('polySurface5').material.map.wrapT = THREE.RepeatWrapping; // Habilita el envoltorio de repetición vertical */ 
})

//cargarModelo('/assets/models/cabeza.gltf');
cargarModelo('/assets/cuerpofinal.gltf');