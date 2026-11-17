import React from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function ParamsTab({ params, setParams }) {
  const handleParamChange = (index, field, value) => {
    const updated = [...params];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-add new empty row if user typed in the last row
    if (index === params.length - 1 && (field === 'key' || field === 'value') && value.trim() !== '') {
      updated.push({ key: '', value: '', description: '', enabled: true });
    }

    setParams(updated);
  };

  const handleToggleEnabled = (index) => {
    const updated = [...params];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setParams(updated);
  };

  const handleDeleteRow = (index) => {
    if (params.length === 1) {
      setParams([{ key: '', value: '', description: '', enabled: true }]);
    } else {
      const updated = params.filter((_, i) => i !== index);
      setParams(updated);
    }
  };

  const handleAddRow = () => {
    setParams([...params, { key: '', value: '', description: '', enabled: true }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
          Query Parameters
        </span>
        <button
          onClick={handleAddRow}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 4,
            border: '1px solid var(--border-medium)',
            background: '#ffffff',
            color: 'var(--rose-700)',
            cursor: 'pointer'
          }}
        >
          <Plus size={12} /> Add Parameter
        </button>
      </div>

      <table className="kv-table">
        <thead>
          <tr>
            <th style={{ width: 36, textAlign: 'center' }}></th>
            <th style={{ width: '35%' }}>Key</th>
            <th style={{ width: '40%' }}>Value</th>
            <th>Description</th>
            <th style={{ width: 36 }}></th>
          </tr>
        </thead>
        <tbody>
          {params.map((param, index) => (
            <tr key={index}>
              <td style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  className="kv-checkbox"
                  checked={param.enabled}
                  onChange={() => handleToggleEnabled(index)}
                  title="Enable/Disable parameter"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="kv-input"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="kv-input"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="kv-input"
                  placeholder="Description (optional)"
                  value={param.description || ''}
                  onChange={(e) => handleParamChange(index, 'description', e.target.value)}
                />
              </td>
              <td>
                <button
                  className="kv-delete-btn"
                  onClick={() => handleDeleteRow(index)}
                  title="Remove parameter"
                >
                  <Trash2 size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
