import React, { useState } from 'react';
import { Trophy, Medal, Crown, Star, ChevronRight, BarChart3, Users, Code, Layers, BookOpen, Briefcase, Activity } from 'lucide-react';

export default function RoomTables({
  combinedLeaderboard,
  rooms,
  categories,
  onSelectMember
}) {
  const [activeTab, setActiveTab] = useState('combined'); // 'combined' | 'r154' | 'r264' | 'categories'

  const r154 = rooms['154'];
  const r264 = rooms['264'];

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="text-xl" title="1st Place (Gold)">🥇</span>;
    if (rank === 2) return <span className="text-xl" title="2nd Place (Silver)">🥈</span>;
    if (rank === 3) return <span className="text-xl" title="3rd Place (Bronze)">🥉</span>;
    return <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">#{rank}</span>;
  };

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'dsa_ai_ml': return <Code className="w-4 h-4 text-cyan-400" />;
      case 'projects_dev': return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'hackathons': return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'academics': return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'career': return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'fitness_sports': return <Activity className="w-4 h-4 text-rose-400" />;
      default: return <Star className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full glass-panel p-6 rounded-3xl border border-white/10 shadow-xl">
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-2xl border border-white/10">
          <button
            id="tab-combined"
            onClick={() => setActiveTab('combined')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'combined'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Hall of Fame (1-6)</span>
          </button>

          <button
            id="tab-r154"
            onClick={() => setActiveTab('r154')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'r154'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-lg'
                : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Room 154</span>
          </button>

          <button
            id="tab-r264"
            onClick={() => setActiveTab('r264')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'r264'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-lg'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Room 264</span>
          </button>

          <button
            id="tab-categories"
            onClick={() => setActiveTab('categories')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/50 shadow-lg'
                : 'text-slate-400 hover:text-indigo-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Category Duel</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden md:block">
          All 6 Members Have View-Only Access
        </div>
      </div>

      {/* TAB CONTENT: COMBINED LEADERBOARD */}
      {activeTab === 'combined' && (
        <div className="space-y-3">
          <div className="grid grid-cols-12 text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-2 border-b border-white/5">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5 sm:col-span-4">Member</div>
            <div className="col-span-3 sm:col-span-2 text-center">Room</div>
            <div className="hidden sm:block sm:col-span-3 text-center">Top Strengths</div>
            <div className="col-span-3 sm:col-span-2 text-right">Points</div>
          </div>

          {combinedLeaderboard.map((m) => {
            const is154 = m.room === '154';
            return (
              <div
                key={m.id}
                onClick={() => onSelectMember(m.id)}
                className={`grid grid-cols-12 items-center p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                  is154 
                    ? 'hover:bg-cyan-950/30 hover:border-cyan-500/40 border-white/5 bg-slate-900/40' 
                    : 'hover:bg-amber-950/30 hover:border-amber-500/40 border-white/5 bg-slate-900/40'
                }`}
              >
                <div className="col-span-1 flex justify-center">
                  {getRankBadge(m.rank)}
                </div>

                <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg shadow">
                    {m.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      {m.name}
                      {m.isMVP && (
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          MVP
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{m.title}</div>
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-2 flex justify-center">
                  <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg ${
                    is154 ? 'badge-154' : 'badge-264'
                  }`}>
                    Room {m.room}
                  </span>
                </div>

                {/* Categories quick preview */}
                <div className="hidden sm:flex sm:col-span-3 justify-center gap-1.5">
                  {Object.keys(m.categoryBreakdown).slice(0, 3).map(catId => {
                    const cat = m.categoryBreakdown[catId];
                    if (cat.cappedPoints === 0) return null;
                    return (
                      <span key={catId} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">
                        {cat.shortName}: {cat.cappedPoints}
                      </span>
                    );
                  })}
                </div>

                <div className="col-span-3 sm:col-span-2 text-right flex items-center justify-end gap-1">
                  <div>
                    <span className="text-lg font-black font-display text-white">{m.score}</span>
                    <span className="text-xs text-slate-400 font-bold ml-1">pts</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: ROOM 154 ROSTER */}
      {activeTab === 'r154' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-cyan-300">Room 154 Standings</h3>
              <p className="text-xs text-slate-400">Total: {r154.totalPoints} pts | Average: {r154.averagePoints} pts</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/40">
              3 Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {r154.members.map(m => (
              <div
                key={m.id}
                onClick={() => onSelectMember(m.id)}
                className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer transition shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{m.avatar}</span>
                    <div>
                      <h4 className="text-base font-extrabold text-white">{m.name}</h4>
                      <p className="text-xs text-slate-400">{m.title}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                    #{m.roomRank}
                  </span>
                </div>

                <div className="my-3 py-2 border-y border-white/5 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Total Score</span>
                  <span className="text-2xl font-black text-cyan-400 font-display">{m.score} pts</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {Object.keys(m.categoryBreakdown).map(catId => {
                    const cat = m.categoryBreakdown[catId];
                    const pct = Math.min((cat.cappedPoints / cat.cap) * 100, 100);
                    return (
                      <div key={catId} className="flex justify-between text-slate-400 text-[11px]">
                        <span className="truncate">{cat.shortName}</span>
                        <span className="font-mono font-bold text-slate-300">{cat.cappedPoints} / {cat.cap}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ROOM 264 ROSTER */}
      {activeTab === 'r264' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-amber-300">Room 264 Standings</h3>
              <p className="text-xs text-slate-400">Total: {r264.totalPoints} pts | Average: {r264.averagePoints} pts</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-amber-900/60 text-amber-300 border border-amber-500/40">
              3 Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {r264.members.map(m => (
              <div
                key={m.id}
                onClick={() => onSelectMember(m.id)}
                className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/20 hover:border-amber-400/50 cursor-pointer transition shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{m.avatar}</span>
                    <div>
                      <h4 className="text-base font-extrabold text-white">{m.name}</h4>
                      <p className="text-xs text-slate-400">{m.title}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                    #{m.roomRank}
                  </span>
                </div>

                <div className="my-3 py-2 border-y border-white/5 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Total Score</span>
                  <span className="text-2xl font-black text-amber-400 font-display">{m.score} pts</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {Object.keys(m.categoryBreakdown).map(catId => {
                    const cat = m.categoryBreakdown[catId];
                    return (
                      <div key={catId} className="flex justify-between text-slate-400 text-[11px]">
                        <span className="truncate">{cat.shortName}</span>
                        <span className="font-mono font-bold text-slate-300">{cat.cappedPoints} / {cat.cap}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CATEGORY DUEL */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(categories).map(catId => {
              const cat = categories[catId];
              const score154 = r154.categoryScores[catId] || 0;
              const score264 = r264.categoryScores[catId] || 0;
              const total = score154 + score264;
              const p154 = total > 0 ? ((score154 / total) * 100).toFixed(0) : 50;
              const p264 = total > 0 ? ((score264 / total) * 100).toFixed(0) : 50;

              return (
                <div key={catId} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(catId)}
                      <span className="text-sm font-extrabold text-white">{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Cap: {cat.cap} pts/member</span>
                  </div>

                  <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                    <span className="text-cyan-400">R154: {score154} pts</span>
                    <span className="text-amber-400">R264: {score264} pts</span>
                  </div>

                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-white/10">
                    <div style={{ width: `${p154}%` }} className="bg-cyan-400 h-full transition-all duration-500" />
                    <div style={{ width: `${p264}%` }} className="bg-amber-400 h-full transition-all duration-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
