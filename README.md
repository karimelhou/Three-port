# Lantern Runner Night Garden

Lantern Runner Night Garden is a Little Nightmares–inspired portfolio vignette reframed as a modern, neon-drenched night garden. The project blends a playable mini-experience with the structure of a personal site, letting visitors explore, collect, and unlock portfolio sections through atmospheric play. Guide a lantern-armed robot along a rain-slick skyway, awaken glowing seeds, and let each illuminated alcove surface placeholder portfolio panels that can later be swapped for real content.

## Atmosphere & Experience
- **Setting:** An elevated causeway suspended above endless clouds, punctuated by reflective pools, hovering drones, and synth trees that bloom as you explore. Weather-reactive lighting and fog create silhouettes reminiscent of Little Nightmares while still feeling futuristic.
- **Perspective:** A slow third-person camera that drifts behind the player, easing into movement and banking slightly during turns to maintain a cinematic, side-on profile.
- **Interaction:** Movement uses `W`, `A`, `S`, `D` with subtle inertia. Approach holographic markers to reveal portfolio sections, collect luminous seeds to stir the environment, and trigger ambient animations as you explore the skyway.
- **Audio:** Procedural drones, lamp hums, and footfalls generated on the fly—no audio files required. The soundscape evolves as seeds are gathered and zones awaken.

## Tech Stack & Architecture
- **Three.js** handles rendering, custom geometry, and collision bounds. Everything in the world—character, trees, roads, drones—is constructed from primitives or procedurally generated data, so the experience ships without binary assets.
- **Vite** powers the build/dev server, enabling fast module hot reloading while iterating on animations and scene composition.
- **Vanilla CSS** shapes the holographic UI overlays, HUD, neon typography, and cinematic letterboxing.
- **Modular ES Modules** split responsibilities across dedicated files (`player.js`, `scene.js`, `lighting.js`, etc.) so future contributors can extend gameplay, visuals, or UI without hunting through monolithic scripts.

## Getting Started
```bash
npm install
npm start
```
Open the printed localhost URL (default `http://localhost:5173`) to explore. Everything is procedural—no additional assets needed.

### Controls & Goals
- `W` / `S`: Move forward or backward along the platform.
- `A` / `D`: Strafe across the walkway.
- Hold movement keys briefly to build momentum—controls are intentionally weighted to mirror the slow, deliberate feel of Little Nightmares.
- Approach cyan glyphs to surface **About**, **Projects**, **Prototype Garden**, **Process**, and **Contact** overlays in-world.
- Awaken the three hovering **memory seeds** to ignite the synth trees, spawn new light trails, and update the HUD counter.
- Follow subtle pools of light or drone patrols to uncover optional lore snippets and the hidden gallery overlook.

## Folder Structure
```
.
├── index.html          # Entry point bootstrapping the renderer and mounting UI roots
├── package.json        # Scripts and dependencies (Three.js + Vite)
├── README.md           # Experience overview, setup notes, and design intent
├── src/
│   ├── main.js         # Renderer loop, camera follow, triggers & collectible management
│   ├── player.js       # Robot rig, inverse kinematics, animation cycles, and lamp behaviour
│   ├── scene.js        # Environment assembly, synth trees, drones, triggers, and world logic
│   ├── lighting.js     # Ambient, rim, and spot lighting configuration with mood presets
│   ├── ui.js           # Overlay composition for cinematic copy, HUD counters, and hints
│   └── soundscape.js   # Procedural ambience & footstep pulses with seed-reactive modulation
├── styles/
│   └── style.css       # Neon UI, typography, and letterbox styling
└── assets/             # Placeholder for future JSON/texture assets
```

## Customising for Your Portfolio
- Update `triggerData` inside `src/scene.js` with real copy, links, and section structure. Each trigger controls the holographic slab text and optional call-to-action.
- Swap placeholder memory-seed text in `createRoomTriggers` or repurpose the interactive seeds for unlockable case studies, achievement tracking, or secret reels.
- Extend the environment by appending new synth trees, drones, or trigger entries—everything is generated from primitives and procedural offsets, so a single data push can grow the world.
- Adjust material palettes in `lighting.js` and `scene.js` to shift the atmosphere from neon blues to warmer candlelight or desaturated greys.

## Future Enhancements
- Introduce lightweight quests (collect items to open gates, reroute light into mirrors) so the portfolio doubles as a narrative puzzle.
- Layer in shader-based rain streaks or volumetric light shafts for deeper mood once performance budgets are confirmed.
- Expand the robot rig with keyframe blending or ragdoll physics to suit future narrative beats or micro-interactions.
- Add mobile-friendly camera presets and touch controls to widen device coverage without sacrificing atmosphere.

Enjoy the nocturnal stroll!
