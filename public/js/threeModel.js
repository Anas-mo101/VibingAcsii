let scene, camera, renderer, model;

init();
render();

function init() {

  renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
  });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const modelDiv = document.getElementById('3dalpha');
  modelDiv.appendChild(renderer.domElement);
  renderer.setSize(modelDiv.offsetWidth, modelDiv.offsetHeight);

  scene = new THREE.Scene();

  const fov = 80;
  const aspect = modelDiv.offsetWidth / modelDiv.offsetHeight;
  const near = 1.0;
  const far = 1000.0;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(1, 0, 20);

  let light = new THREE.DirectionalLight(0xFFFF00,90);
  light.position.set(0, 0, 90);
  light.target.position.set(0, 0, 0);
  scene.add(light);

  let light2 = new THREE.DirectionalLight(0xFFFF00,90);
  light2.position.set(0, 0, -90);
  light2.target.position.set(0, 0, 0);
  scene.add(light2);

  let light3 = new THREE.DirectionalLight(0xFFFFFF,90);
  light3.position.set(0, -90, 0);
  light3.target.position.set(0, 0, 0);
  scene.add(light3);

  let light4 = new THREE.DirectionalLight(0xFFFFFF,90);
  light4.position.set(0, 90, 0);
  light4.target.position.set(0, 0, 0);
  scene.add(light4);

  const loader = new THREE.GLTFLoader();
  loader.setPath('../media/');
  loader.load('scene.gltf', (gltf) => {
    gltf.scene.traverse(c => {
      c.castShadow = false;
    });
    model = gltf.scene
    scene.add(gltf.scene);
  });

  window.addEventListener('resize', () => {
     renderer._OnWindowResize();
  }, true);

}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  model.rotation.y += 0.01;
}