import React, { useState, useMemo } from 'react';
import { AlignLeft, Minimize2, Trash2, CheckCircle2, AlertCircle, FileCode } from 'lucide-react';
import { beautifyJson, minifyJson } from '../../utils/formatters';

export default function BodyTab({ bodyType, setBodyType, body, setBody }) {
  const [errorMsg, setErrorMsg] = useState('');

  // Validate JSON on the fly
  const jsonStatus = useMemo(() => {
    if (bodyType !== 'json') return null;
    if (!body || !body.trim()) {
      return { valid: true, empty: true, message: 'Empty body' };
    }
    try {
      JSON.parse(body);
      return { valid: true, message: 'Valid JSON' };
    } catch (err) {
      return { valid: false, message: err.message };
    }
  }, [body, bodyType]);

  const handleBeautify = () => {
    try {
      const formatted = beautifyJson(body);
      setBody(formatted);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Cannot format: ' + err.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJson(body);
      setBody(minified);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Cannot minify: ' + err.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const insertSampleUser = () => {
    const sample = {
      name: 'Samantha Ray',
      email: 'samantha.ray@example.com',
      role: 'Staff Engineer',
      status: 'active',
      skills: ['React', 'Node.js', 'APIs']
    };
    setBody(JSON.stringify(sample, null, 2));
  };

  const insertSamplePost = () => {
    const sample = {
      title: 'Building Modern Web APIs with Node.js',
      authorId: 1,
      tags: ['nodejs', 'express', 'rest'],
      published: true
    };
    setBody(JSON.stringify(sample, null, 2));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Body Type Selectors */}
      <div className="body-types-bar">
        <label className="body-type-label">
          <input
            type="radio"
            name="bodyType"
            value="none"
            checked={bodyType === 'none'}
            onChange={(e) => setBodyType(e.target.value)}
          />
          none
        </label>
        <label className="body-type-label">
          <input
            type="radio"
            name="bodyType"
            value="json"
            checked={bodyType === 'json'}
            onChange={(e) => setBodyType(e.target.value)}
          />
          raw (JSON)
        </label>
        <label className="body-type-label">
          <input
            type="radio"
            name="bodyType"
            value="text"
            checked={bodyType === 'text'}
            onChange={(e) => setBodyType(e.target.value)}
          />
          raw (Text)
        </label>
        <label className="body-type-label">
          <input
            type="radio"
            name="bodyType"
            value="x-www-form-urlencoded"
            checked={bodyType === 'x-www-form-urlencoded'}
            onChange={(e) => setBodyType(e.target.value)}
          />
          x-www-form-urlencoded
        </label>
      </div>

      {bodyType === 'none' && (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          This request does not have a body payload. Select <strong>raw (JSON)</strong> to include data for POST or PUT.
        </div>
      )}

      {bodyType !== 'none' && (
        <>
          {/* Actions Bar */}
          <div className="body-actions-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {bodyType === 'json' && (
                <>
                  <button className="btn-code-action" onClick={handleBeautify} title="Prettify JSON with 2-space indentation">
                    <AlignLeft size={13} />
                    Format JSON
                  </button>
                  <button className="btn-code-action" onClick={handleMinify} title="Minify JSON">
                    <Minimize2 size={13} />
                    Minify
                  </button>
                  <button className="btn-code-action" onClick={insertSampleUser} title="Load sample user object">
                    <FileCode size={13} />
                    Sample User
                  </button>
                  <button className="btn-code-action" onClick={insertSamplePost} title="Load sample post object">
                    <FileCode size={13} />
                    Sample Post
                  </button>
                </>
              )}

              <button className="btn-code-action" onClick={() => setBody('')} title="Clear editor content">
                <Trash2 size={13} />
                Clear
              </button>
            </div>

            {/* Validation indicator */}
            {bodyType === 'json' && jsonStatus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
                {jsonStatus.valid ? (
                  <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                    <CheckCircle2 size={13} />
                    {jsonStatus.empty ? 'Empty' : 'JSON Valid'}
                  </span>
                ) : (
                  <span style={{ color: '#e11d48', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }} title={jsonStatus.message}>
                    <AlertCircle size={13} />
                    Invalid JSON
                  </span>
                )}
              </div>
            )}
          </div>

          {errorMsg && (
            <div style={{ fontSize: 11.5, color: '#e11d48', marginBottom: 6, fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          {/* Code Textarea */}
          <textarea
            className="json-textarea"
            placeholder={
              bodyType === 'json'
                ? '{\n  "key": "value"\n}'
                : bodyType === 'x-www-form-urlencoded'
                ? 'key1=value1&key2=value2'
                : 'Raw request text body...'
            }
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck={false}
          />
        </>
      )}
    </div>
  );
}
