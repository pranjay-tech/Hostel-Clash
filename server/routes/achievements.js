const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');
const { requireAdmin } = require('../auth');
const { CATEGORIES } = require('../scoringCatalogue');

// Get categories & activities catalogue
router.get('/catalogue', (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
});

// List achievements with optional filtering
router.get('/', (req, res) => {
  const { room, memberId, categoryId } = req.query;
  const db = getDb();
  let list = [...(db.achievements || [])];

  if (room) {
    list = list.filter(a => a.room === String(room));
  }
  if (memberId) {
    list = list.filter(a => a.memberId === String(memberId));
  }
  if (categoryId) {
    list = list.filter(a => a.categoryId === String(categoryId));
  }

  // Sort by date descending, then createdAt descending
  list.sort((a, b) => {
    const dDiff = new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
    if (dDiff !== 0) return dDiff;
    return (b.id > a.id ? 1 : -1);
  });

  res.json({ success: true, count: list.length, achievements: list });
});

// Add achievement - ADMIN ONLY
router.post('/', requireAdmin, (req, res) => {
  const { memberId, categoryId, activityId, customTitle, date, notes, link } = req.body;
  const db = getDb();

  const member = db.members.find(m => m.id === memberId);
  if (!member) {
    return res.status(400).json({ success: false, error: 'Member not found' });
  }

  const category = CATEGORIES[categoryId];
  if (!category) {
    return res.status(400).json({ success: false, error: 'Invalid category' });
  }

  const activity = category.activities.find(a => a.id === activityId);
  if (!activity) {
    return res.status(400).json({ success: false, error: 'Invalid activity parameter' });
  }

  const points = activity.points;
  const activityName = customTitle ? `${activity.name} - ${customTitle}` : activity.name;

  const newAchievement = {
    id: 'ach_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    memberId: member.id,
    memberName: member.name,
    room: member.room,
    categoryId: category.id,
    categoryName: category.name,
    activityId: activity.id,
    activityName: activityName,
    points: Number(points),
    date: date || new Date().toISOString().split('T')[0],
    notes: notes || '',
    link: link || '',
    createdAt: new Date().toISOString()
  };

  db.achievements.unshift(newAchievement);
  saveDb(db);

  res.status(201).json({
    success: true,
    message: `Achievement marked for ${member.name} (+${points} pts)`,
    achievement: newAchievement
  });
});

// Edit achievement - ADMIN ONLY
router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { memberId, categoryId, activityId, customTitle, date, notes, link } = req.body;
  const db = getDb();

  const index = db.achievements.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Achievement not found' });
  }

  const member = db.members.find(m => m.id === (memberId || db.achievements[index].memberId));
  const category = CATEGORIES[categoryId || db.achievements[index].categoryId];
  let activity = null;
  if (category) {
    activity = category.activities.find(a => a.id === (activityId || db.achievements[index].activityId));
  }

  const oldAch = db.achievements[index];
  const points = activity ? activity.points : oldAch.points;
  const activityName = activity
    ? (customTitle ? `${activity.name} - ${customTitle}` : activity.name)
    : (customTitle || oldAch.activityName);

  const updatedAchievement = {
    ...oldAch,
    memberId: member ? member.id : oldAch.memberId,
    memberName: member ? member.name : oldAch.memberName,
    room: member ? member.room : oldAch.room,
    categoryId: category ? category.id : oldAch.categoryId,
    categoryName: category ? category.name : oldAch.categoryName,
    activityId: activity ? activity.id : oldAch.activityId,
    activityName: activityName,
    points: Number(points),
    date: date || oldAch.date,
    notes: notes !== undefined ? notes : oldAch.notes,
    link: link !== undefined ? link : oldAch.link,
    updatedAt: new Date().toISOString()
  };

  db.achievements[index] = updatedAchievement;
  saveDb(db);

  res.json({
    success: true,
    message: 'Achievement updated successfully',
    achievement: updatedAchievement
  });
});

// Delete achievement - ADMIN ONLY
router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const index = db.achievements.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Achievement not found' });
  }

  const removed = db.achievements.splice(index, 1)[0];
  saveDb(db);

  res.json({
    success: true,
    message: `Achievement "${removed.activityName}" deleted`,
    id
  });
});

module.exports = router;
