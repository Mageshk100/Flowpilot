import React from 'react';
import { X, Trash2 } from 'lucide-react';
import useWorkflowStore from '../store/useWorkflowStore';
import {
  StartNodeForm,
  TaskNodeForm,
  ApprovalNodeForm,
  AutomatedNodeForm,
  EndNodeForm,
} from '../forms/NodeForms';

const TYPE_LABELS = {
  start: 'Start Event',
  task: 'Manual Task',
  approval: 'Approval Gate',
  auto: 'Automated Action',
  end: 'End Event',
};

const FORM_MAP = {
  start: StartNodeForm,
  task: TaskNodeForm,
  approval: ApprovalNodeForm,
  auto: AutomatedNodeForm,
  end: EndNodeForm,
};

export const ConfigPanel = () => {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);
  const deleteSelectedNode = useWorkflowStore((s) => s.deleteSelectedNode);
  const selectedNode = useWorkflowStore((s) =>
    s.nodes.find((n) => n.id === s.selectedNodeId)
  );

  const isOpen = !!selectedNodeId;
  const FormComponent = selectedNode ? FORM_MAP[selectedNode.type] : null;

  return (
    <div className={`panel config-panel ${isOpen ? 'open' : ''}`}>
      {isOpen && selectedNode && (
        <>
          {/* Header */}
          <div className="config-header">
            <h3 className="panel-title">Configuration</h3>
            <button
              className="btn btn-ghost"
              onClick={() => setSelectedNodeId(null)}
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Node type badge */}
          <div className={`config-node-type type-${selectedNode.type}`}>
            {TYPE_LABELS[selectedNode.type] || selectedNode.type}
          </div>

          {/* Node ID */}
          <div className="config-node-id">
            <span className="id-label">ID</span>
            <span className="id-value">{selectedNodeId}</span>
          </div>

          {/* Dynamic form */}
          <div style={{ flex: 1 }}>
            {FormComponent ? (
              <FormComponent nodeId={selectedNode.id} data={selectedNode.data} />
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                No configuration available for this node type.
              </div>
            )}
          </div>

          {/* Delete action */}
          <div className="config-delete-zone">
            <button
              className="btn btn-danger"
              style={{ width: '100%' }}
              onClick={deleteSelectedNode}
            >
              <Trash2 size={14} />
              Delete Node
            </button>
          </div>
        </>
      )}
    </div>
  );
};
