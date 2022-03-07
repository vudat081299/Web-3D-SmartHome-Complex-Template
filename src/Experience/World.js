import * as THREE from "three";
import Experience from "./Experience.js";
import GUI from "lil-gui";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.spotLight = new THREE.SpotLight( 0xffffff, 1 );
    this.lightHelper = new THREE.SpotLightHelper( this.spotLight );
    this.shadowCameraHelper = new THREE.CameraHelper( this.spotLight.shadow.camera );
    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setDummy();
      }
    });
  }

  setDummy() {
    this.resources.items.lennaTexture.encoding = THREE.sRGBEncoding;
    // this.resources.items.houseTexture.encoding = THREE.sRGBEncoding

    // binding to gui
    this.controlObject = {
      enable: false,
      side: 0, 
      width: 1,
      height: 1,
      depth: 1
    };







    const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
    this.scene.add( ambient );

    
    this.spotLight.position.set( 15, 40, 35 );
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 0.1;
    this.spotLight.decay = 2;
    this.spotLight.distance = 200;

    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 512;
    this.spotLight.shadow.mapSize.height = 512;
    this.spotLight.shadow.camera.near = 10;
    this.spotLight.shadow.camera.far = 200;
    this.spotLight.shadow.focus = 1;
    this.scene.add( this.spotLight );

    
    this.scene.add( this.lightHelper );

    
    this.scene.add( this.shadowCameraHelper );

    //
    let material = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );

    let geometry = new THREE.PlaneGeometry( 2000, 2000 );

    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 0, - 1, 0 );
    mesh.rotation.x = - Math.PI * 0.5;
    mesh.receiveShadow = true;
    this.scene.add( mesh );

    //

    material = new THREE.MeshPhongMaterial( { color: 0x4080ff, dithering: true } );

    geometry = new THREE.CylinderGeometry( 5, 5, 2, 32, 1, false );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 0, 5, 0 );
    mesh.castShadow = true;
    this.scene.add( mesh );







    // Helper
    this.scene.add( new THREE.AxesHelper( 30 ) );

    // Ground
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry( 1000, 1000 ),
      new THREE.MeshPhongMaterial( { color: 0xffffff, depthWrite: true } )
    );
    // plane.position.set(0, 0, 0);
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = - 0.5;
    plane.receiveShadow = true;
    this.scene.add(plane);

    // Scene custom
		this.scene.background = new THREE.Color( 0xa0a0a0 );
    this.scene.fog = new THREE.Fog( 0xa0a0a0, 5, 300 );

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

    // gui.add( this.tapMesh.position, 'x', -6, 6 );
    // gui.add( this.tapMesh.position, 'y', -6, 6 );
    // gui.add( this.tapMesh.position, 'z', -6, 6 );
  }

  addShadowedLight( x, y, z, color, intensity ) {
    const directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    this.scene.add( directionalLight );

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;

    // Directional Light Helper
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2
    );
    this.scene.add(directionalLightHelper);
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

		this.lightHelper.update();
		this.shadowCameraHelper.update();
  }

  destroy() {}
}
