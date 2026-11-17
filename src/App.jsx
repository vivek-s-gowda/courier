import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import RequestBar from './components/RequestBar';
import ParamsTab from './components/RequestTabs/ParamsTab';
import HeadersTab from './components/RequestTabs/HeadersTab';
import BodyTab from './components/RequestTabs/BodyTab';
import AuthTab from './components/RequestTabs/AuthTab';
import ResponsePanel from './components/ResponsePanel/ResponsePanel';
import SaveRequestModal from './components/SaveRequestModal';

export default function App() {
  // Main Request States
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('http://localhost:5001/api/mock/users');
  const [requestName, setRequestName] = useState('Get Mock Users');
  const [selectedId, setSelectedId] = useState(null);

  // Configuration Tabs
  const [activeConfigTab, setActiveConfigTab] = useState('params'); // 'params' | 'headers' | 'body' | 'auth'
  const [params, setParams] = useState([
    { key: 'limit', value: '10', description: 'Maximum users to return', enabled: true },
    { key: '', value: '', description: '', enabled: true }
  ]);
  const [headers, setHeaders] = useState([
    { key: 'Accept', value: 'application/json', description: 'Accept JSON', enabled: true },
    { key: '', value: '', description: '', enabled: true }
  ]);
  const [bodyType, setBodyType] = useState('none');
  const [body, setBody] = useState('');
  const [auth, setAuth] = useState({ type: 'none', token: '', username: '', password: '' });

  // Response States
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // History & Saved Requests
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const isUpdatingUrlFromParams = useRef(false);

  // Show Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch initial History & Saved collections from Backend
  useEffect(() => {
    fetchHistory();
    fetchSaved();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.warn('Could not fetch history:', err);
    }
  };

  const fetchSaved = async () => {
    try {
      const res = await fetch('/api/collections');
      if (res.ok) {
        const data = await res.json();
        setSaved(data);
      }
    } catch (err) {
      console.warn('Could not fetch saved collections:', err);
    }
  };

  // Synchronize Params with URL Query String
  useEffect(() => {
    if (isUpdatingUrlFromParams.current) {
      isUpdatingUrlFromParams.current = false;
      return;
    }

    try {
      if (!url) return;
      const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
      const urlParams = [];
      parsedUrl.searchParams.forEach((val, k) => {
        urlParams.push({ key: k, value: val, description: '', enabled: true });
      });
      urlParams.push({ key: '', value: '', description: '', enabled: true });

      // Compare if actually changed
      const currentNonEmpty = params.filter(p => p.key && p.enabled);
      const urlNonEmpty = urlParams.filter(p => p.key && p.enabled);
      const isDifferent = JSON.stringify(currentNonEmpty.map(p => ({ k: p.key, v: p.value }))) !==
                          JSON.stringify(urlNonEmpty.map(p => ({ k: p.key, v: p.value })));
      if (isDifferent && urlNonEmpty.length > 0) {
        setParams(urlParams);
      }
    } catch {
      // Ignore URL parsing errors while user is typing
    }
  }, [url]);

  const handleParamsChange = (newParams) => {
    setParams(newParams);
    try {
      if (!url) return;
      isUpdatingUrlFromParams.current = true;
      const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
      parsedUrl.search = ''; // reset existing query

      newParams.forEach(p => {
        if (p.enabled && p.key) {
          parsedUrl.searchParams.append(p.key, p.value || '');
        }
      });

      setUrl(parsedUrl.toString());
    } catch {
      // ignore
    }
  };

  // Send API Request
  const handleSend = async () => {
    if (!url.trim()) {
      showToast('Please enter a valid request URL', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        method,
        url: url.trim(),
        headers: headers.filter(h => h.enabled && h.key),
        params: params.filter(p => p.enabled && p.key),
        body,
        bodyType,
        timeout: 30000
      };

      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setResponse(data);
      fetchHistory(); // refresh sidebar history

      if (data.status >= 200 && data.status < 300) {
        showToast(`${method} request completed with status ${data.status}`);
      } else {
        showToast(`${method} returned status ${data.status || 'ERR'}`, 'error');
      }
    } catch (err) {
      setResponse({
        success: false,
        status: 0,
        statusText: 'Proxy Execution Error',
        time: 0,
        size: 0,
        headers: {},
        data: { error: err.message },
        raw: err.message,
        isJson: true
      });
      showToast('Request execution failed: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load from History
  const handleSelectHistory = (item) => {
    setSelectedId(item.id);
    setMethod(item.method || 'GET');
    setUrl(item.url || '');
    setRequestName(`${item.method} Request`);
    if (Array.isArray(item.headers) && item.headers.length > 0) {
      const h = [...item.headers];
      h.push({ key: '', value: '', description: '', enabled: true });
      setHeaders(h);
    }
    if (Array.isArray(item.params) && item.params.length > 0) {
      const p = [...item.params];
      p.push({ key: '', value: '', description: '', enabled: true });
      setParams(p);
    }
    setBodyType(item.bodyType || 'none');
    setBody(item.body || '');
    if (item.body && item.bodyType !== 'none') {
      setActiveConfigTab('body');
    }
    showToast(`Loaded ${item.method} ${item.url}`);
  };

  // Load Saved Request
  const handleSelectSaved = (item) => {
    setMethod(item.method || 'GET');
    setUrl(item.url || '');
    setRequestName(item.name || 'Saved Request');
    if (Array.isArray(item.headers)) {
      setHeaders([...item.headers, { key: '', value: '', description: '', enabled: true }]);
    }
    if (Array.isArray(item.params)) {
      setParams([...item.params, { key: '', value: '', description: '', enabled: true }]);
    }
    setBodyType(item.bodyType || 'none');
    setBody(item.body || '');
    if (item.body && item.bodyType !== 'none') {
      setActiveConfigTab('body');
    }
    showToast(`Loaded "${item.name}"`);
  };

  // Load Mock Preset
  const handleLoadMock = (preset) => {
    setMethod(preset.method);
    setUrl(preset.url);
    setRequestName(preset.name);
    setBodyType(preset.bodyType || 'none');
    setBody(preset.body || '');
    if (preset.body) {
      setActiveConfigTab('body');
    }
    showToast(`Loaded ${preset.name}`);
  };

  // New blank request
  const handleNewRequest = () => {
    setSelectedId(null);
    setMethod('GET');
    setUrl('http://localhost:5001/api/mock/users');
    setRequestName('Untitled Request');
    setParams([{ key: '', value: '', description: '', enabled: true }]);
    setHeaders([{ key: 'Accept', value: 'application/json', description: '', enabled: true }, { key: '', value: '', description: '', enabled: true }]);
    setBodyType('none');
    setBody('');
    setResponse(null);
    showToast('New request created');
  };

  // Delete Single History Item
  const handleDeleteHistoryItem = async (id) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedId === id) setSelectedId(null);
      showToast('Removed from history');
    } catch (err) {
      console.error(err);
    }
  };

  // Clear All History
  const handleClearHistory = async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistory([]);
      setSelectedId(null);
      showToast('All history cleared');
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Saved Request
  const handleDeleteSavedItem = async (id) => {
    try {
      await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      setSaved(prev => prev.filter(item => item.id !== id));
      showToast('Saved request deleted');
    } catch (err) {
      console.error(err);
    }
  };

  // Save Current Request
  const handleSaveToCollection = async (customName) => {
    try {
      const reqData = {
        name: customName,
        method,
        url,
        headers: headers.filter(h => h.enabled && h.key),
        params: params.filter(p => p.enabled && p.key),
        bodyType,
        body
      };

      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData)
      });

      if (res.ok) {
        const created = await res.json();
        setSaved(prev => [created, ...prev]);
        setRequestName(customName);
        showToast(`Saved "${customName}" to collection!`);
      }
    } catch (err) {
      showToast('Failed to save request: ' + err.message, 'error');
    }
  };

  // Generate cURL command
  const handleCopyCurl = () => {
    let curl = `curl --location --request ${method} '${url}'`;
    headers.forEach(h => {
      if (h.enabled && h.key) {
        curl += ` \\\n  --header '${h.key}: ${h.value || ''}'`;
      }
    });

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && bodyType !== 'none' && body) {
      curl += ` \\\n  --data-raw '${body.replace(/'/g, "'\\''")}'`;
    }

    navigator.clipboard.writeText(curl);
    showToast('cURL command copied to clipboard');
  };

  // Active parameter / header count badges
  const activeParamsCount = params.filter(p => p.enabled && p.key).length;
  const activeHeadersCount = headers.filter(h => h.enabled && h.key).length;

  return (
    <div className="app-container">
      {/* Left Sidebar (History & Collections) */}
      <Sidebar
        history={history}
        saved={saved}
        selectedId={selectedId}
        onSelectHistory={handleSelectHistory}
        onSelectSaved={handleSelectSaved}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onDeleteSavedItem={handleDeleteSavedItem}
        onClearHistory={handleClearHistory}
        onNewRequest={handleNewRequest}
        onLoadMock={handleLoadMock}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Request Bar */}
        <RequestBar
          method={method}
          setMethod={setMethod}
          url={url}
          setUrl={setUrl}
          requestName={requestName}
          setRequestName={setRequestName}
          onSend={handleSend}
          onSave={() => setIsSaveModalOpen(true)}
          isLoading={isLoading}
          onCopyCurl={handleCopyCurl}
        />

        {/* Request Configuration Section */}
        <section className="request-config-section">
          <div className="config-tabs-bar">
            <button
              className={`config-tab ${activeConfigTab === 'params' ? 'active' : ''}`}
              onClick={() => setActiveConfigTab('params')}
            >
              Params
              {activeParamsCount > 0 && <span className="badge-count">{activeParamsCount}</span>}
            </button>

            <button
              className={`config-tab ${activeConfigTab === 'headers' ? 'active' : ''}`}
              onClick={() => setActiveConfigTab('headers')}
            >
              Headers
              {activeHeadersCount > 0 && <span className="badge-count">{activeHeadersCount}</span>}
            </button>

            <button
              className={`config-tab ${activeConfigTab === 'body' ? 'active' : ''}`}
              onClick={() => setActiveConfigTab('body')}
            >
              Body
              {bodyType !== 'none' && <span className="badge-count">{bodyType}</span>}
            </button>

            <button
              className={`config-tab ${activeConfigTab === 'auth' ? 'active' : ''}`}
              onClick={() => setActiveConfigTab('auth')}
            >
              Auth
              {auth.type !== 'none' && <span className="badge-count">{auth.type}</span>}
            </button>
          </div>

          <div className="config-tab-content">
            {activeConfigTab === 'params' && (
              <ParamsTab params={params} setParams={handleParamsChange} />
            )}
            {activeConfigTab === 'headers' && (
              <HeadersTab headers={headers} setHeaders={setHeaders} />
            )}
            {activeConfigTab === 'body' && (
              <BodyTab
                bodyType={bodyType}
                setBodyType={setBodyType}
                body={body}
                setBody={setBody}
              />
            )}
            {activeConfigTab === 'auth' && (
              <AuthTab
                auth={auth}
                setAuth={setAuth}
                headers={headers}
                setHeaders={setHeaders}
              />
            )}
          </div>
        </section>

        {/* Response & JSON Formatter Section (Bellow) */}
        <ResponsePanel
          response={response}
          isLoading={isLoading}
          onLoadQuickTest={handleLoadMock}
        />
      </main>

      {/* Save to Collection Modal */}
      <SaveRequestModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveToCollection}
        defaultName={requestName}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
