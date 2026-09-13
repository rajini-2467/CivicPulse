CREATE DATABASE IF NOT EXISTS civicpulse;

USE civicpulse;

-- =========================================
-- 1. USERS TABLE
-- =========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    role ENUM('citizen', 'admin', 'department_officer') DEFAULT 'citizen',
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- 2. ISSUE CATEGORIES TABLE
-- =========================================

CREATE TABLE issue_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 3. DEPARTMENTS TABLE
-- =========================================

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 4. ISSUES TABLE
-- =========================================

CREATE TABLE issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_code VARCHAR(30) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    department_id INT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM(
        'reported',
        'under_review',
        'assigned',
        'in_progress',
        'resolved',
        'rejected',
        'closed'
    ) DEFAULT 'reported',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES issue_categories(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
);

-- =========================================
-- 5. ISSUE LOCATIONS TABLE
-- =========================================

CREATE TABLE issue_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE
);

-- =========================================
-- 6. ISSUE STATUS HISTORY TABLE
-- =========================================

CREATE TABLE issue_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by INT,
    remarks TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE,

    FOREIGN KEY (changed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =========================================
-- 7. ISSUE ASSIGNMENTS TABLE
-- =========================================

CREATE TABLE issue_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    department_id INT NOT NULL,
    assigned_by INT,
    assigned_to INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,

    FOREIGN KEY (issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE,

    FOREIGN KEY (assigned_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =========================================
-- 8. ISSUE MEDIA TABLE
-- =========================================

CREATE TABLE issue_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    media_type ENUM('image', 'video', 'document') DEFAULT 'image',
    media_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE
);

-- =========================================
-- 9. AI ANALYSIS TABLE
-- =========================================

CREATE TABLE ai_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    predicted_category VARCHAR(100),
    predicted_priority ENUM('low', 'medium', 'high', 'critical'),
    confidence_score DECIMAL(5, 2),
    duplicate_of INT NULL,
    ai_summary TEXT,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE,

    FOREIGN KEY (duplicate_of)
        REFERENCES issues(id)
        ON DELETE SET NULL
);

-- =========================================
-- 10. VERIFICATIONS TABLE
-- =========================================

CREATE TABLE verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    user_id INT NOT NULL,
    verification_type ENUM('upvote', 'confirm', 'reject') DEFAULT 'confirm',
    comment TEXT,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(issue_id, user_id),

    FOREIGN KEY (issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================
-- 11. USER POINTS TABLE
-- =========================================

CREATE TABLE user_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    total_points INT DEFAULT 0,
    current_level INT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================
-- 12. POINTS TRANSACTIONS TABLE
-- =========================================

CREATE TABLE points_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    issue_id INT NULL,
    points INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (issue_id)
        REFERENCES issues(id)
        ON DELETE SET NULL
);

-- =========================================
-- 13. BADGES TABLE
-- =========================================

CREATE TABLE badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    badge_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    points_required INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 14. USER BADGES TABLE
-- =========================================

CREATE TABLE user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, badge_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (badge_id)
        REFERENCES badges(id)
        ON DELETE CASCADE
);

-- =========================================
-- SAMPLE ISSUE CATEGORIES
-- =========================================

INSERT INTO issue_categories
(category_name, description, icon)
VALUES
('Road Damage', 'Potholes, broken roads and damaged streets', 'road'),
('Streetlight', 'Broken or non-working streetlights', 'lightbulb'),
('Garbage', 'Garbage collection and waste-related problems', 'trash'),
('Water Supply', 'Water leakage and water supply issues', 'droplet'),
('Drainage', 'Blocked drains and drainage problems', 'waves'),
('Public Safety', 'Safety-related civic issues', 'shield'),
('Traffic', 'Traffic signals and traffic-related issues', 'car'),
('Other', 'Other civic problems', 'circle-help');

-- =========================================
-- SAMPLE DEPARTMENTS
-- =========================================

INSERT INTO departments
(department_name, description, contact_email, contact_phone)
VALUES
(
    'Roads and Infrastructure',
    'Handles road damage, potholes and infrastructure problems',
    'roads@civicpulse.com',
    '1800-100-1001'
),
(
    'Electrical Department',
    'Handles streetlights and electrical civic issues',
    'electrical@civicpulse.com',
    '1800-100-1002'
),
(
    'Sanitation Department',
    'Handles garbage collection and waste management',
    'sanitation@civicpulse.com',
    '1800-100-1003'
),
(
    'Water Department',
    'Handles water supply and leakage issues',
    'water@civicpulse.com',
    '1800-100-1004'
),
(
    'Public Safety Department',
    'Handles public safety and emergency-related civic issues',
    'safety@civicpulse.com',
    '1800-100-1005'
);

-- =========================================
-- SAMPLE BADGES
-- =========================================

INSERT INTO badges
(badge_name, description, icon, points_required)
VALUES
(
    'First Report',
    'Awarded for reporting the first civic issue',
    'first-report',
    10
),
(
    'Active Citizen',
    'Awarded for earning 50 points',
    'active-citizen',
    50
),
(
    'Community Hero',
    'Awarded for earning 100 points',
    'community-hero',
    100
),
(
    'Civic Champion',
    'Awarded for earning 250 points',
    'civic-champion',
    250
);

-- =========================================
-- CHECK ALL TABLES
-- =========================================

SHOW TABLES;