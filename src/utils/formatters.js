export function formatBytes(bytes) {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatMs(ms) {
  if (ms === undefined || ms === null) return '0 ms';
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function getMethodColor(method) {
  const m = (method || 'GET').toUpperCase();
  switch (m) {
    case 'GET':
      return {
        text: '#059669', // emerald-600
        bg: '#ecfdf5',   // emerald-50
        border: '#a7f3d0'
      };
    case 'POST':
      return {
        text: '#d97706', // amber-600
        bg: '#fffbeb',   // amber-50
        border: '#fde68a'
      };
    case 'PUT':
      return {
        text: '#2563eb', // blue-600
        bg: '#eff6ff',   // blue-50
        border: '#bfdbfe'
      };
    case 'DELETE':
      return {
        text: '#e11d48', // rose-600
        bg: '#fff1f2',   // rose-50
        border: '#fecdd3'
      };
    case 'PATCH':
      return {
        text: '#7c3aed', // violet-600
        bg: '#f5f3ff',   // violet-50
        border: '#ddd6fe'
      };
    default:
      return {
        text: '#4b5563',
        bg: '#f3f4f6',
        border: '#e5e7eb'
      };
  }
}

export function getStatusColor(status) {
  if (!status) return { text: '#e11d48', bg: '#fff1f2', border: '#fecdd3', label: 'Error' };
  const s = Number(status);
  if (s >= 200 && s < 300) {
    return { text: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: 'Success' };
  } else if (s >= 300 && s < 400) {
    return { text: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Redirect' };
  } else if (s >= 400 && s < 500) {
    return { text: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Client Error' };
  } else if (s >= 500) {
    return { text: '#e11d48', bg: '#fff1f2', border: '#fecdd3', label: 'Server Error' };
  }
  return { text: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', label: 'Unknown' };
}

export function timeAgo(timestamp) {
  if (!timestamp) return '';
  const now = new Date();
  const date = new Date(timestamp);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString();
}

export function beautifyJson(raw) {
  if (!raw || typeof raw !== 'string') return '';
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch (err) {
    throw err;
  }
}

export function minifyJson(raw) {
  if (!raw || typeof raw !== 'string') return '';
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed);
  } catch (err) {
    throw err;
  }
}

export function isValidJson(raw) {
  if (!raw || !raw.trim()) return true;
  try {
    JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}
