import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';


const radius=8;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 50,100);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
const texture = new THREE.TextureLoader().load("https://th.bing.com/th/id/OIP.4d8NsqVAxFhgJLv6rwCL_gHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3");
const material = new THREE.MeshStandardMaterial({ map: texture ,wireframe: false});

const ball = new THREE.Mesh(
  new THREE.SphereGeometry(radius,32,32),
  material
);
scene.add(ball);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 100, 100).normalize();
scene.add(light);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10000, 10000,200,200),
  new THREE.MeshBasicMaterial({ color: 'green', side: THREE.DoubleSide, wireframe: true })
);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -2;
scene.add(plane);

const animate = () => {
  requestAnimationFrame(animate);

  // moving ball based on pitch and yaw
  // ball.position.x += window.yaw;
  // ball.position.z -= window.pitch;

  // moving plane based on pitch and yaw
  plane.position.x -= window.yaw;
  plane.position.z += window.pitch;
  let dist= Math.sqrt(window.pitch*window.pitch + window.yaw*window.yaw);
  let movementAngle = -Math.atan2(window.pitch, window.yaw); // direction of movement
  const rotationAngle = dist / radius;  // how much to rotate
  // Rotate the ball realistically
  ball.rotateOnWorldAxis(
    new THREE.Vector3(Math.sin(movementAngle), 0, -Math.cos(movementAngle)),
    rotationAngle
  );
  ball.rotateOnWorldAxis(
    new THREE.Vector3(0, -1, 0),
    window.rollAngle/radius
  );
  
  
  // const euler = new THREE.Euler().setFromQuaternion(ball.quaternion, 'XYZ');
  // console.log(euler.x, euler.y, euler.z);
  
  // if (window.rollchange) {
  // if (Math.abs(window.rollAngle) < Math.PI / 2) {
  // ball.rotation.y=window.rollAngle; // Adjust rotation based on roll angle
  // }else{
  //   ball.rotation.y=window.rollAngle+ Math.PI; 
  // }
  // }else{
  // }
  // console.log(' x: ',ball.rotation.x, ' y: ', ball.rotation.y, ' z: ', ball.rotation.z);
  renderer.render(scene, camera);
};
animate();
