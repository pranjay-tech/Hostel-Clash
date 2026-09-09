import React, { useState } from 'react';
import { Clock, Search, Filter, ExternalLink, Trash2, Edit3, Award, Sparkles } from 'lucide-react';

export default function ActivityFeed({
  achievements,
  categories,
  isAdmin,
  onEditAchievement,
  onDeleteAchievement
}) {
  const [selectedRoom, setSelectedRoom] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = achievements.filter(ach => {
    if (selectedRoom !== 'ALL' && ach.room !== selectedRoom) return false;
    if (selectedCategory !== 'ALL' && ach.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ach.memberName?.toLowerCase().includes(q);
      const matchActivity = ach.activityName?.toLowerCase().includes(q);
      const matchNotes = ach.notes?.toLowerCase().includes(q);
      if (!matchName && !matchActivity && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="w-full glass-panel p-6 rounded-3xl border border-white/10 shadow-xl">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-extrabold text-white">Live Achievement Stream</h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
            {filtered.length} logged
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Room Filter Pills */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setSelectedRoom('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedRoom === 'ALL' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedRoom('154')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedRoom === '154' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              Room 154
            </button>
            <button
              onClick={() => setSelectedRoom('264')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedRoom === '264' ? 'bg-amber-950 text-amber-300 border border-amber-500/50' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              Room 264
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950/80 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Categories</option>
            {Object.keys(categories).map(catId => (
              <option key={catId} value={catId}>
                {categories[catId].shortName}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/80 text-xs text-white rounded-xl pl-8 pr-3 py-2 border border-white/10 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Achievement List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No achievements found matching the current filters.
          </div>
        ) : (
          filtered.map(ach => {
            const is154 = ach.room === '154';
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  is154 
                    ? 'bg-slate-900/40 border-cyan-500/20 hover:border-cyan-500/40' 
                    : 'bg-slate-900/40 border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                {/* Left: Member & Activity Details */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-inner ${
                    is154 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}>
                    {ach.memberName?.charAt(0)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-white">
                        {ach.memberName}
                      </span>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.2 rounded ${
                        is154 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        Room {ach.room}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10 font-semibold">
                        {ach.categoryName || ach.categoryId}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-200 mt-1">
                      {ach.activityName}
                    </h4>

                    {ach.notes && (
                      <p className="text-xs text-slate-400 mt-0.5 italic">
                        "{ach.notes}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-mono">
                      <span>📅 {ach.date}</span>
                      {ach.link && (
                        <a
                          href={ach.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>Proof Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Points Awarded & Admin Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="text-right">
                    <span className={`text-base sm:text-lg font-black font-display px-3 py-1 rounded-xl shadow-inner ${
                      is154 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      +{ach.points} pts
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                      <button
                        onClick={() => onEditAchievement(ach)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition"
                        title="Edit this achievement"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteAchievement(ach.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                        title="Delete achievement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
