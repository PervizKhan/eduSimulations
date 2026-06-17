# EducationSimulation

A freemium, schema-driven physics education platform built with Next.js, Three.js, and Canvas. Features interactive, gamified simulations for K-12 students learning Physics, Chemistry, and Mathematics.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

### Build for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
education-simulation/
├── app/
│   ├── layout.js                # Root layout with Tailwind styling
│   ├── page.js                  # Home page with simulation gallery
│   ├── globals.css              # Global styles
│   └── simulations/
│       └── [slug]/
│           └── page.js          # Dynamic simulation page
├── components/
│   ├── SimulationWrapper.jsx    # Universal simulation UI container
│   └── PremiumGateModal.jsx     # Premium content modal
├── physicsEngines/
│   ├── projectile3D.js          # 3D Projectile motion (Three.js)
│   ├── pendulum2D.js            # Simple pendulum (Canvas)
│   └── freefall2D.js            # Free fall simulator (Canvas)
├── config/
│   └── simulations/
│       ├── 3d-projectile.json   # Projectile config
│       ├── basic-pendulum.json  # Pendulum config
│       └── freefall.json        # Freefall config
├── lib/
│   ├── configLoader.js          # Load simulation configs
│   └── physicsUtils.js          # Physics calculations & formatting
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎮 Available Simulations

### Free Simulations
- **Basic Pendulum Lab** (`/simulations/basic-pendulum`) - Simple harmonic motion with configurable length, mass, angle, and gravity
- **Free Fall Simulator** (`/simulations/freefall`) - Study acceleration with adjustable height, mass, and air resistance

### Premium Simulations
- **3D Projectile Playground** (`/simulations/3d-projectile`) - Advanced 3D trajectory analysis with real-time telemetry

## 🏗️ Architecture

### Schema-Driven UI Pattern
Instead of creating unique components for each simulation, the platform uses:

1. **JSON Configuration Files** (`config/simulations/*.json`)
   - Define UI controls (sliders, ranges, defaults)
   - Specify physics engine module to load
   - Set premium gating flags

2. **Universal Dynamic Route** (`app/simulations/[slug]/page.js`)
   - Loads config based on URL slug
   - Dynamically imports physics engine
   - Renders SimulationWrapper with loaded config

3. **Physics Engines** (`physicsEngines/*.js`)
   - Standalone rendering modules
   - Accept config + controls as props
   - Render to Canvas (2D) or WebGL/Three.js (3D)
   - Update telemetry HUD in real-time

### Key Design Principles

✨ **Child-Friendly Aesthetics**
- High-contrast colors (Sky: `#bae6fd`, Grass: `#4ade80`)
- Playful, heavily-rounded UI elements
- Clear emoji-based labels

📊 **Real-Time Telemetry**
- Top-right HUD panel with absolute positioning
- Live metrics: time, speed, position, height, range, flight time
- Formatted with 2-3 decimal places for clarity

🎯 **Dynamic Physics**
- No arbitrary time bounds—simulations run until natural completion
- Collision detection for landing/stopping
- Camera tracking for large-scale animations (3D only)

🔒 **Premium Gating**
- Modal intercepts premium simulations
- `isPremium` flag in config controls gating
- Easy to implement subscription logic

## 📝 Adding New Simulations

### Step 1: Create Configuration File
Create a new JSON file in `config/simulations/{slug}.json`:

```json
{
  "slug": "new-simulation",
  "title": "My New Simulation 🔬",
  "category": "Physics",
  "isPremium": false,
  "engineModule": "myEngine",
  "dimensions": "2D",
  "description": "Description of the simulation",
  "controls": [
    {
      "id": "param1",
      "label": "Parameter 1",
      "min": 0,
      "max": 100,
      "default": 50,
      "step": 1,
      "unit": "units"
    }
  ]
}
```

### Step 2: Create Physics Engine
Create a new engine file in `physicsEngines/{engineModule}.js`:

```javascript
'use client';

import { useEffect, useRef } from 'react';

export default function MyEngine({ config, controls, isRunning }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialization code
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
```

### Step 3: Register Engine
Add your engine to the `engines` object in `components/SimulationWrapper.jsx`:

```javascript
const engines = {
  projectile3D: ProjectileSimulation,
  pendulum2D: PendulumSimulation,
  freefall2D: FreefallSimulation,
  myEngine: MyEngineSimulation, // Add this
};
```

### Step 4: Test
Visit `/simulations/new-simulation` to test your new simulation.

## 🎨 Styling

The project uses **Tailwind CSS** with custom color extensions:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      sky: "#bae6fd",    // Sky blue
      grass: "#4ade80",  // Grass green
    },
    borderRadius: {
      "3xl": "2rem",     // Extra rounded corners
    },
  },
}
```

## 🔧 Technologies

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + PostCSS
- **3D Graphics**: Three.js
- **2D Graphics**: HTML5 Canvas API
- **Rendering**: Server-side generated, client-side hydrated

## 🚀 Performance Optimizations

- **Dynamic Imports**: Physics engines use `next/dynamic` with `ssr: false`
- **Canvas Scaling**: Responsive sizing without re-rendering
- **RequestAnimationFrame**: 60fps animation loops
- **Efficient Telemetry**: Formatted on-demand, not reactive

## 📄 License

MIT

## 🎓 Educational Content

All simulations use accurate physics formulas:
- **Projectile Motion**: v(t) = v₀ ± gt, x(t) = v₀t + ½gt²
- **Simple Pendulum**: θ(t) = θ₀cos(ωt), ω = √(g/L)
- **Free Fall**: y(t) = y₀ - ½gt², v(t) = gt

Great for K-12 STEM education!
