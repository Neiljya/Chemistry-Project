
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let object;
let controls;
let objToRender = 'hcl';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/scene.glb`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // If there is an error, log it
    console.error(error);
  }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true makes a transparent background
renderer.setSize(window.innerWidth, window.innerHeight);


document.getElementById("container3D").appendChild(renderer.domElement);
camera.position.z = objToRender === "hcl" ? 25 : 500;

// Setting up Lighting
const topLight = new THREE.DirectionalLight(0xffffff, 1); 
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "hcl" ? 5 : 1);
scene.add(ambientLight);

// Setting up controls
if (objToRender === "hcl") {
  controls = new OrbitControls(camera, renderer.domElement);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);

}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


animate();


// buttons

const widgets = document.querySelectorAll('.widget');
widgets.forEach(widget => {
    widget.addEventListener('click', () => {
        document.getElementById('popup').style.display = 'block';
    });
});

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Add event listener for close button
document.querySelector('.popup button').addEventListener('click', closePopup);

document.querySelectorAll('.widget').forEach(widget => {
    widget.addEventListener('click', () => {
        const targetPopup = document.getElementById(widget.getAttribute('data-target'));
        targetPopup.classList.add('show');
        targetPopup.classList.remove('hide'); // Ensure any 'hide' class is removed if previously added
    });
});

document.querySelectorAll('.popup .close-button').forEach(button => {
    button.addEventListener('click', () => {
        const popup = button.closest('.popup');
        popup.classList.add('hide');
        popup.classList.remove('show');
        // Wait for animation to finish before setting display none
        popup.addEventListener('animationend', () => {
            if (popup.classList.contains('hide')) {
                popup.style.display = 'none';
                popup.classList.remove('hide'); // Reset class to avoid blocking further animations
            }
        }, {once: true});
    });
});
