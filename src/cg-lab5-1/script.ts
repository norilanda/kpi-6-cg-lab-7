import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create a scene
const sceneXOY = new THREE.Scene();
const sceneXOZ = new THREE.Scene();
const sceneYOZ = new THREE.Scene();
const sceneIsometric = new THREE.Scene();

const getWidth = () => {
    return window.innerWidth;
}

// Create a camera
const width = window.innerWidth;
const height = window.innerHeight;

const aspectRatio = width / height;
const cameraHeight = 2;
const cameraWidth = cameraHeight * aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2, // left
  cameraWidth / 2, // right
  cameraHeight / 2, // top
  cameraHeight / -2, // bottom
);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(getWidth(), window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const colors = {
    white: new THREE.Color(1.0, 1.0, 1.0),
    black: new THREE.Color(0.0, 0.0, 0.0),
    grey: new THREE.Color(0.5, 0.5, 0.5),
    darcGrey: new THREE.Color(0.2, 0.2, 0.2),
    red: new THREE.Color(1.0, 0.0, 0.0),
    green: new THREE.Color(0.0, 1.0, 0.0),
    blue: new THREE.Color(0.0, 0.0, 1.0),
    darcBlue: new THREE.Color(0.0, 0.0, 0.5),
    cyan: new THREE.Color(0.0, 1.0, 1.0),
    magenta: new THREE.Color(1.0, 0.0, 1.0),
    yellow: new THREE.Color(1.0, 1.0, 0.0),
    orange: new THREE.Color(0.1, 0.5, 0.0),
    lemon: new THREE.Color(0.8, 1.0, 0.0),
    brown: new THREE.Color(0.5, 0.3, 0.0),
    navy: new THREE.Color(0.0, 0.4, 0.8),
    aqua: new THREE.Color(0.4, 0.7, 1.0),
    cherry: new THREE.Color(1.0, 0.0, 0.5),
};

const materials = [
    new THREE.MeshPhongMaterial({ color: colors.blue, shininess: 50, specular: colors.white }), // right
    new THREE.MeshPhongMaterial({ color: colors.yellow, shininess: 50, specular: colors.white }), // left
    new THREE.MeshPhongMaterial({ color: colors.cyan, shininess: 50, specular: colors.white }), // top
    new THREE.MeshPhongMaterial({ color: colors.red, shininess: 50, specular: colors.white }), // bottom
    new THREE.MeshPhongMaterial({ color: colors.magenta, shininess: 50, specular: colors.white }), // front
    new THREE.MeshPhongMaterial({ color: colors.green, shininess: 50, specular: colors.white })  // back
];

const setupScene = (scene: THREE.Scene) => {
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    const light = new THREE.PointLight(colors.white, 1, 1000);
    light.position.set(0, 0, 0);
    scene.add(light);

    return light;
}

const sceneLightXOY = setupScene(sceneXOY);
const sceneLightXOZ = setupScene(sceneXOZ);
const sceneLightYOZ = setupScene(sceneYOZ);
const sceneLightIsometric = setupScene(sceneIsometric);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

window.addEventListener('resize', () => {
    renderer.setSize(getWidth(), window.innerHeight);
    camera.updateProjectionMatrix();
    renderScene();
});

const renderScene = () => {
    const h = window.innerHeight;
    const w = window.innerWidth;

    renderer.setScissorTest(true)
    renderXOY(h, w);

    renderer.autoClear = false;
    renderXOZ(h, w);
    renderYOZ(h, w);
    renderIsometric(h, w)

    renderer.setScissorTest(false)
    renderer.autoClear = true;
}

const renderXOY = (h: number, w: number) => {
    renderer.setViewport(0, h/2, w/2, h/2)
    renderer.setScissor(0, h/2, w / 2, h/2)
    renderer.setClearColor( new THREE.Color(0.9,0.7,0.8), 1);
    renderer.clear();
    // Set camera position
    camera.position.set(0.0, 0.0, 2.0);
    // Set camera to look at the scene's origin
    camera.lookAt(0.0, 0.0, 0.0);
    // Set camera's up direction
    camera.up.set(0.0, 1.0, 0.0);

    sceneLightXOY.position.set(0, 0, 1.8);

    renderer.render(sceneXOY, camera);
}

const renderXOZ = (h: number, w: number) => {
    renderer.setViewport(w / 2, h/2, w / 2, h/2);
    renderer.setScissor(w / 2, h/2, w / 2, h/2);
    renderer.setClearColor( new THREE.Color(0.8,0.9,0.7), 1);
    renderer.clear();
    camera.position.set(0.0, 2.0, 0.0);
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 1.0, 0.0);

    sceneLightXOZ.position.set(0, 1.8, 0);
    renderer.render(sceneXOZ, camera);
}

const renderYOZ = (h: number, w: number) => {
    renderer.setViewport(0, 0, w / 2, h/2);
    renderer.setScissor(0, 0, w / 2, h/2);
    renderer.setClearColor( new THREE.Color(0.8,0.8,0.9), 1);
    renderer.clear();
    camera.position.set(2.0, 0.0, 0.0);
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 1.0, 0.0);
    sceneLightYOZ.position.set(1.8, 0.0, 0);
    renderer.render(sceneYOZ, camera);
}

const renderIsometric = (h: number, w: number) => {
    renderer.setViewport(w/2, 0, w / 2, h/2);
    renderer.setScissor(w/2, 0, w / 2, h/2);
    renderer.setClearColor( new THREE.Color(0.9,0.8,0.8), 1);
    renderer.clear();
    camera.position.set(1.125, 1.125, 1.125);
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 1.0, 0.0);
    sceneLightIsometric.position.set(1, 1, 1);
    sceneLightIsometric.intensity = 10;
    renderer.render(sceneIsometric, camera);
}

const animate = () => {
    requestAnimationFrame(animate);
    renderScene();
}
animate();
