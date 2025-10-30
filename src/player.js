import * as THREE from "three";

const SPEED = 1.8;
const ACCEL = 6.0;
const FRICTION = 4.0;

export class Player {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.position.set(-8, 0, 0);

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c2d36,
      roughness: 0.8,
      metalness: 0.1,
    });

    const coatMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d3828,
      roughness: 0.7,
      emissive: new THREE.Color(0x1a140c).multiplyScalar(0.7),
    });

    const hoodGeometry = new THREE.ConeGeometry(0.32, 0.7, 6, 1, true);
    hoodGeometry.rotateX(Math.PI);
    const hood = new THREE.Mesh(hoodGeometry, coatMaterial);
    hood.position.set(0, 1.55, 0);

    const torsoGeometry = new THREE.CylinderGeometry(0.26, 0.35, 1.2, 6, 1, true);
    const torso = new THREE.Mesh(torsoGeometry, coatMaterial);
    torso.position.set(0, 0.9, 0);

    const legsGeometry = new THREE.BoxGeometry(0.45, 0.5, 0.32);
    const legs = new THREE.Mesh(legsGeometry, bodyMaterial);
    legs.position.set(0, 0.25, 0);

    const bootsGeometry = new THREE.BoxGeometry(0.48, 0.18, 0.5);
    const boots = new THREE.Mesh(bootsGeometry, bodyMaterial);
    boots.position.set(0, 0.02, 0.05);

    const armsGeometry = new THREE.BoxGeometry(0.6, 0.18, 0.28);
    const arms = new THREE.Mesh(armsGeometry, coatMaterial);
    arms.position.set(0, 1.1, 0);

    const lanternGlass = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.15, 1),
      new THREE.MeshStandardMaterial({
        color: 0xeed599,
        transparent: true,
        opacity: 0.6,
        emissive: 0xeed599,
        emissiveIntensity: 1.2,
      })
    );
    lanternGlass.position.set(0.35, 0.8, 0.35);

    const lanternFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.03, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x28231d, metalness: 0.3, roughness: 0.6 })
    );
    lanternFrame.rotation.x = Math.PI / 2;
    lanternFrame.position.copy(lanternGlass.position);

    const lanternLight = new THREE.PointLight(0xfff2c6, 3.2, 8, 2.0);
    lanternLight.position.copy(lanternGlass.position);
    lanternLight.castShadow = true;
    lanternLight.shadow.mapSize.set(512, 512);

    this.lantern = new THREE.Group();
    this.lantern.add(lanternGlass, lanternFrame, lanternLight);

    this.group.add(hood, torso, legs, boots, arms, this.lantern);
    this.group.traverse((child) => {
      child.castShadow = true;
      if (child.isMesh) {
        child.receiveShadow = true;
      }
    });

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    scene.add(this.group);
  }

  update(delta, keyState) {
    this.direction.set(0, 0, 0);
    if (keyState.get("KeyW")) this.direction.z -= 1;
    if (keyState.get("KeyS")) this.direction.z += 1;
    if (keyState.get("KeyA")) this.direction.x -= 1;
    if (keyState.get("KeyD")) this.direction.x += 1;

    if (this.direction.lengthSq() > 0) {
      this.direction.normalize();
      const acceleration = this.direction.clone().multiplyScalar(ACCEL * delta);
      this.velocity.add(acceleration);
    } else {
      const damping = Math.max(1 - FRICTION * delta, 0);
      this.velocity.multiplyScalar(damping);
    }

    const maxSpeed = SPEED;
    const speed = this.velocity.length();
    if (speed > maxSpeed) {
      this.velocity.multiplyScalar(maxSpeed / speed);
    }

    this.group.position.addScaledVector(this.velocity, delta);

    const sway = Math.sin(performance.now() * 0.004 * Math.min(speed + 0.2, 1.4)) * 0.04;
    this.lantern.rotation.z = sway;
    this.lantern.position.y = 0.8 + Math.abs(sway) * 0.5;

    const forward = this.velocity.x >= 0 ? 1 : -1;
    this.group.scale.set(forward, 1, 1);
  }

  updateLantern(triggers) {
    const lanternLight = this.lantern.children.find((child) => child.isLight);
    const nearest = this._closestTrigger(triggers);
    if (nearest) {
      const distance = this.group.position.distanceTo(nearest.center);
      const influence = THREE.MathUtils.clamp(1 - distance / nearest.radius, 0, 1);
      lanternLight.intensity = 2.6 + influence * 2.4;
      lanternLight.color.lerpColors(new THREE.Color(0xffd9a1), nearest.tint, influence * 0.8);
    } else {
      lanternLight.intensity = 2.8;
      lanternLight.color.set(0xfff2c6);
    }
  }

  _closestTrigger(triggers) {
    let closest = null;
    let minDist = Infinity;
    for (const trigger of triggers) {
      const dist = this.group.position.distanceTo(trigger.center);
      if (dist < minDist) {
        minDist = dist;
        closest = trigger;
      }
    }
    if (!closest || minDist > closest.radius * 1.5) return null;
    return closest;
  }

  get position() {
    return this.group.position;
  }
}
