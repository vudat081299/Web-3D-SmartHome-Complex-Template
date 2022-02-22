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
    this.resources.items.lennaTexture.encoding = THREE.sRGBEncoding;
    // this.resources.items.houseTexture.encoding = THREE.sRGBEncoding

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ map: this.resources.items.lennaTexture })
      // new THREE.MeshBasicMaterial({
      //     color: 0xffffff,
      //     transparent: true
      // })
    );
    // this.scene.add(cube)

    // cube mesh
    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xfefefe })
    );
    this.scene.add(cube1);

    // house model
    // this.resources.items.houseTexture.scene.scale.set(0.02, 0.02, 0.02)
    // this.scene.add(this.resources.items.houseTexture.scene)

    // Point light
    const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
    let bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);

    let bulbMat = new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000,
    });
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
    bulbLight.position.set(0, 2, 0);
    bulbLight.castShadow = true;
    this.scene.add(bulbLight);

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
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    this.scene.add(spotLightHelper);


    // UIDebug
    // const gui = new GUI();
    // const myObject = {
    //   myBoolean: true,
    //   myString: "lil-gui",
    //   myNumber: 1,
    // };
    // gui.domElement.id = "gui";

    // gui.add(myObject, "myBoolean"); // Checkbox
    // gui.add(myObject, "myFunction"); // Button
    // gui.add(myObject, "myString"); // Text Field
    // gui.add(myObject, "myNumber"); // Number Field
    // this.scene.add(gui);
  }

  resize() {}

  update() {}

  destroy() {}
}
