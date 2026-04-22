# FlowPilot

FlowPilot is a visual, drag-and-drop workflow designer built to help HR teams and operations managers map out process pipelines. Whether it's an employee onboarding sequence or a complex approval hierarchy, FlowPilot lets you architect the logic visually.

## Quick Start

You'll need Node.js installed to run this locally.

```bash
# Install dependencies
npm install

# Start the Vite development server 
npm run dev
```

Visit `http://localhost:5173` in your browser to start building.

## How it Works

The application revolves around three main interactions:

- **The Canvas**: Powered by React Flow. Drag components from the left sidebar onto the central grid and wire them together.
- **Node Configuration**: Selecting any node on the canvas opens a contextual panel on the right. Each component type (`Start`, `Task`, `Approval`, `Automated Action`, `End`) has a tailored form to capture specific metadata.
- **Simulation**: Once your workflow is wired up, hit the **Simulate** button. A local mock execution engine will traverse your graph step-by-step and output a log. It's a quick way to sanity-check your logic and catch infinite loops.

## Tech Stack

I kept the stack deliberately lean to prioritize a snappy UX and maintainable codebase:

- **React + Vite**: For fast builds and a reactive UI.
- **@xyflow/react**: The backbone of the canvas, handling panning, zooming, and node/edge rendering.
- **Zustand**: Used as a centralized store for managing the graph state. It pairs perfectly with React Flow, letting us update node data dynamically without triggering massive re-renders across the app.
- **Vanilla CSS**: No heavy UI frameworks or utility classes here. The design relies on clean, scoping-friendly CSS modules, CSS variables, and modern features to achieve the dark theme and glassmorphism aesthetics.

## Project Structure

If you're poking around the source code, here's the lay of the land:

- `/src/components` - The structural UI shells (`Canvas`, `Sidebar`, `ConfigPanel`, etc.).
- `/src/nodes` - Visual definitions for the custom React Flow nodes.
- `/src/forms` - The specific data entry forms that render inside the configuration panel.
- `/src/store` - Where `useWorkflowStore.js` lives, containing the Zustand implementation.
- `/src/services` - Where the mock API and the simulation traversal engine (`api.js`) reside.

## Roadmap & Known Limitations

This is a prototype, and there are a few obvious next steps if you want to take it to production:

- **Conditional Routing**: The current simulator mostly follows a straight-line "happy path". To be fully featured, it needs an expression evaluator to dynamically trace conditional edges (e.g. following the "Rejected" port vs the "Approved" port).
- **Persistence**: Everything is currently held in memory. Hooking the `getWorkflowData()` export up to a database (or even just `localStorage`) is required to save sessions.
- **Strict Canvas Validation**: Right now, there aren't many guardrails. Adding checks to prevent wiring an `End` node back to a `Start` node would make the designer more robust.
