import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function JsonTreeNode({
  data,
  nodeKey = null,
  isLast = true,
  searchQuery = '',
  defaultExpanded = true
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const isObject = data !== null && typeof data === 'object' && !Array.isArray(data);
  const isArray = Array.isArray(data);
  const isContainer = isObject || isArray;

  // Search matching
  const matchesSearch = (text) => {
    if (!searchQuery) return false;
    return String(text).toLowerCase().includes(searchQuery.toLowerCase());
  };

  const renderValue = (val) => {
    if (val === null) return <span className="json-null">null</span>;
    if (typeof val === 'boolean') return <span className="json-boolean">{val ? 'true' : 'false'}</span>;
    if (typeof val === 'number') {
      const isMatch = matchesSearch(val);
      return (
        <span
          className="json-number"
          style={isMatch ? { backgroundColor: '#fef08a', padding: '0 2px', borderRadius: 2 } : {}}
        >
          {val}
        </span>
      );
    }
    if (typeof val === 'string') {
      const isMatch = matchesSearch(val);
      return (
        <span
          className="json-string"
          style={isMatch ? { backgroundColor: '#fef08a', padding: '0 2px', borderRadius: 2 } : {}}
        >
          "{val}"
        </span>
      );
    }
    return String(val);
  };

  const keyIsMatch = nodeKey !== null && matchesSearch(nodeKey);

  if (!isContainer) {
    return (
      <div style={{ padding: '1px 0', whiteSpace: 'pre' }}>
        {nodeKey !== null && (
          <span
            className="json-key"
            style={keyIsMatch ? { backgroundColor: '#fef08a', padding: '0 2px', borderRadius: 2 } : {}}
          >
            "{nodeKey}":{' '}
          </span>
        )}
        {renderValue(data)}
        {!isLast && <span className="json-bracket">,</span>}
      </div>
    );
  }

  const entries = isArray
    ? data.map((item, idx) => ({ key: idx, value: item }))
    : Object.entries(data).map(([k, v]) => ({ key: k, value: v }));

  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';
  const itemCount = entries.length;

  return (
    <div style={{ padding: '1px 0' }}>
      <div
        style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        <span className="json-toggle-btn">
          {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </span>

        {nodeKey !== null && (
          <span
            className="json-key"
            style={keyIsMatch ? { backgroundColor: '#fef08a', padding: '0 2px', borderRadius: 2 } : {}}
          >
            "{nodeKey}":{' '}
          </span>
        )}

        <span className="json-bracket">{openBracket}</span>

        {!isExpanded && (
          <span
            style={{
              fontSize: 11,
              color: 'var(--text-subtle)',
              margin: '0 4px',
              backgroundColor: 'var(--rose-50)',
              padding: '1px 6px',
              borderRadius: 4,
              border: '1px solid var(--rose-200)'
            }}
          >
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        )}

        {!isExpanded && <span className="json-bracket">{closeBracket}</span>}
        {!isExpanded && !isLast && <span className="json-bracket">,</span>}
      </div>

      {isExpanded && (
        <div className="json-tree-node">
          {entries.map((entry, index) => (
            <JsonTreeNode
              key={entry.key}
              data={entry.value}
              nodeKey={isArray ? null : entry.key}
              isLast={index === entries.length - 1}
              searchQuery={searchQuery}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}

      {isExpanded && (
        <div>
          <span className="json-bracket">{closeBracket}</span>
          {!isLast && <span className="json-bracket">,</span>}
        </div>
      )}
    </div>
  );
}
