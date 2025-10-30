import * as THREE from "three";

export function buildEnvironment(scene) {
  const root = new THREE.Group();

  const foundationMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b0b12,
    roughness: 0.85,
    metalness: 0.15,
  });
  const plazaMaterial = new THREE.MeshStandardMaterial({
    color: 0x181c23,
    roughness: 0.65,
    metalness: 0.25,
  });
  const inlayMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f161f,
    roughness: 0.45,
    metalness: 0.6,
  });

  const foundation = new THREE.Mesh(new THREE.BoxGeometry(34, 1.2, 18), foundationMaterial);
  foundation.position.set(0, -0.6, 0);
  foundation.receiveShadow = true;
  root.add(foundation);

  const plaza = new THREE.Mesh(new THREE.BoxGeometry(28, 0.4, 8), plazaMaterial);
  plaza.position.set(0, -0.2, 0);
  plaza.receiveShadow = true;
  root.add(plaza);

  const inlay = new THREE.Mesh(new THREE.PlaneGeometry(26.5, 6.6), inlayMaterial);
  inlay.rotation.x = -Math.PI / 2;
  inlay.position.set(0, 0.01, 0);
  inlay.receiveShadow = true;
  root.add(inlay);

  const pathLines = new THREE.Group();
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0x50d7ff,
    emissive: 0x50d7ff,
    emissiveIntensity: 1.3,
    transparent: true,
    opacity: 0.8,
    metalness: 0.4,
    roughness: 0.2,
  });
  for (let i = -1; i <= 1; i++) {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(26, 0.25), glowMaterial.clone());
    strip.rotation.x = -Math.PI / 2;
    strip.position.set(0, 0.012, i * 1.6);
    pathLines.add(strip);
  }
  root.add(pathLines);

  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x1f222a, metalness: 0.6, roughness: 0.3 });
  const railGroup = new THREE.Group();
  [-3.6, 3.6].forEach((z) => {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 26, 12), railMaterial);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 0.8, z);
    rail.castShadow = true;
    railGroup.add(rail);
    for (let i = -12; i <= 12; i += 4) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.6, 10), railMaterial);
      post.position.set(i, 0.8, z);
      post.castShadow = true;
      railGroup.add(post);
    }
  });
  root.add(railGroup);

  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 4.5),
    new THREE.MeshStandardMaterial({ color: 0x090b11, roughness: 0.6, metalness: 0.35 })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -0.19, 3.6);
  road.receiveShadow = true;
  root.add(road);

  const roadGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 0.12),
    new THREE.MeshStandardMaterial({
      color: 0xffa94f,
      emissive: 0xffa94f,
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.85,
    })
  );
  roadGlow.rotation.x = -Math.PI / 2;
  roadGlow.position.set(0, -0.18, 3.6);
  root.add(roadGlow);

  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(32, 12),
    new THREE.MeshStandardMaterial({
      color: 0x0e111a,
      metalness: 0.9,
      roughness: 0.08,
      transparent: true,
      opacity: 0.7,
    })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.48, -5.6);
  water.receiveShadow = true;
  root.add(water);

  const cityBackdrop = new THREE.Group();
  const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x13151d, roughness: 0.8, metalness: 0.1 });
  for (let i = -4; i <= 4; i++) {
    const height = 4 + Math.random() * 6;
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.2 + Math.random(), height, 0.8 + Math.random()), towerMaterial);
    tower.position.set(i * 3.2, height / 2 + 0.4, -8.6 - Math.random() * 2);
    tower.receiveShadow = true;
    cityBackdrop.add(tower);
  }
  root.add(cityBackdrop);

  const fogPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 9),
    new THREE.MeshBasicMaterial({ color: 0x1b2230, transparent: true, opacity: 0.35, depthWrite: false })
  );
  fogPlane.position.set(0, 2.5, -7.6);
  root.add(fogPlane);

  const animatedEntities = [];
  const interactives = [];

  const synthGarden = new THREE.Group();
  const trees = [];
  const treeColors = [0x4fd3ff, 0xff93d2, 0xffd67b];
  const treePositions = [new THREE.Vector3(-8.4, 0, 2.8), new THREE.Vector3(0.4, 0, 3.4), new THREE.Vector3(7.6, 0, 2.4)];

  treePositions.forEach((pos, index) => {
    const tree = createSynthTree(pos, 1.1 + Math.random() * 0.4, treeColors[index % treeColors.length]);
    synthGarden.add(tree.group);
    trees.push(tree);
    animatedEntities.push((elapsed) => {
      tree.group.rotation.y = Math.sin(elapsed * 0.25 + index) * 0.08;
      tree.leaves.material.emissiveIntensity = tree.glow.value;
    });
  });
  root.add(synthGarden);

  const droneColors = [0x4fd3ff, 0xffaa6f, 0xff90ea];
  [
    new THREE.Vector3(-6.5, 2.4, -1.4),
    new THREE.Vector3(0.5, 2.8, -2.2),
    new THREE.Vector3(6.8, 2.2, -1.2),
  ].forEach((position, index) => {
    const drone = createHoverDrone(position, droneColors[index]);
    root.add(drone.group);
    animatedEntities.push((elapsed) => {
      const offset = Math.sin(elapsed * 1.3 + index) * 0.45;
      drone.group.position.y = position.y + offset;
      drone.group.rotation.y = elapsed * 0.4 + index;
      drone.iris.rotation.y = Math.sin(elapsed * 2 + index);
    });
  });

  const holoTotems = new THREE.Group();
  for (let i = -10; i <= 10; i += 5) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 2.4, 16), plazaMaterial);
    pillar.position.set(i, 1.2, -2.8);
    pillar.castShadow = true;
    pillar.receiveShadow = true;

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.04, 16, 48),
      new THREE.MeshStandardMaterial({
        color: 0x89f2ff,
        emissive: 0x89f2ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.6,
      })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.set(i, 2.1, -2.8);

    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.12, 3.6, 24, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x4fd3ff,
        emissive: 0x4fd3ff,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
      })
    );
    beam.position.set(i, 1.8, -2.8);

    holoTotems.add(pillar, halo, beam);
    animatedEntities.push((elapsed) => {
      halo.rotation.z = elapsed * 0.3;
      beam.material.opacity = 0.18 + Math.sin(elapsed * 1.6 + i) * 0.1;
    });
  }
  root.add(holoTotems);

  const mistParticles = createParticles();
  root.add(mistParticles);
  animatedEntities.push((elapsed) => {
    mistParticles.rotation.y = elapsed * 0.02;
  });

  const seedConfigs = [
    { position: new THREE.Vector3(-6.2, 0.5, 2.1), tint: 0x4fd3ff, tree: trees[0] },
    { position: new THREE.Vector3(0.8, 0.5, 2.9), tint: 0xff93d2, tree: trees[1] },
    { position: new THREE.Vector3(6.4, 0.5, 2.0), tint: 0xffd67b, tree: trees[2] },
  ];

  seedConfigs.forEach((config, index) => {
    const seed = createMemorySeed(config.position, config.tint);
    root.add(seed.group);
    interactives.push({
      center: config.position,
      radius: 1.6,
      activated: false,
      activate: () => {
        if (seed.state.activated) return false;
        seed.state.activated = true;
        seed.light.intensity = 2.2;
        seed.ring.scale.setScalar(1.6);
        seed.group.position.y += 0.1;
        config.tree.glow.value = 1.8;
        return true;
      },
    });
    animatedEntities.push((elapsed) => {
      const pulse = 0.8 + Math.sin(elapsed * 1.6 + index) * 0.2;
      seed.ring.rotation.x = elapsed * 0.8 + index;
      seed.group.position.y = 0.5 + Math.sin(elapsed * 1.1 + index) * 0.12;
      seed.light.intensity = seed.state.activated ? 2.2 : 1.2 * pulse;
      if (!seed.state.activated) {
        config.tree.glow.value = THREE.MathUtils.lerp(config.tree.glow.value, 0.9 + pulse * 0.3, 0.02);
      } else {
        config.tree.glow.value = THREE.MathUtils.lerp(config.tree.glow.value, 1.8, 0.04);
      }
    });
  });

  scene.add(root);

  return {
    bounds: {
      minX: -13.5,
      maxX: 13.5,
      minZ: -3.1,
      maxZ: 3.6,
    },
    update(elapsed) {
      animatedEntities.forEach((fn) => fn(elapsed));
    },
    interactives,
  };
}

export function createRoomTriggers(scene) {
  const triggerData = [
    {
      name: "intro",
      center: new THREE.Vector3(-11.2, 0.6, 0.2),
      radius: 2.6,
      tint: new THREE.Color(0x4fd3ff),
      content: {
        subtitle: "Signal Received",
        title: "The Lantern Runner",
        body: `<p>You awaken on a rain-slicked skyway, a survey unit stitched together from repurposed relics.</p>
          <p>Follow the cyan beacons, ignite dormant seeds, and let this portfolio unfold like a nocturnal expedition.</p>`,
      },
    },
    {
      name: "about",
      center: new THREE.Vector3(-5.4, 0.6, -0.6),
      radius: 2.2,
      tint: new THREE.Color(0xffa94f),
      content: {
        subtitle: "Origin Story",
        title: "About Me",
        body: `<p>I build tactile, narrative-rich worlds for games and interactive art installations.</p>
          <ul>
            <li>Experience design &amp; world building for immersive media</li>
            <li>Rendering, shaders, and real-time storytelling pipelines</li>
            <li>Creative direction for atmospheric, emotionally charged spaces</li>
          </ul>`,
      },
    },
    {
      name: "projects",
      center: new THREE.Vector3(-0.2, 0.6, -1.2),
      radius: 2.4,
      tint: new THREE.Color(0xff93d2),
      content: {
        subtitle: "Archive",
        title: "Projects",
        body: `<p>Artifacts suspended in stasis narrate earlier voyages.</p>
          <ul>
            <li><strong>Echoes of the Maw</strong> — stealth survival vignette with reactive lighting AI.</li>
            <li><strong>Paper Lanterns</strong> — generative WebGL poem that paints with fog and fragments.</li>
            <li><strong>Harbor Lights</strong> — co-op UI experiment blending tactile knobs with spatial audio.</li>
          </ul>`,
      },
    },
    {
      name: "playlab",
      center: new THREE.Vector3(4.8, 0.6, 1.6),
      radius: 2.4,
      tint: new THREE.Color(0x50d7ff),
      content: {
        subtitle: "Play Lab",
        title: "Prototype Garden",
        body: `<p>Roadside terminals host sketches-in-progress: small physics toys, AI-driven ambience studies, and narrative systems tests.</p>
          <p>The interactive seeds nearby awaken ambient reactions—feel free to activate them all.</p>`,
      },
    },
    {
      name: "process",
      center: new THREE.Vector3(7.6, 0.6, -0.8),
      radius: 2.4,
      tint: new THREE.Color(0xffd67b),
      content: {
        subtitle: "Process",
        title: "How I Work",
        body: `<p>I iterate in playable mood boards: block out lighting first, script interactions second, refine narrative beats last.</p>
          <p>Production pillars: rapid greyboxing, shader prototyping, collaborative docs, and playtest-driven refinements.</p>`,
      },
    },
    {
      name: "contact",
      center: new THREE.Vector3(11.2, 0.6, -0.1),
      radius: 2.5,
      tint: new THREE.Color(0x89f2ff),
      content: {
        subtitle: "Transmission",
        title: "Contact",
        body: `<p>Signal the workshop for collaborations or atmospheric adventures.</p>
          <p>Email: <a href="mailto:lantern@moodyport.io">lantern@moodyport.io</a><br />
          Mastodon: <a href="https://mastodon.social/@lantern" target="_blank" rel="noreferrer">@lantern</a></p>`,
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

  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.16, radius * 0.16, 0.05, 48),
    new THREE.MeshStandardMaterial({
      color: tint.clone().multiplyScalar(0.4),
      emissive: tint,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.6,
    })
  );
  disc.position.copy(center).setY(0.02);
  visuals.add(disc);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.55, radius * 0.04, 24, 64),
    new THREE.MeshStandardMaterial({
      color: tint,
      emissive: tint,
      emissiveIntensity: 1.1,
      transparent: true,
      opacity: 0.5,
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.copy(center).setY(0.08);
  visuals.add(ring);

  const monolith = new THREE.Mesh(
    new THREE.BoxGeometry(radius * 0.8, radius * 1.6, radius * 0.3),
    new THREE.MeshStandardMaterial({ color: 0x181c23, roughness: 0.7, metalness: 0.2 })
  );
  monolith.position.copy(center).setY(radius * 0.8 + 0.05).setZ(center.z - 0.4);
  monolith.castShadow = true;
  visuals.add(monolith);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.25, radius * 0.1, radius * 2.4, 24, 1, true),
    new THREE.MeshStandardMaterial({
      color: tint,
      emissive: tint,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  beam.position.copy(center).setY(radius * 1.4);
  visuals.add(beam);

  const volumetric = new THREE.PointLight(tint, 0.6, radius * 4, 2.5);
  volumetric.position.copy(center).setY(radius * 1.8);
  visuals.add(volumetric);

  visuals.userData.ring = ring;
  visuals.userData.beam = beam;
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

function createSynthTree(position, scale, tint) {
  const group = new THREE.Group();
  group.position.copy(position);

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25 * scale, 0.2 * scale, 1.6 * scale, 12),
    new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 0.65, metalness: 0.25 })
  );
  trunk.position.y = 0.8 * scale;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  const branches = new THREE.Mesh(
    new THREE.ConeGeometry(0.45 * scale, 1.2 * scale, 6, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x2d323c, roughness: 0.6, metalness: 0.35 })
  );
  branches.position.y = 1.4 * scale;
  branches.castShadow = true;
  group.add(branches);

  const leavesMaterial = new THREE.MeshStandardMaterial({
    color: tint,
    emissive: tint,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.75,
  });

  const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72 * scale, 1), leavesMaterial);
  leaves.position.y = 2 * scale;
  leaves.castShadow = true;
  group.add(leaves);

  return { group, leaves, glow: { value: 1.0 } };
}

function createHoverDrone(position, tint) {
  const group = new THREE.Group();
  group.position.copy(position);

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 24, 18),
    new THREE.MeshStandardMaterial({ color: 0x1e242f, metalness: 0.9, roughness: 0.2 })
  );
  const iris = new THREE.Mesh(
    new THREE.RingGeometry(0.1, 0.22, 32),
    new THREE.MeshStandardMaterial({ color: tint, emissive: tint, emissiveIntensity: 1.2 })
  );
  iris.rotation.x = Math.PI / 2;
  iris.position.z = 0.28;

  const light = new THREE.PointLight(tint, 1.1, 6, 2.2);
  light.position.set(0, 0, 0.2);

  const fins = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.3, 3),
    new THREE.MeshStandardMaterial({ color: 0x2d323c, metalness: 0.7, roughness: 0.3 })
  );
  fins.position.set(0, -0.32, 0);

  group.add(shell, iris, light, fins);

  return { group, iris };
}

function createMemorySeed(position, tint) {
  const group = new THREE.Group();
  group.position.copy(position);

  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.18, 1),
    new THREE.MeshStandardMaterial({
      color: tint,
      emissive: tint,
      emissiveIntensity: 1.1,
      metalness: 0.5,
      roughness: 0.25,
      transparent: true,
      opacity: 0.92,
    })
  );

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.03, 12, 48),
    new THREE.MeshStandardMaterial({
      color: tint,
      emissive: tint,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.7,
    })
  );
  ring.rotation.x = Math.PI / 2;

  const light = new THREE.PointLight(tint, 1.1, 6, 2.6);

  group.add(orb, ring, light);

  return {
    group,
    ring,
    light,
    state: { activated: false },
  };
}

function createParticles() {
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 260;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(24);
    positions[i * 3 + 1] = Math.random() * 4 + 1.5;
    positions[i * 3 + 2] = THREE.MathUtils.randFloat(-4, 3.5);
    sizes[i] = Math.random() * 0.6 + 0.2;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: 0xc8f1ff,
    size: 0.16,
    transparent: true,
    opacity: 0.6,
  });

  return new THREE.Points(particleGeometry, material);
}
