import React, { useState } from 'react';
import { Crown, ChevronRight } from 'lucide-react';

export default function LeaderboardView({
  combinedLeaderboard,
  rooms,
  onSelectMember
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | '154' | '264'

  const r154 = rooms['154'];
  const r264 = rooms['264'];

  const displayedMembers = activeTab === '154'
    ? r154.members
    : activeTab === '264'
    ? r264.members
    : combinedLeaderboard;

  return (
    <div className="space-y-6">
      
      {/* Sub-Tabs Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#10141C] p-1 rounded-lg border border-[#202736]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#151C28] text-[#F3F5F7] border border-[#2B374A] shadow-sm'
                : 'text-[#8B96A8] hover:text-[#F3F5F7]'
            }`}
          >
            Hall of Fame (1–6)
          </button>

          <button
            onClick={() => setActiveTab('154')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === '154'
                ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm'
                : 'text-[#8B96A8] hover:text-[#38BDF8]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span>Room 154</span>
          </button>

          <button
            onClick={() => setActiveTab('264')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === '264'
                ? 'bg-[#FB7185]/15 text-[#FB7185] border border-[#FB7185]/40 shadow-sm'
                : 'text-[#8B96A8] hover:text-[#FB7185]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185]" />
            <span>Room 264</span>
          </button>
        </div>

        <span className="text-xs text-[#5F6A7A] hidden sm:inline">
          Click row to inspect scorecard
        </span>
      </div>

      {/* Leaderboard Table Container */}
      <div className="panel-surface overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 text-xs font-medium text-[#5F6A7A] uppercase tracking-wider py-3 px-4 border-b border-[#242B36]">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 sm:col-span-5">Member</div>
          <div className="col-span-2 text-center">Room</div>
          <div className="hidden sm:block sm:col-span-2 text-center">Achievements</div>
          <div className="col-span-3 sm:col-span-2 text-right pr-2">Points</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#242B36]">
          {displayedMembers.map((m, idx) => {
            const is154 = m.room === '154';
            const rank = activeTab === 'all' ? m.rank : (idx + 1);
            const rankFormatted = String(rank).padStart(2, '0');

            return (
              <div
                key={m.id}
                onClick={() => onSelectMember(m.id)}
                className="grid grid-cols-12 items-center py-3.5 px-4 hover:bg-[#151A23] cursor-pointer transition text-sm group"
              >
                {/* Rank */}
                <div className="col-span-1 text-center font-mono text-xs font-bold text-[#8B96A8] flex items-center justify-center gap-1">
                  {rank === 1 ? (
                    <Crown className="w-3.5 h-3.5 text-[#F59E0B]" />
                  ) : (
                    <span>{rankFormatted}</span>
                  )}
                </div>

                {/* Member */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                  <div>
                    <div className="font-semibold text-[#F3F5F7] group-hover:text-white flex items-center gap-1.5">
                      {m.name}
                      {m.isMVP && activeTab === 'all' && (
                        <span className="text-[10px] font-mono px-1 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                          MVP
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#8B96A8] truncate">{m.title}</div>
                  </div>
                </div>

                {/* Room */}
                <div className="col-span-2 flex justify-center">
                  <span className="text-xs font-medium text-[#8B96A8] flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${is154 ? 'bg-[#38BDF8]' : 'bg-[#FB7185]'}`} />
                    <span>Room {m.room}</span>
                  </span>
                </div>

                {/* Count */}
                <div className="hidden sm:block sm:col-span-2 text-center text-xs text-[#8B96A8] font-mono">
                  {m.achievementsCount} logged
                </div>

                {/* Points */}
                <div className="col-span-3 sm:col-span-2 text-right flex items-center justify-end gap-2 pr-2">
                  <span className="text-base font-bold font-mono text-[#F3F5F7]">
                    {m.score} <span className="text-xs font-normal text-[#8B96A8]">pts</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5F6A7A] group-hover:text-[#F3F5F7] transition" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
