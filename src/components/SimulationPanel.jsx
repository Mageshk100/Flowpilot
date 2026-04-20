import React from 'react';
import { X, TerminalSquare } from 'lucide-react';

export const SimulationPanel = ({ isOpen, logs, onClose, isSimulating }) => {
  return (
    <div className={`simulation-overlay ${isOpen ? 'open' : ''}`}>
      <div className="simulation-content">
        {/* Header */}
        <div className="simulation-header">
          <h2>
            <TerminalSquare size={18} />
            Simulation Log
          </h2>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            aria-label="Close simulation"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="simulation-body">
          {isSimulating ? (
            <div className="simulation-spinner">
              <div className="spinner-ring" />
              <span>Running simulation…</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="simulation-empty">
              No execution logs available.
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={log.id}
                className={`log-entry ${log.level === 'error' ? 'error' : log.type}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="log-time">
                  Step {log.step} · {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div
                  className="log-message"
                  style={{
                    color: log.level === 'error' ? 'var(--accent-rose)' : 'inherit',
                  }}
                >
                  {log.message}
                </div>
                {log.details && Object.keys(log.details).length > 0 && (
                  <div className="log-details">
                    {JSON.stringify(log.details, null, 2)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
