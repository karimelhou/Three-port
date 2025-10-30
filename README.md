# Little Nightmares Portfolio

A moody, Little Nightmares–inspired interactive portfolio presented as a miniature playable scene. Wander through a shadowy hallway, follow pockets of light, and discover placeholder portfolio content as the lantern-bearing character approaches each vignette.

## Atmospheric Direction
- **Tone:** Bleak, storybook horror ambience with soft fog, hanging lights, and creaking industrial details.
- **Perspective:** A cinematic third-person camera gliding behind the player.
- **Interaction:** Move with `W`, `A`, `S`, `D`. Approach glowing glyphs to reveal portfolio sections layered diegetically into the space.
- **Audio:** Lightweight Web Audio drones and distant resonances crafted procedurally—no external sound files required.

## Tech Stack
- [Three.js](https://threejs.org/) for all rendering, lighting, and lightweight physics.
- [Vite](https://vitejs.dev/) for instant local development with ES modules.
- Vanilla CSS for UI overlays and cinematic letterboxing.

## Getting Started
```bash
npm install
npm start
```
Open the printed localhost URL (default `http://localhost:5173`) in your browser. The experience loads immediately—no additional assets are required.

### Controls
- `W` / `S`: Drift forward or backward within the shallow space.
- `A` / `D`: Move left and right along the hallway.
- Explore the corridor; soft lights mark interactive spaces (About, Projects, Contact).

## Folder Structure
```
.
├── index.html          # Entry point bootstrapping the renderer
├── package.json        # Scripts and dependencies
├── README.md           # Project overview & guidance
├── src/
│   ├── main.js         # Bootstraps renderer, camera loop, trigger handling
│   ├── player.js       # Lantern-bearing player character and locomotion
│   ├── scene.js        # World geometry, vignettes, and trigger definitions
│   ├── lighting.js     # Ambient, rim, and spotlight configuration
│   ├── ui.js           # Cinematic overlay panels for portfolio content
│   └── soundscape.js   # Procedural ambient drones and subtle footsteps
├── styles/
│   └── style.css       # Letterboxing, overlay styling, and typography
└── assets/             # Placeholder for future textures or JSON assets
```

## Filling in Real Portfolio Content
Replace the placeholder strings in `src/scene.js` within `triggerData` to inject real biography, projects, or contact information. Each trigger automatically updates its glyph hue and overlay copy.

## Notes & Future Ideas
- Swap the primitive character for a custom low-poly mesh (JSON or procedural) once ready.
- Extend the hallway with additional rooms (skills, journals, experiments) by appending trigger entries.
- Introduce subtle puzzles—drag crates, light candles, or solve silhouettes to unlock deeper pages.

Enjoy the lantern-lit stroll!
