import React, { useState } from 'react';
import { Trophy, Crown, ChevronRight, Search, ExternalLink, Edit3, Trash2, Code, Layers, BookOpen, Briefcase, Activity, Sparkles, Scale, ShieldCheck } from 'lucide-react';

export default function ArenaView({
  battle,
  rooms,
  achievements,
  categories,
  combinedLeaderboard,
  isAdmin,
  onSelectMember,
  onEditAchievement,
  onDeleteAchievement,
  onOpenAddAchievement,
  onViewRules
}) {
  const [leaderboardTab, setLeaderboardTab] = useState('all'); // 'all' | '154' | '264'
  const [activityFilterRoom, setActivityFilterRoom] = useState('ALL');
  const [activitySearch, setActivitySearch] = useState('');

  if (!rooms || !rooms['154'] || !rooms['264']) return null;

  const r154 = rooms['154'];
  const r264 = rooms['264'];

  const is154Leading = battle.leaderRoom === '154';
  const is264Leading = battle.leaderRoom === '264';
  const isTied = battle.leaderRoom === 'TIED';

  // Leaderboard data
  const displayedMembers = leaderboardTab === '154'
    ? r154.members
    : leaderboardTab === '264'
    ? r264.members
    : combinedLeaderboard;

  // Activity filter
  const filteredActivities = (achievements || []).filter(ach => {
    if (activityFilterRoom !== 'ALL' && ach.room !== activityFilterRoom) return false;
    if (activitySearch.trim()) {
      const q = activitySearch.toLowerCase();
      const matchName = ach.memberName?.toLowerCase().includes(q);
      const matchActivity = ach.activityName?.toLowerCase().includes(q);
      if (!matchName && !matchActivity) return false;
    }
    return true;
  });

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'dsa_ai_ml': return <Code className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'projects_dev': return <Layers className="w-3.5 h-3.5 text-[#818CF8]" />;
      case 'hackathons': return <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />;
      case 'academics': return <BookOpen className="w-3.5 h-3.5 text-[#10B981]" />;
      case 'career': return <Briefcase className="w-3.5 h-3.5 text-[#C084FC]" />;
      case 'fitness_sports': return <Activity className="w-3.5 h-3.5 text-[#FB7185]" />;
      default: return <Trophy className="w-3.5 h-3.5 text-[#8B96A8]" />;
    }
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* 1. EXPANSIVE FULL-WIDTH SCOREBOARD HERO */}
      <div className="panel-surface p-6 sm:p-8 w-full">
        
        {/* Status Callout Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#242B36] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold text-[#8B96A8] uppercase tracking-wider text-[11px]">
              Hostel Year-Long Clash • Live Scoreboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-medium text-[#8B96A8] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
              {isTied ? (
                <span>Rooms are currently tied on score</span>
              ) : is154Leading ? (
                <span className="text-[#38BDF8] font-bold">
                  Room 154 leads by <span className="text-[#F3F5F7]">+{battle.totalLead} pts</span> (+{battle.avgLead} avg)
                </span>
              ) : (
                <span className="text-[#FB7185] font-bold">
                  Room 264 leads by <span className="text-[#F3F5F7]">+{battle.totalLead} pts</span> (+{battle.avgLead} avg)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* The Big Duel Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-11 items-center gap-6 py-6">
          
          {/* Room 154 (Left) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-[#151A23] border border-[#242B36]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                <span className="text-sm font-bold text-[#F3F5F7]">Room 154</span>
                <span className="text-xs text-[#8B96A8]">The Titans</span>
              </div>
              {is154Leading && (
                <span className="text-[11px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/30 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#38BDF8]" /> Leader
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F3F5F7] font-display">
                  {r154.totalPoints} <span className="text-lg font-normal text-[#8B96A8]">pts</span>
                </div>
                <div className="text-xs text-[#8B96A8] mt-1 font-mono">
                  {r154.averagePoints} avg / member
                </div>
              </div>
            </div>

            {/* Roster Progress Bars inside Hero */}
            <div className="pt-3 border-t border-[#242B36] space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[#5F6A7A] font-bold flex justify-between">
                <span>Room Members</span>
                <span>Contributions</span>
              </div>
              {r154.members.map(m => {
                const pct = r154.totalPoints > 0 ? (m.score / r154.totalPoints) * 100 : 33;
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className="p-2 rounded-lg bg-[#10141C] hover:bg-[#191F29] border border-[#242B36] cursor-pointer transition flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#F3F5F7]">{m.name}</span>
                      <span className="text-[10px] text-[#5F6A7A]">({m.achievementsCount} logs)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#080A0F] rounded-full overflow-hidden hidden sm:block">
                        <div style={{ width: `${pct}%` }} className="h-full bg-[#38BDF8]" />
                      </div>
                      <span className="font-mono font-bold text-[#38BDF8]">{m.score} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VS Divider */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-[#5F6A7A] uppercase tracking-widest px-3 py-1.5 rounded-lg bg-[#151A23] border border-[#242B36]">
              VS
            </span>
            <div className="text-[11px] text-[#5F6A7A] font-mono mt-2 hidden lg:block">
              {battle.room154Share}% vs {battle.room264Share}%
            </div>
          </div>

          {/* Room 264 (Right) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-[#151A23] border border-[#242B36]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
                <span className="text-sm font-bold text-[#F3F5F7]">Room 264</span>
                <span className="text-xs text-[#8B96A8]">The Challengers</span>
              </div>
              {is264Leading && (
                <span className="text-[11px] font-mono font-bold text-[#FB7185] bg-[#FB7185]/10 px-2 py-0.5 rounded border border-[#FB7185]/30 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#FB7185]" /> Leader
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F3F5F7] font-display">
                  {r264.totalPoints} <span className="text-lg font-normal text-[#8B96A8]">pts</span>
                </div>
                <div className="text-xs text-[#8B96A8] mt-1 font-mono">
                  {r264.averagePoints} avg / member
                </div>
              </div>
            </div>

            {/* Roster Progress Bars inside Hero */}
            <div className="pt-3 border-t border-[#242B36] space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[#5F6A7A] font-bold flex justify-between">
                <span>Room Members</span>
                <span>Contributions</span>
              </div>
              {r264.members.map(m => {
                const pct = r264.totalPoints > 0 ? (m.score / r264.totalPoints) * 100 : 33;
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className="p-2 rounded-lg bg-[#10141C] hover:bg-[#191F29] border border-[#242B36] cursor-pointer transition flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#F3F5F7]">{m.name}</span>
                      <span className="text-[10px] text-[#5F6A7A]">({m.achievementsCount} logs)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#080A0F] rounded-full overflow-hidden hidden sm:block">
                        <div style={{ width: `${pct}%` }} className="h-full bg-[#FB7185]" />
                      </div>
                      <span className="font-mono font-bold text-[#FB7185]">{m.score} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Momentum Bar */}
        <div className="pt-4 border-t border-[#242B36]">
          <div className="flex justify-between text-xs font-mono text-[#8B96A8] mb-2">
            <span className="text-[#38BDF8] font-bold">Room 154 ({battle.room154Share}%)</span>
            <span className="text-[#FB7185] font-bold">Room 264 ({battle.room264Share}%)</span>
          </div>
          <div className="h-2.5 w-full bg-[#151A23] rounded-full overflow-hidden flex border border-[#242B36]">
            <div style={{ width: `${battle.room154Share}%` }} className="bg-[#38BDF8] h-full transition-all duration-300" />
            <div style={{ width: `${battle.room264Share}%` }} className="bg-[#FB7185] h-full transition-all duration-300" />
          </div>
        </div>

      </div>

      {/* Rules & Scoring Criteria Quick Banner */}
      <div 
        onClick={onViewRules}
        className="panel-surface p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#233554] bg-gradient-to-r from-[#0C121F] via-[#101726] to-[#0C121F] hover:border-[#38BDF8]/40 transition cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] flex-shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F3F5F7] group-hover:text-[#38BDF8] transition">
                Hostel Clash Rules & Scoring Codex
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A0D14] text-[#38BDF8] border border-[#38BDF8]/30">
                1 pt ≈ 1 hr
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A0D14] text-[#10B981] border border-[#10B981]/30">
                Uncapped
              </span>
            </div>
            <p className="text-[11px] text-[#8B96A8] mt-0.5">
              Fair Average Formula (Room Total ÷ 3.0) • Verified Proof Links • 6 Performance Domains
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] group-hover:translate-x-0.5 transition self-end sm:self-auto">
          <span>View Rules & Scoring Criteria</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 2. MAIN EXPANSIVE COMMAND CENTER: 2-COLUMN WIDE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
        
        {/* LEFT COLUMN: STANDINGS & CATEGORY FACE-OFF (8 cols on XL screens) */}
        <div className="xl:col-span-7 2xl:col-span-8 space-y-6">
          
          {/* STANDINGS CARD */}
          <div className="panel-surface p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#242B36]">
              <div className="flex items-center gap-1 bg-[#151A23] p-1 rounded-lg border border-[#242B36] text-xs">
                <button
                  onClick={() => setLeaderboardTab('all')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition ${
                    leaderboardTab === 'all' ? 'bg-[#10141C] text-[#F3F5F7] border border-[#242B36]' : 'text-[#8B96A8] hover:text-[#F3F5F7]'
                  }`}
                >
                  Hall of Fame (1–6)
                </button>
                <button
                  onClick={() => setLeaderboardTab('154')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
                    leaderboardTab === '154' ? 'bg-[#10141C] text-[#38BDF8] border border-[#242B36]' : 'text-[#8B96A8] hover:text-[#38BDF8]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  <span>Room 154</span>
                </button>
                <button
                  onClick={() => setLeaderboardTab('264')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
                    leaderboardTab === '264' ? 'bg-[#10141C] text-[#FB7185] border border-[#242B36]' : 'text-[#8B96A8] hover:text-[#FB7185]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185]" />
                  <span>Room 264</span>
                </button>
              </div>

              <span className="text-[11px] text-[#5F6A7A] font-mono">
                Click any row for scorecard
              </span>
            </div>

            {/* Standings rows */}
            <div className="divide-y divide-[#242B36]">
              {displayedMembers.map((m, idx) => {
                const is154 = m.room === '154';
                const rank = leaderboardTab === 'all' ? m.rank : (idx + 1);
                const rankFormatted = String(rank).padStart(2, '0');

                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className="py-3 px-3 hover:bg-[#151A23] rounded-lg cursor-pointer transition flex items-center justify-between gap-3 text-sm group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs font-bold text-[#8B96A8] w-6 text-center">
                        {rank === 1 ? <Crown className="w-4 h-4 text-[#F59E0B] inline" /> : rankFormatted}
                      </span>
                      <div>
                        <div className="font-semibold text-[#F3F5F7] group-hover:text-white flex items-center gap-2">
                          <span>{m.name}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            is154 ? 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20' : 'bg-[#FB7185]/10 text-[#FB7185] border border-[#FB7185]/20'
                          }`}>
                            R{m.room}
                          </span>
                          {m.isMVP && leaderboardTab === 'all' && (
                            <span className="text-[10px] font-mono px-1 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                              MVP
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#8B96A8] truncate">{m.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs text-[#5F6A7A] font-mono hidden sm:inline">
                        {m.achievementsCount} logged
                      </span>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-base font-bold font-mono text-[#F3F5F7]">
                          {m.score} <span className="text-xs font-normal text-[#8B96A8]">pts</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#5F6A7A] group-hover:text-[#F3F5F7] transition" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CATEGORY DUEL MATRIX */}
          <div className="panel-surface p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#242B36]">
              <div>
                <h3 className="text-sm font-bold text-[#F3F5F7] uppercase tracking-wider">
                  Category Duel Matrix
                </h3>
                <p className="text-xs text-[#8B96A8]">Head-to-head point distribution across domains</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-[#38BDF8] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> R154</span>
                <span className="text-[#FB7185] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FB7185]" /> R264</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {Object.keys(categories).map(catId => {
                const cat = categories[catId];
                const score154 = r154.categoryScores[catId] || 0;
                const score264 = r264.categoryScores[catId] || 0;
                const total = score154 + score264;
                const p154 = total > 0 ? Number(((score154 / total) * 100).toFixed(0)) : 50;
                const p264 = total > 0 ? Number(((score264 / total) * 100).toFixed(0)) : 50;

                return (
                  <div key={catId} className="p-3.5 rounded-xl bg-[#151A23] border border-[#242B36]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(catId)}
                        <span className="text-xs font-bold text-[#F3F5F7]">{cat.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-[#5F6A7A] px-1.5 py-0.2 rounded bg-[#0A0D14] border border-[#202736]">
                        Uncapped
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-xs font-mono my-1.5">
                      <span className="text-[#38BDF8] font-semibold">{score154} pts</span>
                      <span className="text-[#FB7185] font-semibold">{score264} pts</span>
                    </div>

                    <div className="h-1.5 w-full bg-[#080A0F] rounded-full overflow-hidden flex border border-[#242B36]">
                      <div style={{ width: `${p154}%` }} className="bg-[#38BDF8] h-full" />
                      <div style={{ width: `${p264}%` }} className="bg-[#FB7185] h-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE ACTIVITY STREAM & MVPs (4-5 cols on XL screens) */}
        <div className="xl:col-span-5 2xl:col-span-4 space-y-6">
          
          {/* ROOM MVPs CARD */}
          <div className="panel-surface p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242B36]">
              <h3 className="text-xs font-bold text-[#F3F5F7] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Room MVP Leaders</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => r154.mvp && onSelectMember(r154.mvp.id)}
                className="p-3 rounded-lg bg-[#151A23] border border-[#242B36] hover:border-[#38BDF8]/40 cursor-pointer transition"
              >
                <div className="text-[11px] text-[#38BDF8] font-semibold">Room 154</div>
                <div className="text-sm font-bold text-[#F3F5F7] mt-0.5">{r154.mvp?.name}</div>
                <div className="text-xs font-mono text-[#38BDF8] font-bold mt-1">{r154.mvp?.score} pts</div>
              </div>

              <div
                onClick={() => r264.mvp && onSelectMember(r264.mvp.id)}
                className="p-3 rounded-lg bg-[#151A23] border border-[#242B36] hover:border-[#FB7185]/40 cursor-pointer transition"
              >
                <div className="text-[11px] text-[#FB7185] font-semibold">Room 264</div>
                <div className="text-sm font-bold text-[#F3F5F7] mt-0.5">{r264.mvp?.name}</div>
                <div className="text-xs font-mono text-[#FB7185] font-bold mt-1">{r264.mvp?.score} pts</div>
              </div>
            </div>
          </div>

          {/* LIVE ACTIVITY FEED */}
          <div className="panel-surface p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242B36]">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-[#F3F5F7] uppercase tracking-wider">
                  Live Activity Feed
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#151A23] text-[#8B96A8] border border-[#242B36]">
                  {filteredActivities.length}
                </span>
              </div>

              {/* Room filter tabs */}
              <div className="flex items-center gap-1 text-[11px] font-medium bg-[#080A0F] p-0.5 rounded border border-[#242B36]">
                <button
                  onClick={() => setActivityFilterRoom('ALL')}
                  className={`px-2 py-0.5 rounded ${activityFilterRoom === 'ALL' ? 'bg-[#151A23] text-[#F3F5F7]' : 'text-[#8B96A8]'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActivityFilterRoom('154')}
                  className={`px-2 py-0.5 rounded ${activityFilterRoom === '154' ? 'bg-[#151A23] text-[#38BDF8]' : 'text-[#8B96A8]'}`}
                >
                  154
                </button>
                <button
                  onClick={() => setActivityFilterRoom('264')}
                  className={`px-2 py-0.5 rounded ${activityFilterRoom === '264' ? 'bg-[#151A23] text-[#FB7185]' : 'text-[#8B96A8]'}`}
                >
                  264
                </button>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative mb-3">
              <Search className="w-3 h-3 text-[#5F6A7A] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activity..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-full bg-[#080A0F] border border-[#242B36] text-xs text-[#F3F5F7] rounded-lg pl-7 pr-2.5 py-1.5 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            {/* Feed items */}
            <div className="divide-y divide-[#242B36] max-h-[520px] overflow-y-auto pr-1">
              {filteredActivities.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5F6A7A]">
                  No activities found.
                </div>
              ) : (
                filteredActivities.map(ach => {
                  const is154 = ach.room === '154';
                  return (
                    <div key={ach.id} className="py-3 first:pt-0 last:pb-0 hover:bg-[#151A23]/50 transition rounded-lg p-2 group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-[11px] mb-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${is154 ? 'bg-[#38BDF8]' : 'bg-[#FB7185]'}`} />
                            <span className="font-semibold text-[#F3F5F7]">{ach.memberName}</span>
                            <span className="text-[#5F6A7A] font-mono">· R{ach.room}</span>
                          </div>
                          <div className="text-xs font-semibold text-[#F3F5F7] leading-snug">
                            {ach.activityName}
                          </div>
                          {ach.notes && (
                            <p className="text-[11px] text-[#8B96A8] italic mt-0.5 truncate">
                              "{ach.notes}"
                            </p>
                          )}
                          <div className="text-[10px] text-[#5F6A7A] mt-1 font-mono">
                            {ach.date} • {ach.categoryName}
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                          <span className={`text-xs font-bold font-mono ${is154 ? 'text-[#38BDF8]' : 'text-[#FB7185]'}`}>
                            +{ach.points} pts
                          </span>

                          {isAdmin && (
                            <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                              <button
                                onClick={() => onEditAchievement(ach)}
                                className="p-1 rounded text-[#8B96A8] hover:text-[#F3F5F7]"
                                title="Edit"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onDeleteAchievement(ach)}
                                className="p-1 rounded text-[#8B96A8] hover:text-[#EF4444]"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {isAdmin && (
              <div className="pt-3 mt-3 border-t border-[#242B36]">
                <button
                  onClick={onOpenAddAchievement}
                  className="w-full btn-cyan justify-center text-xs !py-2"
                >
                  + Record New Achievement
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
