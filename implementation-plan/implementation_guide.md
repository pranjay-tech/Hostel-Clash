# Implementation Guide: Scaler Dashboard with Improvements

---

## Database Schema (Complete)

### Core Tables

```sql
-- Students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    semester INT,
    batch_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Academic data
CREATE TABLE academic_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    cgr DECIMAL(3,2),
    assignment_completion INT,
    assignment_avg DECIMAL(3,2),
    midterm_score INT,
    endterm_score INT,
    attendance INT,
    peer_teaching BOOLEAN,
    academic_competitions INT,
    verified BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_student_semester (student_id, semester)
);

-- LeetCode data
CREATE TABLE leetcode_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    username VARCHAR(255),
    rating INT,
    easy_solved INT,
    medium_solved INT,
    hard_solved INT,
    contests_participated INT,
    last_sync TIMESTAMP,
    sync_status ENUM('pending','success','failed'),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_student_leetcode (student_id)
);

-- Codeforces data
CREATE TABLE codeforces_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    handle VARCHAR(255),
    current_rating INT,
    max_rating INT,
    contests_participated INT,
    last_sync TIMESTAMP,
    sync_status ENUM('pending','success','failed'),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_student_codeforces (student_id)
);

-- Kaggle data
CREATE TABLE kaggle_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    username VARCHAR(255),
    competitions INT,
    best_percentile DECIMAL(5,2),
    bronze_medals INT,
    silver_medals INT,
    gold_medals INT,
    notebooks INT,
    datasets INT,
    last_sync TIMESTAMP,
    sync_status ENUM('pending','success','failed'),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_student_kaggle (student_id)
);

-- Projects
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    project_name VARCHAR(255),
    type ENUM('CRUD','fullstack','AI','production'),
    github_url VARCHAR(255),
    deployed BOOLEAN,
    deployed_url VARCHAR(255),
    readme_quality INT,
    test_coverage DECIMAL(3,2),
    real_users INT,
    open_source BOOLEAN,
    base_points INT,
    multiplier DECIMAL(3,2),
    final_points INT,
    team_members JSON, -- {student_id, role, contribution%}
    verification_status ENUM('pending','verified','rejected'),
    submitted_at TIMESTAMP,
    verified_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_semester (student_id, semester)
);

-- Hackathons
CREATE TABLE hackathons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    hackathon_name VARCHAR(255),
    tier ENUM('local','national','international'),
    placement INT, -- 1=winner, 2=2nd, etc
    team_size INT,
    solo BOOLEAN,
    team_leader BOOLEAN,
    technical_contribution BOOLEAN,
    duration_hours INT,
    base_points INT,
    tier_multiplier DECIMAL(3,2),
    placement_multiplier DECIMAL(3,2),
    final_points INT,
    verification_status ENUM('pending','verified','rejected'),
    organizer_confirmation VARCHAR(255),
    submitted_at TIMESTAMP,
    verified_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_semester (student_id, semester)
);

-- Open Source
CREATE TABLE open_source (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    project_name VARCHAR(255),
    project_url VARCHAR(255),
    prs_count INT,
    merged_prs INT,
    merged_pr_links JSON, -- array of PR URLs
    is_maintainer BOOLEAN,
    gsoc BOOLEAN,
    base_points INT,
    final_points INT,
    verification_status ENUM('pending','verified','rejected'),
    submitted_at TIMESTAMP,
    verified_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_semester (student_id, semester)
);

-- Career
CREATE TABLE career (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    has_resume BOOLEAN,
    has_portfolio BOOLEAN,
    has_linkedin BOOLEAN,
    linkedin_connections INT,
    mock_interviews INT,
    interviews_passed INT,
    applications_submitted INT,
    interviews_scheduled INT,
    internship_offers INT,
    internship_completed BOOLEAN,
    internship_company VARCHAR(255),
    base_points INT,
    final_points INT,
    verification_status ENUM('pending','verified','rejected'),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_student_semester (student_id, semester)
);

-- Learning
CREATE TABLE learning (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    course_name VARCHAR(255),
    course_type ENUM('short','substantial'),
    duration_hours INT,
    certificate BOOLEAN,
    certificate_url VARCHAR(255),
    built_project BOOLEAN,
    taught_others BOOLEAN,
    base_points INT,
    final_points INT,
    verification_status ENUM('pending','verified','rejected'),
    submitted_at TIMESTAMP,
    verified_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_semester (student_id, semester)
);

-- Fitness
CREATE TABLE fitness (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    week_number INT,
    workouts_this_week INT,
    weekly_points INT,
    streak_weeks INT,
    streak_bonus INT,
    events_participated INT,
    event_points INT,
    goals_achieved INT,
    goal_points INT,
    total_weekly_points INT,
    verification_status ENUM('pending','verified','rejected'),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_student_week (student_id, semester, week_number)
);

-- Consistency tracking
CREATE TABLE consistency_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    week_number INT,
    dsa_problems INT,
    project_hours DECIMAL(4,2),
    academic_sessions INT,
    assignments_completed INT,
    github_activity BOOLEAN,
    weekly_score INT,
    streak_counter INT,
    streak_broken BOOLEAN,
    submitted_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_student_week (student_id, semester, week_number)
);

-- Score history (for time-series)
CREATE TABLE score_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    semester INT NOT NULL,
    week_number INT,
    timestamp DATETIME,
    academic_raw INT,
    academic_adjusted INT,
    technical_raw INT,
    technical_adjusted INT,
    career_raw INT,
    career_adjusted INT,
    wellness_raw INT,
    wellness_adjusted INT,
    total_score INT,
    decay_applied DECIMAL(3,2), -- e.g., 0.95 = 95% of points
    velocity INT, -- points gained this week
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_time_series (student_id, semester, week_number)
);

-- Achievements & badges
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    achievement_type VARCHAR(100), -- 'first_problem', 'first_project', etc
    name VARCHAR(255),
    description TEXT,
    icon_emoji VARCHAR(10),
    rarity ENUM('common','uncommon','rare','epic','legendary'),
    points_bonus INT
);

CREATE TABLE student_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_date DATETIME,
    semester INT,
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE KEY unique_student_achievement (student_id, achievement_id)
);

-- Activity log (for timeline)
CREATE TABLE activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    activity_type VARCHAR(100), -- 'leetcode_problem', 'project_submitted', etc
    activity_date DATETIME,
    details JSON, -- flexible data based on activity type
    points_change INT,
    semester INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_timeline (student_id, semester, activity_date)
);

-- Verification audit trail
CREATE TABLE verification_audit (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    entity_type VARCHAR(100), -- 'project', 'hackathon', 'internship', etc
    entity_id INT,
    submitted_value VARCHAR(255),
    verification_result ENUM('approved','rejected','pending_more_info'),
    verifier_id INT, -- student ID of peer verifier or 0 for admin
    verification_method ENUM('auto','link','peer','certificate','email'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Fraud flags
CREATE TABLE fraud_flags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    flag_type VARCHAR(100), -- 'anomaly_jump', 'too_many_verifications', etc
    severity ENUM('info','warning','critical'),
    description TEXT,
    flagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_reviewed BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_severity (severity, resolved)
);
```

---

## Core Calculation Functions (Python)

### 1. Academic Score Calculation

```python
def calculate_academic_score(student_id, semester):
    """
    Calculate academic score (250 points max)
    
    Components:
    - CGR: CGR × 25 (max 250)
    - Additional: exams, assignments, peer teaching, etc (max 150, but capped by CGR total)
    """
    
    academic = db.query(AcademicData).filter(
        AcademicData.student_id == student_id,
        AcademicData.semester == semester
    ).first()
    
    if not academic:
        return 0
    
    # CGR component (0-250)
    cgr_points = min(academic.cgr * 25, 250)
    
    # Additional components (only if CGR points < 250)
    additional_points = 0
    if academic.assignment_completion:
        additional_points += min(academic.assignment_completion / 5, 20)  # max 20
    if academic.assignment_avg:
        additional_points += min(academic.assignment_avg / 3, 30)  # max 30
    if academic.midterm_score:
        additional_points += min(academic.midterm_score / 3.5, 30)  # max 30
    if academic.endterm_score:
        additional_points += min(academic.endterm_score / 2.5, 40)  # max 40
    if academic.attendance:
        additional_points += min(academic.attendance / 10, 10)  # max 10
    if academic.peer_teaching:
        additional_points += 10
    if academic.academic_competitions:
        additional_points += min(academic.academic_competitions * 5, 10)
    
    total = cgr_points + min(additional_points, 150)
    return min(total, 250)


def calculate_leetcode_score(student_id):
    """
    Calculate LeetCode score (80 points max)
    
    Components:
    - Rating: 50 points (based on rating brackets)
    - Problems: 30 points (weighted by difficulty, acceptance rate)
    """
    
    leetcode = db.query(LeetCodeData).filter(
        LeetCodeData.student_id == student_id
    ).first()
    
    if not leetcode:
        return 0
    
    # Rating component (0-50)
    rating = leetcode.rating or 0
    rating_points = 0
    if rating < 1200:
        rating_points = 10
    elif 1200 <= rating < 1400:
        rating_points = 20
    elif 1400 <= rating < 1600:
        rating_points = 30
    elif 1600 <= rating < 1800:
        rating_points = 35
    elif 1800 <= rating < 2000:
        rating_points = 40
    elif 2000 <= rating < 2200:
        rating_points = 45
    else:
        rating_points = 50
    
    # Problem component (0-30, capped)
    # Fetch problem details from LeetCode API
    problems = fetch_leetcode_problems(leetcode.username)
    
    problem_points = 0
    for problem in problems:
        # Base points by difficulty
        if problem['difficulty'] == 'Easy':
            base = 0.5
        elif problem['difficulty'] == 'Medium':
            base = 1.5
        else:  # Hard
            base = 3.0
        
        # Difficulty multiplier (acceptance rate)
        acceptance = problem.get('acceptance_rate', 50)
        if acceptance > 70:
            multiplier = 1.0
        elif 50 <= acceptance <= 70:
            multiplier = 1.25
        elif 30 <= acceptance < 50:
            multiplier = 1.5
        else:
            multiplier = 2.0
        
        problem_points += base * multiplier
    
    # Cap at 30
    problem_points = min(problem_points, 30)
    
    return min(rating_points + problem_points, 80)


def calculate_codeforces_score(student_id):
    """
    Calculate Codeforces score (80 points max)
    
    Components:
    - Rating: 60 points
    - Contest participation: 20 points
    """
    
    codeforces = db.query(CodeforcesData).filter(
        CodeforcesData.student_id == student_id
    ).first()
    
    if not codeforces:
        return 0
    
    # Rating component (0-60)
    rating = codeforces.current_rating or 0
    rating_points = 0
    if rating < 1000:
        rating_points = 10
    elif 1000 <= rating < 1200:
        rating_points = 20
    elif 1200 <= rating < 1400:
        rating_points = 30
    elif 1400 <= rating < 1600:
        rating_points = 40
    elif 1600 <= rating < 1800:
        rating_points = 45
    elif 1800 <= rating < 2000:
        rating_points = 50
    elif 2000 <= rating < 2200:
        rating_points = 55
    else:
        rating_points = 60
    
    # Contest participation component (0-20)
    contests = codeforces.contests_participated or 0
    contest_points = 0
    if contests >= 1:
        contest_points += 2
    if contests >= 5:
        contest_points += 3
    if contests >= 10:
        contest_points += 5
    if contests >= 20:
        contest_points += 10
    
    contest_points = min(contest_points, 20)
    
    return min(rating_points + contest_points, 80)


def calculate_kaggle_score(student_id):
    """
    Calculate Kaggle score (40 points max)
    
    Components:
    - Competition achievement: 25 points
    - Profile achievements: 15 points
    """
    
    kaggle = db.query(KaggleData).filter(
        KaggleData.student_id == student_id
    ).first()
    
    if not kaggle:
        return 0
    
    # Competition achievement (0-25)
    comp_points = 0
    
    # Only take best achievement per competition
    competitions = fetch_kaggle_competitions(kaggle.username)
    for comp in competitions:
        best_achievement = 0
        
        if comp.get('participated'):
            best_achievement = max(best_achievement, 2)
        if comp.get('submitted'):
            best_achievement = max(best_achievement, 2)
        if comp.get('top_50_percent'):
            best_achievement = max(best_achievement, 5)
        if comp.get('top_25_percent'):
            best_achievement = max(best_achievement, 8)
        if comp.get('top_10_percent'):
            best_achievement = max(best_achievement, 12)
        if comp.get('top_5_percent'):
            best_achievement = max(best_achievement, 16)
        if comp.get('bronze_medal'):
            best_achievement = max(best_achievement, 15)
        if comp.get('silver_medal'):
            best_achievement = max(best_achievement, 20)
        if comp.get('gold_medal'):
            best_achievement = max(best_achievement, 25)
        
        comp_points += best_achievement
    
    comp_points = min(comp_points, 25)
    
    # Profile achievements (0-15)
    profile_points = 0
    if kaggle.notebooks:
        profile_points += min(kaggle.notebooks * 3, 5)  # max 5
    if kaggle.datasets:
        profile_points += min(kaggle.datasets * 3, 5)  # max 5
    # Discussion and rank medals...
    
    profile_points = min(profile_points, 15)
    
    return min(comp_points + profile_points, 40)
```

### 2. Overall Score with Decay

```python
def calculate_overall_score(student_id, semester):
    """
    Calculate overall score with decay applied to old achievements
    
    Formula:
    Overall = 0.35 × Academic + 0.40 × Technical + 0.20 × Career + 0.05 × Wellness
    
    With decay applied per semester
    """
    
    # Get scores from current semester
    academic_raw = calculate_academic_score(student_id, semester)
    technical_raw = (
        calculate_leetcode_score(student_id) +
        calculate_codeforces_score(student_id) +
        calculate_kaggle_score(student_id)
    )
    career_raw = calculate_career_score(student_id, semester)
    wellness_raw = calculate_wellness_score(student_id, semester)
    
    # Current semester: 100% value
    current_semester_points = {
        'academic': academic_raw * 0.35,
        'technical': min(technical_raw, 200) * 0.40,
        'career': min(career_raw, 150) * 0.20,
        'wellness': min(wellness_raw, 75) * 0.05
    }
    
    # Previous semester: 50% decay
    if semester > 1:
        prev_academic = calculate_academic_score(student_id, semester - 1)
        prev_technical = get_previous_technical_score(student_id, semester - 1)
        prev_career = calculate_career_score(student_id, semester - 1)
        prev_wellness = calculate_wellness_score(student_id, semester - 1)
        
        prev_semester_points = {
            'academic': prev_academic * 0.35 * 0.50,  # 50% decay
            'technical': min(prev_technical, 200) * 0.40 * 0.50,
            'career': min(prev_career, 150) * 0.20 * 0.50,
            'wellness': min(prev_wellness, 75) * 0.05 * 0.50
        }
    else:
        prev_semester_points = {k: 0 for k in current_semester_points.keys()}
    
    # Sum all components
    total = sum(current_semester_points.values()) + sum(prev_semester_points.values())
    
    return min(total, 1000)  # Cap at 1000
```

### 3. Fraud Detection

```python
def detect_anomalies(student_id, semester):
    """
    Run automated fraud detection checks
    """
    
    flags = []
    
    # Check 1: Anomaly jump
    current_score = get_weekly_score(student_id, semester, current_week=None)
    prev_week_score = get_weekly_score(student_id, semester, current_week=None - 1)
    
    if prev_week_score and (current_score - prev_week_score) > 100:
        flags.append({
            'type': 'anomaly_jump',
            'severity': 'warning',
            'description': f'Score jumped {current_score - prev_week_score} points in 1 week'
        })
    
    # Check 2: Platform cooldown
    lc_activities_this_week = count_activities(student_id, 'leetcode_problem', current_week)
    cf_activities_this_week = count_activities(student_id, 'codeforces_contest', current_week)
    
    if lc_activities_this_week > 3:
        flags.append({
            'type': 'platform_cooldown',
            'severity': 'info',
            'description': f'{lc_activities_this_week} LeetCode activities this week'
        })
    
    # Check 3: GitHub code similarity
    projects = db.query(Projects).filter(
        Projects.student_id == student_id,
        Projects.semester == semester,
        Projects.verification_status == 'pending'
    )
    
    for project in projects:
        similarity = check_code_similarity(project.github_url)
        if similarity > 0.4:  # > 40% similar to existing code
            flags.append({
                'type': 'code_similarity',
                'severity': 'critical',
                'description': f'Project {project.project_name}: {similarity*100}% similarity detected'
            })
    
    # Check 4: Application-to-interview ratio
    applications = count_applications(student_id, semester)
    interviews = count_interviews(student_id, semester)
    
    if applications > 0 and interviews / applications < 0.05:  # < 5% interview rate
        flags.append({
            'type': 'application_spam',
            'severity': 'warning',
            'description': f'Low interview-to-application ratio: {interviews}/{applications}'
        })
    
    # Check 5: Rating manipulation
    cf = db.query(CodeforcesData).filter(CodeforcesData.student_id == student_id).first()
    if cf and cf.max_rating and cf.current_rating:
        if (cf.max_rating - cf.current_rating) > 300:  # > 300 point drop
            flags.append({
                'type': 'rating_manipulation',
                'severity': 'warning',
                'description': f'Codeforces rating dropped {cf.max_rating - cf.current_rating} points'
            })
    
    # Save flags
    for flag in flags:
        db.add(FraudFlag(
            student_id=student_id,
            flag_type=flag['type'],
            severity=flag['severity'],
            description=flag['description']
        ))
    
    db.commit()
    return flags
```

### 4. Badge/Achievement Logic

```python
def award_achievements(student_id, semester):
    """
    Check and award achievements/badges based on student progress
    """
    
    awarded = []
    
    # First-time achievements
    if not student_has_achievement(student_id, 'first_leetcode_problem'):
        lc_problems = get_total_problems_solved(student_id)
        if lc_problems >= 1:
            award_achievement(student_id, 'first_leetcode_problem')
            awarded.append('first_leetcode_problem')
    
    if not student_has_achievement(student_id, 'first_project'):
        projects = count_projects(student_id, semester)
        if projects >= 1:
            award_achievement(student_id, 'first_project')
            awarded.append('first_project')
    
    # Tier achievements
    academic_score = calculate_academic_score(student_id, semester)
    if academic_score >= 250:
        if not student_has_tier(student_id, 'academic', 'passing_grade'):
            award_achievement(student_id, 'academic_tier_passing_grade')
            awarded.append('academic_tier_passing_grade')
    if academic_score >= 350:
        award_achievement(student_id, 'academic_tier_proficient')
        awarded.append('academic_tier_proficient')
    # ... more tiers
    
    # Streak achievements
    consistency = get_consistency_score(student_id, semester)
    streak = get_current_streak(student_id, semester)
    
    if streak >= 4:
        award_achievement(student_id, 'streak_4_weeks')
        awarded.append('streak_4_weeks')
    if streak >= 12:
        award_achievement(student_id, 'streak_12_weeks')
        awarded.append('streak_12_weeks')
    
    # Growth achievements
    growth = calculate_growth_percentage(student_id, semester)
    if growth >= 50:
        award_achievement(student_id, 'growth_climber')
        awarded.append('growth_climber')
    if growth >= 100:
        award_achievement(student_id, 'growth_rocket')
        awarded.append('growth_rocket')
    
    return awarded
```

---

## API Integration

### LeetCode API Integration

```python
def sync_leetcode_data(username):
    """
    Sync LeetCode data from API
    """
    
    api_endpoint = f"https://leetcode.com/api/graphql"
    
    query = """
    query {
        userProfile(username: "%s") {
            profile {
                realName
                userAvatar
                reputation
            }
            userCalendar {
                activeYears
                streak
                totalActiveDays
            }
            submissionCalendar
            userContestRanking {
                globalRanking
                globalOutOfRanking
                rating
                ratingPercentile
                ratingChange
            }
            userSkillStats {
                difficulty
                count
                percentage
            }
        }
    }
    """ % username
    
    response = requests.post(
        api_endpoint,
        json={"query": query},
        headers={"Content-Type": "application/json"}
    )
    
    data = response.json()['data']['userProfile']
    
    # Extract problems solved
    easy = 0
    medium = 0
    hard = 0
    
    for skill in data['userSkillStats']:
        if skill['difficulty'] == 'Easy':
            easy = skill['count']
        elif skill['difficulty'] == 'Medium':
            medium = skill['count']
        elif skill['difficulty'] == 'Hard':
            hard = skill['count']
    
    return {
        'rating': data['userContestRanking']['rating'],
        'easy_solved': easy,
        'medium_solved': medium,
        'hard_solved': hard,
        'contests_participated': count_contests(username)
    }


def sync_codeforces_data(handle):
    """
    Sync Codeforces data from API
    """
    
    api_endpoint = f"https://codeforces.com/api/user.info?handles={handle}"
    
    response = requests.get(api_endpoint)
    data = response.json()['result'][0]
    
    # Get contests
    contests_api = f"https://codeforces.com/api/user.ratedListBySolver?handle={handle}"
    contests_data = requests.get(contests_api).json()['result']
    
    return {
        'rating': data['rating'],
        'maxRating': data['maxRating'],
        'contests_participated': len(contests_data)
    }


def sync_kaggle_data(username):
    """
    Sync Kaggle data from API (requires API key)
    """
    
    from kaggle.api.kaggle_api_extended import KaggleApi
    
    api = KaggleApi()
    api.authenticate()
    
    # Get user profile
    profile = api.user_profile(username)
    
    return {
        'competitions': profile['totalCompetitions'],
        'best_percentile': profile.get('bestPercentile', 100),
        'medals': profile['medals']
    }
```

---

## Dashboard Backend (Flask Example)

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/student/<int:student_id>/leaderboard', methods=['GET'])
def get_leaderboard(student_id):
    """
    Get overall leaderboard with velocity and improvement
    """
    
    semester = request.args.get('semester', default=2, type=int)
    
    students = db.query(Students).all()
    leaderboard = []
    
    for student in students:
        score = calculate_overall_score(student.id, semester)
        velocity = calculate_velocity(student.id, semester)
        improvement = calculate_improvement(student.id, semester)
        
        leaderboard.append({
            'rank': 0,  # Will be set after sorting
            'student_id': student.id,
            'name': student.name,
            'score': score,
            'velocity': velocity,
            'improvement': improvement,
            'avatar': f'https://api.dicebear.com/7.x/avataaars/svg?seed={student.email}'
        })
    
    # Sort by score
    leaderboard.sort(key=lambda x: x['score'], reverse=True)
    
    # Assign ranks
    for idx, student in enumerate(leaderboard):
        student['rank'] = idx + 1
    
    return jsonify(leaderboard)


@app.route('/api/student/<int:student_id>/profile', methods=['GET'])
def get_student_profile(student_id):
    """
    Get detailed student profile with all metrics
    """
    
    semester = request.args.get('semester', default=2, type=int)
    
    student = db.query(Students).filter(Students.id == student_id).first()
    
    academic_score = calculate_academic_score(student_id, semester)
    technical_score = (
        calculate_leetcode_score(student_id) +
        calculate_codeforces_score(student_id) +
        calculate_kaggle_score(student_id)
    )
    career_score = calculate_career_score(student_id, semester)
    wellness_score = calculate_wellness_score(student_id, semester)
    
    overall_score = calculate_overall_score(student_id, semester)
    rank = get_student_rank(student_id, semester)
    velocity = calculate_velocity(student_id, semester)
    improvement = calculate_improvement(student_id, semester)
    consistency = get_consistency_score(student_id, semester)
    achievements = get_student_achievements(student_id, semester)
    
    return jsonify({
        'student': {
            'id': student.id,
            'name': student.name,
            'email': student.email,
            'semester': semester
        },
        'scores': {
            'overall': overall_score,
            'academic': academic_score,
            'technical': technical_score,
            'career': career_score,
            'wellness': wellness_score
        },
        'stats': {
            'rank': rank,
            'velocity': velocity,
            'improvement': improvement,
            'consistency': consistency
        },
        'achievements': achievements,
        'breakdown': {
            'academic_percentage': (academic_score / 250) * 100,
            'technical_percentage': (technical_score / 200) * 100,
            'career_percentage': (career_score / 150) * 100,
            'wellness_percentage': (wellness_score / 75) * 100
        }
    })


@app.route('/api/student/<int:student_id>/timeline', methods=['GET'])
def get_student_timeline(student_id):
    """
    Get week-by-week score progression
    """
    
    semester = request.args.get('semester', default=2, type=int)
    
    history = db.query(ScoreHistory).filter(
        ScoreHistory.student_id == student_id,
        ScoreHistory.semester == semester
    ).order_by(ScoreHistory.week_number).all()
    
    timeline = []
    for record in history:
        timeline.append({
            'week': record.week_number,
            'score': record.total_score,
            'velocity': record.velocity,
            'academic': record.academic_adjusted,
            'technical': record.technical_adjusted,
            'career': record.career_adjusted,
            'wellness': record.wellness_adjusted
        })
    
    return jsonify(timeline)


@app.route('/api/instructor/cohort', methods=['GET'])
def get_cohort_overview():
    """
    Instructor view: Cohort overview
    """
    
    semester = request.args.get('semester', default=2, type=int)
    
    students = db.query(Students).all()
    scores = [calculate_overall_score(s.id, semester) for s in students]
    
    red_flags = db.query(FraudFlag).filter(
        FraudFlag.resolved == False
    ).all()
    
    # Calculate trends
    avg_score = sum(scores) / len(scores) if scores else 0
    prev_scores = [
        calculate_overall_score(s.id, semester - 1) for s in students
    ] if semester > 1 else scores
    avg_improvement = (
        (avg_score - (sum(prev_scores) / len(prev_scores))) 
        / (sum(prev_scores) / len(prev_scores))
    ) * 100 if semester > 1 else 0
    
    return jsonify({
        'cohort': {
            'total_students': len(students),
            'average_score': avg_score,
            'median_score': sorted(scores)[len(scores)//2],
            'min_score': min(scores),
            'max_score': max(scores),
            'improvement_percentage': avg_improvement
        },
        'red_flags': [
            {
                'type': f.flag_type,
                'severity': f.severity,
                'description': f.description,
                'student_name': db.query(Students).filter(
                    Students.id == f.student_id
                ).first().name
            } for f in red_flags[:10]  # Top 10 flags
        ]
    })


@app.route('/api/instructor/student/<int:student_id>/alerts', methods=['GET'])
def get_student_alerts(student_id):
    """
    Get alerts/flags for a specific student
    """
    
    flags = db.query(FraudFlag).filter(
        FraudFlag.student_id == student_id,
        FraudFlag.resolved == False
    ).all()
    
    return jsonify([
        {
            'id': f.id,
            'type': f.flag_type,
            'severity': f.severity,
            'description': f.description,
            'created_at': f.flagged_at.isoformat()
        } for f in flags
    ])


if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

## Sync Worker (Background Job)

```python
import schedule
import time
from celery import Celery

app = Celery('dashboard_sync')

@app.task
def sync_all_platform_data():
    """
    Run every 6 hours: sync all LeetCode, Codeforces, Kaggle data
    """
    
    students = db.query(Students).all()
    
    for student in students:
        try:
            # LeetCode
            lc_data = db.query(LeetCodeData).filter(
                LeetCodeData.student_id == student.id
            ).first()
            
            if lc_data and lc_data.username:
                updated_data = sync_leetcode_data(lc_data.username)
                lc_data.rating = updated_data['rating']
                lc_data.easy_solved = updated_data['easy_solved']
                lc_data.medium_solved = updated_data['medium_solved']
                lc_data.hard_solved = updated_data['hard_solved']
                lc_data.last_sync = datetime.now()
                lc_data.sync_status = 'success'
            
            # Codeforces
            cf_data = db.query(CodeforcesData).filter(
                CodeforcesData.student_id == student.id
            ).first()
            
            if cf_data and cf_data.handle:
                updated_data = sync_codeforces_data(cf_data.handle)
                cf_data.current_rating = updated_data['rating']
                cf_data.contests_participated = updated_data['contests_participated']
                cf_data.last_sync = datetime.now()
                cf_data.sync_status = 'success'
            
            # Kaggle
            kaggle_data = db.query(KaggleData).filter(
                KaggleData.student_id == student.id
            ).first()
            
            if kaggle_data and kaggle_data.username:
                updated_data = sync_kaggle_data(kaggle_data.username)
                kaggle_data.competitions = updated_data['competitions']
                kaggle_data.best_percentile = updated_data['best_percentile']
                kaggle_data.last_sync = datetime.now()
                kaggle_data.sync_status = 'success'
            
            db.commit()
            
        except Exception as e:
            print(f"Sync failed for student {student.id}: {str(e)}")
            lc_data.sync_status = 'failed' if lc_data else None
            db.commit()


@app.task
def recalculate_all_scores():
    """
    Run daily: recalculate all student scores and detect anomalies
    """
    
    students = db.query(Students).all()
    semester = get_current_semester()
    
    for student in students:
        # Recalculate score
        overall_score = calculate_overall_score(student.id, semester)
        
        # Detect anomalies
        flags = detect_anomalies(student.id, semester)
        
        # Award achievements
        achievements = award_achievements(student.id, semester)
        
        # Update score history
        record = ScoreHistory(
            student_id=student.id,
            semester=semester,
            week_number=get_current_week(semester),
            timestamp=datetime.now(),
            total_score=overall_score
        )
        db.add(record)
    
    db.commit()


# Schedule jobs
schedule.every(6).hours.do(sync_all_platform_data.apply_async)
schedule.every().day.at("02:00").do(recalculate_all_scores.apply_async)

def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(60)
```

---

## Implementation Checklist

- [ ] Create database schema
- [ ] Implement core calculation functions
- [ ] Integrate APIs (LeetCode, Codeforces, Kaggle)
- [ ] Build backend API endpoints
- [ ] Create background sync worker
- [ ] Build frontend dashboard (React/Vue)
- [ ] Implement instructor interface
- [ ] Add achievement/badge system
- [ ] Set up fraud detection
- [ ] Create verification workflow
- [ ] Write comprehensive tests
- [ ] Deploy to production
- [ ] Monitor and iterate

---

## Estimated Timeline

| Phase | Tasks | Timeline |
|-------|-------|----------|
| 1 | Database + Core calculations | 1 week |
| 2 | API integrations + Backend | 1 week |
| 3 | Frontend dashboard | 1.5 weeks |
| 4 | Verification + Anti-gaming | 1 week |
| 5 | Instructor tools + Badges | 1 week |
| 6 | Testing + Polish + Deploy | 1.5 weeks |
| **Total** | | **8 weeks** |

