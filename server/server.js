import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure data folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const historyFilePath = path.join(dataDir, 'history.json');
const collectionsFilePath = path.join(dataDir, 'collections.json');

// Initialize history file if needed
if (!fs.existsSync(historyFilePath)) {
  fs.writeFileSync(historyFilePath, JSON.stringify([], null, 2));
}

// Initialize collections file if needed
if (!fs.existsSync(collectionsFilePath)) {
  const initialCollections = [
    {
      id: 'mock-get-users',
      name: 'Get All Mock Users',
      method: 'GET',
      url: `http://localhost:${PORT}/api/mock/users`,
      headers: [{ key: 'Accept', value: 'application/json', enabled: true }],
      params: [{ key: 'limit', value: '10', enabled: true }],
      bodyType: 'none',
      body: '',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-post-user',
      name: 'Create New User',
      method: 'POST',
      url: `http://localhost:${PORT}/api/mock/users`,
      headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
      params: [],
      bodyType: 'json',
      body: JSON.stringify({ name: 'Alex Mercer', email: 'alex@example.com', role: 'Developer', status: 'active' }, null, 2),
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-put-user',
      name: 'Update User (ID: 1)',
      method: 'PUT',
      url: `http://localhost:${PORT}/api/mock/users/1`,
      headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
      params: [],
      bodyType: 'json',
      body: JSON.stringify({ name: 'Alex Mercer Jr.', email: 'alex.jr@example.com', role: 'Lead Architect', status: 'active' }, null, 2),
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-delete-user',
      name: 'Delete User (ID: 1)',
      method: 'DELETE',
      url: `http://localhost:${PORT}/api/mock/users/1`,
      headers: [],
      params: [],
      bodyType: 'none',
      body: '',
      createdAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(collectionsFilePath, JSON.stringify(initialCollections, null, 2));
}

function readJsonFile(filePath, defaultValue = []) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// In-memory mock data
let mockUsers = [
  { id: 1, name: 'Emma Watson', email: 'emma@example.com', role: 'Product Manager', status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 2, name: 'Liam Johnson', email: 'liam@example.com', role: 'Senior Engineer', status: 'active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 3, name: 'Sophia Chen', email: 'sophia@example.com', role: 'UI/UX Designer', status: 'pending', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 4, name: 'Marcus Miller', email: 'marcus@example.com', role: 'DevOps Engineer', status: 'inactive', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 5, name: 'Aria Stark', email: 'aria@example.com', role: 'QA Specialist', status: 'active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
];

let mockPosts = [
  { id: 101, title: 'Mastering REST APIs in 2026', authorId: 2, tags: ['api', 'architecture', 'rest'], likes: 142, published: true },
  { id: 102, title: 'Why Reddish Themes are Easy on the Eyes', authorId: 3, tags: ['design', 'ui', 'theme'], likes: 89, published: true },
  { id: 103, title: 'Fullstack Testing Workflow with Courier', authorId: 1, tags: ['testing', 'postman', 'devtools'], likes: 230, published: false }
];

let nextUserId = 6;
let nextPostId = 104;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- API PROXY EXECUTOR ---
app.post('/api/proxy', async (req, res) => {
  const {
    method = 'GET',
    url,
    headers = [],
    params = [],
    body = '',
    bodyType = 'none',
    timeout = 30000
  } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Construct target URL with params
  let targetUrlString = url.trim();
  if (!/^https?:\/\//i.test(targetUrlString)) {
    targetUrlString = `http://${targetUrlString}`;
  }

  try {
    const targetUrl = new URL(targetUrlString);

    // Append enabled query params
    if (Array.isArray(params)) {
      for (const p of params) {
        if (p.enabled && p.key) {
          targetUrl.searchParams.append(p.key, p.value || '');
        }
      }
    }

    // Build headers
    const requestHeaders = {};
    if (Array.isArray(headers)) {
      for (const h of headers) {
        if (h.enabled && h.key) {
          requestHeaders[h.key] = h.value || '';
        }
      }
    } else if (typeof headers === 'object' && headers !== null) {
      Object.assign(requestHeaders, headers);
    }

    const upperMethod = method.toUpperCase();
    const fetchOptions = {
      method: upperMethod,
      headers: requestHeaders,
      redirect: 'follow',
      signal: AbortSignal.timeout(Number(timeout) || 30000)
    };

    // Prepare body for methods that allow payloads
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(upperMethod) && bodyType !== 'none') {
      if (bodyType === 'json') {
        if (!requestHeaders['Content-Type']) {
          requestHeaders['Content-Type'] = 'application/json';
        }
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      } else if (bodyType === 'x-www-form-urlencoded') {
        if (!requestHeaders['Content-Type']) {
          requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        fetchOptions.body = typeof body === 'string' ? body : new URLSearchParams(body).toString();
      } else if (bodyType === 'text' || bodyType === 'raw') {
        fetchOptions.body = String(body);
      } else {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }
    }

    const startTime = performance.now();
    const response = await fetch(targetUrl.toString(), fetchOptions);
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    // Extract response headers
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const contentType = response.headers.get('content-type') || '';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const size = buffer.length;
    const rawText = buffer.toString('utf-8');

    let parsedData = null;
    let isJson = false;

    if (contentType.includes('application/json') || rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
      try {
        parsedData = JSON.parse(rawText);
        isJson = true;
      } catch {
        parsedData = rawText;
        isJson = false;
      }
    } else {
      parsedData = rawText;
    }

    const result = {
      success: true,
      status: response.status,
      statusText: response.statusText || (response.status === 200 ? 'OK' : ''),
      time: duration,
      size,
      headers: responseHeaders,
      data: parsedData,
      raw: rawText,
      isJson,
      url: targetUrl.toString(),
      method: upperMethod
    };

    // Record into history
    const historyItem = {
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      method: upperMethod,
      url: targetUrl.toString(),
      status: response.status,
      statusText: result.statusText,
      duration,
      size,
      headers: Array.isArray(headers) ? headers : [],
      params: Array.isArray(params) ? params : [],
      bodyType,
      body: typeof body === 'string' ? body : JSON.stringify(body),
      responseSnippet: isJson && parsedData ? (Array.isArray(parsedData) ? `[Array of ${parsedData.length}]` : `{Object}`) : rawText.slice(0, 100)
    };

    const currentHistory = readJsonFile(historyFilePath, []);
    currentHistory.unshift(historyItem);
    // Keep max 200 items in history
    if (currentHistory.length > 200) {
      currentHistory.length = 200;
    }
    writeJsonFile(historyFilePath, currentHistory);

    return res.json(result);
  } catch (error) {
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    const failureResult = {
      success: false,
      error: error.message || 'Request failed',
      isTimeout,
      status: isTimeout ? 408 : 0,
      statusText: isTimeout ? 'Request Timeout' : 'Network Error',
      time: 0,
      size: 0,
      headers: {},
      data: {
        error: error.message,
        hint: isTimeout ? 'The remote server did not respond within the timeout window.' : 'Ensure the target URL is reachable and the server is running.'
      },
      raw: error.stack || error.message,
      isJson: true,
      url: targetUrlString,
      method: (method || 'GET').toUpperCase()
    };

    // Save failed attempt to history too
    const currentHistory = readJsonFile(historyFilePath, []);
    currentHistory.unshift({
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      method: (method || 'GET').toUpperCase(),
      url: targetUrlString,
      status: failureResult.status,
      statusText: failureResult.statusText,
      duration: 0,
      size: 0,
      headers: Array.isArray(headers) ? headers : [],
      params: Array.isArray(params) ? params : [],
      bodyType,
      body: typeof body === 'string' ? body : JSON.stringify(body),
      responseSnippet: `Error: ${error.message}`
    });
    if (currentHistory.length > 200) currentHistory.length = 200;
    writeJsonFile(historyFilePath, currentHistory);

    return res.status(200).json(failureResult);
  }
});

// --- HISTORY ENDPOINTS ---
app.get('/api/history', (req, res) => {
  const history = readJsonFile(historyFilePath, []);
  res.json(history);
});

app.post('/api/history', (req, res) => {
  const item = req.body;
  if (!item) return res.status(400).json({ error: 'Item data required' });
  
  const history = readJsonFile(historyFilePath, []);
  item.id = item.id || 'req_' + Date.now();
  item.timestamp = item.timestamp || new Date().toISOString();
  history.unshift(item);
  if (history.length > 200) history.length = 200;
  writeJsonFile(historyFilePath, history);
  res.status(201).json(item);
});

app.delete('/api/history/:id', (req, res) => {
  const { id } = req.params;
  const history = readJsonFile(historyFilePath, []);
  const filtered = history.filter(item => item.id !== id);
  writeJsonFile(historyFilePath, filtered);
  res.json({ success: true, count: filtered.length });
});

app.delete('/api/history', (req, res) => {
  writeJsonFile(historyFilePath, []);
  res.json({ success: true, message: 'History cleared' });
});

// --- COLLECTIONS / SAVED REQUESTS ---
app.get('/api/collections', (req, res) => {
  const collections = readJsonFile(collectionsFilePath, []);
  res.json(collections);
});

app.post('/api/collections', (req, res) => {
  const request = req.body;
  if (!request.name || !request.url) {
    return res.status(400).json({ error: 'Name and URL are required' });
  }

  const collections = readJsonFile(collectionsFilePath, []);
  const newRequest = {
    ...request,
    id: request.id || 'saved_' + Date.now(),
    createdAt: new Date().toISOString()
  };
  collections.unshift(newRequest);
  writeJsonFile(collectionsFilePath, collections);
  res.status(201).json(newRequest);
});

app.delete('/api/collections/:id', (req, res) => {
  const { id } = req.params;
  const collections = readJsonFile(collectionsFilePath, []);
  const filtered = collections.filter(item => item.id !== id);
  writeJsonFile(collectionsFilePath, filtered);
  res.json({ success: true });
});

// --- BUILT-IN MOCK APIS (GET, POST, PUT, DELETE) ---

// Mock Users
app.get('/api/mock/users', (req, res) => {
  const { status, role, search, limit } = req.query;
  let result = [...mockUsers];

  if (status) {
    result = result.filter(u => u.status.toLowerCase() === status.toLowerCase());
  }
  if (role) {
    result = result.filter(u => u.role.toLowerCase().includes(role.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  if (limit) {
    result = result.slice(0, parseInt(limit, 10));
  }

  res.json({
    total: result.length,
    timestamp: new Date().toISOString(),
    users: result
  });
});

app.get('/api/mock/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = mockUsers.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found', id });
  }
  res.json(user);
});

app.post('/api/mock/users', (req, res) => {
  const { name, email, role = 'Member', status = 'active' } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      error: 'Validation failed',
      details: {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null
      }
    });
  }

  const newUser = {
    id: nextUserId++,
    name,
    email,
    role,
    status,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
    createdAt: new Date().toISOString()
  };

  mockUsers.push(newUser);
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});

app.put('/api/mock/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found for update', id });
  }

  const existing = mockUsers[userIndex];
  const updatedUser = {
    ...existing,
    ...req.body,
    id, // preserve id
    updatedAt: new Date().toISOString()
  };

  mockUsers[userIndex] = updatedUser;
  res.json({
    message: 'User updated successfully',
    user: updatedUser
  });
});

app.delete('/api/mock/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found for deletion', id });
  }

  const deleted = mockUsers.splice(userIndex, 1)[0];
  res.json({
    message: 'User deleted successfully',
    deletedUser: deleted
  });
});

// Mock Posts
app.get('/api/mock/posts', (req, res) => {
  res.json({
    total: mockPosts.length,
    posts: mockPosts
  });
});

app.post('/api/mock/posts', (req, res) => {
  const { title, authorId = 1, tags = [] } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newPost = {
    id: nextPostId++,
    title,
    authorId: parseInt(authorId, 10),
    tags: Array.isArray(tags) ? tags : [tags],
    likes: 0,
    published: false,
    createdAt: new Date().toISOString()
  };

  mockPosts.push(newPost);
  res.status(201).json({
    message: 'Post created successfully',
    post: newPost
  });
});

app.put('/api/mock/posts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = mockPosts.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found', id });
  }

  mockPosts[index] = {
    ...mockPosts[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString()
  };

  res.json({
    message: 'Post updated successfully',
    post: mockPosts[index]
  });
});

app.delete('/api/mock/posts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = mockPosts.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found', id });
  }

  const deleted = mockPosts.splice(index, 1)[0];
  res.json({
    message: 'Post deleted successfully',
    deletedPost: deleted
  });
});

// Mock Status tester
app.get('/api/mock/status/:code', (req, res) => {
  const code = parseInt(req.params.code, 10) || 200;
  res.status(code).json({
    statusCode: code,
    message: `Returned simulated status code ${code}`,
    time: new Date().toISOString()
  });
});

// Mock Delay tester
app.get('/api/mock/delay/:ms', async (req, res) => {
  const ms = Math.min(Math.max(parseInt(req.params.ms, 10) || 1000, 100), 10000);
  await new Promise(resolve => setTimeout(resolve, ms));
  res.json({
    delayRequested: ms,
    message: `Response delayed by ${ms}ms successfully`,
    time: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'Courier API Engine',
    port: PORT,
    uptime: process.uptime()
  });
});

// Serve frontend dist if built
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Courier Backend Server running on http://localhost:${PORT}`);
});
