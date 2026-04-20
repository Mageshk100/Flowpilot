import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

/**
 * Central Zustand store for the workflow designer.
 * Manages nodes, edges, selection state, and all mutations.
 */
const useWorkflowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  /* ─── React Flow event handlers ─── */

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    const styledEdge = {
      ...connection,
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'rgba(148, 163, 184, 0.5)', strokeWidth: 2 },
    };
    set((state) => ({
      edges: addEdge(styledEdge, state.edges),
    }));
  },

  /* ─── Node CRUD ─── */

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNodeData: (nodeId, newData) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== nodeId) return node;
        return {
          ...node,
          data: { ...node.data, ...newData },
        };
      }),
    }));
  },

  deleteSelectedNode: () => {
    set((state) => {
      const { selectedNodeId, nodes, edges } = state;
      if (!selectedNodeId) return state;

      return {
        nodes: nodes.filter((n) => n.id !== selectedNodeId),
        edges: edges.filter(
          (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
        ),
        selectedNodeId: null,
      };
    });
  },

  /* ─── Selection ─── */

  setSelectedNodeId: (id) => {
    set({ selectedNodeId: id });
  },

  /* ─── Serialisation helper for simulation ─── */

  getWorkflowData: () => {
    const { nodes, edges } = get();
    return { nodes, edges };
  },
}));

export default useWorkflowStore;
