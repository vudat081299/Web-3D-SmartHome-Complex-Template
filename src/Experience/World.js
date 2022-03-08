import * as THREE from "three";
import Experience from "./Experience.js";
import GUI from "lil-gui";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.prepareVariables();
    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setDummy();
      }
    });
    this.prepapreEventListeners();
  }

  prepapreEventListeners() {
    window.addEventListener('mousemove', (event) => {
      this.pointer.x = ( event.clientX / (window.innerWidth - 400) ) * 2 - 1;
      this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    })
    document.addEventListener('click', () => {
      this.updateIntersectionsOnClick();
    })
  }

  prepareVariables() {
    this.CLONEINTERSECTEDNODE = null;
    this.INTERSECTED = null;
    this.spotLight = new THREE.SpotLight(0xffffff, 1);
    this.shadowCameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera); // call after init spotLight
    this.lightHelper = new THREE.SpotLightHelper(this.spotLight); // call after init spotLight
    this.pointer = new THREE.Vector2();
    this.buttons = []
		this.offset = new THREE.Vector3( 0.1, 0.1, 0.1 );
  }

  setDummy() {
    // this.prepareModels();
    this.prepareLights();
    this.prepareObjects();
    this.prepareGUI();

    // Axes helper
    this.scene.add(new THREE.AxesHelper(30));

    // Scene custom
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 5, 300);
  }

  prepareObjects() {
    // Objects
    //
    let material = new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true });
    let geometry = new THREE.PlaneGeometry(2000, 2000);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, - 1, 0);
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    //
    // material = new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true });
    // geometry = new THREE.CylinderGeometry(5, 5, 2, 32, 1, false);
    // mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(0, 10, 0);
    // mesh.castShadow = true;
    // this.scene.add(mesh);

    // Ground
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: true })
    );
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = - 0.5;
    plane.receiveShadow = true;
    this.ground = plane;
    this.scene.add(this.ground);

    // Highlight box
    this.highlightBox = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshLambertMaterial({ color: 0xff9999 })
    );
    this.highlightBox.visible = false;
    this.scene.add( this.highlightBox );

    this.prepareIntersections();
  }

  prepareLights() {
    // Light
    // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff );
    // hemiLight.position.set( 0, 100, 0 );
    // this.scene.add( hemiLight );

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    ambient.position.set(15, 40, 35);
    this.scene.add(ambient);

    this.spotLight.position.set(15, 40, 35);
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 1;
    this.spotLight.decay = 2;
    this.spotLight.distance = 200;

    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 512;
    this.spotLight.shadow.mapSize.height = 512;
    this.spotLight.shadow.camera.near = 10;
    this.spotLight.shadow.camera.far = 200;
    this.spotLight.shadow.focus = 1;
    this.spotLight.shadow.radius = 10;
    this.spotLight.shadow.blurSamples = 10;

    this.scene.add(this.spotLight);
    this.scene.add(this.lightHelper);
    this.scene.add(this.shadowCameraHelper);
  }

  prepareModels() {
    // this.resources.items.lennaTexture.encoding = THREE.sRGBEncoding;
    this.resources.items.houseTexture.encoding = THREE.sRGBEncoding;

    // house model
    this.resources.items.houseTexture.scene.scale.set(0.4, 0.4, 0.4);
    this.resources.items.houseTexture.castShadow = true;
    this.resources.items.houseTexture.receiveShadow = true;
    this.scene.add(this.resources.items.houseTexture.scene)
  }

  prepareGUI() {
    // Data binding to gui
    this.controlObject = {
      enable: false,
      side: 0,
      width: 1,
      height: 1,
      depth: 1
    };
    // UIDebug
    const gui = new GUI();
    // const gui = new GUI({ closed: true, width: 350 });
    gui.domElement.id = "gui";

    gui.add(this.controlObject, "enable");
    // gui.add( this.controlObject, 'side', [ 0, 1, 2 ] ).onChange( this.onchangeGUI() );
    // gui.add( this.controlObject, 'width', 0.1, 10 ).onChange( this.onchangeGUI() );
    // gui.add( this.controlObject, 'height', 0.1, 10 ).onChange( this.onchangeGUI() );
    // gui.add( this.controlObject, 'depth', 0.1, 10 ).onChange( this.onchangeGUI() );
    gui.add(this.controlObject, 'side', [0, 1, 2]).onChange(v => { this.onchangeSide(v); this.onchangeGUI(); });
    gui.add(this.controlObject, 'width', 0.03, 6).onChange(v => { this.onchangeGUI() });
    gui.add(this.controlObject, 'height', 0.03, 6).onChange(v => { this.onchangeGUI() });
    gui.add(this.controlObject, 'depth', 0.03, 6).onChange(v => { this.onchangeGUI() });

    // gui.add( this.tapMesh.position, 'x', -6, 6 );
    // gui.add( this.tapMesh.position, 'y', -6, 6 );
    // gui.add( this.tapMesh.position, 'z', -6, 6 );
  }

  prepareIntersections() {
    // container = document.createElement('div');
    // document.body.appendChild(container);
    const intersectionBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < 1000; i++) {
      const object = new THREE.Mesh(intersectionBoxGeometry, new THREE.MeshLambertMaterial({ color: 0x99c0ff }));

      object.position.x = Math.random() * 100 + 10;
      object.position.y = Math.random() * 100 + 10;
      object.position.z = Math.random() * 100 + 10;

      // object.rotation.x = Math.random() * 2 * Math.PI;
      // object.rotation.y = Math.random() * 2 * Math.PI;
      // object.rotation.z = Math.random() * 2 * Math.PI;

      // object.scale.x = Math.random() * 1 + 10;
      // object.scale.y = Math.random() * 1 + 10;
      // object.scale.z = Math.random() * 1 + 10;

      this.scene.add(object);
    }
  }

  addShadowedLight(x, y, z, color, intensity) {
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    this.scene.add(directionalLight);

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

  onchangeSide(v) {
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

  onchangeGUI() {
    this.tapMesh.scale.set(
      this.controlObject.width,
      this.controlObject.height,
      this.controlObject.depth
    );
  }

  updateIntersectionsOnClick() {
    // find intersections
    this.raycaster = new THREE.Raycaster();
    this.raycaster.setFromCamera(this.pointer, this.camera.instance);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);
    if (intersects.length > 0) {
      if (intersects[0].object != null && intersects[0].object != this.ground && this.INTERSECTED != intersects[0].object) {
        // if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        this.INTERSECTED = intersects[0].object;
        this.CLONEINTERSECTEDNODE = intersects[0].object;
        if (this.INTERSECTED.material.emissive) {
          // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          // this.INTERSECTED.material.emissive.setHex(0x666666);
          this.highlightBox.position.copy( this.INTERSECTED.position );
          this.highlightBox.rotation.copy( this.INTERSECTED.rotation );
          this.highlightBox.scale.copy( this.INTERSECTED.scale ).add( this.offset );
          this.highlightBox.visible = true;
        }
      }
    } else {
      // if (INTERSECTED.material.emissive) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      // INTERSECTED = null;
      this.highlightBox.visible = false;
    }
  }

  resize() { 

  }

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

  destroy() { 
    
  }
}
