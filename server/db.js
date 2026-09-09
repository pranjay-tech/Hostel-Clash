const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

function getDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const defaultData = { members: [], achievements: [] };
      saveDb(defaultData);
      return defaultData;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { members: [], achievements: [] };
  }
}

function saveDb(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_room154_264_salt').digest('hex');
}

function verifyPassword(password, hash) {
  if (!hash) return false;
  return hashPassword(password) === hash;
}

module.exports = {
  getDb,
  saveDb,
  hashPassword,
  verifyPassword
};
