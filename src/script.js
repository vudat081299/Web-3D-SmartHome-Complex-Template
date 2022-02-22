import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import Experience from './Experience/Experience.js'
import * as THREE from "three";

const experience = new Experience({
  targetElement: document.querySelector('.experience'),
  targetElementSmall: document.querySelector('.experience-small')
});

// const canvas = document.querySelector('canvas.experience2');
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas
// });

// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.render(experience.renderer.scene, experience.renderer.camera.instance);
