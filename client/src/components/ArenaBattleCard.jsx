import React from 'react';
import { Trophy, Swords, Zap, Crown, Flame, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function ArenaBattleCard({ battle, rooms, onSelectMember }) {
  if (!rooms || !rooms['154'] || !rooms['264']) return null;

  const r154 = rooms['154'];
  const r264 = rooms['264'];

  const is154Leading = battle.leaderRoom === '154';
  const is264Leading = battle.leaderRoom === '264';
  const isTied = battle.leaderRoom === 'TIED';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden p-6 sm:p-8 glass-panel border border-white/10 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-cyan-500/10 filter blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/10 filter blur-3xl pointer-events-none" />

      {/* Top Banner: Status & Margin */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Live Room Battle Active
          </span>
        </div>

        {/* Lead Delta Callout */}
        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/15 flex items-center gap-2 shadow-inner">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold tracking-wide">
            {isTied ? (
              <span className="text-slate-300">DEADLOCK: Both Rooms Tied on Average</span>
            ) : is154Leading ? (
              <span className="text-cyan-300 font-extrabold">
                ROOM 154 LEADS BY <span className="underline decoration-cyan-400 decoration-2">+{battle.avgLead} AVG PTS</span> (+{battle.totalLead} total)
              </span>
            ) : (
              <span className="text-amber-300 font-extrabold">
                ROOM 264 LEADS BY <span className="underline decoration-amber-400 decoration-2">+{battle.avgLead} AVG PTS</span> (+{battle.totalLead} total)
              </span>
            )}
          </span>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Computed: Total Points ÷ 3 Members
        </div>
      </div>

      {/* Main Duel Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
        
        {/* ROOM 154 CARD */}
        <div className={`lg:col-span-5 rounded-2xl p-6 transition-all duration-300 ${
          is154Leading 
            ? 'bg-gradient-to-br from-cyan-950/60 via-cyan-900/20 to-slate-900/80 border-2 border-cyan-400/60 shadow-xl shadow-cyan-500/15' 
            : 'bg-slate-900/50 border border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                Room 154
              </span>
              <span className="text-xs text-slate-400 font-semibold">The Titans</span>
            </div>
            {is154Leading && (
              <div className="flex items-center gap-1 text-xs font-extrabold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/50">
                <Crown className="w-3.5 h-3.5 text-cyan-400" />
                <span>LEADER</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Room Average Score</div>
              <div className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight flex items-baseline gap-1">
                <span className="text-cyan-400">{r154.averagePoints}</span>
                <span className="text-sm font-bold text-slate-400">pts / member</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-bold">Total Pts</div>
              <div className="text-2xl font-black text-slate-200 font-display">{r154.totalPoints}</div>
            </div>
          </div>

          {/* Roster Chips */}
          <div className="pt-3 border-t border-white/10">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Room Members</div>
            <div className="grid grid-cols-3 gap-2">
              {r154.members.map(m => (
                <button
                  key={m.id}
                  onClick={() => onSelectMember(m.id)}
                  className="p-2 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/20 text-left transition group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                    <span>{m.name}</span>
                    <span className="text-[10px]">{m.avatar}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                    {m.score} <span className="text-[9px] font-normal text-slate-400">pts</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* VS DIVISION & MOMENTUM GAUGE */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border border-white/20 flex items-center justify-center shadow-lg">
            <Swords className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div className="font-display font-black text-2xl tracking-widest text-slate-300">
            VS
          </div>
          <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase font-mono">
            {battle.room154Share}% vs {battle.room264Share}%
          </div>
        </div>

        {/* ROOM 264 CARD */}
        <div className={`lg:col-span-5 rounded-2xl p-6 transition-all duration-300 ${
          is264Leading 
            ? 'bg-gradient-to-br from-amber-950/60 via-amber-900/20 to-slate-900/80 border-2 border-amber-400/60 shadow-xl shadow-amber-500/15' 
            : 'bg-slate-900/50 border border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Room 264
              </span>
              <span className="text-xs text-slate-400 font-semibold">The Challengers</span>
            </div>
            {is264Leading && (
              <div className="flex items-center gap-1 text-xs font-extrabold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>LEADER</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Room Average Score</div>
              <div className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight flex items-baseline gap-1">
                <span className="text-amber-400">{r264.averagePoints}</span>
                <span className="text-sm font-bold text-slate-400">pts / member</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-bold">Total Pts</div>
              <div className="text-2xl font-black text-slate-200 font-display">{r264.totalPoints}</div>
            </div>
          </div>

          {/* Roster Chips */}
          <div className="pt-3 border-t border-white/10">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Room Members</div>
            <div className="grid grid-cols-3 gap-2">
              {r264.members.map(m => (
                <button
                  key={m.id}
                  onClick={() => onSelectMember(m.id)}
                  className="p-2 rounded-xl bg-amber-950/30 hover:bg-amber-900/50 border border-amber-500/20 text-left transition group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200 group-hover:text-amber-300 truncate">
                    <span>{m.name}</span>
                    <span className="text-[10px]">{m.avatar}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                    {m.score} <span className="text-[9px] font-normal text-slate-400">pts</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Battle Progress Gauge */}
      <div className="pt-4">
        <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
          <span className="text-cyan-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Room 154 ({battle.room154Share}%)
          </span>
          <span className="text-amber-400 flex items-center gap-1">
            Room 264 ({battle.room264Share}%) <Flame className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 flex border border-white/15 shadow-inner">
          <div
            style={{ width: `${battle.room154Share}%` }}
            className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 rounded-l-full transition-all duration-700 relative group"
            title={`Room 154: ${battle.room154Share}%`}
          />
          <div
            style={{ width: `${battle.room264Share}%` }}
            className="h-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 rounded-r-full transition-all duration-700 relative group"
            title={`Room 264: ${battle.room264Share}%`}
          />
        </div>
      </div>

    </div>
  );
}
