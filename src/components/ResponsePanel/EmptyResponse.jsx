import React from 'react';
import { Send, Globe, ArrowRight } from 'lucide-react';
import { getMethodColor } from '../../utils/formatters';

export default function EmptyResponse({ onLoadQuickTest }) {
  const quickActions = [
    {
      method: 'GET',
      title: 'GET Mock Users',
      desc: 'http://localhost:5001/api/mock/users',
      url: 'http://localhost:5001/api/mock/users',
      bodyType: 'none',
      body: ''
    },
    {
      method: 'POST',
      title: 'POST Create User',
      desc: 'http://localhost:5001/api/mock/users',
      url: 'http://localhost:5001/api/mock/users',
      bodyType: 'json',
      body: JSON.stringify({ name: 'Clara Oswald', email: 'clara@example.com', role: 'Staff Developer' }, null, 2)
    },
    {
      method: 'PUT',
      title: 'PUT Update User (ID: 1)',
      desc: 'http://localhost:5001/api/mock/users/1',
      url: 'http://localhost:5001/api/mock/users/1',
      bodyType: 'json',
      body: JSON.stringify({ name: 'Emma Watson', role: 'VP of Engineering', status: 'active' }, null, 2)
    },
    {
      method: 'DELETE',
      title: 'DELETE User (ID: 1)',
      desc: 'http://localhost:5001/api/mock/users/1',
      url: 'http://localhost:5001/api/mock/users/1',
      bodyType: 'none',
      body: ''
    }
  ];

  return (
    <div className="empty-state-container">
      <div className="empty-icon-circle">
        <Send size={26} style={{ transform: 'translateX(1px)' }} />
      </div>
      <h3 className="empty-title">Ready to Test Your APIs</h3>
      <p className="empty-subtitle">
        Enter a URL above and click <strong>Send</strong>, or click one of the quick mock endpoints below to test GET, POST, PUT, and DELETE calls instantly.
      </p>

      <div className="quick-tests-grid">
        {quickActions.map((qa, i) => {
          const mColor = getMethodColor(qa.method);
          return (
            <div
              key={i}
              className="quick-test-card"
              onClick={() => onLoadQuickTest(qa)}
            >
              <span
                className="badge-method"
                style={{
                  color: mColor.text,
                  backgroundColor: mColor.bg,
                  border: `1px solid ${mColor.border}`
                }}
              >
                {qa.method}
              </span>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div className="quick-test-title">{qa.title}</div>
                <div className="quick-test-desc" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {qa.desc}
                </div>
              </div>
              <ArrowRight size={14} color="var(--rose-400)" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
