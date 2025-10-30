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
scene.fog = new THREE.FogExp2(0x050507, 0.12);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 4, 9);
camera.lookAt(0, 2.8, 0);

const lights = createLights();
lights.forEach((light) => scene.add(light));

const environment = buildEnvironment(scene);
const triggers = createRoomTriggers(scene);
const player = new Player(scene);
const overlay = new OverlayUI();
const ambience = new AmbientSoundscape();

const clock = new THREE.Clock();
const controlsHint = createControlsHint();
let activeTrigger = null;

function createControlsHint() {
  document.body.classList.add("fade-letterbox");
  const hint = document.createElement("div");
  hint.className = "controls-hint";
  hint.innerHTML = "<span>W A S D</span> — Move | Approach the light to discover.";
  document.body.appendChild(hint);
  return hint;
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
  player.update(delta, keyState);
  const elapsed = clock.elapsedTime;

  // clamp player inside environment bounds
  const bounds = environment.bounds;
  player.position.x = THREE.MathUtils.clamp(player.position.x, bounds.minX, bounds.maxX);
  player.position.z = THREE.MathUtils.clamp(player.position.z, bounds.minZ, bounds.maxZ);

  // Update camera to follow player with slight delay
  const targetPos = new THREE.Vector3(player.position.x + 1.4, player.position.y + 3.0, player.position.z + 8);
  camera.position.lerp(targetPos, 0.05);
  const lookTarget = new THREE.Vector3(player.position.x, player.position.y + 1.5, player.position.z);
  camera.lookAt(lookTarget);

  // Evaluate triggers
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
      controlsHint.classList.add("hidden");
    } else {
      overlay.hide();
      controlsHint.classList.remove("hidden");
    }
  }

  player.updateLantern(triggers);

  // animate trigger glyphs subtly
  for (const trigger of triggers) {
    const { glyph, lightCone, volumetric } = trigger.visuals.userData;
    if (glyph) {
      glyph.material.opacity = 0.45 + Math.sin(elapsed * 0.8 + trigger.center.x) * 0.15;
      glyph.rotation.z = elapsed * 0.1;
    }
    if (lightCone) {
      lightCone.material.opacity = 0.18 + Math.sin(elapsed * 1.1 + trigger.center.z) * 0.08;
    }
    if (volumetric) {
      volumetric.intensity = 0.35 + Math.sin(elapsed * 0.6 + trigger.center.x * 0.3) * 0.1;
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
