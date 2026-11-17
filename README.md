# 🚀 Courier — Postman-Style API Testing Platform

A lightweight, modern, and aesthetic API testing application inspired by Postman. Built with **React** for the UI and **Node.js (Express)** for the backend execution engine, featuring a clean **lite reddish / rose** theme.

---

## ✨ Features

### 1. Full HTTP Method Support
- **GET**: Fetch resources, query data with URL parameters.
- **POST**: Create new entities with JSON payloads, form-data, or raw text.
- **PUT**: Update existing entities with payload validation.
- **DELETE**: Remove entities by ID or query criteria.
- *(Bonus: also supports `PATCH` for partial updates)*

### 2. Left-Hand Navigation (History & Collections)
- **Live Request History**: Automatically logs every executed request with timestamp, HTTP method pill, URL snippet, duration (ms), and response status badge (e.g. `200 OK`, `404 Not Found`).
- **Quick Search & Filter**: Instant search across request history by URL, HTTP method, or status code.
- **1-Click Recall**: Click any history item to instantly populate the active request editor with its method, URL, headers, params, and body.
- **Saved Collections**: Bookmark named requests for reuse across testing sessions.
- **Built-in Mock API Launcher**: Pre-configured buttons to test all 4 operations immediately without needing external servers.
- **History Management**: Delete individual history items on hover, or clear all history.

### 3. API Input Screen (Center / Top)
- **Method Selector**: Color-coded badges (GET = Emerald, POST = Amber, PUT = Blue, DELETE = Rose/Red).
- **URL Bar**: Responsive input with keyboard shortcut support (`Cmd + Enter` or `Ctrl + Enter` to send).
- **cURL Exporter**: 1-click copy request as a terminal `curl` command.
- **Request Configuration Tabs**:
  - **Params Tab**: Key-value query parameters table with enable/disable checkboxes. Automatically syncs with the URL query string in real-time.
  - **Headers Tab**: Header key-value editor with a quick `+ JSON Preset` button (`Content-Type`, `Accept`).
  - **Body Tab**: 
    - Options for `raw (JSON)`, `raw (Text)`, `x-www-form-urlencoded`, and `none`.
    - **JSON Beautify / Formatter**: Indents code with 2 spaces.
    - **JSON Minifier**: Strips whitespace for compact payloads.
    - **Real-Time Validation**: Instant badge showing whether the JSON syntax is valid or malformed.
    - **Sample Inserts**: 1-click insert sample User or Post payload.
  - **Auth Tab**: Bearer token and Basic auth with automatic `Authorization` header generation.

### 4. Below: Response Area & JSON Formatter
- **Status Meta Bar**:
  - HTTP Status Code Pill (e.g., `200 OK` in soft green, `404 Not Found` in soft red).
  - Roundtrip Response Time (e.g., `45 ms`).
  - Response Payload Size (e.g., `1.85 KB`).
- **Interactive JSON Formatter**:
  - Syntax highlighted with distinct colors:
    - Keys: Deep crimson/rose (`#BE123C`)
    - Strings: Emerald green (`#047857`)
    - Numbers: Amber (`#D97706`)
    - Booleans: Violet (`#7C3AED`)
    - Null: Muted gray
  - **Collapsible Nodes**: Expand or collapse arrays and objects with item counts.
  - **Expand / Collapse All**: 1-click toggle for large JSON trees.
  - **Find in JSON**: Search bar that highlights matching keys and values in real time.
  - **Copy JSON**: Copies formatted JSON to clipboard with animated visual confirmation.
  - **Download File**: Saves response as `.json` or `.txt`.
- **Raw View**: Unformatted raw text view.
- **Headers View**: Searchable table displaying all response headers sent by the server.

### 5. Lite Reddish Theme
- Soft warm rose-white background (`#FFF9FA` / `#FFF2F4`).
- Rose and crimson accents (`#E11D48`, `#F43F5E`, `#BE123C`).
- Crisp card borders (`#FECDD3`, `#FEE2E2`) with subtle warm shadows.
- Distinct color-coded method badges for rapid visual identification.

### 6. Node.js Backend & API Proxy
- **Bypasses Browser CORS**: Browser API clients cannot normally call external APIs due to CORS. Courier's backend proxy (`/api/proxy`) dispatches the request from the Node.js server, captures exact latency and size, and returns the response safely to the UI.
- **Built-in Mock API**: Complete CRUD endpoints (`/api/mock/users`, `/api/mock/posts`) ready for immediate testing.
- **File Persistence**: History and collections are safely persisted to `server/data/history.json` and `server/data/collections.json`.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
Starts both the Node.js backend (`http://localhost:5001`) and the Vite React frontend (`http://localhost:5173`):
```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**.

### 3. Run in Production Mode
Builds the frontend and runs the unified Express server on **`http://localhost:5001`**:
```bash
npm run build
npm start
```

Open your browser at **`http://localhost:5001`**.

---

## 🧪 Built-In Mock Endpoints to Test

You can test all 4 HTTP methods immediately using the built-in mock engine:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `http://localhost:5001/api/mock/users` | List mock users (supports `?search=`, `?limit=`, `?role=`, `?status=`) |
| **GET** | `http://localhost:5001/api/mock/users/1` | Get single user by ID |
| **POST** | `http://localhost:5001/api/mock/users` | Create user with JSON body: `{ "name": "...", "email": "..." }` |
| **PUT** | `http://localhost:5001/api/mock/users/1` | Update user with JSON body: `{ "role": "Lead Architect" }` |
| **DELETE** | `http://localhost:5001/api/mock/users/1` | Delete user with ID 1 |
| **GET** | `http://localhost:5001/api/mock/status/404` | Test simulated HTTP status codes (200, 201, 400, 404, 500) |
| **GET** | `http://localhost:5001/api/mock/delay/1500` | Test response latency and loading spinner |

---

## 📂 Project Structure

```
Courier/
├── server/
│   ├── server.js            # Express server (Proxy executor, Mock APIs, History CRUD)
│   └── data/
│       ├── history.json     # Saved request history
│       └── collections.json # Saved request bookmarks
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx              # Left navigation: History, Saved, Mock presets
│   │   ├── RequestBar.jsx           # Method dropdown, URL bar, Send & Save buttons
│   │   ├── SaveRequestModal.jsx     # Bookmark modal
│   │   ├── RequestTabs/
│   │   │   ├── ParamsTab.jsx        # Query params editor (syncs with URL)
│   │   │   ├── HeadersTab.jsx       # Headers editor & presets
│   │   │   ├── BodyTab.jsx          # JSON/Text/Form body editor & validator
│   │   │   └── AuthTab.jsx          # Bearer & Basic auth configuration
│   │   └── ResponsePanel/
│   │       ├── ResponsePanel.jsx    # Status bar, tabs, and layout
│   │       ├── JsonViewer.jsx       # JSON Formatter toolbar, copy & download
│   │       ├── JsonTreeNode.jsx     # Interactive collapsible syntax-colored tree
│   │       └── EmptyResponse.jsx    # 1-click quick-start testing cards
│   ├── utils/
│   │   └── formatters.js            # Bytes, latency, time ago, JSON beautifier
│   ├── App.jsx                      # Main app shell & request orchestration
│   ├── main.jsx                     # React DOM entry
│   └── index.css                    # Lite reddish theme styles & variables
├── index.html                       # HTML template
├── vite.config.js                   # Vite configuration with backend proxy
└── package.json                     # Scripts & dependencies
```
