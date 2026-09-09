import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  AlertCircle,
  Zap,
  Trophy,
  Calendar,
  Tag,
  FileText,
  Link2,
  ChevronDown,
  Sparkles,
  Upload
} from 'lucide-react';

const CATEGORY_META = {
  dsa_ai_ml: { label: 'DSA / AI / ML', icon: '💻' },
  projects_dev: { label: 'Dev & Projects', icon: '🛠️' },
  hackathons: { label: 'Hackathons', icon: '🏆' },
  academics: { label: 'Academics & CGR', icon: '🎓' },
  career: { label: 'Career & Intern', icon: '💼' },
  fitness_sports: { label: 'Fitness & Sports', icon: '⚡' }
};

export default function AdminModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  members,
  editItem = null,
  onRestoreBackup
}) {
  if (!isOpen) return null;

  const [memberId, setMemberId] = useState(members[0]?.id || 'pranjay');
  const [categoryId, setCategoryId] = useState('dsa_ai_ml');
  const [activityId, setActivityId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editItem) {
      setMemberId(editItem.memberId);
      setCategoryId(editItem.categoryId);
      setActivityId(editItem.activityId);
      setCustomTitle(editItem.customTitle || '');
      setDate(editItem.date || new Date().toISOString().split('T')[0]);
      setNotes(editItem.notes || '');
      setLink(editItem.link || '');
    } else {
      setMemberId(members[0]?.id || 'pranjay');
      setCategoryId('dsa_ai_ml');
      const defaultActivity = categories['dsa_ai_ml']?.activities[0]?.id || '';
      setActivityId(defaultActivity);
      setCustomTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setLink('');
    }
    setError('');
  }, [editItem, isOpen]);

  const handleCategoryChange = (newCatId) => {
    setCategoryId(newCatId);
    const cat = categories[newCatId];
    if (cat && cat.activities?.length > 0) {
      setActivityId(cat.activities[0].id);
    }
  };

  const handleFileRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (window.confirm(`Restore database from backup? This will overwrite current records with ${parsed.members?.length || 0} members and ${(parsed.achievements || []).length} achievements.`)) {
          if (onRestoreBackup) onRestoreBackup(parsed);
        }
      } catch (err) {
        alert('Invalid JSON backup file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const currentCategory = categories[categoryId];
  const currentActivity = currentCategory?.activities?.find(a => a.id === activityId);
  const selectedMember = members.find(m => m.id === memberId) || members[0];
  const points = currentActivity?.points || 0;
  const isRoom154 = selectedMember?.room === '154';

  const room154Members = members.filter(m => m.room === '154');
  const room264Members = members.filter(m => m.room === '264');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activityId) {
      setError('Please select an activity parameter.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({
        memberId,
        categoryId,
        activityId,
        customTitle: customTitle.trim(),
        date,
        notes: notes.trim(),
        link: link.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit achievement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', height: 'min(86vh, 700px)' }}
        className="relative w-full max-w-xl bg-[#0B0E15] border border-[#283548] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden"
      >
        
        {/* Dynamic ambient room glow at top */}
        <div
          className={`h-1 w-full shrink-0 transition-colors duration-300 ${
            isRoom154
              ? 'bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#FB7185] to-transparent'
          }`}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#202B3B] bg-[#0F1420] shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                isRoom154
                  ? 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]'
                  : 'bg-[#FB7185]/10 border-[#FB7185]/30 text-[#FB7185]'
              }`}
            >
              {editItem ? <Sparkles className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#F3F5F7]">
                  {editItem ? 'Edit Achievement' : 'Mark Achievement'}
                </h3>
                <span className="flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-[#8B96A8]">
                Admin action • Updates room score & individual records
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#8B96A8] hover:text-[#F3F5F7] hover:bg-[#1A2230] p-1 rounded-md transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-5 mt-3 p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div
          style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto' }}
          className="p-4 sm:p-5 space-y-3.5"
        >
          
          {/* 1. SELECT MEMBER (COMPACT & CLEAR) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B96A8]">
                1. Select Member
              </label>
              <span className="text-[10px] font-mono text-[#5F6A7A]">
                Room {selectedMember?.room}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Room 154 */}
              <div className="p-1.5 rounded-lg bg-[#101622] border border-[#1D2738]">
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-[9px] font-mono font-bold text-[#38BDF8] tracking-wider uppercase">
                    Room 154
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {room154Members.map(m => {
                    const isSelected = memberId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMemberId(m.id)}
                        className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#38BDF8]/20 border border-[#38BDF8] text-white shadow-sm shadow-[#38BDF8]/25 font-semibold'
                            : 'bg-[#141B26] border border-transparent hover:border-[#28364A] text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        <span className="text-xs">{m.avatar}</span>
                        <span className="truncate">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Room 264 */}
              <div className="p-1.5 rounded-lg bg-[#18131B] border border-[#2B1F28]">
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-[9px] font-mono font-bold text-[#FB7185] tracking-wider uppercase">
                    Room 264
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185]" />
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {room264Members.map(m => {
                    const isSelected = memberId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMemberId(m.id)}
                        className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FB7185]/20 border border-[#FB7185] text-white shadow-sm shadow-[#FB7185]/25 font-semibold'
                            : 'bg-[#221822] border border-transparent hover:border-[#432A38] text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        <span className="text-xs">{m.avatar}</span>
                        <span className="truncate">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 2. CATEGORY SELECTOR (SMALLER, CLEARER) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B96A8] block">
              2. Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {Object.keys(categories).map(catId => {
                const isSelected = categoryId === catId;
                const meta = CATEGORY_META[catId] || { label: categories[catId].name, icon: '🎯' };
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => handleCategoryChange(catId)}
                    className={`flex items-center justify-between p-1.5 px-2 rounded-lg text-left transition-all cursor-pointer ${
                      isSelected
                        ? isRoom154
                          ? 'bg-[#38BDF8]/15 border border-[#38BDF8]/70 text-[#F8FAFC] shadow-sm font-semibold'
                          : 'bg-[#FB7185]/15 border border-[#FB7185]/70 text-[#F8FAFC] shadow-sm font-semibold'
                        : 'bg-[#111622] border border-[#1E2738] hover:border-[#2F3E56] text-[#8B96A8] hover:text-[#F3F5F7]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm shrink-0">{meta.icon}</span>
                      <span className="text-[11px] font-medium truncate">{meta.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. ACTIVITY PARAMETER (CLEAR COMPACT SELECT) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B96A8] block">
              3. Activity Parameter
            </label>
            <div className="relative">
              <select
                id="admin-select-activity"
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                className="w-full appearance-none bg-[#111622] border border-[#222C3C] hover:border-[#384860] focus:border-[#38BDF8] rounded-lg px-3 py-2 pr-8 text-xs text-[#F3F5F7] focus:outline-none transition-all cursor-pointer font-medium"
              >
                {currentCategory?.activities?.map(act => (
                  <option key={act.id} value={act.id} className="bg-[#0E131C] text-[#F3F5F7] py-1">
                    {act.name} (+{act.points} {act.points === 1 ? 'pt' : 'pts'})
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B96A8]">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* LIVE IMPACT SCORECARD BANNER (COMPACT) */}
          <div
            className={`p-2.5 px-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
              isRoom154
                ? 'bg-gradient-to-r from-[#0C2438]/80 via-[#101A28]/80 to-[#111722] border-[#38BDF8]/40 shadow-sm'
                : 'bg-gradient-to-r from-[#38111D]/80 via-[#26131D]/80 to-[#18131B] border-[#FB7185]/40 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 border ${
                  isRoom154
                    ? 'bg-[#38BDF8]/20 border-[#38BDF8]/40 text-[#38BDF8]'
                    : 'bg-[#FB7185]/20 border-[#FB7185]/40 text-[#FB7185]'
                }`}
              >
                {selectedMember?.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#F3F5F7] truncate">
                    {selectedMember?.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isRoom154
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
                        : 'bg-[#FB7185]/20 text-[#FB7185]'
                    }`}
                  >
                    R{selectedMember?.room}
                  </span>
                </div>
                <div className="text-[11px] text-[#8B96A8] truncate">
                  {currentActivity?.name || 'Select activity'}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <div className="text-[9px] uppercase font-bold tracking-wider text-[#8B96A8]">
                Score Impact
              </div>
              <div
                className={`text-lg font-black font-mono tracking-tight leading-tight ${
                  isRoom154 ? 'text-[#38BDF8]' : 'text-[#FB7185]'
                }`}
              >
                +{points} <span className="text-[10px] font-semibold">PTS</span>
              </div>
            </div>
          </div>

          {/* 4. DETAILS & PROOF */}
          <div className="space-y-2.5 pt-1.5 border-t border-[#1E2636]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B96A8]">
              4. Verification & Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Date */}
              <div>
                <label className="flex items-center gap-1 text-[11px] text-[#8B96A8] mb-1 font-medium">
                  <Calendar className="w-3 h-3 text-[#5F6A7A]" />
                  <span>Date Completed</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#111622] border border-[#202B3A] focus:border-[#38BDF8] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F5F7] focus:outline-none transition-all"
                />
              </div>

              {/* Subtitle / Context */}
              <div>
                <label className="flex items-center gap-1 text-[11px] text-[#8B96A8] mb-1 font-medium">
                  <Tag className="w-3 h-3 text-[#5F6A7A]" />
                  <span>Context / Round (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Div 2 Round #940"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-[#111622] border border-[#202B3A] focus:border-[#38BDF8] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F5F7] placeholder:text-[#4A5568] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Description Notes */}
            <div>
              <label className="flex items-center gap-1 text-[11px] text-[#8B96A8] mb-1 font-medium">
                <FileText className="w-3 h-3 text-[#5F6A7A]" />
                <span>Description / Notes (Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Key problem solved, algorithm used, project features, or grade details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#111622] border border-[#202B3A] focus:border-[#38BDF8] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F5F7] placeholder:text-[#4A5568] focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Proof Link */}
            <div>
              <label className="flex items-center gap-1 text-[11px] text-[#8B96A8] mb-1 font-medium">
                <Link2 className="w-3 h-3 text-[#5F6A7A]" />
                <span>Proof URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://codeforces.com/submission/... or github.com/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-[#111622] border border-[#202B3A] focus:border-[#38BDF8] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F5F7] placeholder:text-[#4A5568] focus:outline-none transition-all"
              />
            </div>
          </div>

        </div>

        {/* Modal Footer Bar */}
        <div
          style={{ flexShrink: 0 }}
          className="flex items-center justify-between px-5 py-3 border-t border-[#202B3B] bg-[#0A0D14]"
        >
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-[#5F6A7A] font-medium hidden sm:block">
              {selectedMember ? `${selectedMember.name} • Room ${selectedMember.room}` : ''}
            </div>
            {!editItem && onRestoreBackup && (
              <label className="text-[11px] text-[#5F6A7A] hover:text-[#38BDF8] cursor-pointer transition flex items-center gap-1 font-medium select-none" title="Restore database from snapshot JSON">
                <Upload className="w-3 h-3" />
                <span className="hidden md:inline">Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileRestore}
                />
              </label>
            )}
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#8B96A8] hover:text-[#F3F5F7] bg-[#141B26] hover:bg-[#1C2536] border border-[#222C3C] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isRoom154
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] shadow-[#38BDF8]/20'
                  : 'bg-gradient-to-r from-[#E11D48] to-[#FB7185] hover:from-[#BE123C] hover:to-[#E11D48] shadow-[#FB7185]/20'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {submitting ? 'Recording...' : editItem ? 'Save Updates' : 'Record Achievement'}
              </span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
