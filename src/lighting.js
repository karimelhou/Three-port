import * as THREE from "three";

export function createLights() {
  const lights = [];

  const ambient = new THREE.HemisphereLight(0x243042, 0x07070a, 0.6);
  lights.push(ambient);

  const moonLight = new THREE.DirectionalLight(0x8fa4ff, 0.55);
  moonLight.position.set(-6, 8, 12);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(1024, 1024);
  moonLight.shadow.camera.near = 0.1;
  moonLight.shadow.camera.far = 40;
  moonLight.shadow.camera.left = -16;
  moonLight.shadow.camera.right = 16;
  moonLight.shadow.camera.top = 16;
  moonLight.shadow.camera.bottom = -12;
  lights.push(moonLight);

  const rim = new THREE.SpotLight(0xf3a760, 1.1, 38, Math.PI / 5, 0.45, 1.8);
  rim.position.set(9, 6.5, 6);
  rim.target.position.set(-2, 2, -1);
  rim.castShadow = true;
  rim.shadow.mapSize.set(1024, 1024);
  lights.push(rim, rim.target);

  const gardenGlow = new THREE.PointLight(0x4fd3ff, 1.1, 25, 1.6);
  gardenGlow.position.set(0, 4.2, 2.4);
  lights.push(gardenGlow);

  const roadLight = new THREE.SpotLight(0xffa94f, 0.8, 25, Math.PI / 4.5, 0.6, 2.0);
  roadLight.position.set(-4, 5.2, 7);
  roadLight.target.position.set(4, 0, 3);
  roadLight.castShadow = true;
  lights.push(roadLight, roadLight.target);

  return lights;
}
