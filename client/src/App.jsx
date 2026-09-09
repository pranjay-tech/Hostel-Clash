import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ArenaView from './views/ArenaView';
import LeaderboardView from './views/LeaderboardView';
import ActivityView from './views/ActivityView';
import CategoryView from './views/CategoryView';
import AdminModal from './components/AdminModal';
import AuthModal from './components/AuthModal';
import MemberDetailModal from './components/MemberDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { AlertCircle } from 'lucide-react';
import {
  fetchStats,
  fetchAchievements,
  fetchCatalogue,
  loginMember,
  verifyAdminPasskey,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  downloadDatabaseBackup,
  restoreDatabaseBackup
} from './services/api';

export default function App() {
  const [activeView, setActiveView] = useState('arena'); // 'arena' | 'leaderboard' | 'activity' | 'categories'
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [member, setMember] = useState(() => {
    const saved = localStorage.getItem('room_clash_member');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('room_clash_admin') === 'true';
  });
  const [adminKey, setAdminKey] = useState(() => {
    return sessionStorage.getItem('room_clash_admin_key') || '';
  });

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('member');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailMemberId, setDetailMemberId] = useState(null);

  const [loadError, setLoadError] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);

  // Load dashboard data
  const loadAllData = async (isRetry = false) => {
    try {
      setLoading(true);
      setLoadError(false);
      const [statsRes, achsRes, catRes] = await Promise.all([
        fetchStats(),
        fetchAchievements(),
        fetchCatalogue()
      ]);
      setStats(statsRes);
      setAchievements(achsRes.achievements || []);
      setCategories(catRes.categories || {});
      setIsWakingUp(false);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setIsWakingUp(true);
      if (!isRetry) {
        setTimeout(() => loadAllData(true), 5000);
      } else {
        setLoadError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleDownloadBackup = async () => {
    try {
      await downloadDatabaseBackup();
    } catch (err) {
      alert(err.message || 'Failed to download database backup');
    }
  };

  const handleRestoreBackup = async (backupData) => {
    try {
      const res = await restoreDatabaseBackup(backupData, adminKey);
      alert(res.message || 'Data restored successfully!');
      await loadAllData();
      setAdminModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to restore database');
    }
  };

  // Member Auth Handlers
  const handleMemberSuccess = (memberData) => {
    setMember(memberData);
    localStorage.setItem('room_clash_member', JSON.stringify(memberData));
  };

  const handleLogoutMember = () => {
    setMember(null);
    localStorage.removeItem('room_clash_member');
  };

  // Admin Auth Handlers
  const handleAdminSuccess = (key) => {
    setIsAdmin(true);
    setAdminKey(key);
    sessionStorage.setItem('room_clash_admin', 'true');
    sessionStorage.setItem('room_clash_admin_key', key);
  };

  const handleLockAdmin = () => {
    setIsAdmin(false);
    setAdminKey('');
    sessionStorage.removeItem('room_clash_admin');
    sessionStorage.removeItem('room_clash_admin_key');
  };

  // Achievement Handlers
  const handleSaveAchievement = async (formData) => {
    if (editItem) {
      await updateAchievement(editItem.id, formData, adminKey);
    } else {
      await createAchievement(formData, adminKey);
    }
    await loadAllData();
  };

  const handlePromptDelete = (achievement) => {
    setDeleteTarget(achievement);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAchievement(deleteTarget.id, adminKey);
      setDeleteTarget(null);
      await loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to delete achievement');
    }
  };

  const handleOpenEdit = (ach) => {
    setEditItem(ach);
    setAdminModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditItem(null);
    setAdminModalOpen(true);
  };

  const allMembers = stats?.combinedLeaderboard || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#080A0F] text-[#F3F5F7] w-full">
      
      {/* Global Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        member={member}
        isAdmin={isAdmin}
        onOpenAuth={(mode) => { setAuthModalMode(mode); setAuthModalOpen(true); }}
        onLogoutMember={handleLogoutMember}
        onLockAdmin={handleLockAdmin}
        onOpenAddAchievement={handleOpenAdd}
        onDownloadBackup={handleDownloadBackup}
        totalAchievementsCount={achievements.length}
      />

      {/* Main Full-Screen Expansive Container */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        
        {loadError && !stats ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center px-4">
            <div className="w-10 h-10 rounded-xl bg-[#141B26] border border-[#2B374A] flex items-center justify-center text-[#F59E0B]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#F3F5F7]">Connecting to Competition Server</p>
            <p className="text-xs text-[#8B96A8] max-w-sm">
              Free-tier cloud backend instances sleep after inactivity and need ~30s to wake up.
            </p>
            <button
              onClick={() => loadAllData(false)}
              className="mt-2 btn-cyan !py-1.5 !px-4 text-xs font-semibold cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : loading && !stats ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-[#38BDF8] border-t-transparent animate-spin" />
            <p className="text-xs text-[#8B96A8]">
              {isWakingUp ? 'Waking up competition cloud server (takes ~25s on free tier)...' : 'Loading Room Clash Command Center...'}
            </p>
          </div>
        ) : stats ? (
          <>
            {/* VIEW 1: THE ARENA COMMAND CENTER */}
            {activeView === 'arena' && (
              <ArenaView
                battle={stats.battle}
                rooms={stats.rooms}
                achievements={achievements}
                categories={categories}
                combinedLeaderboard={stats.combinedLeaderboard}
                isAdmin={isAdmin}
                onSelectMember={(id) => setDetailMemberId(id)}
                onEditAchievement={handleOpenEdit}
                onDeleteAchievement={handlePromptDelete}
                onOpenAddAchievement={handleOpenAdd}
                onViewRules={() => setActiveView('categories')}
              />
            )}

            {/* VIEW 2: FULL-WIDTH LEADERBOARD */}
            {activeView === 'leaderboard' && (
              <LeaderboardView
                combinedLeaderboard={stats.combinedLeaderboard}
                rooms={stats.rooms}
                onSelectMember={(id) => setDetailMemberId(id)}
              />
            )}

            {/* VIEW 3: FULL-WIDTH ACTIVITY STREAM */}
            {activeView === 'activity' && (
              <ActivityView
                achievements={achievements}
                categories={categories}
                isAdmin={isAdmin}
                onEditAchievement={handleOpenEdit}
                onDeleteAchievement={handlePromptDelete}
              />
            )}

            {/* VIEW 4: FULL-WIDTH CATEGORY BREAKDOWN */}
            {activeView === 'categories' && (
              <CategoryView
                categories={categories}
                rooms={stats.rooms}
              />
            )}
          </>
        ) : null}

      </main>

      {/* Clean Footer */}
      <footer className="w-full border-t border-[#242B36] py-5 text-center text-xs text-[#5F6A7A]">
        Hostel Clash • Room 154 vs Room 264 • Year-End Performance Tracker
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onMemberSuccess={handleMemberSuccess}
        onAdminSuccess={handleAdminSuccess}
        loginMemberFn={loginMember}
        verifyAdminPasskeyFn={verifyAdminPasskey}
      />

      {/* Admin Score Marking Modal */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => { setAdminModalOpen(false); setEditItem(null); }}
        onSubmit={handleSaveAchievement}
        categories={categories}
        members={allMembers}
        editItem={editItem}
        onRestoreBackup={handleRestoreBackup}
      />

      {/* Member Scorecard Modal */}
      <MemberDetailModal
        memberId={detailMemberId}
        isOpen={Boolean(detailMemberId)}
        onClose={() => setDetailMemberId(null)}
        combinedLeaderboard={stats?.combinedLeaderboard || []}
        achievements={achievements}
      />

      {/* Destructive Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        achievement={deleteTarget}
      />

    </div>
  );
}
