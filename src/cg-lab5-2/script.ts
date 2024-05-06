import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
const cameraHeight = 180;
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

const loader = new GLTFLoader();

loader.load( '/models/teapot/scene.gltf', function ( gltf ) {
    const object = gltf.scene;

	sceneXOY.add( object );
	sceneXOZ.add( object.clone() );
	sceneYOZ.add( object.clone() );
	sceneIsometric.add( object.clone() );

}, undefined, function ( error ) {

	console.error( error );

} );

const axesSize = 200;

const setupScene = (scene: THREE.Scene) => {
    const directionalLight = new THREE.DirectionalLight( 0xffffff );
    const axesHelper = new THREE.AxesHelper( axesSize );
    axesHelper.setColors(colors.red, colors.green, colors.blue)
    scene.add(axesHelper);
    scene.add(directionalLight);
    return directionalLight;
}

const directionalLightXOY = setupScene(sceneXOY);
const directionalLightXOZ = setupScene(sceneXOZ);
const directionalLightYOZ = setupScene(sceneYOZ);
const directionalLightIsometric = setupScene(sceneIsometric);

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

const cameraOffset = 150;

const renderXOY = (h: number, w: number) => {
    renderer.setViewport(0, h/2, w/2, h/2)
    renderer.setScissor(0, h/2, w / 2, h/2)
    renderer.setClearColor( new THREE.Color(0.9,0.7,0.8), 1);
    renderer.clear();
    // Set camera position
    camera.position.set(0.0, 0.0, cameraOffset);
    // Set camera to look at the scene's origin
    camera.lookAt(0.0, 0.0, 0.0);
    // Set camera's up direction
    camera.up.set(0.0, 1.0, 0.0);
    directionalLightXOY.position.set(0, 0, 1);

    renderer.render(sceneXOY, camera);
}

const renderXOZ = (h: number, w: number) => {
    renderer.setViewport(w / 2, h/2, w / 2, h/2);
    renderer.setScissor(w / 2, h/2, w / 2, h/2);
    renderer.setClearColor( new THREE.Color(0.8,0.9,0.7), 1);
    renderer.clear();
    camera.position.set(0.0, cameraOffset, 0.0);
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 1.0, 0.0);
    directionalLightXOZ.position.set(0, 1, 0);

    renderer.render(sceneXOZ, camera);
}

const renderYOZ = (h: number, w: number) => {
    renderer.setViewport(0, 0, w / 2, h/2);
    renderer.setScissor(0, 0, w / 2, h/2);
    renderer.setClearColor( new THREE.Color(0.8,0.8,0.9), 1);
    renderer.clear();
    camera.position.set(cameraOffset, 0.0, 0.0);
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 1.0, 0.0);
    directionalLightYOZ.position.set(1, 0, 0);

    renderer.render(sceneYOZ, camera);
}

const renderIsometric = (h: number, w: number) => {
    renderer.setViewport(w/2, 0, w / 2, h/2);
    renderer.setScissor(w/2, 0, w / 2, h/2);
    renderer.setClearColor( new THREE.Color(0.9,0.8,0.8), 1);
    renderer.clear();
    camera.position.set(85, 85, 85);
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 1.0, 0.0);
    directionalLightIsometric.position.set(1, 1, 1);

    renderer.render(sceneIsometric, camera);
}

const animate = () => {
    requestAnimationFrame(animate);
    renderScene();
}
animate();
