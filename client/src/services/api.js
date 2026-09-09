const API_ENDPOINT = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
const BASE_URL = `${API_ENDPOINT}/api`;

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchAchievements(filters = {}) {
  const params = new URLSearchParams();
  if (filters.room) params.append('room', filters.room);
  if (filters.memberId) params.append('memberId', filters.memberId);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);

  const res = await fetch(`${BASE_URL}/achievements?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch achievements');
  return res.json();
}

export async function fetchCatalogue() {
  const res = await fetch(`${BASE_URL}/achievements/catalogue`);
  if (!res.ok) throw new Error('Failed to fetch scoring catalogue');
  return res.json();
}

export async function loginMember(accessKey, password = '') {
  const res = await fetch(`${BASE_URL}/auth/member-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessKey, password })
  });
  return res.json();
}

export async function verifyAdminPasskey(adminKey) {
  const res = await fetch(`${BASE_URL}/auth/admin-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminKey })
  });
  return res.json();
}

export async function createAchievement(data, adminKey) {
  const res = await fetch(`${BASE_URL}/achievements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to save achievement');
  return json;
}

export async function updateAchievement(id, data, adminKey) {
  const res = await fetch(`${BASE_URL}/achievements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update achievement');
  return json;
}

export async function deleteAchievement(id, adminKey) {
  const res = await fetch(`${BASE_URL}/achievements/${id}`, {
    method: 'DELETE',
    headers: {
      'x-admin-key': adminKey
    }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete achievement');
  return json;
}

export async function downloadDatabaseBackup() {
  const res = await fetch(`${BASE_URL}/stats/backup`);
  if (!res.ok) throw new Error('Failed to fetch backup');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `room-clash-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export async function restoreDatabaseBackup(backupData, adminKey) {
  const res = await fetch(`${BASE_URL}/stats/restore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey
    },
    body: JSON.stringify({ data: backupData })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to restore backup');
  return json;
}
