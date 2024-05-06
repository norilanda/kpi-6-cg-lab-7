export let rotateScene = true;

const toggleRotation = () => {
    rotateScene = !rotateScene;
}

const rotationButton = document.getElementById('rotationBtn');
rotationButton?.addEventListener('click', toggleRotation);