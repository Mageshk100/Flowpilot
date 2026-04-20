import { useState, useCallback } from 'react';
import { simulateWorkflow } from '../services/api';
import useWorkflowStore from '../store/useWorkflowStore';

/**
 * Encapsulates all simulation-related state and logic.
 * Returns controls for the App shell to wire into the UI.
 */
export const useSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const getWorkflowData = useWorkflowStore((s) => s.getWorkflowData);

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    setSimulationLogs([]);
    setModalOpen(true);

    try {
      const graph = getWorkflowData();
      const logs = await simulateWorkflow(graph);
      setSimulationLogs(logs);
    } catch (err) {
      setSimulationLogs([
        {
          id: 'sys-error',
          step: 0,
          timestamp: new Date().toISOString(),
          level: 'error',
          type: 'error',
          message: 'System error during simulation',
          details: { error: err.message },
        },
      ]);
    } finally {
      setIsSimulating(false);
    }
  }, [getWorkflowData]);

  const closeSimulation = useCallback(() => {
    setModalOpen(false);
  }, []);

  return {
    isSimulating,
    simulationLogs,
    modalOpen,
    runSimulation,
    closeSimulation,
  };
};
