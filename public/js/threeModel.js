class Model {
  constructor(modelfile, location, flag = false) { 
    this.modelfile = modelfile
    this.location = location
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.modelDiv = document.getElementById(this.location);
    this.modelDiv.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.modelDiv.offsetWidth, this.modelDiv.offsetHeight);
    this.scene = new THREE.Scene();;
    this.model;

    this.cameraProperties();

    let light = new THREE.DirectionalLight(0xFFFF00,90);
    light.position.set(0, 0, 90);
    light.target.position.set(0, 0, 0);
    this.scene.add(light);

    let light2 = new THREE.DirectionalLight(0xFFFF00,90);
    light2.position.set(0, 0, -90);
    light2.target.position.set(0, 0, 0);
    this.scene.add(light2);

    let light3 = new THREE.DirectionalLight(0xFFFFFF,90);
    light3.position.set(0, -90, 0);
    light3.target.position.set(0, 0, 0);
    this.scene.add(light3);

    let light4 = new THREE.DirectionalLight(0xFFFFFF,90);
    light4.position.set(0, 90, 0);
    light4.target.position.set(0, 0, 0);
    this.scene.add(light4);

    if(flag){
      this.orbitTools();
    }

    const loader = new THREE.GLTFLoader();
    loader.setPath('../public/media/');
    loader.load(this.modelfile, (gltf) => {
      gltf.scene.traverse(c => {
        c.castShadow = false;
      });

      this.model = gltf.scene;
      this.scene.add(gltf.scene);
    });
  }

  cameraProperties(fov = 80, x = 0, y = 0, z = 20){
    const aspect = this.modelDiv.offsetWidth / this.modelDiv.offsetHeight;
    const near = 1.0;
    const far = 1000.0;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(x, y, z);
  }

  renderModel() {
    this.renderer.render(this.scene, this.camera);
    this.model.rotation.y += 0.01;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  orbitTools(){
    const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener('change', this.render());
    controls.target.set(0, 0, 0);
    controls.update();
    // controls.enableZoom = false;
    // controls.enablePan = false;
  }

}

var Model1 = new Model("scene.gltf","3dalpha");
var Model2 = new Model("scene.gltf","3dalpha2");
var Model3 = new Model("scene.gltf","3dalpha3");

function animate(){
  requestAnimationFrame( animate );
  Model1.renderModel();
  Model2.renderModel();
  Model3.renderModel();
}

animate();