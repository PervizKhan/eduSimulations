import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EducationSimulation - Master Architecture Plan</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #0284c7; border-bottom: 3px solid #0284c7; padding-bottom: 10px; font-size: 28px; }
        h2 { color: #0369a1; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; font-size: 20px; }
        h3 { color: #0f172a; font-size: 16px; }
        code, pre { background: #f1f5f9; padding: 10px; border-radius: 6px; font-family: 'Courier New', Courier, monospace; display: block; overflow-x: auto; font-size: 13px; border-left: 4px solid #cbd5e1; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
        th { background-color: #f8fafc; color: #0369a1; }
        .blockquote { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; font-style: italic; border-radius: 0 8px 8px 0; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
    </style>
</head>
<body>

    <h1>🚀 EDUCATION SIMULATION - ARCHITECTURE & MASTER PLAN</h1>
    
    <h2>1. Project Overview & Vision</h2>
    <ul>
        <li><strong>Project Name:</strong> EducationSimulation</li>
        <li><strong>Target Audience:</strong> K-12 Students (Ages 8-18) learning Physics, Chemistry, and Mathematics.</li>
        <li><strong>Core Philosophy:</strong> Gamified, pleasant, high-contrast, child-friendly, and interactive visual learning.</li>
        <li><strong>Monetization Model:</strong> Freemium. Core simulations are free; advanced labs are locked behind a metadata-driven premium paywall.</li>
        <li><strong>Release Cadence:</strong> Scalable, data-driven daily updates (adding 1 new simulation daily).</li>
    </ul>

    <h2>2. Technology Stack</h2>
    <ul>
        <li><strong>Framework:</strong> Next.js (App Router architecture for SEO optimization and premium routing controls).</li>
        <li><strong>2D Graphics:</strong> Vanilla HTML5 Canvas API (for lightweight rendering loops).</li>
        <li><strong>3D Graphics:</strong> WebGL powered by <strong>Three.js</strong> (for depth-based tracking, realistic lighting, and 3D vector representations).</li>
        <li><strong>Styling:</strong> Tailwind CSS (configured with playful, heavily rounded, child-friendly layout elements).</li>
    </ul>

    <h2>3. Core Architectural Pattern: Schema-Driven (Data-Driven) UI</h2>
    <p>To ensure frictionless daily scalability, the platform completely decouples the <strong>User Interface (UI Layout)</strong> from the <strong>Physics/Mathematical Engine</strong>.</p>
    <p>Instead of writing a unique React component or page for every single simulation, the system utilizes a single <strong>Universal Dynamic Route</strong> (<code>app/simulations/[slug]/page.js</code>) that reads a decoupled JSON configuration file and dynamically maps parameters onto a generic template layout wrapper.</p>

    <h3>Directory Structure Blueprint:</h3>
    <pre>
education-simulation/
├── app/
│   └── simulations/
│       └── [slug]/
│           └── page.js           # Universal Layout & Core Render Component
├── config/
│   └── simulations/
│       ├── 3d-projectile.json    # JSON UI configuration for Projectile Lab
│       └── basic-pendulum.json   # JSON UI configuration for Pendulum Lab
├── physicsEngines/
│   ├── projectile3D.js           # Mathematical equations & render injection for Projectile
│   └── pendulum2D.js             # Mathematical equations & render injection for Pendulum
└── components/
    ├── SimulationWrapper.jsx     # Handles Sliders layout, Play/Pause, Top-Right HUD Card
    └── PremiumGateModal.jsx      # Intercepts session rendering if isPremium is true</pre>

    <h2>4. JSON Config Schema Specification</h2>
    <p>Every daily simulation configuration must strictly follow this metadata layout:</p>
    <pre>
{
  "slug": "3d-projectile",
  "title": "3D Projectile Playground &amp;#128640;",
  "category": "Physics",
  "isPremium": true,
  "engineModule": "projectile3D",
  "dimensions": "3D",
  "controls": [
    { "id": "v0", "label": "Launch Speed", "min": 10, "max": 80, "default": 45, "step": 1, "unit": "m/s" },
    { "id": "angle", "label": "Launch Pitch Angle", "min": 15, "max": 90, "default": 45, "step": 1, "unit": "&deg;" },
    { "id": "azimuth", "label": "Direction Angle", "min": -90, "max": 90, "default": 0, "step": 1, "unit": "&deg;" },
    { "id": "g", "label": "Planet Gravity", "min": 3, "max": 25, "default": 9.8, "step": 0.1, "unit": "m/s&sup2;" }
  ]
}</pre>

    <h2>5. Non-Negotiable Engine &amp; UI Guardrails</h2>
    <ul>
        <li><strong>Dynamic Landing (No Arbitrary Time Bounds):</strong> Simulations must never stop at an arbitrary hardcoded timer. The engine must evaluate boundary collision points in real time, running smoothly until the object reaches its natural state of rest (e.g., hitting the ground).</li>
        <li><strong>Top-Right HUD Panel Constraint:</strong> All active telemetry details (Time, Speed, Position, Max Height, Total Range, Total Flight Time) must always render inside an absolute-positioned screen space HUD element locked specifically to the <strong>Top-Right Corner</strong> of the viewport canvas.</li>
        <li><strong>Child-Centric Aesthetics:</strong> UI styling vectors must use soft, playful, high-contrast configurations (Sky tint <code>#bae6fd</code>, Grass ground <code>#4ade80</code>). Complex scientific variable notations should be translated into readable text metrics and interactive emojis.</li>
        <li><strong>Hydration Protection:</strong> Heavy client-side canvases or WebGL configurations must utilize Next.js asynchronous <code>dynamic()</code> imports with <code>ssr: false</code> to prevent server environment rendering errors.</li>
        <li><strong>Cinematic Camera Tracking:</strong> For large-scale animations, the viewport camera must dynamically translate its look-at offset matrix following the tracking object's real-time position coordinates.</li>
    </ul>

    <h2>6. Handover Instruction Template for Future AI Sessions</h2>
    <p>Copy and paste this specific block into any new AI window (ChatGPT / Claude / DeepSeek) to instantly onboard the model:</p>
    
    <div class="blockquote">
        "I am working on a Next.js Freemium project called <strong>EducationSimulation</strong>. We use a Schema-Driven UI framework where JSON metadata builds control layouts dynamically, and standalone math scripts handle render injections. I need you to act as an expert Full-Stack Software Engineer and Physics Educator. When I ask you to build or optimize a simulation, your outputs must align perfectly with this structure: utilizing dynamic imports, child-friendly styling parameters, top-right telemetry HUD placement, and boundless physical collision execution logic."
    </div>

</body>
</html>
"""

with open("EducationSimulation_Master_Plan.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("🎯 Boom! 'EducationSimulation_Master_Plan.html' has been generated in this folder.")
print("👉 Double-click to open it in Chrome/Edge, press Ctrl+P (Cmd+P) to save as PDF!")
print("👉 Or right-click the file, open with Microsoft Word, and save it as a .docx file!")