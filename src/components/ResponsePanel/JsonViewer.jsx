import React, { useState } from 'react';
import { Copy, Check, Download, Search, Maximize2, Minimize2, FileJson } from 'lucide-react';
import JsonTreeNode from './JsonTreeNode';

export default function JsonViewer({ responseData, rawData, isJson }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandAllKey, setExpandAllKey] = useState(0); // increment to trigger re-render of tree
  const [defaultExpanded, setDefaultExpanded] = useState(true);

  const handleCopy = () => {
    const textToCopy = isJson
      ? JSON.stringify(responseData, null, 2)
      : String(rawData || '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = isJson
      ? JSON.stringify(responseData, null, 2)
      : String(rawData || '');
    const blob = new Blob([text], { type: isJson ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response_${Date.now()}.${isJson ? 'json' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpandAll = (expand) => {
    setDefaultExpanded(expand);
    setExpandAllKey((prev) => prev + 1);
  };

  return (
    <div className="json-viewer-container">
      {/* JSON Toolbar */}
      <div className="json-viewer-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--rose-700)' }}>
            <FileJson size={14} />
            {isJson ? 'JSON Formatter' : 'Text Output'}
          </span>

          {isJson && (
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 8, top: 7, color: 'var(--rose-400)' }} />
              <input
                type="text"
                className="json-search-input"
                placeholder="Find in JSON..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isJson && (
            <>
              <button
                className="btn-code-action"
                style={{ fontSize: 11, padding: '3px 8px' }}
                onClick={() => toggleExpandAll(true)}
                title="Expand all nodes"
              >
                <Maximize2 size={11} /> Expand All
              </button>
              <button
                className="btn-code-action"
                style={{ fontSize: 11, padding: '3px 8px' }}
                onClick={() => toggleExpandAll(false)}
                title="Collapse all nodes"
              >
                <Minimize2 size={11} /> Collapse All
              </button>
            </>
          )}

          <button
            className="btn-code-action"
            style={{ fontSize: 11, padding: '3px 8px' }}
            onClick={handleCopy}
            title="Copy formatted JSON to clipboard"
          >
            {copied ? (
              <>
                <Check size={11} color="#059669" />
                <span style={{ color: '#059669' }}>Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            className="btn-code-action"
            style={{ fontSize: 11, padding: '3px 8px' }}
            onClick={handleDownload}
            title="Download response as file"
          >
            <Download size={11} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="json-code-box">
        {isJson && responseData !== undefined && responseData !== null ? (
          <div key={expandAllKey}>
            <JsonTreeNode
              data={responseData}
              searchQuery={searchQuery}
              defaultExpanded={defaultExpanded}
            />
          </div>
        ) : (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
            {rawData || '(Empty Response Body)'}
          </pre>
        )}
      </div>
    </div>
  );
}
