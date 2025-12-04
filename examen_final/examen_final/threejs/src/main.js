import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

console.log("Script cargado - versión THREE:", THREE.REVISION);

let scene, renderer;
let camera1, camera2, activeCamera;
let controls;
let objects = [];
let textureLoader;

init();
animate();

function init() {
  console.log("Init ejecutándose...");

  // Escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Texture Loader
  textureLoader = new THREE.TextureLoader();

  // Cámaras
  camera1 = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera1.position.set(10, 10, 10);
  camera1.lookAt(0, 0, 0);

  camera2 = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera2.position.set(0, 15, 0);
  camera2.lookAt(0, 0, 0);

  activeCamera = camera1;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  console.log("Canvas agregado al DOM");

  // Controles
  controls = new OrbitControls(activeCamera, renderer.domElement);
  controls.enableDamping = true;

  // Luces
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  // Piso con textura
  const grassTexture = textureLoader.load("../textures/floor.jpg");
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({
      map: grassTexture,
      side: THREE.DoubleSide,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1;
  scene.add(floor);

  // Cubo rojo con textura
  const metalTexture = textureLoader.load("../textures/box.jpg");
  metalTexture.wrapS = THREE.RepeatWrapping;
  metalTexture.wrapT = THREE.RepeatWrapping;

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ map: metalTexture })
  );
  cube.position.set(-3, 1, 0);
  scene.add(cube);
  objects.push(cube);

  // Esfera azul
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x0066ff })
  );
  sphere.position.set(3, 1.5, 0);
  scene.add(sphere);
  objects.push(sphere);

  // Cilindro naranja
  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 3, 32),
    new THREE.MeshStandardMaterial({ color: 0xff8800 })
  );
  cylinder.position.set(0, 1.5, -3);
  scene.add(cylinder);
  objects.push(cylinder);

  // Cono amarillo
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(1, 3, 32),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  );
  cone.position.set(0, 1.5, 3);
  scene.add(cone);
  objects.push(cone);

  console.log("Objetos creados:", objects.length);

  // Botón cambiar cámara
  const btnCam = document.getElementById("btnCam");
  if (btnCam) {
    btnCam.addEventListener("click", () => {
      activeCamera = activeCamera === camera1 ? camera2 : camera1;
      controls.object = activeCamera;
      controls.update();
      console.log("Cámara cambiada");
    });
  }

  window.addEventListener("resize", onWindowResize);
  console.log("Inicialización completa");
}

function onWindowResize() {
  camera1.aspect = window.innerWidth / window.innerHeight;
  camera1.updateProjectionMatrix();

  camera2.aspect = window.innerWidth / window.innerHeight;
  camera2.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  if (objects[0]) objects[0].rotation.y += 0.02;
  if (objects[1]) objects[1].position.y = 1.5 + Math.sin(time * 2) * 0.5;
  if (objects[2]) objects[2].rotation.y += 0.015;
  if (objects[3]) objects[3].rotation.x += 0.01;

  controls.update();
  renderer.render(scene, activeCamera);
}
