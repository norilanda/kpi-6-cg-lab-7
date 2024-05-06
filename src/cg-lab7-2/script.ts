import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';
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

const cameraValue = 2;
const camera = new THREE.OrthographicCamera(
  cameraWidth / -cameraValue, // left
  cameraWidth / cameraValue, // right
  cameraHeight / cameraValue, // top
  cameraHeight / -cameraValue, // bottom
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

const a = 4;
const b = 4;
const c = 4;

const matrix = new THREE.Matrix4(
    1, 0, 0, -1/a,
    0, 1, 0, -1/b,
    0, 0, 1, -1/c,
    0, 0, 0, 1,
);

const createCustomMaterial = (color: THREE.Color) => {
    return new THREE.ShaderMaterial({ 
        uniforms: {
            color: {
              value: new THREE.Color(color)
            },
            matrix: {
                value: matrix
            }
          },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });
}

const materials = [
    createCustomMaterial(colors.blue), // right
    createCustomMaterial(colors.yellow), // left
    createCustomMaterial(colors.cyan), // top
    createCustomMaterial(colors.red), // bottom
    createCustomMaterial(colors.magenta), // front
    createCustomMaterial(colors.green)  // back
];

const setupScene = (scene: THREE.Scene) => {
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    const light = new THREE.PointLight(colors.white, 1, 1000);
    light.position.set(0, 0, 0);
    scene.add(light);

    addExtendedEdges(scene, cube);

    return light;
}

const addExtendedEdges = (scene: THREE.Scene, cube: THREE.Mesh) => {
    // Create a new buffer geometry for the extended edges
    const extendedEdgesGeometryX = new THREE.BufferGeometry();
    const extendedEdgesGeometryY = new THREE.BufferGeometry();
    const extendedEdgesGeometryZ = new THREE.BufferGeometry();

    const verticesX = [];
    const verticesY = [];
    const verticesZ = [];
    const edgesGeometry = new THREE.EdgesGeometry(cube.geometry);

    // Iterate over each edge in the edges geometry
    for (let i = 0; i < edgesGeometry.attributes.position.count; i += 2) {
        // Get the start and end points of the edge
        const start = new THREE.Vector3().fromBufferAttribute(edgesGeometry.attributes.position, i);
        const end = new THREE.Vector3().fromBufferAttribute(edgesGeometry.attributes.position, i + 1);

        // Calculate the direction of the edge
        const direction = new THREE.Vector3().subVectors(end, start).normalize();

        // Extend the start and end points along the direction
        start.addScaledVector(direction, -1); // Extend the start point
        end.addScaledVector(direction, 1); // Extend the end point

        // Add the extended edge to the appropriate vertices array
        if (direction.x !== 0) {
            verticesX.push(start.x, start.y, start.z, end.x, end.y, end.z);
        } else if (direction.y !== 0) {
            verticesY.push(start.x, start.y, start.z, end.x, end.y, end.z);
        } else {
            verticesZ.push(start.x, start.y, start.z, end.x, end.y, end.z);
        }
    }

    // Add the vertices to the extended edges geometries
    extendedEdgesGeometryX.setAttribute('position', new THREE.Float32BufferAttribute(verticesX, 3));
    extendedEdgesGeometryY.setAttribute('position', new THREE.Float32BufferAttribute(verticesY, 3));
    extendedEdgesGeometryZ.setAttribute('position', new THREE.Float32BufferAttribute(verticesZ, 3));

    // Create line segments objects from the extended edges geometries
    const extendedEdgesX = new THREE.LineSegments(extendedEdgesGeometryX, createCustomMaterial(colors.red ));
    const extendedEdgesY = new THREE.LineSegments(extendedEdgesGeometryY, createCustomMaterial(colors.green));
    const extendedEdgesZ = new THREE.LineSegments(extendedEdgesGeometryZ, createCustomMaterial(colors.blue));

    extendedEdgesX.scale.set(100, 1, 1);
    extendedEdgesY.scale.set(1, 100, 1);
    extendedEdgesZ.scale.set(1, 1, 100);

    // Add the extended edges to the scene
    scene.add(extendedEdgesX, extendedEdgesY, extendedEdgesZ);
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
