import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';



const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h);

const renderer = new THREE.WebGLRenderer();
renderer.toneMappingExposure = 0.5;
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

setBackground('./planet-models/klop.exr');
AmbientLight(0xffffff, 3,scene);
DirectionalLight(0xffffff, 5,scene);
settingPlanets();


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

// Animation loop to update the positions of the planets
// This function is called repeatedly to animate the planets in their orbits.
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
  renderer.render(scene, camera);
}
animate();


// Functions to create lights in the scene
// These lights are added to the scene to illuminate the planets and enhance the 3D effect.
function AmbientLight(color, intensity,scene) {
  const light = new THREE.AmbientLight(color, intensity); 
  scene.add(light);
}
function DirectionalLight(color, intensity,scene) {
  const light = new THREE.DirectionalLight(color, intensity);
  scene.add(light);
  light.position.set(1, 1, 1).normalize();
  light.castShadow = false;
}


// Handle mouse click events to select planets
// This code allows you to click on planets and log their names to the console.
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
// Each function loads a specific planet model and adds it to the scene.
// The models are loaded using the GLTFLoader, and each planet is scaled and positioned accordingly

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
function getEarth(){
  let earth = null;

  const gltfloader = new GLTFLoader();
  gltfloader.load('/planet-models/Earth.glb',
    function (gltf) {
      earth = gltf.scene;
    
      earth.traverse(function (child) {
        if (child.isMesh) {
          child.name = 'Earth';
        }
      });
      earth.scale.set(0.07, 0.07, 0.07);
      earth.name = 'Earth';
      scene.add(earth);
      earth.position.set(390, 0, 0);

    },
    undefined,
    function (error) {
      console.error('Error loading model:', error);
    }
  );
  return earth;

}
function getMercury() {
  let mercury = null;
  const gltfloader = new GLTFLoader();
  gltfloader.load('/planet-models/Mercury.glb',
    function (gltf) {
      mercury = gltf.scene;
      mercury.traverse(function (child) {
        if (child.isMesh) {
          child.name = 'Mercury';
        }
      });
      mercury.scale.set(0.05, 0.05, 0.05);
      mercury.name = 'Mercury';
      scene.add(mercury);
      mercury.position.set(200, 0, 0);
    },
    undefined,
    function (error) {
      console.error('Error loading Mercury:', error);
    }
  );
  return mercury;
}

function getVenus() {
  let venus = null;
  const gltfloader = new GLTFLoader();
  gltfloader.load('/planet-models/Venus.glb',
    function (gltf) {
      venus = gltf.scene;
      venus.traverse(function (child) {
        if (child.isMesh) {
          child.name = 'Venus';
        }
      });
      venus.scale.set(0.06, 0.06, 0.06);
      venus.name = 'Venus';
      scene.add(venus);
      venus.position.set(270, 0, 0);
    },
    undefined,
    function (error) {
      console.error('Error loading Venus:', error);
    }
  );
  return venus;
}

function getMars() {
  let mars = null;
  const gltfloader = new GLTFLoader();
  gltfloader.load('/planet-models/Mars.glb',
    function (gltf) {
      mars = gltf.scene;
      mars.traverse(function (child) {
        if (child.isMesh) {
          child.name = 'Mars';
        }
      });
      mars.scale.set(0.055, 0.055, 0.055);
      mars.name = 'Mars';
      scene.add(mars);
      mars.position.set(480, 0, 0);
    },
    undefined,
    function (error) {
      console.error('Error loading Mars:', error);
    }
  );
  return mars;
}

function getJupiter() {
  let jupiter = null;
  const gltfloader = new GLTFLoader();
  gltfloader.load('/planet-models/Jupiter.glb',
    function (gltf) {
      jupiter = gltf.scene;
      jupiter.traverse(function (child) {
        if (child.isMesh) {
          child.name = 'Jupiter';
        }
      });
      jupiter.scale.set(0.12, 0.12, 0.12);
      jupiter.name = 'Jupiter';
      scene.add(jupiter);
      jupiter.position.set(600, 0, 0);
    },
    undefined,
    function (error) {
      console.error('Error loading Jupiter:', error);
    }
  );
  return jupiter;
}

function getSaturn() {
  let saturn = null;
  const gltfloader = new GLTFLoader();
  gltfloader.load('/planet-models/Saturn.glb',
    function (gltf) {
      saturn = gltf.scene;
      saturn.traverse(function (child) {
        if (child.isMesh) {
          child.name = 'Saturn';
        }
      });
      saturn.scale.set(0.11, 0.11, 0.11);
      saturn.name = 'Saturn';
      scene.add(saturn);
      saturn.position.set(800, 0, 0);
    },
    undefined,
    function (error) {
      console.error('Error loading Saturn:', error);
    }
  );
  return saturn;
}

function getUranus() {
  let uranus = null;
  const gltfloader = new GLTFLoader();
  gltfloader.load('/planet-models/Uranus.glb',
    function (gltf) {
      uranus = gltf.scene;
      uranus.traverse(function (child) {
        if (child.isMesh) {
          child.name = 'Uranus';
        }
      });
      uranus.scale.set(0.09, 0.09, 0.09);
      uranus.name = 'Uranus';
      scene.add(uranus);
      uranus.position.set(1000, 0, 0);
    },
    undefined,
    function (error) {
      console.error('Error loading Uranus:', error);
    }
  );
  return uranus;
}

function getNeptune() {
  let neptune = null;
  const gltfloader = new GLTFLoader();
  gltfloader.load('/planet-models/Neptune.glb',
    function (gltf) {
      neptune = gltf.scene;
      neptune.traverse(function (child) {
        if (child.isMesh) {
          child.name = 'Neptune';
        }
      });
      neptune.scale.set(0.085, 0.085, 0.085);
      neptune.name = 'Neptune';
      scene.add(neptune);
      neptune.position.set(1150, 0, 0);
    },
    undefined,
    function (error) {
      console.error('Error loading Neptune:', error);
    }
  );
  return neptune;
}

function getSun() {
  let sun = null;
  const gltfloader = new GLTFLoader();
  gltfloader.load('/planet-models/Sun.glb',
    function (gltf) {
      sun = gltf.scene;
      sun.traverse(function (child) {
        if (child.isMesh) {
          child.name = 'Sun';
        }
      });
      sun.scale.set(10, 10, 10);
      sun.name = 'Sun';
      scene.add(sun);
      sun.position.set(0, 0, 0);
      

    },
    undefined,
    function (error) {
      console.error('Error loading Sun:', error);
    }
  );
  return sun;
}

// Function to set the background texture of the scene
function setBackground(path) {
  const exrLoader = new EXRLoader();
  exrLoader.load(path, function(texture) {
    scene.background = texture;
  });
}


