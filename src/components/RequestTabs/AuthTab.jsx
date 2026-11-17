import React from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

export default function AuthTab({ auth, setAuth, headers, setHeaders }) {
  const handleTypeChange = (type) => {
    setAuth({ ...auth, type });

    // Clean up or inject headers based on type
    let cleanHeaders = headers.filter(h => h.key.toLowerCase() !== 'authorization');
    if (type === 'bearer' && auth.token) {
      cleanHeaders.unshift({ key: 'Authorization', value: `Bearer ${auth.token}`, description: 'Bearer Token', enabled: true });
    } else if (type === 'basic' && (auth.username || auth.password)) {
      const creds = btoa(`${auth.username || ''}:${auth.password || ''}`);
      cleanHeaders.unshift({ key: 'Authorization', value: `Basic ${creds}`, description: 'Basic Auth', enabled: true });
    }
    setHeaders(cleanHeaders);
  };

  const handleBearerChange = (token) => {
    setAuth({ ...auth, token });
    let cleanHeaders = headers.filter(h => h.key.toLowerCase() !== 'authorization');
    if (token) {
      cleanHeaders.unshift({ key: 'Authorization', value: `Bearer ${token}`, description: 'Bearer Token', enabled: true });
    }
    setHeaders(cleanHeaders);
  };

  const handleBasicChange = (field, val) => {
    const updatedAuth = { ...auth, [field]: val };
    setAuth(updatedAuth);
    let cleanHeaders = headers.filter(h => h.key.toLowerCase() !== 'authorization');
    if (updatedAuth.username || updatedAuth.password) {
      const creds = btoa(`${updatedAuth.username || ''}:${updatedAuth.password || ''}`);
      cleanHeaders.unshift({ key: 'Authorization', value: `Basic ${creds}`, description: 'Basic Auth', enabled: true });
    }
    setHeaders(cleanHeaders);
  };

  return (
    <div style={{ padding: '8px 4px', maxWidth: 500 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
          Auth Type:
        </span>
        <select
          value={auth.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          style={{
            padding: '6px 12px',
            fontSize: 12.5,
            fontWeight: 600,
            borderRadius: 6,
            border: '1px solid var(--border-medium)',
            backgroundColor: '#ffffff',
            outline: 'none',
            color: 'var(--rose-700)'
          }}
        >
          <option value="none">No Auth</option>
          <option value="bearer">Bearer Token</option>
          <option value="basic">Basic Auth</option>
        </select>
      </div>

      {auth.type === 'none' && (
        <div style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>
          This request does not use any authorization headers.
        </div>
      )}

      {auth.type === 'bearer' && (
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
            TOKEN
          </label>
          <div style={{ position: 'relative' }}>
            <KeyRound size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--rose-400)' }} />
            <input
              type="text"
              className="kv-input"
              style={{
                paddingLeft: 32,
                border: '1px solid var(--border-medium)',
                borderRadius: 6,
                backgroundColor: '#ffffff',
                fontFamily: 'var(--font-mono)'
              }}
              placeholder="e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={auth.token || ''}
              onChange={(e) => handleBearerChange(e.target.value)}
            />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={12} color="#059669" />
            Automatically injected into Authorization header
          </p>
        </div>
      )}

      {auth.type === 'basic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
              USERNAME
            </label>
            <input
              type="text"
              className="kv-input"
              style={{
                border: '1px solid var(--border-medium)',
                borderRadius: 6,
                backgroundColor: '#ffffff'
              }}
              placeholder="admin"
              value={auth.username || ''}
              onChange={(e) => handleBasicChange('username', e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
              PASSWORD
            </label>
            <input
              type="password"
              className="kv-input"
              style={{
                border: '1px solid var(--border-medium)',
                borderRadius: 6,
                backgroundColor: '#ffffff'
              }}
              placeholder="••••••••"
              value={auth.password || ''}
              onChange={(e) => handleBasicChange('password', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
