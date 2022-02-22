import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import Experience from './Experience/Experience.js'

const experience = new Experience({
    targetElement: document.querySelector('.experience')
})
const experience2 = new Experience({
    targetElement: document.querySelector('.experience2')
})
