import * as THREE from "three";

export function createLights() {
  const lights = [];

  const ambient = new THREE.AmbientLight(0x1f2233, 0.6);
  lights.push(ambient);

  const moonLight = new THREE.DirectionalLight(0x8fa4ff, 0.5);
  moonLight.position.set(-6, 8, 12);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(1024, 1024);
  moonLight.shadow.camera.near = 0.1;
  moonLight.shadow.camera.far = 35;
  moonLight.shadow.camera.left = -12;
  moonLight.shadow.camera.right = 12;
  moonLight.shadow.camera.top = 12;
  moonLight.shadow.camera.bottom = -12;
  lights.push(moonLight);

  const rim = new THREE.SpotLight(0xf3a760, 1.2, 35, Math.PI / 5, 0.4, 1.8);
  rim.position.set(9, 6.5, 6);
  rim.target.position.set(-4, 2, 0);
  rim.castShadow = true;
  rim.shadow.mapSize.set(1024, 1024);
  lights.push(rim, rim.target);

  return lights;
}
