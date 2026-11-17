import React, { useState } from 'react';
import { Bookmark, X } from 'lucide-react';

export default function SaveRequestModal({ isOpen, onClose, onSave, defaultName }) {
  const [name, setName] = useState(defaultName || 'My Request');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--rose-700)', fontWeight: 700 }}>
            <Bookmark size={18} />
            <span>Save Request</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
            Request Name
          </label>
          <input
            type="text"
            className="modal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Get All Users, Update Profile"
            autoFocus
          />

          <div className="modal-actions">
            <button
              type="button"
              className="btn-meta"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-send"
              style={{ padding: '8px 16px', borderRadius: 6 }}
            >
              Save to Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
