const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');
const { requireAdmin } = require('../auth');
const { CATEGORIES } = require('../scoringCatalogue');

router.get('/', (req, res) => {
  const db = getDb();
  const members = db.members || [];
  const achievements = db.achievements || [];

  // Compute individual stats
  const memberStats = members.map(member => {
    const memberAchs = achievements.filter(a => a.memberId === member.id);
    
    // Category points (uncapped)
    const categoryBreakdown = {};
    Object.keys(CATEGORIES).forEach(catId => {
      categoryBreakdown[catId] = {
        id: catId,
        name: CATEGORIES[catId].name,
        shortName: CATEGORIES[catId].shortName,
        points: 0,
        rawPoints: 0,
        count: 0
      };
    });

    memberAchs.forEach(ach => {
      if (categoryBreakdown[ach.categoryId]) {
        const pts = Number(ach.points || 0);
        categoryBreakdown[ach.categoryId].points += pts;
        categoryBreakdown[ach.categoryId].rawPoints += pts;
        categoryBreakdown[ach.categoryId].count += 1;
      }
    });

    // Pure Uncapped Total Score
    let totalScore = 0;
    Object.keys(categoryBreakdown).forEach(catId => {
      totalScore += categoryBreakdown[catId].points;
    });

    return {
      id: member.id,
      name: member.name,
      room: member.room,
      avatar: member.avatar,
      title: member.title,
      score: totalScore,
      rawScore: totalScore,
      achievementsCount: memberAchs.length,
      categoryBreakdown
    };
  });

  // Group by Room
  const room154Members = memberStats.filter(m => m.room === '154');
  const room264Members = memberStats.filter(m => m.room === '264');

  // Room 154 Totals & Averages
  const room154Total = room154Members.reduce((sum, m) => sum + m.score, 0);
  const room154Average = Number((room154Total / Math.max(room154Members.length, 1)).toFixed(2));
  
  // Room 264 Totals & Averages
  const room264Total = room264Members.reduce((sum, m) => sum + m.score, 0);
  const room264Average = Number((room264Total / Math.max(room264Members.length, 1)).toFixed(2));

  // Category totals per room (uncapped)
  const room154Categories = {};
  const room264Categories = {};
  Object.keys(CATEGORIES).forEach(catId => {
    room154Categories[catId] = room154Members.reduce(
      (sum, m) => sum + (m.categoryBreakdown[catId]?.points || 0), 0
    );
    room264Categories[catId] = room264Members.reduce(
      (sum, m) => sum + (m.categoryBreakdown[catId]?.points || 0), 0
    );
  });

  // Head-to-Head leader determination
  let leaderRoom = null;
  let avgLead = 0;
  let totalLead = 0;
  if (room154Average > room264Average) {
    leaderRoom = '154';
    avgLead = Number((room154Average - room264Average).toFixed(2));
    totalLead = room154Total - room264Total;
  } else if (room264Average > room154Average) {
    leaderRoom = '264';
    avgLead = Number((room264Average - room154Average).toFixed(2));
    totalLead = room264Total - room154Total;
  } else {
    leaderRoom = 'TIED';
    avgLead = 0;
    totalLead = 0;
  }

  // Combined individual leaderboard
  const combinedLeaderboard = [...memberStats].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.achievementsCount - a.achievementsCount;
  }).map((m, idx) => ({
    ...m,
    rank: idx + 1,
    isMVP: idx === 0
  }));

  // Room 154 internal leaderboard
  const room154Leaderboard = [...room154Members].sort((a, b) => b.score - a.score).map((m, idx) => ({
    ...m,
    roomRank: idx + 1
  }));

  // Room 264 internal leaderboard
  const room264Leaderboard = [...room264Members].sort((a, b) => b.score - a.score).map((m, idx) => ({
    ...m,
    roomRank: idx + 1
  }));

  // Calculate battle bar percentage
  const totalCombined = room154Average + room264Average;
  const room154Share = totalCombined > 0 ? Number(((room154Average / totalCombined) * 100).toFixed(1)) : 50;
  const room264Share = totalCombined > 0 ? Number(((room264Average / totalCombined) * 100).toFixed(1)) : 50;

  res.json({
    success: true,
    lastUpdated: new Date().toISOString(),
    battle: {
      leaderRoom,
      avgLead,
      totalLead,
      room154Share,
      room264Share
    },
    rooms: {
      '154': {
        name: 'Room 154',
        roomNumber: '154',
        theme: 'cyan',
        totalPoints: room154Total,
        averagePoints: room154Average,
        membersCount: room154Members.length,
        categoryScores: room154Categories,
        mvp: room154Leaderboard[0] || null,
        members: room154Leaderboard
      },
      '264': {
        name: 'Room 264',
        roomNumber: '264',
        theme: 'amber',
        totalPoints: room264Total,
        averagePoints: room264Average,
        membersCount: room264Members.length,
        categoryScores: room264Categories,
        mvp: room264Leaderboard[0] || null,
        members: room264Leaderboard
      }
    },
    combinedLeaderboard,
    categories: CATEGORIES
  });
});

// Download full database backup
router.get('/backup', (req, res) => {
  const db = getDb();
  const timestamp = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="room-clash-backup-${timestamp}.json"`);
  res.send(JSON.stringify(db, null, 2));
});

// Restore database from backup (Admin Only)
router.post('/restore', requireAdmin, (req, res) => {
  const { data } = req.body;
  if (!data || !Array.isArray(data.members)) {
    return res.status(400).json({ success: false, error: 'Invalid backup format' });
  }

  const success = saveDb(data);
  if (!success) {
    return res.status(500).json({ success: false, error: 'Failed to write backup to database' });
  }

  res.json({
    success: true,
    message: `Restored ${data.members.length} members and ${(data.achievements || []).length} achievements successfully.`
  });
});

module.exports = router;
