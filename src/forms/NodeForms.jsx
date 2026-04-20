import React, { useEffect, useState } from 'react';
import useWorkflowStore from '../store/useWorkflowStore';
import { getAutomations } from '../services/api';
import { Settings2 } from 'lucide-react';

/* ─── Start Node Form ─── */
export const StartNodeForm = ({ nodeId, data }) => {
  const updateData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (e) => {
    updateData(nodeId, { [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Trigger Event</label>
        <select
          name="trigger"
          className="form-select"
          value={data?.trigger || 'manual'}
          onChange={handleChange}
        >
          <option value="manual">Manual Trigger</option>
          <option value="api">API Endpoint Hook</option>
          <option value="schedule">Scheduled Time</option>
          <option value="webhook">Incoming Webhook</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-textarea"
          value={data?.description || ''}
          onChange={handleChange}
          placeholder="Workflow initial context…"
        />
      </div>
    </div>
  );
};

/* ─── Task Node Form ─── */
export const TaskNodeForm = ({ nodeId, data }) => {
  const updateData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (e) => {
    updateData(nodeId, { [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Task Title</label>
        <input
          name="title"
          type="text"
          className="form-input"
          value={data?.title || ''}
          onChange={handleChange}
          placeholder="e.g., Setup Dev Environment"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Assignee</label>
        <input
          name="assignee"
          type="text"
          className="form-input"
          value={data?.assignee || ''}
          onChange={handleChange}
          placeholder="Email or role"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Task Details</label>
        <textarea
          name="details"
          className="form-textarea"
          value={data?.details || ''}
          onChange={handleChange}
          placeholder="Instructions for assignee…"
        />
      </div>
    </div>
  );
};

/* ─── Approval Node Form ─── */
export const ApprovalNodeForm = ({ nodeId, data }) => {
  const updateData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (e) => {
    updateData(nodeId, { [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Approval Title</label>
        <input
          name="title"
          type="text"
          className="form-input"
          value={data?.title || ''}
          onChange={handleChange}
          placeholder="e.g., Equipment Request Approval"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Approver</label>
        <select
          name="approver"
          className="form-select"
          value={data?.approver || 'Manager'}
          onChange={handleChange}
        >
          <option value="Manager">Line Manager</option>
          <option value="HR">HR Department</option>
          <option value="IT">IT Department</option>
          <option value="Finance">Finance Controller</option>
          <option value="Legal">Legal Team</option>
        </select>
      </div>
    </div>
  );
};

/* ─── Automated Action Node Form ─── */
export const AutomatedNodeForm = ({ nodeId, data }) => {
  const updateData = useWorkflowStore((s) => s.updateNodeData);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAutomations().then((res) => {
      if (!cancelled) {
        setAutomations(res);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const handleActionChange = (e) => {
    const actionId = e.target.value;
    const actionDef = automations.find((a) => a.id === actionId);
    if (!actionDef) return;

    updateData(nodeId, {
      action: actionId,
      actionName: actionDef.name,
      system: actionId.split('_')[0] || 'System',
      params: actionDef.params.reduce((acc, p) => ({ ...acc, [p]: '' }), {}),
    });
  };

  const handleParamChange = (paramName, value) => {
    updateData(nodeId, {
      params: { ...(data?.params || {}), [paramName]: value },
    });
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
        Loading automations…
      </div>
    );
  }

  const selectedAutomation = automations.find((a) => a.id === data?.action);

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Action</label>
        <select
          name="action"
          className="form-select"
          value={data?.action || ''}
          onChange={handleActionChange}
        >
          <option value="" disabled>Select an action…</option>
          {automations.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {selectedAutomation && (
        <div className="form-params-section">
          <h4 className="form-params-title">
            <Settings2 size={12} />
            Parameters
          </h4>
          {selectedAutomation.params.map((param) => (
            <div className="form-group" key={param} style={{ marginBottom: '10px' }}>
              <label className="form-label" style={{ textTransform: 'capitalize' }}>
                {param.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                className="form-input"
                value={data.params?.[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}…`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── End Node Form ─── */
export const EndNodeForm = ({ nodeId, data }) => {
  const updateData = useWorkflowStore((s) => s.updateNodeData);

  const handleChange = (e) => {
    updateData(nodeId, { [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Final Status</label>
        <select
          name="status"
          className="form-select"
          value={data?.status || 'Completed'}
          onChange={handleChange}
        >
          <option value="Completed">Completed Successfully</option>
          <option value="Rejected">Rejected</option>
          <option value="Terminated">Terminated</option>
          <option value="Escalated">Escalated</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Closing Message</label>
        <textarea
          name="message"
          className="form-textarea"
          value={data?.message || ''}
          onChange={handleChange}
          placeholder="Message to display upon completion…"
        />
      </div>
    </div>
  );
};
