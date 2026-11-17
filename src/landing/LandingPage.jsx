import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Download,
  Terminal,
  Check,
  Copy,
  Zap,
  GitBranch,
  Gauge,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Workflow,
  Sparkles,
  Command,
  FileCode2,
  Server,
  ExternalLink,
  ChevronRight,
  Play,
  CheckCircle2,
  Globe,
  Radio,
  Clock,
  HardDrive
} from 'lucide-react';
import './landing.css';

export default function LandingPage({ onLaunchApp }) {
  // OS Detection
  const [detectedOs, setDetectedOs] = useState('macOS');
  useEffect(() => {
    const platform = window.navigator.userAgent.toLowerCase();
    if (platform.includes('mac')) setDetectedOs('macOS (Universal)');
    else if (platform.includes('win')) setDetectedOs('Windows (x64)');
    else if (platform.includes('linux')) setDetectedOs('Linux (AppImage)');
  }, []);

  // Terminal Copy State
  const [copiedBrew, setCopiedBrew] = useState(false);
  const handleCopyBrew = () => {
    navigator.clipboard.writeText('brew install --cask courier-api');
    setCopiedBrew(true);
    setTimeout(() => setCopiedBrew(false), 2200);
  };

  // Interactive Hero Mockup States
  const heroMockupEndpoints = [
    {
      id: 'get-users',
      method: 'GET',
      url: 'https://api.courier.dev/v1/users?limit=10',
      label: 'GET /v1/users',
      status: 200,
      statusText: 'OK',
      time: '14 ms',
      size: '1.84 KB',
      data: {
        status: 'success',
        total: 1248,
        page: 1,
        users: [
          { id: 'usr_9f81a', name: 'Elena Rostova', role: 'Principal Architect', status: 'active' },
          { id: 'usr_2c44e', name: 'Marcus Vance', role: 'Staff Engineer', status: 'active' },
          { id: 'usr_7b19d', name: 'Sarah Lin', role: 'DevOps Lead', status: 'pending' }
        ]
      }
    },
    {
      id: 'post-auth',
      method: 'POST',
      url: 'https://api.courier.dev/v1/auth/token',
      label: 'POST /v1/auth/token',
      status: 201,
      statusText: 'Created',
      time: '19 ms',
      size: '0.42 KB',
      data: {
        token_type: 'Bearer',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.courier_token',
        expires_in: 3600,
        scope: 'read:all write:all admin',
        user_id: 'usr_9f81a'
      }
    },
    {
      id: 'ws-stream',
      method: 'WS',
      url: 'wss://stream.courier.dev/v1/events',
      label: 'WS /v1/stream',
      status: 101,
      statusText: 'Switching Protocols',
      time: '8 ms',
      size: '0.28 KB',
      data: {
        event: 'client_connected',
        session_id: 'sess_89f0a21',
        ping_interval_ms: 15000,
        active_subscribers: 42
      }
    },
    {
      id: 'delete-user',
      method: 'DELETE',
      url: 'https://api.courier.dev/v1/users/42',
      label: 'DELETE /v1/users/42',
      status: 200,
      statusText: 'OK',
      time: '11 ms',
      size: '0.15 KB',
      data: {
        success: true,
        deleted_id: 42,
        message: 'User entity purged from primary cluster'
      }
    }
  ];

  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [responseFlash, setResponseFlash] = useState(false);

  const activeEndpoint = heroMockupEndpoints[activeEndpointIndex];

  const handleTriggerSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setResponseFlash(true);
      setTimeout(() => setResponseFlash(false), 500);
    }, 240);
  };

  // 3D Tilt on Mouse Move
  const mockupRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!mockupRef.current) return;
    const rect = mockupRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    mockupRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!mockupRef.current) return;
    mockupRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  // Bento Interactive Protocol Switcher
  const [selectedProtocol, setSelectedProtocol] = useState('REST');
  const protocolPayloads = {
    REST: `{
  "method": "POST",
  "endpoint": "/api/v2/orders",
  "body": { "sku": "CR-900", "qty": 3, "currency": "USD" }
}`,
    GraphQL: `query GetAccount($id: ID!) {
  account(id: $id) {
    name
    tier
    apiQuota { remaining }
  }
}`,
    gRPC: `service CourierService {
  rpc StreamTelemetry (TelemetryReq) 
    returns (stream TelemetryChunk);
}`,
    SSE: `event: ping
id: 10492
data: { "server_epoch": 1794920780, "health": "100%" }`
  };

  // Bento Mock Server Toggle
  const [isMockServerActive, setIsMockServerActive] = useState(true);

  // Benchmarks Interactive State
  const [benchmarkMetric, setBenchmarkMetric] = useState('startup');
  const benchmarkData = {
    startup: {
      title: 'Cold Boot Startup Latency',
      courier: '9 ms',
      postman: '1,240 ms',
      insomnia: '980 ms',
      unit: 'Milliseconds (Lower is better)'
    },
    ram: {
      title: 'Memory Footprint at Idle',
      courier: '42 MB',
      postman: '385 MB',
      insomnia: '290 MB',
      unit: 'Megabytes (Lower is better)'
    },
    latency: {
      title: 'Request Pipeline Overhead',
      courier: '0.4 ms',
      postman: '18.2 ms',
      insomnia: '12.6 ms',
      unit: 'Milliseconds overhead'
    }
  };

  // Pricing Annual Toggle
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="landing-container">
      {/* Background Ambient Glows */}
      <div className="bg-ambient-glow" />
      <div className="bg-grid-pattern" />

      {/* --------------------------------------------------------------------
          A. FLOATING GLASSMORPHIC NAVBAR
          -------------------------------------------------------------------- */}
      <header className="landing-navbar">
        <div className="navbar-inner">
          <a href="#" className="navbar-brand">
            <div className="navbar-logo-box">
              <Send size={18} strokeWidth={2.5} style={{ transform: 'translateX(1px)' }} />
            </div>
            <span className="navbar-title">Courier</span>
          </a>

          <nav className="navbar-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#benchmarks" className="nav-link">Benchmarks</a>
            <a href="#protocols" className="nav-link">Protocols</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="nav-link">Docs</a>
          </nav>

          <div className="navbar-actions">
            <button
              onClick={onLaunchApp}
              className="btn-launch-app"
              title="Open online web client (/app)"
            >
              <span>Launch App</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          B. HERO SECTION WITH 3D-TILT APP MOCKUP
          -------------------------------------------------------------------- */}
      <section className="hero-section">
        <div className="hero-pill-badge">
          <span className="badge-pulse-dot" />
          <span>v2.0 is live — Local-first &amp; Git-native</span>
          <ChevronRight size={13} />
        </div>

        <h1 className="hero-headline">
          Ship APIs at the <br />
          <span className="hero-headline-highlight">Speed of Thought.</span>
        </h1>

        <p className="hero-subheadline">
          A lightning-fast, zero-bloat API testing client. Store collections as clean Git-tracked files, launch in under 10ms, and bypass cloud lock-in forever.
        </p>

        <div className="hero-cta-group">
          <a href="#download" className="btn-hero-primary">
            <Download size={16} />
            <span>Download for {detectedOs}</span>
          </a>

          <button onClick={onLaunchApp} className="btn-hero-secondary">
            <span>Open in Browser (/app)</span>
            <ExternalLink size={15} />
          </button>

          <div className="terminal-copy-pill" onClick={handleCopyBrew} title="Click to copy command">
            <Terminal size={13} color="var(--lp-violet)" />
            <span>brew install --cask courier-api</span>
            {copiedBrew ? (
              <Check size={13} color="#10b981" />
            ) : (
              <Copy size={13} color="#71717a" />
            )}
          </div>
        </div>

        {/* Interactive 3D Hero Mockup */}
        <div
          className="hero-mockup-wrapper"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hero-mockup-card" ref={mockupRef}>
            {/* Window Titlebar */}
            <div className="mockup-titlebar">
              <div className="mockup-traffic-lights">
                <span className="traffic-light traffic-red" />
                <span className="traffic-light traffic-yellow" />
                <span className="traffic-light traffic-green" />
              </div>

              <div className="mockup-window-title">
                <Send size={12} color="var(--lp-rose)" />
                <span>Courier — API Testing Client</span>
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                  Proxy Engine: Online
                </span>
              </div>
            </div>

            {/* Window Content */}
            <div className="mockup-body">
              {/* Left Sidebar */}
              <div className="mockup-sidebar">
                <span className="mockup-sidebar-header">Interactive Endpoints</span>
                {heroMockupEndpoints.map((ep, idx) => (
                  <div
                    key={ep.id}
                    className={`mockup-history-item ${idx === activeEndpointIndex ? 'active' : ''}`}
                    onClick={() => setActiveEndpointIndex(idx)}
                  >
                    <span className={`mockup-method-pill method-${ep.method.toLowerCase()}`} style={{ fontSize: 10, padding: '2px 6px' }}>
                      {ep.method}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ep.label.split(' ')[1]}
                    </span>
                  </div>
                ))}

                <div style={{ marginTop: 'auto', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, fontSize: 11, color: 'var(--lp-text-muted)' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>Tip:</span> Click any tab or the <strong>Send</strong> button to test live response rendering!
                </div>
              </div>

              {/* Center Workspace */}
              <div className="mockup-workspace">
                {/* Request Bar */}
                <div className="mockup-request-bar">
                  <span className={`mockup-method-pill method-${activeEndpoint.method.toLowerCase()}`}>
                    {activeEndpoint.method}
                  </span>
                  <input
                    type="text"
                    className="mockup-url-input"
                    value={activeEndpoint.url}
                    readOnly
                  />
                  <button
                    className="mockup-btn-send"
                    onClick={handleTriggerSend}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Tabs */}
                <div className="mockup-tabs">
                  <button className="mockup-tab active">Response Body (JSON)</button>
                  <button className="mockup-tab">Headers</button>
                  <button className="mockup-tab">cURL Preview</button>
                </div>

                {/* Response Area */}
                <div className={`mockup-response-area ${responseFlash ? 'response-flash' : ''}`}>
                  <div className="mockup-response-meta">
                    <span className="mockup-status-badge">
                      <CheckCircle2 size={12} />
                      {activeEndpoint.status} {activeEndpoint.statusText}
                    </span>

                    <div style={{ display: 'flex', gap: 14 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} color="var(--lp-violet)" />
                        {activeEndpoint.time}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HardDrive size={12} color="var(--lp-cyan)" />
                        {activeEndpoint.size}
                      </span>
                    </div>
                  </div>

                  <pre className="mockup-code-block">
                    <code>{JSON.stringify(activeEndpoint.data, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          C. LOGO CLOUD & PROTOCOLS MARQUEE
          -------------------------------------------------------------------- */}
      <section className="marquee-section" id="protocols">
        <div className="marquee-heading">Engineered for Modern Engineering Stacks &amp; Protocols</div>
        <div className="marquee-track">
          {[
            'REST API',
            'GraphQL',
            'gRPC',
            'WebSockets',
            'OpenAPI 3.1',
            'cURL Exporter',
            'Git Sync',
            'Docker Compatible',
            'JSON Schema',
            'OAuth 2.0 & Bearer',
            'Server-Sent Events (SSE)',
            'HTTP/2 & HTTP/3',
            'Apple Silicon Native',
            'Zero Telemetry'
          ].concat([
            'REST API',
            'GraphQL',
            'gRPC',
            'WebSockets',
            'OpenAPI 3.1',
            'cURL Exporter',
            'Git Sync',
            'Docker Compatible',
            'JSON Schema',
            'OAuth 2.0 & Bearer',
            'Server-Sent Events (SSE)',
            'HTTP/2 & HTTP/3',
            'Apple Silicon Native',
            'Zero Telemetry'
          ]).map((item, idx) => (
            <div key={idx} className="marquee-item">
              <Zap size={13} color="var(--lp-violet)" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          D. BENTO GRID FEATURES SHOWCASE
          -------------------------------------------------------------------- */}
      <section className="bento-section" id="features">
        <div className="section-header">
          <div className="section-eyebrow">Architecture First</div>
          <h2 className="section-title">Built for Engineers Who Value Speed and Privacy</h2>
          <p className="section-subtitle">
            Say goodbye to 10-second splash screens, forced account logins, and proprietary cloud silos. Courier gives you raw, uncompromised speed.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Git-Native Collections (Large 8-col) */}
          <div className="bento-card bento-card-large">
            <div className="bento-icon-box">
              <GitBranch size={22} />
            </div>
            <h3 className="bento-card-title">Git-Native Collections</h3>
            <p className="bento-card-desc">
              Your API requests belong in your Git repository right beside your application code. Merge requests, review PRs, and branch environments using standard Git workflows.
            </p>
            <div className="git-diff-tree">
              <div className="diff-file">diff --git a/collections/payments.json b/collections/payments.json</div>
              <div className="diff-file">@@ -14,6 +14,8 @@ "POST /v1/checkout"</div>
              <div className="diff-add">+   "header": "Idempotency-Key: req_981a3e"</div>
              <div className="diff-add">+   "param": "currency=USD&amp;capture=true"</div>
              <div className="diff-del">-   "endpoint": "http://sandbox.stripe.mock"</div>
              <div className="diff-add">+   "endpoint": "https://api.stripe.com/v1/charges"</div>
            </div>
          </div>

          {/* Card 2: Sub-10ms Cold Start (Small 4-col) */}
          <div className="bento-card bento-card-small">
            <div className="bento-icon-box" style={{ color: 'var(--lp-cyan)', background: 'rgba(6, 182, 212, 0.12)', borderColor: 'rgba(6, 182, 212, 0.25)' }}>
              <Gauge size={22} />
            </div>
            <h3 className="bento-card-title">Sub-10ms Cold Start</h3>
            <p className="bento-card-desc">
              Launches instantaneously without blocking splash screens or bloated analytics scripts.
            </p>
            <div className="speed-comparison-chart">
              <div className="speed-bar-row">
                <div className="speed-bar-label">
                  <span style={{ color: '#fff' }}>Courier</span>
                  <span style={{ color: 'var(--lp-violet)' }}>9 ms</span>
                </div>
                <div className="speed-bar-track">
                  <div className="speed-bar-fill-courier" />
                </div>
              </div>
              <div className="speed-bar-row">
                <div className="speed-bar-label">
                  <span>Legacy Competitor P</span>
                  <span>1,240 ms</span>
                </div>
                <div className="speed-bar-track">
                  <div className="speed-bar-fill-legacy" />
                </div>
              </div>
              <div className="speed-bar-row">
                <div className="speed-bar-label">
                  <span>Legacy Competitor I</span>
                  <span>980 ms</span>
                </div>
                <div className="speed-bar-track">
                  <div className="speed-bar-fill-legacy" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Multi-Protocol Engine (Small 4-col) */}
          <div className="bento-card bento-card-small">
            <div className="bento-icon-box" style={{ color: 'var(--lp-rose)', background: 'rgba(225, 29, 72, 0.12)', borderColor: 'rgba(225, 29, 72, 0.25)' }}>
              <Layers size={22} />
            </div>
            <h3 className="bento-card-title">Multi-Protocol Engine</h3>
            <p className="bento-card-desc">
              Seamlessly switch between REST, GraphQL, gRPC, and Server-Sent Events.
            </p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {['REST', 'GraphQL', 'gRPC', 'SSE'].map((proto) => (
                <button
                  key={proto}
                  onClick={() => setSelectedProtocol(proto)}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: selectedProtocol === proto ? 'var(--lp-violet)' : 'var(--lp-border)',
                    background: selectedProtocol === proto ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: selectedProtocol === proto ? '#fff' : 'var(--lp-text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {proto}
                </button>
              ))}
            </div>
            <pre style={{ margin: 0, padding: 10, background: '#09090b', border: '1px solid var(--lp-border)', borderRadius: 6, fontSize: 11, fontFamily: 'var(--lp-font-mono)', color: '#d4d4d8', overflowX: 'auto' }}>
              {protocolPayloads[selectedProtocol]}
            </pre>
          </div>

          {/* Card 4: Chained Requests & Scripting (Half 4-col) */}
          <div className="bento-card bento-card-small">
            <div className="bento-icon-box">
              <Workflow size={22} />
            </div>
            <h3 className="bento-card-title">Chained Request Pipes</h3>
            <p className="bento-card-desc">
              Pass tokens from an auth endpoint directly into downstream request headers automatically without manual copy-pasting.
            </p>
            <div style={{ background: '#09090b', padding: '12px', border: '1px solid var(--lp-border)', borderRadius: 8, fontSize: 11.5, fontFamily: 'var(--lp-font-mono)' }}>
              <div style={{ color: '#f59e0b', marginBottom: 6 }}>1. POST /auth/login → token</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--lp-violet)', margin: '4px 0' }}>
                <span>↳</span>
                <span style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '2px 6px', borderRadius: 4 }}>
                  $token → Authorization: Bearer
                </span>
              </div>
              <div style={{ color: '#10b981', marginTop: 6 }}>2. GET /v1/user/profile</div>
            </div>
          </div>

          {/* Card 5: Zero-Config Mock Server (Small 4-col) */}
          <div className="bento-card bento-card-small">
            <div className="bento-icon-box" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
              <Server size={22} />
            </div>
            <h3 className="bento-card-title">Local Mock Server</h3>
            <p className="bento-card-desc">
              Test clients and verify schemas locally with zero external network connectivity.
            </p>
            <div style={{ background: '#09090b', border: '1px solid var(--lp-border)', padding: '12px', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Local Server</span>
                <button
                  onClick={() => setIsMockServerActive(!isMockServerActive)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: isMockServerActive ? '#10b981' : '#52525b',
                    color: '#fff'
                  }}
                >
                  {isMockServerActive ? 'ACTIVE' : 'IDLE'}
                </button>
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--lp-font-mono)', color: 'var(--lp-text-muted)' }}>
                {isMockServerActive ? 'http://localhost:5001/api/mock/users' : 'Server stopped'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          E. INTERACTIVE BENCHMARKS SECTION
          -------------------------------------------------------------------- */}
      <section className="benchmarks-section" id="benchmarks">
        <div className="section-header">
          <div className="section-eyebrow">Real World Benchmarks</div>
          <h2 className="section-title">Engineered to Outperform</h2>
          <p className="section-subtitle">
            Measured across identical hardware (Apple M3 Max, 36GB RAM, Node.js 22 runtime).
          </p>
        </div>

        <div className="benchmark-card">
          <div className="benchmark-tabs">
            <button
              className={`benchmark-tab-btn ${benchmarkMetric === 'startup' ? 'active' : ''}`}
              onClick={() => setBenchmarkMetric('startup')}
            >
              Startup Latency
            </button>
            <button
              className={`benchmark-tab-btn ${benchmarkMetric === 'ram' ? 'active' : ''}`}
              onClick={() => setBenchmarkMetric('ram')}
            >
              RAM Usage
            </button>
            <button
              className={`benchmark-tab-btn ${benchmarkMetric === 'latency' ? 'active' : ''}`}
              onClick={() => setBenchmarkMetric('latency')}
            >
              Execution Overhead
            </button>
          </div>

          <div className="benchmark-grid">
            <div className="benchmark-client-box highlight">
              <span className="winner-badge">FASTEST</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Courier</span>
              <div className="benchmark-val fastest">
                {benchmarkData[benchmarkMetric].courier}
              </div>
              <span className="benchmark-label">{benchmarkData[benchmarkMetric].unit}</span>
            </div>

            <div className="benchmark-client-box">
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--lp-text-secondary)' }}>Legacy Tool P</span>
              <div className="benchmark-val">
                {benchmarkData[benchmarkMetric].postman}
              </div>
              <span className="benchmark-label">{benchmarkData[benchmarkMetric].unit}</span>
            </div>

            <div className="benchmark-client-box">
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--lp-text-secondary)' }}>Legacy Tool I</span>
              <div className="benchmark-val">
                {benchmarkData[benchmarkMetric].insomnia}
              </div>
              <span className="benchmark-label">{benchmarkData[benchmarkMetric].unit}</span>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          F. TRANSPARENT PRICING
          -------------------------------------------------------------------- */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <div className="section-eyebrow">Fair &amp; Transparent</div>
          <h2 className="section-title">Open-Source Core, Zero Paywalls</h2>
          <p className="section-subtitle">
            Courier is free forever for developers. No limits on requests, history, or environments.
          </p>
        </div>

        <div className="pricing-toggle-wrapper">
          <span>Monthly billing</span>
          <div
            className={`pricing-toggle ${isAnnual ? 'active' : ''}`}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div className="pricing-toggle-knob" />
          </div>
          <span>Annual billing</span>
          <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--lp-violet)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
            Save 20%
          </span>
        </div>

        <div className="pricing-cards-grid">
          {/* Community Plan */}
          <div className="pricing-card">
            <div className="pricing-tag">Community Edition</div>
            <div className="pricing-price">$0</div>
            <p style={{ fontSize: 13, color: 'var(--lp-text-muted)' }}>Free forever for individual developers</p>

            <ul className="pricing-features-list">
              <li className="pricing-feature-item">
                <Check size={16} color="#10b981" />
                <span>Unlimited local collections &amp; history</span>
              </li>
              <li className="pricing-feature-item">
                <Check size={16} color="#10b981" />
                <span>Git-native syncing via your filesystem</span>
              </li>
              <li className="pricing-feature-item">
                <Check size={16} color="#10b981" />
                <span>REST, GraphQL, WebSockets, &amp; gRPC</span>
              </li>
              <li className="pricing-feature-item">
                <Check size={16} color="#10b981" />
                <span>Built-in Mock Server &amp; Proxy engine</span>
              </li>
              <li className="pricing-feature-item">
                <Check size={16} color="#10b981" />
                <span>Zero telemetry &amp; 100% offline functionality</span>
              </li>
            </ul>

            <button onClick={onLaunchApp} className="btn-pricing btn-pricing-outline">
              Open Web App (/app)
            </button>
          </div>

          {/* Team Cloud Plan */}
          <div className="pricing-card featured">
            <div className="pricing-tag">Team Enterprise</div>
            <div className="pricing-price">
              {isAnnual ? '$10' : '$12'}
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--lp-text-muted)' }}> / user / mo</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--lp-text-muted)' }}>For engineering teams needing managed sync</p>

            <ul className="pricing-features-list">
              <li className="pricing-feature-item">
                <Check size={16} color="var(--lp-violet)" />
                <span style={{ color: '#fff' }}>Everything in Community, plus:</span>
              </li>
              <li className="pricing-feature-item">
                <Check size={16} color="var(--lp-violet)" />
                <span>End-to-end encrypted team vault sync</span>
              </li>
              <li className="pricing-feature-item">
                <Check size={16} color="var(--lp-violet)" />
                <span>Role-based access control (RBAC)</span>
              </li>
              <li className="pricing-feature-item">
                <Check size={16} color="var(--lp-violet)" />
                <span>SAML SSO &amp; SCIM provisioning</span>
              </li>
              <li className="pricing-feature-item">
                <Check size={16} color="var(--lp-violet)" />
                <span>Priority 24/7 engineering support</span>
              </li>
            </ul>

            <a href="#download" className="btn-pricing btn-pricing-filled">
              Start 14-Day Free Trial
            </a>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          G. FINAL CTA & DOWNLOAD MATRIX
          -------------------------------------------------------------------- */}
      <section className="final-cta-section" id="download">
        <div className="final-cta-card">
          <div className="section-eyebrow">Ready to upgrade?</div>
          <h2 className="section-title">Ditch the Bloat. Deliver APIs with Courier.</h2>
          <p className="section-subtitle">
            Join thousands of backend architects and engineers building faster APIs every day.
          </p>

          <div className="os-matrix-row">
            <a href="#download" className="os-download-btn">
              <AppleIcon />
              <span>macOS (Universal / Apple Silicon)</span>
            </a>
            <a href="#download" className="os-download-btn">
              <WindowsIcon />
              <span>Windows (x64 / ARM)</span>
            </a>
            <a href="#download" className="os-download-btn">
              <LinuxIcon />
              <span>Linux (AppImage / deb)</span>
            </a>
            <button onClick={onLaunchApp} className="os-download-btn" style={{ borderColor: 'var(--lp-violet)', color: '#fff' }}>
              <Globe size={15} color="var(--lp-violet)" />
              <span>Launch Web Client (/app)</span>
            </button>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          FOOTER
          -------------------------------------------------------------------- */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="navbar-logo-box" style={{ width: 28, height: 28 }}>
                <Send size={15} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Courier</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--lp-text-muted)', maxWidth: 300, lineHeight: 1.6 }}>
              The next-generation API testing client. Local-first, git-native, blazingly fast.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Product</div>
            <ul className="footer-links-list">
              <li><button onClick={onLaunchApp} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }} className="footer-link">Online App (/app)</button></li>
              <li><a href="#download" className="footer-link">Desktop Client</a></li>
              <li><a href="#benchmarks" className="footer-link">Performance Benchmarks</a></li>
              <li><a href="#pricing" className="footer-link">Pricing</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Protocols</div>
            <ul className="footer-links-list">
              <li><a href="#protocols" className="footer-link">REST &amp; cURL</a></li>
              <li><a href="#protocols" className="footer-link">GraphQL Schema</a></li>
              <li><a href="#protocols" className="footer-link">WebSockets Streaming</a></li>
              <li><a href="#protocols" className="footer-link">gRPC &amp; Protobuf</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Open Source</div>
            <ul className="footer-links-list">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">GitHub Repository</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">MIT License</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">Changelog (v2.0)</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">Discord Community</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Courier Project. Released under the MIT License.</span>
          <span className="status-indicator">
            <span className="status-dot" />
            All Systems Operational
          </span>
        </div>
      </footer>
    </div>
  );
}

// OS Icons
function AppleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.64-.78 1.08-1.86.96-2.95-1 .04-2.13.66-2.8 1.44-.59.68-1.11 1.77-.97 2.84 1.11.09 2.17-.55 2.81-1.33z" />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.003 0C8.5 0 6.5 2.5 6.5 5.5c0 1.2.3 2.7 1 3.8C6.3 10.3 5 12.5 5 15.5c0 3 2.2 5.5 5.2 6.5-.4.8-.2 2 1.8 2 2 0 2.2-1.2 1.8-2 3-1 5.2-3.5 5.2-6.5 0-3-1.3-5.2-2.5-6.2.7-1.1 1-2.6 1-3.8C17.5 2.5 15.5 0 12.003 0z" />
    </svg>
  );
}
