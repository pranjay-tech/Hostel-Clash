import React, { useState } from 'react';
import {
  Code,
  Layers,
  Trophy,
  BookOpen,
  Briefcase,
  Activity,
  ShieldCheck,
  Scale,
  Flame,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

export default function CategoryView({ categories, rooms }) {
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'catalogue' | 'duel'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!rooms || !rooms['154'] || !rooms['264']) return null;

  const r154 = rooms['154'];
  const r264 = rooms['264'];

  const getCategoryIcon = (catId, className = "w-4 h-4") => {
    switch (catId) {
      case 'dsa_ai_ml': return <Code className={`${className} text-[#38BDF8]`} />;
      case 'projects_dev': return <Layers className={`${className} text-[#818CF8]`} />;
      case 'hackathons': return <Trophy className={`${className} text-[#F59E0B]`} />;
      case 'academics': return <BookOpen className={`${className} text-[#10B981]`} />;
      case 'career': return <Briefcase className={`${className} text-[#C084FC]`} />;
      case 'fitness_sports': return <Activity className={`${className} text-[#FB7185]`} />;
      default: return <Trophy className={`${className} text-[#8B96A8]`} />;
    }
  };

  const getCategoryColor = (catId) => {
    switch (catId) {
      case 'dsa_ai_ml': return 'border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8]';
      case 'projects_dev': return 'border-[#818CF8]/30 bg-[#818CF8]/10 text-[#818CF8]';
      case 'hackathons': return 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]';
      case 'academics': return 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]';
      case 'career': return 'border-[#C084FC]/30 bg-[#C084FC]/10 text-[#C084FC]';
      case 'fitness_sports': return 'border-[#FB7185]/30 bg-[#FB7185]/10 text-[#FB7185]';
      default: return 'border-[#8B96A8]/30 bg-[#8B96A8]/10 text-[#8B96A8]';
    }
  };

  // Flatten all activities with category details for search and filter
  const allActivities = [];
  Object.keys(categories || {}).forEach(catId => {
    const cat = categories[catId];
    (cat.activities || []).forEach(act => {
      allActivities.push({
        ...act,
        categoryId: catId,
        categoryName: cat.name,
        categoryShort: cat.shortName
      });
    });
  });

  const filteredActivities = allActivities.filter(act => {
    if (selectedCategoryFilter !== 'ALL' && act.categoryId !== selectedCategoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = act.name.toLowerCase().includes(q);
      const matchCat = act.categoryName.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242B36]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#101726] border border-[#233554] text-[#38BDF8] font-bold">
              Official Codex
            </span>
            <span className="text-[11px] text-[#5F6A7A]">•</span>
            <span className="text-[11px] text-[#8B96A8]">1 Point ≈ 1 Hour Verified Effort</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F3F5F7] tracking-tight">
            Rules & Scoring Criteria
          </h1>
          <p className="text-xs text-[#8B96A8] mt-0.5">
            The complete scoring model, fair play rules, and points catalogue for Room 154 vs Room 264.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#10141C] p-1 rounded-xl border border-[#202736] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-[#151C28] text-[#F3F5F7] border border-[#2B374A] shadow-sm'
                : 'text-[#8B96A8] hover:text-[#F3F5F7]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Rules</span>
          </button>
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'catalogue'
                ? 'bg-[#151C28] text-[#F3F5F7] border border-[#2B374A] shadow-sm'
                : 'text-[#8B96A8] hover:text-[#F3F5F7]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Scoring Criteria</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A0D14] text-[#8B96A8] border border-[#242B36]">
              {allActivities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('duel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'duel'
                ? 'bg-[#151C28] text-[#F3F5F7] border border-[#2B374A] shadow-sm'
                : 'text-[#8B96A8] hover:text-[#F3F5F7]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#FB7185]" />
            <span>Category Duel</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COMPETITION RULES & ARCHITECTURE                  */}
      {/* ======================================================== */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          
          {/* Key Rule Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Rule 1: Collective Average */}
            <div className="panel-surface p-5 border-l-2 border-l-[#38BDF8] flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] mb-3">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#F3F5F7] mb-1.5">
                  1. The Fair Average Formula
                </h3>
                <p className="text-xs text-[#8B96A8] leading-relaxed">
                  The official room score is calculated strictly as the <strong>Average of all 3 roommates</strong>:
                </p>
                <div className="my-3 p-2.5 rounded-lg bg-[#0A0D14] border border-[#1E293B] font-mono text-center text-xs text-[#38BDF8]">
                  Room Score = Total Points ÷ 3.0
                </div>
                <p className="text-[11px] text-[#5F6A7A] leading-relaxed">
                  Every roommate’s performance directly impacts the room standing. A single carry cannot compensate for inactivity; all 3 members must contribute.
                </p>
              </div>
            </div>

            {/* Rule 2: Uncapped Points & Effort Anchor */}
            <div className="panel-surface p-5 border-l-2 border-l-[#F59E0B] flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] mb-3">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#F3F5F7] mb-1.5">
                  2. Uncapped Effort Scoring
                </h3>
                <p className="text-xs text-[#8B96A8] leading-relaxed">
                  Points accumulate with <strong>no category caps</strong> and <strong>no daily ceilings</strong>.
                </p>
                <div className="my-3 p-2.5 rounded-lg bg-[#0A0D14] border border-[#1E293B] font-mono text-center text-xs text-[#F59E0B]">
                  1 Base Point ≈ 1 Hour Verified Effort
                </div>
                <p className="text-[11px] text-[#5F6A7A] leading-relaxed">
                  Whether solving 50 LeetCode problems or shipping a production app, all real effort is credited directly to the member's and room's score.
                </p>
              </div>
            </div>

            {/* Rule 3: Verification & Proof */}
            <div className="panel-surface p-5 border-l-2 border-l-[#10B981] flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#F3F5F7] mb-1.5">
                  3. Admin Verification & Proof
                </h3>
                <p className="text-xs text-[#8B96A8] leading-relaxed">
                  To prevent fabricated records, points can only be recorded via the secure Admin key (<code className="text-[#38BDF8]">pranjay_admin_45</code>).
                </p>
                <div className="my-3 p-2.5 rounded-lg bg-[#0A0D14] border border-[#1E293B] text-[11px] text-[#8B96A8] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#10B981]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Public proof URL attached</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#10B981]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Logged in public Activity stream</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#5F6A7A] leading-relaxed">
                  Proof URLs can include Codeforces profiles, GitHub PRs, LeetCode submissions, Devfolio badges, or exam grade sheets.
                </p>
              </div>
            </div>

          </div>

          {/* Roster & Lineup Breakdown */}
          <div className="panel-surface p-5">
            <h3 className="text-sm font-bold text-[#F3F5F7] mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#38BDF8]" />
              <span>Official Room Rosters</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Room 154 */}
              <div className="p-4 rounded-xl bg-[#0A0D14] border border-[#38BDF8]/20">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#202736]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                    <span className="text-sm font-bold text-[#38BDF8]">Room 154</span>
                    <span className="text-[11px] text-[#8B96A8] font-mono">(Cyan Vanguard)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F3F5F7]">3 Members</span>
                </div>
                <div className="space-y-2">
                  {r154.members.map((m, idx) => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-[#111622] border border-[#1F2937] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{m.avatar}</span>
                        <span className="font-semibold text-[#F3F5F7]">{m.name}</span>
                        {m.id === 'pranjay' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-bold">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#8B96A8]">
                        Score: <strong className="text-[#38BDF8]">{m.score}</strong> pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room 264 */}
              <div className="p-4 rounded-xl bg-[#0A0D14] border border-[#FB7185]/20">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#202736]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
                    <span className="text-sm font-bold text-[#FB7185]">Room 264</span>
                    <span className="text-[11px] text-[#8B96A8] font-mono">(Crimson / Amber Vanguard)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F3F5F7]">3 Members</span>
                </div>
                <div className="space-y-2">
                  {r264.members.map((m, idx) => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-[#111622] border border-[#1F2937] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{m.avatar}</span>
                        <span className="font-semibold text-[#F3F5F7]">{m.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8B96A8]">
                        Score: <strong className="text-[#FB7185]">{m.score}</strong> pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Operational FAQ & Integrity Standards */}
          <div className="panel-surface p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#F3F5F7] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#F59E0B]" />
              <span>Standard Operational Guidelines</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#1E293B]">
                <h4 className="font-bold text-[#F3F5F7] mb-1">Q: How do I submit an achievement?</h4>
                <p className="text-[#8B96A8] leading-relaxed">
                  Provide your achievement details and proof link (GitHub, Codeforces, LeetCode, or screenshot URL) to Pranjay. He records it through the Admin portal with the passkey.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#1E293B]">
                <h4 className="font-bold text-[#F3F5F7] mb-1">Q: Can I log the same activity multiple times?</h4>
                <p className="text-[#8B96A8] leading-relaxed">
                  Yes! Repeatable milestones (e.g. solving new LeetCode questions, participating in weekly Codeforces rounds, weekly gym streaks) can be recorded every time you achieve them.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#1E293B]">
                <h4 className="font-bold text-[#F3F5F7] mb-1">Q: What happens if a score needs editing or deleting?</h4>
                <p className="text-[#8B96A8] leading-relaxed">
                  Any marked score can be edited or deleted in the public Activity log by the Admin if details were entered incorrectly.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#1E293B]">
                <h4 className="font-bold text-[#F3F5F7] mb-1">Q: How is the winning room crowned?</h4>
                <p className="text-[#8B96A8] leading-relaxed">
                  The room with the higher <strong>Room Average Score</strong> at the end of the semester/year wins the competition and the title of Hostel Clash Champion.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SCORING CRITERIA CATALOGUE                        */}
      {/* ======================================================== */}
      {activeTab === 'catalogue' && (
        <div className="space-y-5">
          
          {/* Controls: Search & Domain Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-[#0C1017] border border-[#202838]">
            
            {/* Domain Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategoryFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategoryFilter === 'ALL'
                    ? 'bg-[#1F293D] text-[#F3F5F7] border border-[#38BDF8]/40 shadow-sm'
                    : 'text-[#8B96A8] hover:text-[#F3F5F7] hover:bg-[#141B26]'
                }`}
              >
                All Domains ({allActivities.length})
              </button>
              {Object.keys(categories || {}).map(catId => {
                const cat = categories[catId];
                const isSel = selectedCategoryFilter === catId;
                return (
                  <button
                    key={catId}
                    onClick={() => setSelectedCategoryFilter(catId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                      isSel
                        ? 'bg-[#1F293D] text-[#F3F5F7] border border-[#38BDF8]/40 shadow-sm'
                        : 'text-[#8B96A8] hover:text-[#F3F5F7] hover:bg-[#141B26]'
                    }`}
                  >
                    {getCategoryIcon(catId, "w-3 h-3")}
                    <span>{cat.shortName}</span>
                    <span className="text-[10px] font-mono text-[#5F6A7A]">
                      ({cat.activities?.length || 0})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6A7A]" />
              <input
                type="text"
                placeholder="Search activity, contest, rating..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111622] border border-[#202B3A] focus:border-[#38BDF8] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F3F5F7] placeholder:text-[#4A5568] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Activities List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredActivities.map((act) => (
              <div
                key={`${act.categoryId}_${act.id}`}
                className="panel-surface p-4 flex flex-col justify-between hover:border-[#38BDF8]/30 transition group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1.5 rounded-md bg-[#10141C] border border-[#202736]">
                      {getCategoryIcon(act.categoryId)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F3F5F7] leading-snug group-hover:text-[#38BDF8] transition">
                        {act.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${getCategoryColor(act.categoryId)}`}>
                          {act.categoryShort}
                        </span>
                        <span className="text-[11px] font-mono text-[#5F6A7A] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#4A5568]" />
                          <span>~{act.points} hrs effort</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Points Badge */}
                  <div className="text-right flex-shrink-0">
                    <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 font-mono text-xs font-black">
                      +{act.points} <span className="text-[10px] font-normal text-[#10B981]/80">pts</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 text-xs text-[#5F6A7A] panel-surface">
              No scoring criteria found matching "{searchQuery}".
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CATEGORY DUEL MATRIX                              */}
      {/* ======================================================== */}
      {activeTab === 'duel' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between pb-1">
            <div className="text-xs text-[#8B96A8]">
              Live head-to-head point distribution across 6 performance domains
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#38BDF8]">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Room 154
              </span>
              <span className="flex items-center gap-1.5 text-[#FB7185]">
                <span className="w-2 h-2 rounded-full bg-[#FB7185]" /> Room 264
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(categories).map(catId => {
              const cat = categories[catId];
              const score154 = r154.categoryScores[catId] || 0;
              const score264 = r264.categoryScores[catId] || 0;
              const total = score154 + score264;
              const p154 = total > 0 ? Number(((score154 / total) * 100).toFixed(0)) : 50;
              const p264 = total > 0 ? Number(((score264 / total) * 100).toFixed(0)) : 50;

              return (
                <div key={catId} className="panel-surface p-5 flex flex-col justify-between">
                  
                  {/* Category Title + Cap */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(catId)}
                        <h3 className="text-sm font-bold text-[#F3F5F7]">{cat.name}</h3>
                      </div>
                      <span className="text-[10px] font-mono text-[#38BDF8] px-1.5 py-0.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/20 font-semibold">
                        Uncapped
                      </span>
                    </div>
                    <p className="text-xs text-[#8B96A8]">{cat.description}</p>
                  </div>

                  {/* Points Duel */}
                  <div className="my-4 pt-3 border-t border-[#242B36] flex justify-between items-baseline">
                    <div>
                      <div className="text-[11px] text-[#8B96A8]">Room 154</div>
                      <div className="text-lg font-bold font-mono text-[#38BDF8]">
                        {score154} <span className="text-xs font-normal text-[#8B96A8]">pts</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-[#8B96A8]">Room 264</div>
                      <div className="text-lg font-bold font-mono text-[#FB7185]">
                        {score264} <span className="text-xs font-normal text-[#8B96A8]">pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Percentages */}
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-[#5F6A7A] mb-1">
                      <span className={score154 >= score264 ? 'text-[#38BDF8] font-semibold' : ''}>
                        {p154}%
                      </span>
                      <span className={score264 >= score154 ? 'text-[#FB7185] font-semibold' : ''}>
                        {p264}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#151A23] rounded-full overflow-hidden flex border border-[#242B36]">
                      <div style={{ width: `${p154}%` }} className="bg-[#38BDF8] h-full transition-all duration-300" />
                      <div style={{ width: `${p264}%` }} className="bg-[#FB7185] h-full transition-all duration-300" />
                    </div>
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
