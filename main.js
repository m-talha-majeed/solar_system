import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h);
const renderer = new THREE.WebGLRenderer();
const { finalComposer, bloomComposer, bloomBlendPass } = setupBloomComposers(renderer, scene, camera, w, h);

renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

getAmbientLight(0xffffff, 3, scene);
settingPlanets();

setBackground('./planet-models/klop.exr');
camera.position.z = 1000;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const planets = [
  { name: 'Mercury', radius: 200, speed: 0.004 },
  { name: 'Venus',   radius: 270, speed: 0.003 },
  { name: 'Earth',   radius: 375, speed: 0.002 },
  { name: 'Mars',    radius: 480, speed: 0.0017 },
  { name: 'Jupiter', radius: 600, speed: 0.0013 },
  { name: 'Saturn',  radius: 800, speed: 0.001 },
  { name: 'Uranus',  radius: 1000, speed: 0.0007 },
  { name: 'Neptune', radius: 1150, speed: 0.0005 }
];
planets.forEach(p => p.angle = Math.random() * Math.PI * 2);

function animate() {
  requestAnimationFrame(animate);

  planets.forEach(planet => {
    const obj = scene.getObjectByName(planet.name);
    if (obj) {
      planet.angle += planet.speed;
      obj.position.x = Math.cos(planet.angle) * planet.radius;
      obj.position.z = Math.sin(planet.angle) * planet.radius;
      obj.position.y = 0;
      obj.rotation.y += 0.01;
    }
  });

  controls.update();

  const originalBackground = scene.background;
  scene.background = null; 
  bloomComposer.render();
  scene.background = originalBackground; 

  bloomBlendPass.uniforms.bloomTexture.value = bloomComposer.renderTarget2.texture;
  finalComposer.render();
}
animate();

// Functions to create lights in the scene
function getAmbientLight(color, intensity, scene) {
  const light = new THREE.AmbientLight(color, intensity); 
  scene.add(light);
}

function getDirectionalLight(color, intensity, scene) {
  const light = new THREE.DirectionalLight(color, intensity);
  scene.add(light);
  light.position.set(1, 1, 1).normalize();
  light.castShadow = false;
}

// Handle mouse click events to select planets
const raycaster = new THREE.Raycaster();
document.addEventListener('mousedown', onMouseDown);

function onMouseDown(event) {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
  );
  raycaster.setFromCamera(coords, camera);
  const intersections = raycaster.intersectObjects(scene.children, true);
  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;
    console.log(`${selectedObject.name} was clicked!`);
  }
}

// Functions to load the Planet models
function settingPlanets() {
    getEarth();
    getMercury();
    getVenus();
    getMars();
    getJupiter();
    getSaturn();
    getUranus();
    getNeptune();
    getSun();
}

// Reusable function to load a planet model
function loadPlanet({
  modelPath,
  scale,
  position,
  name,
  emissiveColor,
  emissiveIntensity
}) {
  const gltfloader = new GLTFLoader();
  gltfloader.load(modelPath,
    function (gltf) {
      const planet = gltf.scene;
      planet.traverse(function (child) {
        if (child.isMesh) {
          child.name = name;
          if (child.material) {
            child.material.emissive = new THREE.Color(emissiveColor);
            child.material.emissiveIntensity = emissiveIntensity;
          }
        }
      });
      planet.scale.set(scale, scale, scale);
      planet.name = name;
      scene.add(planet);
      planet.position.set(...position);
    },
    undefined,
    function (error) {
      console.error(`Error loading ${name}:`, error);
    }
  );
}

function getEarth() {
  loadPlanet({
    modelPath: '/planet-models/Earth.glb',
    scale: 0.07,
    position: [390, 0, 0],
    name: 'Earth',
    emissiveColor: 0x3399ff,
    emissiveIntensity: 0.5
  });
}

function getMercury() {
  loadPlanet({
    modelPath: '/planet-models/Mercury.glb',
    scale: 0.05,
    position: [200, 0, 0],
    name: 'Mercury',
    emissiveColor: 0xaaaaaa,
    emissiveIntensity: 0.5
  });
}

function getVenus() {
  loadPlanet({
    modelPath: '/planet-models/Venus.glb',
    scale: 0.06,
    position: [270, 0, 0],
    name: 'Venus',
    emissiveColor: 0xffcc66,
    emissiveIntensity: 0.5
  });
}

function getMars() {
  loadPlanet({
    modelPath: '/planet-models/Mars.glb',
    scale: 0.055,
    position: [480, 0, 0],
    name: 'Mars',
    emissiveColor: 0xff3300,
    emissiveIntensity: 0.5
  });
}

function getJupiter() {
  loadPlanet({
    modelPath: '/planet-models/Jupiter.glb',
    scale: 0.12,
    position: [600, 0, 0],
    name: 'Jupiter',
    emissiveColor: 0xff9966,
    emissiveIntensity: 0.5
  });
}

function getSaturn() {
  loadPlanet({
    modelPath: '/planet-models/Saturn.glb',
    scale: 0.11,
    position: [800, 0, 0],
    name: 'Saturn',
    emissiveColor: 0xffff99,
    emissiveIntensity: 0.5
  });
}

function getUranus() {
  loadPlanet({
    modelPath: '/planet-models/Uranus.glb',
    scale: 0.09,
    position: [1000, 0, 0],
    name: 'Uranus',
    emissiveColor: 0x66ffff,
    emissiveIntensity: 0.5
  });
}

function getNeptune() {
  loadPlanet({
    modelPath: '/planet-models/Neptune.glb',
    scale: 0.085,
    position: [1150, 0, 0],
    name: 'Neptune',
    emissiveColor: 0x3333ff,
    emissiveIntensity: 0.5
  });
}

function getSun() {
  loadPlanet({
    modelPath: '/planet-models/Sun.glb',
    scale: 10,
    position: [0, 0, 0],
    name: 'Sun',
    emissiveColor: 0xffff00,
    emissiveIntensity: 3
  });
}

// Function to set the background texture of the scene
function setBackground(path) {
  const exrLoader = new EXRLoader();
  exrLoader.load(path, function(texture) {
    scene.background = texture;
  });
}
// Function to set up bloom composers
function setupBloomComposers(renderer, scene, camera, width, height) {
  const finalComposer = new EffectComposer(renderer);
  finalComposer.setSize(width, height);

  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.setSize(width, height);

  const renderPass = new RenderPass(scene, camera);
  bloomComposer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.5, 0.4, 0.1
  );
  bloomComposer.addPass(bloomPass);

  const finalPass = new RenderPass(scene, camera);
  finalComposer.addPass(finalPass);

  const bloomBlendShader = {
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: null }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D baseTexture;
      uniform sampler2D bloomTexture;
      varying vec2 vUv;
      void main() {
        gl_FragColor = texture2D(baseTexture, vUv) + texture2D(bloomTexture, vUv);
      }`
  };

  const bloomBlendPass = new ShaderPass(bloomBlendShader, 'baseTexture');
  bloomBlendPass.needsSwap = true;
  finalComposer.addPass(bloomBlendPass);

  return {
    finalComposer,
    bloomComposer,
    bloomBlendPass
  };
}

