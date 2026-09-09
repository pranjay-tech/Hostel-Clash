import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  achievement
}) {
  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="modal-container p-6 w-full max-w-sm animate-fade-in">
        
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center shrink-0 border border-[#EF4444]/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F3F5F7]">
            Delete achievement?
          </h3>
        </div>

        <p className="text-xs text-[#8B96A8] leading-relaxed mb-3">
          "<span className="font-semibold text-[#F3F5F7]">{achievement.activityName}</span>"
        </p>

        <div className="p-3 rounded-lg bg-[#151A23] border border-[#242B36] text-xs text-[#EF4444] font-medium mb-5">
          This will permanently deduct <span className="font-bold font-mono">-{achievement.points} points</span> from <span className="font-bold text-[#F3F5F7]">{achievement.memberName}</span>.
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="btn-neutral"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Achievement</span>
          </button>
        </div>

      </div>
    </div>
  );
}
