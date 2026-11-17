import React from 'react';
import { Send, Bookmark, ChevronDown, Copy, Check, Terminal } from 'lucide-react';
import { getMethodColor } from '../utils/formatters';

export default function RequestBar({
  method,
  setMethod,
  url,
  setUrl,
  requestName,
  setRequestName,
  onSend,
  onSave,
  isLoading,
  onCopyCurl
}) {
  const [copiedCurl, setCopiedCurl] = React.useState(false);
  const methodColor = getMethodColor(method);

  const handleCopyCurlClick = () => {
    onCopyCurl();
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="request-bar-container">
      {/* Top row: Name & Actions */}
      <div className="request-title-row">
        <input
          type="text"
          className="request-name-input"
          value={requestName}
          onChange={(e) => setRequestName(e.target.value)}
          placeholder="Untitled Request"
        />

        <div className="request-meta-actions">
          <button
            className="btn-meta"
            title="Copy as cURL command"
            onClick={handleCopyCurlClick}
          >
            {copiedCurl ? (
              <>
                <Check size={13} color="#059669" />
                <span style={{ color: '#059669' }}>cURL Copied</span>
              </>
            ) : (
              <>
                <Terminal size={13} />
                <span>cURL</span>
              </>
            )}
          </button>

          <button
            className="btn-meta primary"
            onClick={onSave}
            title="Save request to collection"
          >
            <Bookmark size={13} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Main Bar: Method dropdown + URL input + Send Button */}
      <div className="url-input-group">
        <div
          className="method-select-wrapper"
          style={{
            backgroundColor: methodColor.bg,
            borderRightColor: methodColor.border
          }}
        >
          <select
            className="method-select"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{ color: methodColor.text }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          <ChevronDown size={14} className="method-select-arrow" style={{ color: methodColor.text }} />
        </div>

        <input
          type="text"
          className="url-text-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter request URL (e.g. http://localhost:5001/api/mock/users or https://api.github.com)"
        />

        <button
          className="btn-send"
          onClick={onSend}
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? (
            <>
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }}
              />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Send</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
