import React from 'react';
import { Trash2, Plus, Sparkles } from 'lucide-react';

export default function HeadersTab({ headers, setHeaders }) {
  const handleHeaderChange = (index, field, value) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-add new empty row if user typed in the last row
    if (index === headers.length - 1 && (field === 'key' || field === 'value') && value.trim() !== '') {
      updated.push({ key: '', value: '', description: '', enabled: true });
    }

    setHeaders(updated);
  };

  const handleToggleEnabled = (index) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setHeaders(updated);
  };

  const handleDeleteRow = (index) => {
    if (headers.length === 1) {
      setHeaders([{ key: '', value: '', description: '', enabled: true }]);
    } else {
      const updated = headers.filter((_, i) => i !== index);
      setHeaders(updated);
    }
  };

  const handleAddRow = () => {
    setHeaders([...headers, { key: '', value: '', description: '', enabled: true }]);
  };

  const applyPresetJson = () => {
    const newHeaders = [
      { key: 'Content-Type', value: 'application/json', description: 'JSON payload format', enabled: true },
      { key: 'Accept', value: 'application/json', description: 'Accept JSON response', enabled: true },
      { key: '', value: '', description: '', enabled: true }
    ];
    setHeaders(newHeaders);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
            Request Headers
          </span>
          <button
            onClick={applyPresetJson}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid var(--rose-200)',
              background: 'var(--rose-50)',
              color: 'var(--rose-700)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <Sparkles size={11} /> + JSON Preset
          </button>
        </div>

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
          <Plus size={12} /> Add Header
        </button>
      </div>

      <table className="kv-table">
        <thead>
          <tr>
            <th style={{ width: 36, textAlign: 'center' }}></th>
            <th style={{ width: '35%' }}>Header Name</th>
            <th style={{ width: '40%' }}>Value</th>
            <th>Description</th>
            <th style={{ width: 36 }}></th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header, index) => (
            <tr key={index}>
              <td style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  className="kv-checkbox"
                  checked={header.enabled}
                  onChange={() => handleToggleEnabled(index)}
                  title="Enable/Disable header"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="kv-input"
                  placeholder="e.g. Content-Type"
                  value={header.key}
                  onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="kv-input"
                  placeholder="e.g. application/json"
                  value={header.value}
                  onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="kv-input"
                  placeholder="Description (optional)"
                  value={header.description || ''}
                  onChange={(e) => handleHeaderChange(index, 'description', e.target.value)}
                />
              </td>
              <td>
                <button
                  className="kv-delete-btn"
                  onClick={() => handleDeleteRow(index)}
                  title="Remove header"
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
