const express = require('express');
const router = express.Router();
const { getDb, saveDb, hashPassword, verifyPassword } = require('../db');
const { verifyAdminKey } = require('../auth');

// Public member directory (safe fields only)
router.get('/members', (req, res) => {
  const db = getDb();
  const safeMembers = db.members.map(m => ({
    id: m.id,
    name: m.name,
    room: m.room,
    avatar: m.avatar,
    title: m.title,
    hasPassword: Boolean(m.hasPassword)
  }));
  res.json({ success: true, members: safeMembers });
});

// Member login with access key & personal password verification
router.post('/member-login', (req, res) => {
  const { accessKey, password } = req.body;
  if (!accessKey) {
    return res.status(400).json({ success: false, error: 'Access Key is required' });
  }

  const db = getDb();
  const memberIndex = db.members.findIndex(
    m => m.accessKey.trim().toLowerCase() === accessKey.trim().toLowerCase()
  );

  if (memberIndex === -1) {
    return res.status(404).json({ success: false, error: 'Invalid Member Access Key' });
  }

  const member = db.members[memberIndex];

  // First time setup - member needs to create password
  if (!member.hasPassword) {
    if (!password || password.trim().length < 3) {
      return res.json({
        success: true,
        needsPasswordSetup: true,
        member: {
          id: member.id,
          name: member.name,
          room: member.room,
          avatar: member.avatar
        },
        message: `Welcome ${member.name}! Please create your personal password for future logins.`
      });
    }

    // Set member password
    member.passwordHash = hashPassword(password.trim());
    member.hasPassword = true;
    saveDb(db);

    return res.json({
      success: true,
      firstTimeSetupCompleted: true,
      member: {
        id: member.id,
        name: member.name,
        room: member.room,
        avatar: member.avatar,
        title: member.title
      },
      message: `Password set successfully! Welcome ${member.name}.`
    });
  }

  // Returning member - verify password
  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password is required for this member account'
    });
  }

  if (!verifyPassword(password.trim(), member.passwordHash)) {
    return res.status(401).json({
      success: false,
      error: 'Incorrect password. Please verify and try again.'
    });
  }

  res.json({
    success: true,
    member: {
      id: member.id,
      name: member.name,
      room: member.room,
      avatar: member.avatar,
      title: member.title
    },
    message: `Logged in as ${member.name} (Room ${member.room})`
  });
});

// Admin passkey verification (strictly backend-validated)
router.post('/admin-verify', (req, res) => {
  const { adminKey } = req.body;
  if (!adminKey) {
    return res.status(400).json({ success: false, error: 'Admin key is required' });
  }

  if (verifyAdminKey(adminKey.trim())) {
    return res.json({
      success: true,
      isAdmin: true,
      message: 'Admin access confirmed. Full edit & upload rights active.'
    });
  }

  return res.status(401).json({
    success: false,
    isAdmin: false,
    error: 'Incorrect Admin Passkey. Edit access denied.'
  });
});

module.exports = router;
