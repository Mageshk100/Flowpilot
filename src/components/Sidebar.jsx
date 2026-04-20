import React from 'react';
import { Play, CheckSquare, UserCheck, Zap, Square } from 'lucide-react';

const NODE_CATALOG = [
  { type: 'start',    name: 'Start Event',       desc: 'Workflow trigger',      icon: Play,        iconClass: 'icon-start' },
  { type: 'task',     name: 'Manual Task',        desc: 'Human action step',     icon: CheckSquare, iconClass: 'icon-task' },
  { type: 'approval', name: 'Approval Gate',      desc: 'Decision checkpoint',   icon: UserCheck,   iconClass: 'icon-approval' },
  { type: 'auto',     name: 'Automated Action',   desc: 'System integration',    icon: Zap,         iconClass: 'icon-auto' },
  { type: 'end',      name: 'End Event',          desc: 'Workflow termination',   icon: Square,      iconClass: 'icon-end' },
];

export const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="panel sidebar">
      <h3 className="panel-title">Components</h3>

      {NODE_CATALOG.map(({ type, name, desc, icon: Icon, iconClass }) => (
        <div
          key={type}
          className={`draggable-node node-type-${type}`}
          draggable
          onDragStart={(e) => onDragStart(e, type)}
        >
          <div className={`node-icon ${iconClass}`}>
            <Icon size={14} />
          </div>
          <div className="draggable-node-info">
            <span className="node-name">{name}</span>
            <span className="node-desc">{desc}</span>
          </div>
        </div>
      ))}

      <div className="sidebar-section-label">How to use</div>
      <div style={{
        fontSize: '0.6875rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        padding: '0 4px',
      }}>
        Drag a component onto the canvas to add it.
        Click a node to configure it. Connect nodes by
        dragging from one handle to another.
      </div>
    </div>
  );
};
