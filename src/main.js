import * as THREE from "three";
import { createLights } from "./lighting.js";
import { buildEnvironment, createRoomTriggers } from "./scene.js";
import { Player } from "./player.js";
import { OverlayUI } from "./ui.js";
import { AmbientSoundscape } from "./soundscape.js";

const canvas = document.getElementById("game-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio || 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050507);
scene.fog = new THREE.FogExp2(0x050507, 0.1);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 220);
camera.position.set(-2, 4.5, 10);
camera.lookAt(0, 2.6, 0);

const lights = createLights();
lights.forEach((light) => scene.add(light));

const environment = buildEnvironment(scene);
const triggers = createRoomTriggers(scene);
const player = new Player(scene);
const overlay = new OverlayUI();
const ambience = new AmbientSoundscape();

const interactives = environment.interactives ?? [];
const totalSeeds = interactives.length;
let awakenedSeeds = 0;

const clock = new THREE.Clock();
const controlsHint = createControlsHint(totalSeeds);
let activeTrigger = null;

function createControlsHint(total) {
  document.body.classList.add("fade-letterbox");
  const hint = document.createElement("div");
  hint.className = "controls-hint";
  document.body.appendChild(hint);

  const update = (count) => {
    const progress = total > 0 ? ` | <span class="collect-count">Awakened seeds ${count}/${total}</span>` : "";
    hint.innerHTML = `<span>W A S D</span> — Move${progress}`;
  };

  update(0);
  return {
    element: hint,
    update,
  };
}

const keyState = new Map();
window.addEventListener("keydown", (event) => {
  keyState.set(event.code, true);
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
    event.preventDefault();
  }
  ambience.resume();
});

window.addEventListener("keyup", (event) => {
  keyState.set(event.code, false);
});

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function update() {
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  player.update(delta, keyState);

  const bounds = environment.bounds;
  player.position.x = THREE.MathUtils.clamp(player.position.x, bounds.minX, bounds.maxX);
  player.position.z = THREE.MathUtils.clamp(player.position.z, bounds.minZ, bounds.maxZ);

  if (environment.update) {
    environment.update(elapsed, delta);
  }

  const targetPos = new THREE.Vector3(player.position.x + 1.6, player.position.y + 3.6, player.position.z + 9.5);
  camera.position.lerp(targetPos, 0.05);
  const lookTarget = new THREE.Vector3(player.position.x, player.position.y + 1.8, player.position.z);
  camera.lookAt(lookTarget);

  let nextTrigger = null;
  for (const trigger of triggers) {
    if (trigger.bounds.containsPoint(player.position)) {
      nextTrigger = trigger;
      break;
    }
  }

  if (nextTrigger !== activeTrigger) {
    activeTrigger = nextTrigger;
    if (activeTrigger) {
      overlay.show(activeTrigger.content);
      controlsHint.element.classList.add("hidden");
    } else {
      overlay.hide();
      controlsHint.element.classList.remove("hidden");
    }
  }

  for (const interactive of interactives) {
    if (!interactive.activated && player.position.distanceTo(interactive.center) <= interactive.radius) {
      const activated = interactive.activate ? interactive.activate() : true;
      if (activated) {
        interactive.activated = true;
        awakenedSeeds += 1;
        controlsHint.update(awakenedSeeds);
      }
    }
  }

  player.updateLantern(triggers);

  for (const trigger of triggers) {
    const { ring, beam, volumetric } = trigger.visuals.userData;
    if (ring) {
      ring.rotation.z = elapsed * 0.4 + trigger.center.x * 0.05;
      ring.material.opacity = 0.35 + Math.sin(elapsed * 1.2 + trigger.center.x) * 0.15;
    }
    if (beam) {
      beam.material.opacity = 0.16 + Math.sin(elapsed * 1.1 + trigger.center.z) * 0.08;
    }
    if (volumetric) {
      volumetric.intensity = 0.35 + Math.sin(elapsed * 0.8 + trigger.center.x * 0.2) * 0.12;
    }
  }
}

function render() {
  renderer.render(scene, camera);
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

loop();
