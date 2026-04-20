import React, { useRef, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useWorkflowStore from '../store/useWorkflowStore';
import { nodeTypes } from '../nodes';
import { MousePointerClick } from 'lucide-react';

/** Simple unique-id generator */
const uid = (type) => `${type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const Canvas = () => {
  const wrapperRef = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);

  /* ─── Drag & Drop ─── */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode({
        id: uid(type),
        type,
        position,
        data: { label: `${type} node` },
      });
    },
    [addNode, screenToFlowPosition]
  );

  /* ─── Selection ─── */
  const onNodeClick = useCallback(
    (_, node) => setSelectedNodeId(node.id),
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(
    () => setSelectedNodeId(null),
    [setSelectedNodeId]
  );

  const onNodesDelete = useCallback(
    (deleted) => {
      if (deleted.some((n) => n.id === selectedNodeId)) {
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId, setSelectedNodeId]
  );

  const isEmpty = nodes.length === 0;

  return (
    <div
      className="canvas-wrapper"
      ref={wrapperRef}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {/* Watermark shown on empty canvas */}
      <div className={`canvas-watermark ${isEmpty ? '' : 'hidden'}`}>
        <MousePointerClick size={40} strokeWidth={1.2} />
        <p>Drag components from the sidebar to get started</p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'rgba(148, 163, 184, 0.5)', strokeWidth: 2 },
        }}
      >
        <Background gap={20} size={1} color="rgba(255,255,255,0.04)" />
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeColor={(n) => {
            const colors = {
              start: '#10b981',
              task: '#3b82f6',
              approval: '#f59e0b',
              auto: '#8b5cf6',
              end: '#ef4444',
            };
            return colors[n.type] || '#64748b';
          }}
          maskColor="rgba(10, 14, 26, 0.7)"
          style={{ background: 'rgba(17, 24, 39, 0.8)' }}
        />
      </ReactFlow>
    </div>
  );
};
