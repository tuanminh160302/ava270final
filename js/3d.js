//variables set up
let container, scene, camera, renderer, mic, controls, controls2;

function init() {
  container = document.querySelector('.container');

  //create scene
  scene = new THREE.Scene();

  const fov = 10;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 10;
  const far = 1000;

  //set up camera
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(180, 50, -45);
  scene.applyMatrix4(new THREE.Matrix4().makeTranslation(12, 0, 2));

  //set up light
  ambient = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambient);

  light = new THREE.DirectionalLight(0xffffff, 3.5);
  light.position.set(50, 50, 25);
  
  light.shadow.mapSize.width = 1000;
  light.shadow.mapSize.height = 1000;
  
  scene.add(light);

  light.castShadow = true;
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

  pointLight = new THREE.PointLight(0xf23557, 0.5);
  pointLight.position.set(-50, 50, -20)
  scene.add(pointLight);

  pointLight2 = new THREE.PointLight(0x393c83, 0.5);
  pointLight2.position.set(50, 50, -20);
  scene.add(pointLight2);

  pointLight3 = new THREE.PointLight(0x22b2da, 0.5);
  pointLight3.position.set(-50, 0, 0);
  scene.add(pointLight3);

  pointLight4 = new THREE.PointLight(0xc4c4c4, 0.5);
  pointLight4.position.set(50, 0, 0);
  scene.add(pointLight4);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);
  // set id for renderer
  renderer.domElement.id = 'canvas'

  //set up controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  //smooth rotate
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;
  controls.rotateSpeed = 0.7;

  //smooth zoom
  controls.enableZoom = false;

  //TrackballControls
  controls2 = new THREE.TrackballControls(camera, renderer.domElement);
  controls2.noRotate = true;
  controls2.noPan = true;
  controls2.noZoom = false;
  controls2.zoomSpeed = 0.3;
  controls2.dynamicDampingFactor = 0.05;

  function render() {
    renderer.render(scene, camera);
  }

  //Load model
  let loader = new THREE.GLTFLoader();
  loader.load("./model/coffee/scene.glb", function (gltf) {
    mic = gltf.scene.children[0];
    scene.add(gltf.scene);
    animate();
  });
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  let target = controls.target;
  controls.update();
  controls2.target.set(target.x, target.y, target.z);
  controls2.update();
}
init();