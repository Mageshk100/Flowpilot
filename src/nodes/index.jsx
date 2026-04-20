import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, CheckSquare, UserCheck, Zap, Square } from 'lucide-react';

/* ─── Shared helper ─── */
const nodeClasses = (selected) => `custom-node ${selected ? 'selected' : ''}`;

/* ─── Start Node ─── */
export const StartNode = ({ data, selected }) => (
  <div className={`${nodeClasses(selected)} node-start`}>
    <div className="custom-node-header">
      <div className="node-icon icon-start"><Play size={14} /></div>
      <span>Start</span>
    </div>
    <div className="custom-node-content">
      Trigger: {data?.trigger || 'Manual'}
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

/* ─── Task Node ─── */
export const TaskNode = ({ data, selected }) => (
  <div className={`${nodeClasses(selected)} node-task`}>
    <Handle type="target" position={Position.Top} />
    <div className="custom-node-header">
      <div className="node-icon icon-task"><CheckSquare size={14} /></div>
      <span>{data?.title || 'New Task'}</span>
    </div>
    <div className="custom-node-content">
      {data?.assignee ? `Assignee: ${data.assignee}` : 'No assignee set'}
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

/* ─── Approval Node ─── */
export const ApprovalNode = ({ data, selected }) => (
  <div className={`${nodeClasses(selected)} node-approval`}>
    <Handle type="target" position={Position.Top} />
    <div className="custom-node-header">
      <div className="node-icon icon-approval"><UserCheck size={14} /></div>
      <span>{data?.title || 'Approval Gate'}</span>
    </div>
    <div className="custom-node-content">
      Approver: {data?.approver || 'Manager'}
    </div>
    <Handle type="source" position={Position.Bottom} id="approved" style={{ left: '30%' }} />
    <Handle type="source" position={Position.Bottom} id="rejected" style={{ left: '70%' }} />
    <span className="handle-label approved">✓ Yes</span>
    <span className="handle-label rejected">✗ No</span>
  </div>
);

/* ─── Automated Action Node ─── */
export const AutomatedNode = ({ data, selected }) => (
  <div className={`${nodeClasses(selected)} node-auto`}>
    <Handle type="target" position={Position.Top} />
    <div className="custom-node-header">
      <div className="node-icon icon-auto"><Zap size={14} /></div>
      <span>{data?.actionName || 'Automated Action'}</span>
    </div>
    <div className="custom-node-content">
      {data?.system ? `System: ${data.system}` : 'Select an action →'}
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

/* ─── End Node ─── */
export const EndNode = ({ data, selected }) => (
  <div className={`${nodeClasses(selected)} node-end`}>
    <Handle type="target" position={Position.Top} />
    <div className="custom-node-header">
      <div className="node-icon icon-end"><Square size={14} /></div>
      <span>End</span>
    </div>
    <div className="custom-node-content">
      Status: {data?.status || 'Completed'}
    </div>
  </div>
);

/* ─── Node type registry (passed to ReactFlow) ─── */
export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  auto: AutomatedNode,
  end: EndNode,
};
