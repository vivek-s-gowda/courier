import React, { useState } from 'react';
import { Clock, HardDrive, ShieldCheck, Copy, Check, Search } from 'lucide-react';
import { getStatusColor, formatBytes, formatMs } from '../../utils/formatters';
import JsonViewer from './JsonViewer';
import EmptyResponse from './EmptyResponse';

export default function ResponsePanel({ response, isLoading, onLoadQuickTest }) {
  const [activeTab, setActiveTab] = useState('json'); // 'json' | 'raw' | 'headers'
  const [headerSearch, setHeaderSearch] = useState('');
  const [copiedRaw, setCopiedRaw] = useState(false);

  if (!response && !isLoading) {
    return (
      <div className="response-section">
        <EmptyResponse onLoadQuickTest={onLoadQuickTest} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="response-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: '3px solid var(--rose-200)',
              borderTopColor: 'var(--rose-600)',
              borderRadius: '50%',
              margin: '0 auto 12px',
              animation: 'spin 0.7s linear infinite'
            }}
          />
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--rose-800)' }}>
            Executing API Request...
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Waiting for remote server response
          </p>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(response.status);
  const headersList = Object.entries(response.headers || {}).map(([key, value]) => ({ key, value }));
  const filteredHeaders = headersList.filter(({ key, value }) => {
    if (!headerSearch) return true;
    const q = headerSearch.toLowerCase();
    return key.toLowerCase().includes(q) || String(value).toLowerCase().includes(q);
  });

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(response.raw || '');
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div className="response-section">
      {/* Response Header Bar */}
      <div className="response-header-bar">
        {/* View Tabs */}
        <div className="response-tabs">
          <button
            className={`response-tab ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON Formatter
          </button>
          <button
            className={`response-tab ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw
          </button>
          <button
            className={`response-tab ${activeTab === 'headers' ? 'active' : ''}`}
            onClick={() => setActiveTab('headers')}
          >
            Headers ({headersList.length})
          </button>
        </div>

        {/* Stats: Status, Time, Size */}
        <div className="response-meta-stats">
          <div
            className="badge-status"
            style={{
              color: statusColor.text,
              backgroundColor: statusColor.bg,
              border: `1px solid ${statusColor.border}`
            }}
          >
            <span>{response.status}</span>
            <span>{response.statusText}</span>
          </div>

          <div className="stat-item" title="Roundtrip Response Time">
            <Clock size={13} color="var(--rose-500)" />
            <span>{formatMs(response.time)}</span>
          </div>

          <div className="stat-item" title="Response Payload Size">
            <HardDrive size={13} color="var(--rose-500)" />
            <span>{formatBytes(response.size)}</span>
          </div>
        </div>
      </div>

      {/* Response Viewport */}
      <div className="response-viewport">
        {activeTab === 'json' && (
          <JsonViewer
            responseData={response.data}
            rawData={response.raw}
            isJson={response.isJson}
          />
        )}

        {activeTab === 'raw' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '8px 16px',
                borderBottom: '1px solid var(--border-light)',
                backgroundColor: '#fffbfb'
              }}
            >
              <button
                className="btn-code-action"
                onClick={handleCopyRaw}
              >
                {copiedRaw ? (
                  <>
                    <Check size={12} color="#059669" />
                    <span style={{ color: '#059669' }}>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Raw</span>
                  </>
                )}
              </button>
            </div>
            <pre
              style={{
                flex: 1,
                margin: 0,
                padding: 16,
                overflow: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: 12.5,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}
            >
              {response.raw || '(Empty Body)'}
            </pre>
          </div>
        )}

        {activeTab === 'headers' && (
          <div style={{ padding: '14px 20px', height: '100%', overflow: 'auto' }}>
            <div style={{ marginBottom: 12, position: 'relative', maxWidth: 300 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--rose-400)' }} />
              <input
                type="text"
                className="kv-input"
                style={{
                  paddingLeft: 30,
                  border: '1px solid var(--border-medium)',
                  borderRadius: 6,
                  backgroundColor: '#ffffff'
                }}
                placeholder="Filter response headers..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
              />
            </div>

            <table className="kv-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Header Key</th>
                  <th>Header Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredHeaders.map(({ key, value }, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--rose-700)', fontSize: 12 }}>
                      {key}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, wordBreak: 'break-all' }}>
                      {String(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
