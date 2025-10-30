import * as THREE from "three";

const SPEED = 2.1;
const ACCEL = 6.5;
const FRICTION = 4.2;

export class Player {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.position.set(-12, 0, 0.2);

    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x151920,
      metalness: 0.85,
      roughness: 0.25,
    });
    const ceramicMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3f4a,
      metalness: 0.4,
      roughness: 0.45,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x4fd3ff,
      emissive: 0x4fd3ff,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.95,
    });
    const visorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0c1018,
      transmission: 0.65,
      thickness: 0.6,
      roughness: 0.1,
      metalness: 0.3,
      emissive: 0x52b8ff,
      emissiveIntensity: 0.6,
    });

    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.45, 24), chassisMaterial);
    pelvis.position.set(0, 0.75, 0);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1.1, 10, 20), chassisMaterial);
    torso.position.set(0, 1.45, 0);

    const chestPanel = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.35), ceramicMaterial);
    chestPanel.position.set(0, 1.6, 0.08);

    const coreGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.8, 32), accentMaterial.clone());
    coreGlow.position.set(0, 1.35, 0.12);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 12, 48), ceramicMaterial);
    collar.position.set(0, 1.9, 0);
    collar.rotation.x = Math.PI / 2;

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.15, 0.02);

    const headShell = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 28), chassisMaterial);
    headShell.scale.set(1, 0.82, 1);

    const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.28, 0.16, 32, 1, true), visorMaterial);
    visor.rotation.x = Math.PI / 2;
    visor.position.set(0, 0, 0.28);

    const eyeStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.12), accentMaterial.clone());
    eyeStrip.material.transparent = true;
    eyeStrip.material.opacity = 0.9;
    eyeStrip.position.set(0, 0, 0.34);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.52, 12), accentMaterial.clone());
    antenna.position.set(0, 0.52, 0);

    const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), accentMaterial.clone());
    antennaTip.position.set(0, 0.82, 0);

    headGroup.add(headShell, visor, eyeStrip, antenna, antennaTip);

    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16), ceramicMaterial);
    spine.position.set(0, 1.25, -0.12);

    const hipRing = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 12, 48), ceramicMaterial);
    hipRing.rotation.x = Math.PI / 2;
    hipRing.position.set(0, 1.0, 0);

    const shoulderYoke = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.05, 12, 48), ceramicMaterial);
    shoulderYoke.rotation.z = Math.PI / 2;
    shoulderYoke.position.set(0, 1.95, 0);

    this.group.add(pelvis, torso, chestPanel, coreGlow, collar, headGroup, spine, hipRing, shoulderYoke);

    const limbs = this._createLimbs(chassisMaterial, ceramicMaterial, accentMaterial.clone());
    this.leftArm = limbs.leftArm;
    this.rightArm = limbs.rightArm;
    this.leftLeg = limbs.leftLeg;
    this.rightLeg = limbs.rightLeg;
    this.headGroup = headGroup;
    this.eyeStrip = eyeStrip;
    this.group.add(
      limbs.leftArm.root,
      limbs.rightArm.root,
      limbs.leftLeg.root,
      limbs.rightLeg.root
    );

    this.lampRig = this._createLampRig(accentMaterial.clone());
    limbs.rightArm.forearm.add(this.lampRig.root);
    this.searchLight = this.lampRig.light;
    this.lightCone = this.lampRig.cone;

    this.group.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.walkTime = 0;

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

    if (speed > 0.02) {
      this.walkTime += delta * (3 + speed * 2.2);
    } else {
      this.walkTime += delta * 1.5;
    }

    const stride = Math.min(speed / maxSpeed, 1);
    const swing = Math.sin(this.walkTime) * 0.6 * stride;
    const counterSwing = Math.cos(this.walkTime) * 0.6 * stride;

    this.leftArm.upper.rotation.x = swing * 0.5 - 0.1;
    this.rightArm.upper.rotation.x = -swing * 0.5 - 0.1;
    this.leftArm.forearm.rotation.x = -counterSwing * 0.4 - 0.25;
    this.rightArm.forearm.rotation.x = counterSwing * 0.3 - 0.15;

    this.leftLeg.upper.rotation.x = -swing * 0.75 - 0.2;
    this.rightLeg.upper.rotation.x = swing * 0.75 - 0.2;
    this.leftLeg.lower.rotation.x = Math.max(0, counterSwing * 0.6);
    this.rightLeg.lower.rotation.x = Math.max(0, -counterSwing * 0.6);
    this.leftLeg.ankle.rotation.x = -0.35 + Math.sin(this.walkTime + Math.PI / 2) * 0.2 * stride;
    this.rightLeg.ankle.rotation.x = -0.35 + Math.sin(this.walkTime - Math.PI / 2) * 0.2 * stride;

    const heading = Math.atan2(this.velocity.z, this.velocity.x);
    if (speed > 0.05) {
      const targetRotation = THREE.MathUtils.degToRad(90) - heading;
      this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, targetRotation, 0.12);
    }

    const gaze = THREE.MathUtils.clamp(this.velocity.x * 1.2, -0.4, 0.4);
    this.headGroup.rotation.y = THREE.MathUtils.lerp(this.headGroup.rotation.y, gaze, 0.1);
    this.eyeStrip.material.emissiveIntensity = 0.6 + stride * 0.9;

    const sway = Math.sin(this.walkTime * 0.6) * 0.2 * stride;
    this.lampRig.root.rotation.z = THREE.MathUtils.lerp(this.lampRig.root.rotation.z, sway, 0.2);
    this.lampRig.pivot.rotation.x = THREE.MathUtils.lerp(this.lampRig.pivot.rotation.x, -0.6 - stride * 0.3, 0.2);
  }

  updateLantern(triggers) {
    const nearest = this._closestTrigger(triggers);
    if (nearest) {
      const distance = this.group.position.distanceTo(nearest.center);
      const influence = THREE.MathUtils.clamp(1 - distance / nearest.radius, 0, 1);
      this.searchLight.intensity = 2.4 + influence * 2.8;
      this.searchLight.color.lerpColors(new THREE.Color(0x7de1ff), nearest.tint, influence);
      this.lightCone.material.opacity = 0.32 + influence * 0.4;
      this.lightCone.material.color.lerpColors(new THREE.Color(0x7de1ff), nearest.tint, influence);
    } else {
      this.searchLight.intensity = 2.6;
      this.searchLight.color.set(0x7de1ff);
      this.lightCone.material.opacity = 0.28;
      this.lightCone.material.color.set(0x6cd4ff);
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
    if (!closest || minDist > closest.radius * 1.6) return null;
    return closest;
  }

  get position() {
    return this.group.position;
  }

  _createLimbs(chassisMaterial, ceramicMaterial, accentMaterial) {
    const createArm = (side) => {
      const root = new THREE.Group();
      root.position.set(side * 0.58, 1.9, 0);

      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), chassisMaterial);
      root.add(shoulder);

      const upper = new THREE.Group();
      const upperMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.72, 14), ceramicMaterial);
      upperMesh.position.y = -0.36;
      upper.add(upperMesh);
      upper.position.y = -0.08;

      const forearm = new THREE.Group();
      forearm.position.y = -0.72;
      const forearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.64, 12), ceramicMaterial);
      forearmMesh.position.y = -0.32;
      forearm.add(forearmMesh);

      const wristAccent = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 24), accentMaterial.clone());
      wristAccent.rotation.x = Math.PI / 2;
      wristAccent.position.set(0, -0.68, 0);
      forearm.add(wristAccent);

      upper.add(forearm);
      root.add(upper);

      return { root, upper, forearm };
    };

    const createLeg = (side) => {
      const root = new THREE.Group();
      root.position.set(side * 0.32, 1.0, 0.04);

      const upper = new THREE.Group();
      const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.7, 8, 16), ceramicMaterial);
      thigh.rotation.z = side * 0.12;
      thigh.position.y = -0.45;
      upper.add(thigh);

      const lower = new THREE.Group();
      lower.position.y = -0.9;
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.78, 12), chassisMaterial);
      shin.position.y = -0.36;
      lower.add(shin);

      const ankle = new THREE.Group();
      ankle.position.y = -0.78;
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.6), chassisMaterial);
      foot.position.set(0, -0.08, 0.2);
      ankle.add(foot);

      lower.add(ankle);
      upper.add(lower);
      root.add(upper);

      return { root, upper, lower, ankle };
    };

    return {
      leftArm: createArm(-1),
      rightArm: createArm(1),
      leftLeg: createLeg(-1),
      rightLeg: createLeg(1),
    };
  }

  _createLampRig(accentMaterial) {
    const root = new THREE.Group();
    root.position.set(0, -0.65, 0.18);

    const pivot = new THREE.Group();
    root.add(pivot);

    const emitterHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.42, 16), accentMaterial.clone());
    emitterHousing.rotation.x = Math.PI / 2;
    pivot.add(emitterHousing);

    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.55, 1.6, 22, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x6cd4ff,
        emissive: 0x6cd4ff,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    cone.position.set(0, -0.45, 0.8);
    pivot.add(cone);

    const light = new THREE.PointLight(0x7de1ff, 2.6, 9, 2.6);
    light.position.set(0, -0.22, 0.68);
    light.castShadow = true;
    pivot.add(light);

    const brackets = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 8, 24), accentMaterial.clone());
    brackets.rotation.y = Math.PI / 2;
    pivot.add(brackets);

    return { root, pivot, cone, light };
  }
}
