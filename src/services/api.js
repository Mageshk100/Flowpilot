/**
 * Mock API Service
 * Simulates backend calls for workflow automation data and simulation execution.
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ─── Automations catalogue ─── */

const AUTOMATIONS = [
  { id: 'send_email',    name: 'Send Email',                params: ['to', 'subject', 'body'] },
  { id: 'create_ticket', name: 'Create Jira Ticket',        params: ['project', 'issueType', 'summary'] },
  { id: 'update_slack',  name: 'Post to Slack',             params: ['channel', 'message'] },
  { id: 'add_to_ad',     name: 'Add to Active Directory',   params: ['groupName'] },
  { id: 'provision_hw',  name: 'Provision Hardware',        params: ['hardwareType', 'specs'] },
  { id: 'run_script',    name: 'Run Onboarding Script',     params: ['scriptName', 'environment'] },
];

export const getAutomations = async () => {
  await delay(350);
  return AUTOMATIONS;
};

/* ─── Workflow simulation engine ─── */

/**
 * Traverses the workflow graph from the Start node, producing an
 * ordered execution log.  Follows the first outgoing edge at each step
 * (simplified — a production version would evaluate edge conditions).
 *
 * @param {{ nodes: Array, edges: Array }} graph
 * @returns {Promise<Array>} execution log entries
 */
export const simulateWorkflow = async (graph) => {
  await delay(700);

  const { nodes, edges } = graph;
  const logs = [];
  let stepCounter = 0;

  const addLog = (level, type, message, details = null) => {
    stepCounter += 1;
    logs.push({
      id: crypto.randomUUID(),
      step: stepCounter,
      timestamp: new Date().toISOString(),
      level,
      type,
      message,
      details,
    });
  };

  /* Validate canvas */
  if (!nodes || nodes.length === 0) {
    addLog('error', 'error', 'Simulation failed — the workflow canvas is empty.');
    return logs;
  }

  const startNode = nodes.find((n) => n.type === 'start');
  if (!startNode) {
    addLog('error', 'error', 'Simulation failed — no Start node found.');
    return logs;
  }

  /* Walk the graph */
  const visited = new Set();
  let current = startNode;

  while (current) {
    if (visited.has(current.id)) {
      addLog('error', 'error', `Infinite loop detected at node "${current.data?.label || current.id}".`);
      break;
    }
    visited.add(current.id);

    switch (current.type) {
      case 'start':
        addLog('info', 'start', 'Workflow started', {
          trigger: current.data?.trigger || 'Manual',
        });
        break;

      case 'task':
        addLog('info', 'task', `Task: ${current.data?.title || 'Untitled'}`, {
          assignee: current.data?.assignee || 'Unassigned',
        });
        break;

      case 'approval':
        addLog('info', 'approval', `Approval requested → ${current.data?.approver || 'Manager'}`, {
          title: current.data?.title || 'Review',
        });
        break;

      case 'auto':
        addLog('info', 'auto', `Automation: ${current.data?.actionName || 'N/A'}`, {
          system: current.data?.system || 'Unknown',
          params: current.data?.params || {},
        });
        break;

      case 'end':
        addLog('info', 'end', `Workflow completed — ${current.data?.status || 'Success'}`, {
          message: current.data?.message || '',
        });
        return logs;

      default:
        addLog('error', 'error', `Unknown node type: "${current.type}"`);
    }

    /* Advance to next node via the first outgoing edge */
    const outgoing = edges.filter((e) => e.source === current.id);

    if (outgoing.length === 0) {
      if (current.type !== 'end') {
        addLog('error', 'error', 'Workflow ended unexpectedly — no outgoing connection found.');
      }
      break;
    }

    current = nodes.find((n) => n.id === outgoing[0].target);
  }

  return logs;
};
