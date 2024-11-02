import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Constant
let speedMultiplier = 0.1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2;


// Create renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,  // Enable anti-aliasing for smoother edges
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// Load textures for the planets
const sunTexture = textureLoader.load('textures/sun.jpg');
const mercuryTexture = textureLoader.load('textures/mercury.jpg');
const venusTexture = textureLoader.load('textures/venus.jpg');
const earthTexture = textureLoader.load('textures/earth.jpg');
const marsTexture = textureLoader.load('textures/mars.jpg');
const jupiterTexture = textureLoader.load('textures/jupiter.jpg');
const saturnTexture = textureLoader.load('textures/saturn.jpg');
const uranusTexture = textureLoader.load('textures/uranus.jpg');
const neptuneTexture = textureLoader.load('textures/neptune.jpg');

const sizeMultiplier = 0.1;
// Create a big ball for the sun
const sunGeometry = new THREE.SphereGeometry(1 * sizeMultiplier, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data (size, distance from sun, speed of orbit)
const planetData = [
    { size: 0.5, distance: 0.39, texture: mercuryTexture, speed: 0.08264, rotationSpeed: 0.02 }, // Mercury
    { size: 0.7, distance: 0.72, texture: venusTexture, speed: 0.03232, rotationSpeed: 0.01 }, // Venus
    { size: 0.75, distance: 1, texture: earthTexture, speed: 0.01992, rotationSpeed: 0.03 }, // Earth
    { size: 0.6, distance: 1.52, texture: marsTexture, speed: 0.01059, rotationSpeed: 0.04 }, // Mars
    { size: 1.2, distance: 5.2, texture: jupiterTexture, speed: 0.001673, rotationSpeed: 0.05 }, // Jupiter
    { size: 1, distance: 9.54, texture: saturnTexture, speed: 0.0009294, rotationSpeed: 0.03 }, // Saturn
    { size: 0.9, distance: 19.2, texture: uranusTexture, speed: 0.0002370, rotationSpeed: 0.02 }, // Uranus
    { size: 0.85, distance: 30.06, texture: neptuneTexture, speed: 0.0001208, rotationSpeed: 0.02 }, // Neptune
];

// Array to hold planet meshes
const planets = [];
const orbits = [];  // Array to hold orbit lines

// Create planets based on the data
planetData.forEach(data => {
    //Create planets
    const geometry = new THREE.SphereGeometry(data.size * sizeMultiplier, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ map: data.texture });
    const planet = new THREE.Mesh(geometry, planetMaterial);
    planet.position.set(data.distance, 0, 0);
    scene.add(planet);
    planets.push({ planet, distance: data.distance, speed: data.speed, angle: 0, rotationSpeed: data.rotationSpeed });

    // Create the orbit ring and add it to the 'orbits' array
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.04 * sizeMultiplier, data.distance + 0.04 * sizeMultiplier, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x6faeff, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Rotate the ring to lay flat on the x-z plane
    scene.add(orbit);
    orbits.push(orbit);  // Add orbit to orbits array
});

// Create stars in the background
function addStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    const starCount = 10000; // Number of stars
    const starVertices = [];

    for (let i = 0; i < starCount; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000); // Spread stars across a large area
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

addStars(); // Call the function to add stars

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enables smooth transitions (inertia effect)
controls.dampingFactor = 0.05; // Damping factor
controls.enableZoom = true;    // Enable zoom in and out
controls.enableRotate = true; // Enables rotation around the object
controls.enablePan = false;    // Disable panning (optional)

function animate() {
    requestAnimationFrame(animate);

    // Rotate the planets around the sun
    planets.forEach(p => {
        p.angle += p.speed * speedMultiplier; // Increment the angle
        p.planet.position.set(
            Math.cos(p.angle) * p.distance,
            0,
            Math.sin(p.angle) * p.distance
        );
        p.planet.rotation.y += p.rotationSpeed;
    });

    //Rotate Sun
    sun.rotation.y += 0.002; // Adjust the speed as desired

    controls.update(); // Update camera controls

    renderer.render(scene, camera);
}

animate();

// Event listener to toggle orbit visibility
document.getElementById('toggleOrbits').addEventListener('click', () => {
    orbits.forEach(orbit => {
        orbit.visible = !orbit.visible;  // Toggle visibility of each orbit
    });
});
// Get references to the slider and the speed display
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
speedSlider.addEventListener('input', () => {
    speedMultiplier = parseFloat(speedSlider.value);
    speedValue.textContent = speedMultiplier.toFixed(1) + 'x'; // Update the displayed speed
});


// Adjust camera and renderer on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
