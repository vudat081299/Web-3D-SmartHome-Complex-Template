import * as THREE from "three";
import Experience from "./Experience.js";
import GUI from "lil-gui";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setDummy();
      }
    });
  }

  setDummy() {
    //
    this.controlObject = {
      enable: false,
      side: 0, 
      width: 1,
      height: 1,
      depth: 1
    };

    // tapMesh
    this.tapMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      // new THREE.MeshBasicMaterial({ map: this.resources.items.lennaTexture }) // Load texture on Mesh
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    // enable transparency
    this.tapMesh.material.transparent = true;
    // set opacity to 50%
    this.tapMesh.material.opacity = 0.5; 
    this.tapMesh.position.set(0, 0, 6);
    this.scene.add(this.tapMesh);
  

    this.resources.items.lennaTexture.encoding = THREE.sRGBEncoding;
    this.resources.items.houseTexture.encoding = THREE.sRGBEncoding

    // cube mesh
    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x1f75ff })
    );
    // this.scene.add(cube1);

    // house model
    this.resources.items.houseTexture.scene.scale.set(0.1, 0.1, 0.1)
    this.scene.add(this.resources.items.houseTexture.scene)

    // Point light
    // const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
    // let bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);

    // let bulbMat = new THREE.MeshStandardMaterial({
    //   emissive: 0xffffee,
    //   emissiveIntensity: 1,
    //   color: 0x000000,
    // });
    // bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
    // bulbLight.position.set(0, 2, 0);
    // bulbLight.castShadow = true;
    // this.scene.add(bulbLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight();
    ambientLight.color = new THREE.Color(0xffffff);
    ambientLight.intensity = 0.5;
    ambientLight.position.set(2, 2, -2);
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, -2);
    this.scene.add(directionalLight);

    // Light helper
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2
    );
    this.scene.add(directionalLightHelper);

    // Spot light
    const spotLight = new THREE.SpotLight(
      0xffffff,
      10,
      100,
      Math.PI * 0.2,
      0.25,
      1
    );
    spotLight.position.set(-2, 2, -2);
    this.scene.add(spotLight);

    spotLight.target.position.x = -0.75;
    this.scene.add(spotLight.target);

    // light helper
    // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // this.scene.add(spotLightHelper);

    // Light
    this.scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );
    const light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 1500, 200 );
    light.angle = Math.PI * 0.2;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = - 0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add( light );

    // Helper
    const helper = new THREE.GridHelper(20, 20);
    helper.position.y = - 5;
    helper.material.opacity = 1;
    helper.material.transparent = true;
    this.scene.add( helper );

    // Floor plane
    const planeGeometry = new THREE.PlaneGeometry( 200, 200 );
    planeGeometry.rotateX( - Math.PI / 2 );
    const planeMaterial = new THREE.ShadowMaterial( { color: 0xffffff, opacity: 1 } );
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.position.y = -1;
    plane.receiveShadow = true;
		this.scene.add(plane);

    // UIDebug
    const gui = new GUI();
    // const gui = new GUI({ closed: true, width: 350 });
    gui.domElement.id = "gui";

    gui.add( this.controlObject, "enable" );
    // gui.add( this.controlObject, 'side', [ 0, 1, 2 ] ).onChange( this.onchangeGUI() );
    // gui.add( this.controlObject, 'width', 0.1, 10 ).onChange( this.onchangeGUI() );
    // gui.add( this.controlObject, 'height', 0.1, 10 ).onChange( this.onchangeGUI() );
    // gui.add( this.controlObject, 'depth', 0.1, 10 ).onChange( this.onchangeGUI() );
    gui.add( this.controlObject, 'side', [ 0, 1, 2 ] ).onChange( v => { this.onchangeSide(v); this.onchangeGUI(); });
    gui.add( this.controlObject, 'width', 0.03, 6 ).onChange( v => { this.onchangeGUI() });
    gui.add( this.controlObject, 'height', 0.03, 6 ).onChange( v => { this.onchangeGUI() });
    gui.add( this.controlObject, 'depth', 0.03, 6 ).onChange( v => { this.onchangeGUI() });

    gui.add( this.tapMesh.position, 'x', -6, 6 );
    gui.add( this.tapMesh.position, 'y', -6, 6 );
    gui.add( this.tapMesh.position, 'z', -6, 6 );
    
    // console.log(this.scene.add(gui));
    // setTimeout(function(){this.scene.add(gui);},1000);
    
  }

  onchangeSide(v) 
  {
    if (v === 0) {
      this.controlObject.width = 0.03
      this.controlObject.height = 1
      this.controlObject.depth = 1
    } else if (v === 1) {
      this.controlObject.width = 1
      this.controlObject.height = 0.03
      this.controlObject.depth = 1
    } else if (v === 2) {
      this.controlObject.width = 1
      this.controlObject.height = 1
      this.controlObject.depth = 0.03
    }
  }
  onchangeGUI() 
  {
    this.tapMesh.scale.set(
      this.controlObject.width, 
      this.controlObject.height, 
      this.controlObject.depth
    );
  }

  resize() {}

  update() {
    if (this.tapMesh && this.controlObject) {
      document.getElementById("result").value = 
      "<item " + 
      "type='button' " +
      "name='" + document.getElementById("device-name").value + "' " +
      "x='" + this.tapMesh.position.x + "' " +
      "y='" + this.tapMesh.position.y + "' " +
      "z='" + this.tapMesh.position.z + "' " +
      "width='" + this.controlObject.width + "' " +
      "height='" + this.controlObject.height + "' " +
      "depth='" + this.controlObject.depth + "' " +
      "side=''" + this.controlObject.side + "'" +
      "></item>";
    }
  }

  destroy() {}
}
