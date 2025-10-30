import * as THREE from "three";

export function buildEnvironment(scene) {
  const group = new THREE.Group();

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x15131a,
    roughness: 0.9,
    metalness: 0.05,
  });
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x1c1a24,
    roughness: 0.85,
    metalness: 0.08,
  });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(26, 1, 10), floorMaterial);
  floor.position.set(0, -0.5, 0);
  floor.receiveShadow = true;
  group.add(floor);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(26, 8, 0.5), wallMaterial);
  backWall.position.set(0, 3.3, -4.5);
  backWall.receiveShadow = true;
  group.add(backWall);

  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(26, 0.5, 10), wallMaterial);
  ceiling.position.set(0, 7.8, 0);
  ceiling.receiveShadow = true;
  group.add(ceiling);

  const planks = new THREE.Group();
  const plankMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d2520,
    roughness: 0.7,
  });
  for (let i = -12; i <= 12; i += 1.5) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.6), plankMaterial);
    plank.position.set(i, 0.05, 0.2 * Math.sin(i * 0.3));
    plank.castShadow = true;
    plank.receiveShadow = true;
    planks.add(plank);
  }
  group.add(planks);

  const pipes = new THREE.Group();
  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: 0x4b4e55,
    metalness: 0.6,
    roughness: 0.4,
  });
  for (let i = -2; i < 3; i++) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 12, 16), pipeMaterial);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(-11 + i * 4, 5.6 - i * 0.4, -2.8);
    pipe.castShadow = true;
    pipes.add(pipe);
  }
  group.add(pipes);

  const scenery = new THREE.Group();

  // Intro cage-like arch
  const archMaterial = new THREE.MeshStandardMaterial({ color: 0x1b1a1f, roughness: 0.8, metalness: 0.2 });
  const arch = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.12, 8, 40, Math.PI), archMaterial);
  arch.rotation.z = Math.PI;
  arch.position.set(-9, 2.5, -3.6);
  arch.castShadow = true;
  scenery.add(arch);

  const hangingCage = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 8, 1, true), archMaterial);
  hangingCage.position.set(-8.5, 3.2, -1.6);
  hangingCage.castShadow = true;
  scenery.add(hangingCage);

  // About area desk
  const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x2b2420, roughness: 0.7 });
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 1), deskMaterial);
  deskTop.position.set(-2.4, 1.15, -0.8);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  scenery.add(deskTop);

  const deskLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.1, 0.8), deskMaterial);
  deskLeg.position.set(-3.4, 0.55, -0.8);
  deskLeg.castShadow = true;
  deskLeg.receiveShadow = true;
  scenery.add(deskLeg);
  const leg2 = deskLeg.clone();
  leg2.position.x = -1.4;
  scenery.add(leg2);

  const books = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.5), new THREE.MeshStandardMaterial({ color: 0x5f4b3b }));
  books.position.set(-2.1, 1.4, -0.5);
  books.castShadow = true;
  scenery.add(books);

  const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0xf8e3b9 }));
  candle.position.set(-2.8, 1.35, -0.75);
  candle.castShadow = true;
  scenery.add(candle);
  const candleFlame = new THREE.PointLight(0xfcd7a4, 0.8, 4, 2.5);
  candleFlame.position.set(-2.8, 1.65, -0.75);
  scenery.add(candleFlame);

  // Projects area table of relics
  const plinthMaterial = new THREE.MeshStandardMaterial({ color: 0x1d2026, roughness: 0.6, metalness: 0.2 });
  for (let i = 0; i < 3; i++) {
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.9), plinthMaterial);
    plinth.position.set(3.2 + i * 1.4, 0.6, -0.2 + Math.sin(i * 1.2) * 0.25);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    scenery.add(plinth);

    const orb = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 0), new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.6 + i * 0.1, 0.35, 0.6),
      emissive: 0x111111,
      metalness: 0.3,
      roughness: 0.5,
    }));
    orb.position.set(plinth.position.x, 1.5, plinth.position.z);
    orb.castShadow = true;
    scenery.add(orb);
  }

  // Contact area door
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x231b17, roughness: 0.8 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 0.2), doorMaterial);
  door.position.set(10.2, 1.9, -3.9);
  door.castShadow = true;
  scenery.add(door);

  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 3.7, 0.1), new THREE.MeshStandardMaterial({ color: 0x342822 }));
  doorFrame.position.set(10.2, 2.0, -4.2);
  doorFrame.receiveShadow = true;
  scenery.add(doorFrame);

  const peephole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0xffc76c, emissive: 0x2c1f0d, emissiveIntensity: 0.9 }));
  peephole.rotation.x = Math.PI / 2;
  peephole.position.set(10.2, 2.3, -3.8);
  scenery.add(peephole);

  scene.add(scenery);

  const hangingLights = new THREE.Group();
  const chainMaterial = new THREE.MeshStandardMaterial({ color: 0x383431, metalness: 0.5, roughness: 0.6 });
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0xfadfa5,
    emissive: 0xfadfa5,
    emissiveIntensity: 1.1,
    transparent: true,
    opacity: 0.7,
  });

  const spotColors = [0xffd19a, 0xaed7ff, 0xf9b5d0];
  const anchors = [-7.5, 0, 7.5];
  anchors.forEach((x, index) => {
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), chainMaterial);
    chain.position.set(x, 6.6, -1.2);
    chain.castShadow = true;

    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), glowMaterial.clone());
    glow.material.color.setHex(spotColors[index]);
    glow.material.emissive.setHex(spotColors[index]);
    glow.position.set(x, 5.8, -0.4);

    const light = new THREE.SpotLight(spotColors[index], 1.0, 10, Math.PI / 4, 0.7, 2.2);
    light.position.set(x, 6.1, -0.4);
    light.target.position.set(x, 2.4, index === 1 ? -3 : 0);
    light.castShadow = true;

    hangingLights.add(chain, glow, light, light.target);
  });
  group.add(hangingLights);

  const mistGeometry = new THREE.PlaneGeometry(28, 10);
  const mistMaterial = new THREE.MeshBasicMaterial({
    color: 0x3c425a,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const mist = new THREE.Mesh(mistGeometry, mistMaterial);
  mist.rotation.x = -Math.PI / 2;
  mist.position.set(0, 2.4, -1.5);
  group.add(mist);

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 220;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(24);
    positions[i * 3 + 1] = Math.random() * 6 + 1;
    positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(4) - 2;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0xe8dba6, size: 0.08, transparent: true, opacity: 0.6 })
  );
  particles.position.z = -0.5;
  group.add(particles);

  scene.add(group);

  return {
    bounds: {
      minX: -11.5,
      maxX: 11.5,
      minZ: -1.8,
      maxZ: 1.8,
    },
  };
}

export function createRoomTriggers(scene) {
  const triggerData = [
    {
      name: "intro",
      center: new THREE.Vector3(-8.5, 0.8, 0),
      radius: 2.2,
      tint: new THREE.Color(0xffd19a),
      content: {
        title: "Welcome, Little Dreamer",
        body: `You wake in a forgotten gallery, clutching a lantern. This is the doorway into my craft —
          an interactive portfolio steeped in atmosphere and small stories.`,
      },
    },
    {
      name: "about",
      center: new THREE.Vector3(-2.2, 0.8, 0.4),
      radius: 2.5,
      tint: new THREE.Color(0xaed7ff),
      content: {
        title: "About Me",
        body: `<p>I am a game developer and designer crafting moody, tactile worlds. I blend
          narrative design with systems-thinking to build experiences that linger.</p>
          <ul>
            <li>World building &amp; level design</li>
            <li>Real-time rendering &amp; shaders</li>
            <li>Interaction design &amp; storytelling</li>
          </ul>`,
      },
    },
    {
      name: "projects",
      center: new THREE.Vector3(4.4, 0.8, -0.3),
      radius: 2.8,
      tint: new THREE.Color(0xf9b5d0),
      content: {
        title: "Projects",
        body: `<p>Each relic in this chamber is a memory of past voyages.</p>
          <ul>
            <li><strong>Echoes of the Maw</strong> — stealth adventure prototype exploring scale and fear.</li>
            <li><strong>Paper Lanterns</strong> — atmospheric WebGL poem with generative music.</li>
            <li><strong>Harbor Lights</strong> — tactile UI experiment for an interactive narrative.</li>
          </ul>`,
      },
    },
    {
      name: "contact",
      center: new THREE.Vector3(9.6, 0.8, 0),
      radius: 2.3,
      tint: new THREE.Color(0xffc76c),
      content: {
        title: "Contact",
        body: `<p>Push the creaking door to send word.</p>
          <p>Email: <a href="mailto:lantern@moodyport.io">lantern@moodyport.io</a><br />
          LinkedIn: <a href="https://linkedin.com" target="_blank" rel="noreferrer">/in/shadow-weaver</a></p>`,
      },
    },
  ];

  const triggers = triggerData.map((data) => {
    const helper = createTriggerVisual(data);
    helper.content = data.content;
    scene.add(helper.visuals);
    return helper;
  });

  return triggers;
}

function createTriggerVisual({ center, radius, tint }) {
  const visuals = new THREE.Group();
  visuals.userData = {};

  const glyph = new THREE.Mesh(
    new THREE.RingGeometry(radius * 0.3, radius * 0.35, 32, 1, Math.PI / 2, Math.PI * 1.3),
    new THREE.MeshStandardMaterial({
      color: tint.clone().multiplyScalar(0.5),
      emissive: tint,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.75,
    })
  );
  glyph.rotation.x = -Math.PI / 2;
  glyph.position.copy(center).setY(0.05);

  const lightCone = new THREE.Mesh(
    new THREE.ConeGeometry(radius * 0.5, 4, 24, 1, true),
    new THREE.MeshStandardMaterial({
      color: tint,
      emissive: tint,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  lightCone.position.copy(center).setY(0);

  const volumetric = new THREE.PointLight(tint, 0.6, 6, 2.5);
  volumetric.position.copy(center).setY(2.4);

  visuals.add(glyph, lightCone, volumetric);
  visuals.userData.glyph = glyph;
  visuals.userData.lightCone = lightCone;
  visuals.userData.volumetric = volumetric;

  const bounds = new THREE.Sphere(center.clone(), radius);
  return {
    center,
    radius,
    tint,
    bounds,
    visuals,
    content: null,
  };
}
