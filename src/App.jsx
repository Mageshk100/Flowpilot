import React from 'react';
import { Network, PlayCircle } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { ConfigPanel } from './components/ConfigPanel';
import { SimulationPanel } from './components/SimulationPanel';
import { useSimulation } from './hooks/useSimulation';
import useWorkflowStore from './store/useWorkflowStore';

function AppContent() {
  const { isSimulating, simulationLogs, modalOpen, runSimulation, closeSimulation } =
    useSimulation();

  const nodeCount = useWorkflowStore((s) => s.nodes.length);
  const edgeCount = useWorkflowStore((s) => s.edges.length);

  return (
    <div className="app-container">
      {/* ─── Navbar ─── */}
      <nav className="navbar" id="main-navbar">
        <div className="navbar-brand">
          <Network size={22} />
          FlowPilot
          <span className="brand-subtitle">HR Workflow Designer</span>
        </div>

        <div className="navbar-actions">
          {/* Live stats */}
          <div className="navbar-stats">
            <div className="stat-item">
              <span className="stat-dot nodes" />
              {nodeCount} node{nodeCount !== 1 ? 's' : ''}
            </div>
            <div className="stat-item">
              <span className="stat-dot edges" />
              {edgeCount} edge{edgeCount !== 1 ? 's' : ''}
            </div>
          </div>

          <button
            id="btn-simulate"
            className="btn btn-success"
            onClick={runSimulation}
            disabled={isSimulating}
          >
            <PlayCircle size={15} />
            Simulate
          </button>
        </div>
      </nav>

      {/* ─── Workspace ─── */}
      <main className="main-content">
        <Sidebar />
        <Canvas />
        <ConfigPanel />
      </main>

      {/* ─── Status bar ─── */}
      <div className="status-bar">
        <div className="status-bar-left">
          <div className="status-indicator">
            <span className="status-led" />
            Ready
          </div>
        </div>
        <div className="status-bar-right">
          <span>FlowPilot v1.0</span>
        </div>
      </div>

      {/* ─── Simulation overlay ─── */}
      <SimulationPanel
        isOpen={modalOpen}
        logs={simulationLogs}
        onClose={closeSimulation}
        isSimulating={isSimulating}
      />
    </div>
  );
}

/**
 * Root App component — wraps everything in ReactFlowProvider
 * so all children (Canvas, Sidebar, etc.) can access the React Flow instance.
 */
function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}

export default App;
