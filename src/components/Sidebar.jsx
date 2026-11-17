import React, { useState } from 'react';
import { 
  Send, 
  Plus, 
  Search, 
  Trash2, 
  History, 
  Bookmark, 
  Database, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getMethodColor, getStatusColor, timeAgo } from '../utils/formatters';

export default function Sidebar({
  history = [],
  saved = [],
  selectedId,
  onSelectHistory,
  onSelectSaved,
  onDeleteHistoryItem,
  onDeleteSavedItem,
  onClearHistory,
  onNewRequest,
  onLoadMock
}) {
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'saved' | 'mocks'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.url && item.url.toLowerCase().includes(q)) ||
      (item.method && item.method.toLowerCase().includes(q)) ||
      (item.status && String(item.status).includes(q))
    );
  });

  const filteredSaved = saved.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.url && item.url.toLowerCase().includes(q)) ||
      (item.method && item.method.toLowerCase().includes(q))
    );
  });

  const mockPresets = [
    {
      name: 'GET All Users',
      method: 'GET',
      url: 'http://localhost:5001/api/mock/users',
      description: 'Fetch list of all mock users with filtering'
    },
    {
      name: 'POST Create User',
      method: 'POST',
      url: 'http://localhost:5001/api/mock/users',
      bodyType: 'json',
      body: JSON.stringify({ name: 'Jordan Hayes', email: 'jordan@example.com', role: 'Staff Engineer' }, null, 2),
      description: 'Create user with JSON body payload'
    },
    {
      name: 'PUT Update User',
      method: 'PUT',
      url: 'http://localhost:5001/api/mock/users/1',
      bodyType: 'json',
      body: JSON.stringify({ name: 'Emma Watson', role: 'VP of Engineering' }, null, 2),
      description: 'Update existing user ID 1'
    },
    {
      name: 'DELETE Remove User',
      method: 'DELETE',
      url: 'http://localhost:5001/api/mock/users/2',
      description: 'Delete user ID 2 from database'
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-wrapper">
          <div className="brand-logo">
            <div className="brand-icon-box">
              <Send size={18} strokeWidth={2.5} style={{ transform: 'translateX(1px)' }} />
            </div>
            <div>
              <div className="brand-title">
                Courier
                <span className="brand-subtitle">v1.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* New Request Button */}
        <button className="btn-new-request" onClick={onNewRequest}>
          <Plus size={16} />
          New Request
        </button>

        {/* Search */}
        <div className="sidebar-search-box">
          <Search size={14} className="sidebar-search-icon" />
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search history & APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="sidebar-nav-tabs">
        <button
          className={`sidebar-nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={13} />
          History ({history.length})
        </button>
        <button
          className={`sidebar-nav-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={13} />
          Saved ({saved.length})
        </button>
        <button
          className={`sidebar-nav-tab ${activeTab === 'mocks' ? 'active' : ''}`}
          onClick={() => setActiveTab('mocks')}
        >
          <Database size={13} />
          Mocks
        </button>
      </div>

      {/* Content List */}
      <div className="sidebar-list">
        {activeTab === 'history' && (
          filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <Clock size={28} style={{ color: 'var(--rose-300)', marginBottom: 8 }} />
              <p style={{ fontSize: 13, fontWeight: 600 }}>No requests yet</p>
              <p style={{ fontSize: 11, marginTop: 4 }}>Executed requests will appear here</p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const mColor = getMethodColor(item.method);
              const sColor = getStatusColor(item.status);
              const isSelected = selectedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`history-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectHistory(item)}
                >
                  <div className="history-card-top">
                    <div className="history-method-and-url">
                      <span
                        className="badge-method"
                        style={{
                          color: mColor.text,
                          backgroundColor: mColor.bg,
                          border: `1px solid ${mColor.border}`
                        }}
                      >
                        {item.method}
                      </span>
                      <span className="history-url" title={item.url}>
                        {item.url}
                      </span>
                    </div>

                    <button
                      className="history-delete-btn"
                      title="Remove from history"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="history-card-bottom">
                    <span
                      className="badge-status"
                      style={{
                        color: sColor.text,
                        backgroundColor: sColor.bg,
                        border: `1px solid ${sColor.border}`,
                        fontSize: 10,
                        padding: '1px 5px'
                      }}
                    >
                      {item.status || 'ERR'}
                    </span>
                    <span>{item.duration ? `${item.duration}ms` : ''}</span>
                    <span>{timeAgo(item.timestamp)}</span>
                  </div>
                </div>
              );
            })
          )
        )}

        {activeTab === 'saved' && (
          filteredSaved.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <Bookmark size={28} style={{ color: 'var(--rose-300)', marginBottom: 8 }} />
              <p style={{ fontSize: 13, fontWeight: 600 }}>No saved requests</p>
              <p style={{ fontSize: 11, marginTop: 4 }}>Save requests to easily run them later</p>
            </div>
          ) : (
            filteredSaved.map((item) => {
              const mColor = getMethodColor(item.method);
              return (
                <div
                  key={item.id}
                  className="history-card"
                  onClick={() => onSelectSaved(item)}
                >
                  <div className="history-card-top">
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1f2937' }}>
                      {item.name}
                    </div>
                    <button
                      className="history-delete-btn"
                      title="Delete bookmark"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSavedItem(item.id);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="history-method-and-url" style={{ marginTop: 2 }}>
                    <span
                      className="badge-method"
                      style={{
                        color: mColor.text,
                        backgroundColor: mColor.bg,
                        border: `1px solid ${mColor.border}`,
                        fontSize: 10
                      }}
                    >
                      {item.method}
                    </span>
                    <span className="history-url" title={item.url}>
                      {item.url}
                    </span>
                  </div>
                </div>
              );
            })
          )
        )}

        {activeTab === 'mocks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 11, color: 'var(--rose-700)', fontWeight: 600, padding: '4px 6px' }}>
              Built-in Mock Server (Click to test)
            </div>
            {mockPresets.map((preset, idx) => {
              const mColor = getMethodColor(preset.method);
              return (
                <div
                  key={idx}
                  className="history-card"
                  style={{ borderLeft: `3px solid ${mColor.text}` }}
                  onClick={() => onLoadMock(preset)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      className="badge-method"
                      style={{
                        color: mColor.text,
                        backgroundColor: mColor.bg,
                        border: `1px solid ${mColor.border}`
                      }}
                    >
                      {preset.method}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>
                      {preset.name}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {preset.description}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <span style={{ fontSize: 11, color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={12} color="var(--rose-500)" />
          Ready to test
        </span>

        {activeTab === 'history' && history.length > 0 && (
          <button
            className="btn-sidebar-clear"
            onClick={() => {
              if (window.confirm('Clear all request history?')) {
                onClearHistory();
              }
            }}
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>
    </aside>
  );
}
