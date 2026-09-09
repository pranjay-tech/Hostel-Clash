import React from 'react';
import { Swords, Trophy, Clock, BarChart3, Shield, Lock, User, LogOut, Plus, Download } from 'lucide-react';

export default function Header({
  activeView,
  setActiveView,
  member,
  isAdmin,
  onOpenAuth,
  onLogoutMember,
  onLockAdmin,
  onOpenAddAchievement,
  onDownloadBackup,
  totalAchievementsCount
}) {
  const navItems = [
    { id: 'arena', label: 'Arena' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'activity', label: 'Activity', badge: totalAchievementsCount },
    { id: 'categories', label: 'Rules & Criteria' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#242B36] bg-[#080A0F]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        
        {/* LEFT: Logo + Title + Small 154 vs 264 indicator */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => setActiveView('arena')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#151A23] border border-[#242B36] flex items-center justify-center text-[#38BDF8]">
            <Swords className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#F3F5F7] tracking-tight">
              Hostel Clash
            </span>
            <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#151A23] text-[#8B96A8] border border-[#242B36]">
              154 vs 264
            </span>
          </div>
        </div>

        {/* CENTER: Main Page Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#10141C] p-1 rounded-xl border border-[#202736]">
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#151C28] text-[#F3F5F7] border border-[#2B374A] shadow-sm'
                    : 'text-[#8B96A8] hover:text-[#F3F5F7] hover:bg-[#151A23]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A0D14] text-[#8B96A8] border border-[#242B36]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Admin Status, Mark Score, Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Admin Mode Status & Primary Action */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#F59E0B] flex items-center gap-1 px-2 py-1 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/25">
                <Shield className="w-3 h-3" />
                <span className="hidden sm:inline">Admin</span>
              </span>
              
              <button
                id="btn-add-achievement"
                onClick={onOpenAddAchievement}
                className="btn-cyan !py-1.5 !px-3 text-xs shadow-sm"
                title="Record new achievement"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mark Score</span>
              </button>

              <button
                id="btn-download-backup"
                onClick={onDownloadBackup}
                className="text-[#8B96A8] hover:text-[#38BDF8] p-1.5 rounded-lg hover:bg-[#151C28] border border-transparent hover:border-[#222E40] transition cursor-pointer"
                title="Download JSON Database Backup (Snapshot)"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              
              <button
                onClick={onLockAdmin}
                className="text-[#5F6A7A] hover:text-[#F3F5F7] p-1 transition cursor-pointer"
                title="Lock Admin Mode"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-admin-login"
              onClick={() => onOpenAuth('admin')}
              className="text-xs font-medium text-[#8B96A8] hover:text-[#F3F5F7] px-2 py-1 rounded transition flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-[#5F6A7A]" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          <div className="h-4 w-[1px] bg-[#242B36] hidden sm:block" />

          {/* Member Profile */}
          {member ? (
            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-block w-2 h-2 rounded-full ${
                member.room === '154' ? 'bg-[#38BDF8]' : 'bg-[#FB7185]'
              }`} />
              <span className="font-semibold text-[#F3F5F7]">
                {member.name}
              </span>
              <span className="text-[11px] text-[#8B96A8] font-mono">
                Room {member.room}
              </span>
              <button
                onClick={onLogoutMember}
                className="text-[#5F6A7A] hover:text-[#EF4444] p-1 transition"
                title="Log out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-member-login"
              onClick={() => onOpenAuth('member')}
              className="btn-neutral !py-1.5 !px-3 text-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>

      {/* Mobile Sub-Nav */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-[#242B36] bg-[#080A0F]">
        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`py-1 px-2.5 text-xs font-medium rounded transition ${
                isActive ? 'text-[#F3F5F7] bg-[#151A23]' : 'text-[#8B96A8]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
