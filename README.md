# Lantern Runner Night Garden

A Little Nightmares–inspired portfolio vignette reframed as a modern, neon-drenched night garden. Guide a lantern-armed robot along a rain-slick skyway, awaken glowing seeds, and let each illuminated alcove surface placeholder portfolio panels.

## Atmosphere & Experience
- **Setting:** Elevated causeway with reflective water, hovering drones, and synth trees that bloom as you explore.
- **Perspective:** Third-person cinematic camera drifting behind a smooth, heavy-footed robot.
- **Interaction:** Move with `W`, `A`, `S`, `D`, approach holographic markers to reveal portfolio sections, and collect luminous seeds to stir the environment.
- **Audio:** Procedural drones and footfalls generated on the fly—no audio files required.

## Tech Stack
- [Three.js](https://threejs.org/) powers rendering, custom geometry, lighting, and collision bounds.
- [Vite](https://vitejs.dev/) handles the build/dev server for ES module authoring.
- Vanilla CSS creates the holographic overlay UI, neon typography, and cinematic letterboxing.

## Getting Started
```bash
npm install
npm start
```
Open the printed localhost URL (default `http://localhost:5173`) to explore. Everything is procedural—no additional assets needed.

### Controls & Goals
- `W` / `S`: Move forward or backward along the platform.
- `A` / `D`: Strafe across the walkway.
- Approach cyan glyphs to surface **About**, **Projects**, **Prototype Garden**, **Process**, and **Contact** overlays.
- Awaken the three hovering **memory seeds** to ignite the synth trees and update the HUD counter.

## Folder Structure
```
.
├── index.html          # Entry point bootstrapping the renderer
├── package.json        # Scripts and dependencies (Three.js + Vite)
├── README.md           # Experience overview and setup instructions
├── src/
│   ├── main.js         # Renderer loop, camera follow, triggers & collectibles
│   ├── player.js       # Robot rig, animation cycles, and lamp behaviour
│   ├── scene.js        # Environment assembly, synth trees, drones, triggers
│   ├── lighting.js     # Ambient, rim, and spot lighting configuration
│   ├── ui.js           # Overlay composition for cinematic copy
│   └── soundscape.js   # Procedural ambience & footstep pulses
├── styles/
│   └── style.css       # Neon UI, typography, and letterbox styling
└── assets/             # Placeholder for future JSON/texture assets
```

## Customising for Your Portfolio
- Update `triggerData` inside `src/scene.js` with real copy, links, and section structure.
- Swap placeholder memory-seed text in `createRoomTriggers` or repurpose the interactive seeds for unlockable case studies.
- Extend the environment by appending new synth trees, drones, or trigger entries—everything is generated from primitives.

## Future Enhancements
- Introduce lightweight quests (collect items to open gates, reroute light into mirrors).
- Layer in shader-based rain streaks or volumetric light shafts for deeper mood.
- Expand the robot rig with keyframe blending or ragdoll physics to suit future narrative beats.

Enjoy the nocturnal stroll!
