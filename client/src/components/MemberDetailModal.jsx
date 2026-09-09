import React from 'react';
import { X, Trophy, ExternalLink } from 'lucide-react';

export default function MemberDetailModal({
  memberId,
  isOpen,
  onClose,
  combinedLeaderboard,
  achievements
}) {
  if (!isOpen || !memberId) return null;

  const member = combinedLeaderboard.find(m => m.id === memberId);
  if (!member) return null;

  const memberAchs = (achievements || []).filter(a => a.memberId === memberId);
  const is154 = member.room === '154';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="modal-container p-6 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-5 mb-5 border-b border-[#242B36]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${is154 ? 'bg-[#38BDF8]' : 'bg-[#FB7185]'}`} />
              <h2 className="text-xl font-bold text-[#F3F5F7]">
                {member.name}
              </h2>
              <span className="text-xs font-mono text-[#8B96A8]">
                · Room {member.room}
              </span>
            </div>
            <p className="text-xs text-[#8B96A8]">{member.title}</p>
          </div>

          <div className="text-right flex items-center gap-3">
            <div>
              <div className="text-2xl font-bold font-mono text-[#F3F5F7]">
                {member.score} <span className="text-xs font-normal text-[#8B96A8]">pts</span>
              </div>
              <div className="text-[11px] text-[#5F6A7A] font-mono">Rank #{member.rank}</div>
            </div>
            <button
              onClick={onClose}
              className="text-[#8B96A8] hover:text-[#F3F5F7] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Caps Breakdown */}
        {/* Category Breakdown (Uncapped) */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F6A7A] mb-3">
            Category Breakdown
          </h4>
          <div className="space-y-2.5 text-xs">
            {Object.keys(member.categoryBreakdown).map(catId => {
              const cat = member.categoryBreakdown[catId];
              const pts = cat.points || cat.rawPoints || 0;
              const pct = member.score > 0 ? Math.min((pts / member.score) * 100, 100) : 0;
              return (
                <div key={catId} className="p-2.5 rounded-lg bg-[#151A23] border border-[#242B36]">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#F3F5F7]">{cat.name}</span>
                      <span className="text-[10px] font-mono text-[#5F6A7A]">({cat.count} logs)</span>
                    </div>
                    <span className={`font-mono font-bold text-xs ${is154 ? 'text-[#38BDF8]' : 'text-[#FB7185]'}`}>
                      +{pts} pts
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#080A0F] rounded-full overflow-hidden flex border border-[#242B36]">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full transition-all duration-300 ${
                        is154 ? 'bg-[#38BDF8]' : 'bg-[#FB7185]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Achievements */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-[#5F6A7A]">
            <span>Achievements ({memberAchs.length})</span>
          </div>

          <div className="divide-y divide-[#242B36] border-y border-[#242B36]">
            {memberAchs.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#5F6A7A]">
                No recorded achievements yet.
              </div>
            ) : (
              memberAchs.map(ach => (
                <div key={ach.id} className="py-2.5 first:pt-2 last:pb-2 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-3">
                    <div className="font-semibold text-[#F3F5F7] truncate">{ach.activityName}</div>
                    <div className="text-[11px] text-[#8B96A8] mt-0.5 flex items-center gap-2 font-mono">
                      <span>{ach.date}</span>
                      <span>•</span>
                      <span>{ach.categoryName}</span>
                    </div>
                  </div>
                  <span className={`font-mono font-bold shrink-0 ${
                    is154 ? 'text-[#38BDF8]' : 'text-[#FB7185]'
                  }`}>
                    +{ach.points} pts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
