// Central scoring catalogue for Room 154 vs Room 264
// Built from the effort-anchored model (1 Base Point ~ 1 Hour expected effort)

const CATEGORIES = {
  dsa_ai_ml: {
    id: "dsa_ai_ml",
    name: "DSA/AI/ML Competitions",
    shortName: "DSA/AI/ML",
    icon: "code",
    description: "LeetCode, Codeforces, Kaggle & AI/ML Contest milestones",
    activities: [
      { id: "lc_easy", name: "LeetCode Easy Problem", points: 1, type: "problem" },
      { id: "lc_med", name: "LeetCode Medium Problem", points: 3, type: "problem" },
      { id: "lc_hard", name: "LeetCode Hard Problem", points: 7, type: "problem" },
      { id: "lc_contest", name: "LeetCode Contest Participation", points: 5, type: "contest" },
      { id: "lc_contest_top10", name: "LeetCode Top 10% Contest Finish / Rating 1600+", points: 15, type: "contest" },
      { id: "lc_knight", name: "LeetCode Knight Title (Rating 1850+)", points: 35, type: "title" },
      { id: "lc_guardian", name: "LeetCode Guardian Title (Rating 2150+)", points: 50, type: "title" },
      { id: "cf_prob_sub1000", name: "Codeforces Problem Rating < 1000", points: 1, type: "problem" },
      { id: "cf_prob_1000_1199", name: "Codeforces Problem Rating 1000 - 1199", points: 2, type: "problem" },
      { id: "cf_prob_1200_1399", name: "Codeforces Problem Rating 1200 - 1399", points: 4, type: "problem" },
      { id: "cf_prob_1400_1599", name: "Codeforces Problem Rating 1400 - 1599", points: 7, type: "problem" },
      { id: "cf_prob_1600_1899", name: "Codeforces Problem Rating 1600 - 1899", points: 12, type: "problem" },
      { id: "cf_prob_1900_plus", name: "Codeforces Problem Rating 1900+", points: 20, type: "problem" },
      { id: "cf_contest_part", name: "Codeforces Contest Participation (>=1 AC)", points: 5, type: "contest" },
      { id: "cf_contest_top50", name: "Codeforces Contest Top 50% Finish", points: 5, type: "contest" },
      { id: "cf_contest_top25", name: "Codeforces Contest Top 25% Finish", points: 10, type: "contest" },
      { id: "cf_contest_top10", name: "Codeforces Contest Top 10% Finish", points: 15, type: "contest" },
      { id: "cf_contest_top5", name: "Codeforces Contest Top 5% Finish", points: 25, type: "contest" },
      { id: "cf_pupil", name: "Codeforces Pupil Title (Rating 1200+)", points: 15, type: "title" },
      { id: "cf_specialist", name: "Codeforces Specialist Title (Rating 1400+)", points: 30, type: "title" },
      { id: "cf_expert", name: "Codeforces Expert Title (Rating 1600+)", points: 50, type: "title" },
      { id: "kaggle_bronze", name: "Kaggle Bronze Medal / AI Contest Top 10%", points: 15, type: "competition" },
      { id: "kaggle_silver", name: "Kaggle Silver Medal / AI Contest Top 5%", points: 30, type: "competition" },
      { id: "kaggle_gold", name: "Kaggle Gold Medal / AI Hackathon Prize", points: 50, type: "competition" }
    ]
  },
  projects_dev: {
    id: "projects_dev",
    name: "Engineering Projects & Dev",
    shortName: "Dev & Projects",
    icon: "layers",
    description: "Full-stack apps, architecture, open-source and production software",
    activities: [
      { id: "proj_frontend", name: "Frontend / UI Component Project (Live demo & GitHub)", points: 15 },
      { id: "proj_fullstack", name: "Full-Stack Application Deployed (FE + BE + DB)", points: 40 },
      { id: "proj_advanced", name: "Advanced System (Docker, Redis, Auth, or AI/LLM)", points: 60 },
      { id: "proj_production", name: "Production Software (>25 real active users)", points: 80 },
      { id: "os_good_first", name: "Open-Source PR Merged (Good First Issue / Docs)", points: 10 },
      { id: "os_major_pr", name: "Open-Source PR Merged (Core feature / Major bug fix)", points: 25 },
      { id: "tech_case_study", name: "Technical Case Study / In-Depth Blog Published", points: 10 }
    ]
  },
  hackathons: {
    id: "hackathons",
    name: "Hackathons & Contests",
    shortName: "Hackathons",
    icon: "trophy",
    description: "College, national, and international hackathons and tech battles",
    activities: [
      { id: "hack_college_part", name: "Intra-College Hackathon Participant (Working prototype)", points: 15 },
      { id: "hack_college_podium", name: "Intra-College Hackathon Podium Finish (Top 3)", points: 35 },
      { id: "hack_national_part", name: "National/Major Hackathon (SIH, EthIndia, etc.) Participant", points: 25 },
      { id: "hack_national_finalist", name: "National/Major Hackathon Finalist (Top 10 / Shortlisted)", points: 50 },
      { id: "hack_national_winner", name: "National/Major Hackathon Winner / Top 3 Podium", points: 80 },
      { id: "contest_ctf_top5", name: "Inter-College Coding Contest / CTF Top 5", points: 30 }
    ]
  },
  academics: {
    id: "academics",
    name: "Academics & CGR",
    shortName: "Academics",
    icon: "book-open",
    description: "CGR step score, midterms, endterm 10/10, and semester attendance",
    activities: [
      { id: "cgr_10", name: "Semester CGR = 10.0 (Perfect Score)", points: 50 },
      { id: "cgr_9_5", name: "Semester CGR 9.50 – 9.99", points: 45 },
      { id: "cgr_9_0", name: "Semester CGR 9.00 – 9.49", points: 40 },
      { id: "cgr_8_5", name: "Semester CGR 8.50 – 8.99", points: 35 },
      { id: "cgr_8_0", name: "Semester CGR 8.00 – 8.49", points: 30 },
      { id: "cgr_7_5", name: "Semester CGR 7.50 – 7.99", points: 25 },
      { id: "cgr_7_0", name: "Semester CGR 7.00 – 7.49", points: 20 },
      { id: "cgr_6_5", name: "Semester CGR 6.50 – 6.99", points: 15 },
      { id: "cgr_6_0", name: "Semester CGR 6.00 – 6.49", points: 10 },
      { id: "cgr_sub_6", name: "Semester CGR < 6.00", points: 5 },
      { id: "midterm_topper", name: "Midterm Exam Subject Topper / Section Highest", points: 15 },
      { id: "endterm_10_10", name: "Endterm Subject Grade 10/10", points: 20 },
      { id: "att_above_90", name: "Total Class Attendance in Semester > 90%", points: 20 },
      { id: "att_80_90", name: "Total Class Attendance in Semester 80% – 90%", points: 10 },
      { id: "academic_paper", name: "Academic / Technical Research Paper Submitted or Published", points: 50 }
    ]
  },
  career: {
    id: "career",
    name: "Career & Certifications",
    shortName: "Career",
    icon: "briefcase",
    description: "Portfolios, technical interviews, internships, and cloud credentials",
    activities: [
      { id: "career_portfolio", name: "ATS Tech Resume & Deployed Portfolio Site", points: 15 },
      { id: "interview_cleared", name: "Technical Interview Round Cleared", points: 15 },
      { id: "internship_offer", name: "Formal Internship Offer Received", points: 60 },
      { id: "internship_completed", name: "Internship Successfully Completed", points: 50 },
      { id: "cert_cloud_industry", name: "Recognized Cloud/Tech Cert (AWS, GCP, CKA, Azure)", points: 35 },
      { id: "cert_nptel_elite", name: "Advanced Specialization / NPTEL Elite Certificate", points: 25 }
    ]
  },
  fitness_sports: {
    id: "fitness_sports",
    name: "Fitness, Sports & College Team",
    shortName: "Fitness & Sports",
    icon: "activity",
    description: "College team selection, gym consistency, athletic runs, and sports wins",
    activities: [
      { id: "college_team_selected", name: "Selected in Official College Team", points: 35 },
      { id: "sports_tournament_win", name: "Inter-Hostel / College Sports Match Victory", points: 15 },
      { id: "sports_championship", name: "Sports Tournament Trophy / College Championship Winner", points: 35 },
      { id: "gym_weekly_streak", name: "Weekly Gym / Fitness Consistency (4+ recorded sessions)", points: 10 },
      { id: "fitness_30day_habit", name: "30-Day Unbroken Fitness Habit", points: 25 },
      { id: "run_5k", name: "5K Outdoor Run Completed", points: 10 },
      { id: "run_10k", name: "10K Outdoor Run / Half Marathon Milestone", points: 25 }
    ]
  }
};

module.exports = { CATEGORIES };
