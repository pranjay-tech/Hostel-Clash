import React, { useState } from 'react';
import { Search, ExternalLink, Edit3, Trash2, MoreVertical } from 'lucide-react';

export default function ActivityView({
  achievements,
  categories,
  isAdmin,
  onEditAchievement,
  onDeleteAchievement
}) {
  const [selectedRoom, setSelectedRoom] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = (achievements || []).filter(ach => {
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
    <div className="space-y-6">
      
      {/* Top Filter Toolbar */}
      <div className="panel-surface p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Room Filter Pills */}
        <div className="flex items-center gap-1 bg-[#0A0D14] p-1 rounded-lg border border-[#202736]">
          <button
            onClick={() => setSelectedRoom('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              selectedRoom === 'ALL'
                ? 'bg-[#151C28] text-[#F3F5F7] border border-[#2B374A] shadow-sm'
                : 'text-[#8B96A8] hover:text-[#F3F5F7]'
            }`}
          >
            All Rooms
          </button>
          <button
            onClick={() => setSelectedRoom('154')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedRoom === '154'
                ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm'
                : 'text-[#8B96A8] hover:text-[#38BDF8]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span>Room 154</span>
          </button>
          <button
            onClick={() => setSelectedRoom('264')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedRoom === '264'
                ? 'bg-[#FB7185]/15 text-[#FB7185] border border-[#FB7185]/40 shadow-sm'
                : 'text-[#8B96A8] hover:text-[#FB7185]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185]" />
            <span>Room 264</span>
          </button>
        </div>

        {/* Category & Search Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#080A0F] border border-[#242B36] text-xs font-medium rounded-lg px-2.5 py-1.5 text-[#8B96A8] focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="ALL">All Categories</option>
            {Object.keys(categories).map(catId => (
              <option key={catId} value={catId}>
                {categories[catId].shortName}
              </option>
            ))}
          </select>

          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 text-[#5F6A7A] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080A0F] border border-[#242B36] text-xs text-[#F3F5F7] rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
        </div>

      </div>

      {/* Activity Feed List Container */}
      <div className="panel-surface overflow-hidden divide-y divide-[#242B36]">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#5F6A7A]">
            No achievements recorded matching the filter criteria.
          </div>
        ) : (
          filtered.map(ach => {
            const is154 = ach.room === '154';
            return (
              <div
                key={ach.id}
                className="p-4 sm:p-5 hover:bg-[#151A23] transition flex items-start justify-between gap-4 group"
              >
                {/* Left: Details */}
                <div className="min-w-0 flex-1">
                  
                  {/* Meta: Member + Room */}
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className={`w-2 h-2 rounded-full ${is154 ? 'bg-[#38BDF8]' : 'bg-[#FB7185]'}`} />
                    <span className="font-semibold text-[#F3F5F7]">{ach.memberName}</span>
                    <span className="text-[#5F6A7A] font-mono">·</span>
                    <span className="text-[#8B96A8] font-mono">Room {ach.room}</span>
                  </div>

                  {/* Activity Name */}
                  <div className="text-sm font-semibold text-[#F3F5F7] leading-snug">
                    {ach.activityName}
                  </div>

                  {/* Notes if any */}
                  {ach.notes && (
                    <p className="text-xs text-[#8B96A8] mt-1 italic">
                      "{ach.notes}"
                    </p>
                  )}

                  {/* Secondary info: Category & Date & Link */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-[#5F6A7A]">
                    <span>{ach.categoryName}</span>
                    <span>•</span>
                    <span className="font-mono">{ach.date}</span>
                    {ach.link && (
                      <>
                        <span>•</span>
                        <a
                          href={ach.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#38BDF8] hover:underline flex items-center gap-1"
                        >
                          <span>Proof</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Points + Admin Action Menu */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-sm font-bold font-mono ${
                    is154 ? 'text-[#38BDF8]' : 'text-[#FB7185]'
                  }`}>
                    +{ach.points} pts
                  </span>

                  {isAdmin && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        onClick={() => onEditAchievement(ach)}
                        className="p-1 rounded text-[#8B96A8] hover:text-[#F3F5F7] hover:bg-[#191F29]"
                        title="Edit achievement"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteAchievement(ach)}
                        className="p-1 rounded text-[#8B96A8] hover:text-[#EF4444] hover:bg-[#191F29]"
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
