-- =====================================================
-- PORTFOLIO WEBSITE DATABASE SCHEMA
-- Comprehensive database for John Doe's portfolio website
-- =====================================================

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS project_technologies CASCADE;
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS experience CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS language_skills CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS section_visibility CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;

-- =====================================================
-- USER PROFILE TABLE
-- =====================================================
CREATE TABLE user_profile (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT,
    signature_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'text', -- text, boolean, number, json
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION VISIBILITY TABLE
-- =====================================================
CREATE TABLE section_visibility (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL UNIQUE,
    is_visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SOCIAL LINKS TABLE
-- =====================================================
CREATE TABLE social_links (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL UNIQUE,
    url TEXT NOT NULL,
    icon_class VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SERVICES TABLE
-- =====================================================
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LANGUAGE SKILLS TABLE
-- =====================================================
CREATE TABLE language_skills (
    id SERIAL PRIMARY KEY,
    language VARCHAR(100) NOT NULL UNIQUE,
    proficiency_percentage INTEGER NOT NULL CHECK (proficiency_percentage >= 0 AND proficiency_percentage <= 100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SKILLS TABLE
-- =====================================================
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_url TEXT,
    skill_type VARCHAR(50) DEFAULT 'technical', -- technical, tool, framework, etc.
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- EXPERIENCE TABLE
-- =====================================================
CREATE TABLE experience (
    id SERIAL PRIMARY KEY,
    position VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    client_avatar_url TEXT,
    review_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    detailed_description TEXT,
    client_name VARCHAR(200),
    project_date DATE,
    github_url TEXT,
    live_url TEXT,
    featured_image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROJECT IMAGES TABLE
-- =====================================================
CREATE TABLE project_images (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(200),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROJECT TECHNOLOGIES TABLE
-- =====================================================
CREATE TABLE project_technologies (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    technology_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, technology_name)
);

-- =====================================================
-- CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INSERT DEMO DATA
-- =====================================================

-- Insert User Profile
INSERT INTO user_profile (first_name, last_name, title, location, bio, avatar_url, signature_image_url) VALUES
('John', 'Doe', 'Software Engineer', 'Toronto', 'I am a passionate and dedicated software engineer with expertise in JavaScript, PHP Laravel, and modern web technologies. I thrive on building scalable applications and solving complex technical challenges. With a strong foundation in full-stack development and a problem-solving mindset, I deliver robust solutions that drive business growth. Let''s collaborate to bring your digital ideas to life!', 'https://imgproxy.attic.sh/insecure/f:webp/q:90/w:1920/plain/https://attic.sh/w2wnxqdd1eyw3kw01bzg2u2arva1', '/images/sign.png');

-- Insert Social Links (from Navigation and Frame components)
INSERT INTO social_links (platform, url, icon_class, display_order) VALUES
('GitHub', 'https://github.com', 'fab fa-github', 1),
('LinkedIn', 'https://linkedin.com', 'fab fa-linkedin', 2),
('Twitter', 'https://twitter.com', 'fab fa-twitter', 3),
('Behance', '#', 'fab fa-behance', 4),
('Dribbble', '#', 'fab fa-dribbble', 5);

-- Insert Services
INSERT INTO services (title, description, icon_url, link_url, display_order) VALUES
('Full-Stack Development', 'Build robust web applications with modern JavaScript frameworks and PHP Laravel backend solutions', '/images/1.svg', '/service', 1),
('API Development', 'Create scalable REST APIs and microservices using Laravel and modern backend technologies.', '/images/2.svg', '/service', 2),
('Database Design', 'Design and optimize database schemas with MySQL, MongoDB, and other modern database solutions.', '/images/3.svg', '/service', 3);

-- Insert Language Skills
INSERT INTO language_skills (language, proficiency_percentage, display_order) VALUES
('English', 95, 1),
('French', 85, 2),
('Spanish', 60, 3),
('German', 40, 4);

-- Insert Technical Skills
INSERT INTO skills (name, icon_url, skill_type, display_order) VALUES
-- Frontend Technologies
('HTML5', 'https://cdn-icons-png.flaticon.com/128/3291/3291670.png', 'frontend', 1),
('CSS3', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Official_CSS_Logo.svg/2048px-Official_CSS_Logo.svg.png', 'frontend', 2),
('SASS', 'https://cdn-icons-png.flaticon.com/128/5968/5968358.png', 'frontend', 3),
('Bootstrap', 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png', 'frontend', 4),
('Tailwind', 'https://www.cdnlogo.com/logos/t/58/tailwindcss.svg', 'frontend', 5),
-- JavaScript & Frameworks
('JavaScript', 'https://cdn-icons-png.flaticon.com/128/5968/5968292.png', 'language', 6),
('TypeScript', 'https://cdn-icons-png.flaticon.com/128/5968/5968381.png', 'language', 7),
('Node.js', 'https://cdn-icons-png.flaticon.com/128/5968/5968322.png', 'backend', 8),
('jQuery', 'https://cdn.iconscout.com/icon/free/png-256/free-jquery-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-4-pack-logos-icons-3028907.png', 'frontend', 9),
('React', 'https://cdn-icons-png.flaticon.com/128/10826/10826338.png', 'framework', 10),
('Next.js', 'https://www.datocms-assets.com/98835/1684410508-image-7.png', 'framework', 11),
('Astro', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5KhCojo9MAD9u7-vbHjYYFzD69By9d-PWcw&s', 'framework', 12),
('React Native', 'https://cdn-icons-png.flaticon.com/128/3459/3459528.png', 'framework', 13),
-- Backend Technologies
('PHP', 'https://cdn-icons-png.flaticon.com/128/919/919830.png', 'language', 14),
('Laravel', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnhoVwuJmtF1Lu4t9WcsZ7fESV9KdIQ7pVHw&s', 'framework', 15),
('Java', 'https://cdn-icons-png.flaticon.com/128/3291/3291669.png', 'language', 16),
('C++', 'https://cdn-icons-png.flaticon.com/128/6132/6132222.png', 'language', 17),
('C#', 'https://cdn-icons-png.flaticon.com/128/6132/6132221.png', 'language', 18),
-- Databases
('MongoDB', 'https://cdn.prod.website-files.com/6640cd28f51f13175e577c05/664e00a400e23f104ed2b6cd_3b3dd6e8-8a73-5879-84a9-a42d5b910c74.svg', 'database', 19),
('MySQL', 'https://cdn-icons-png.flaticon.com/128/9543/9543826.png', 'database', 20),
-- Tools & Software
('MS Office', 'https://cdn-icons-png.flaticon.com/128/888/888867.png', 'tool', 21),
('Webflow', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0bNFRNPDWOMqO7zuWEUNlktjE0eU-5q-UlQ&s', 'tool', 22),
('VS Code', 'https://cdn3d.iconscout.com/3d/free/thumb/free-visual-studio-code-3d-icon-download-in-png-blend-fbx-gltf-file-formats--microsoft-logo-python-java-c-coding-lang-pack-logos-icons-7578027.png', 'tool', 23),
('CLI', 'https://cdn-icons-png.flaticon.com/128/11895/11895137.png', 'tool', 24),
('Git', 'https://cdn-icons-png.flaticon.com/128/15466/15466163.png', 'tool', 25),
('NPM', 'https://cdn-icons-png.flaticon.com/128/15484/15484297.png', 'tool', 26),
-- Design Tools
('CorelDRAW', 'https://cdn-icons-png.flaticon.com/128/16064/16064387.png', 'design', 27),
('Adobe CC', 'https://cdn-icons-png.flaticon.com/128/5436/5436970.png', 'design', 28),
('Figma', 'https://cdn-icons-png.flaticon.com/128/5968/5968705.png', 'design', 29),
('Canva', 'https://freepnglogo.com/images/all_img/1691829322canva-app-logo-png.png', 'design', 30);

-- Insert Experience
INSERT INTO experience (position, company, start_date, end_date, is_current, description, display_order) VALUES
('Senior Full-Stack Developer', 'Tech Solutions Inc.', '2022-01-01', NULL, true, 'Led development of scalable web applications using React, Node.js, and Laravel. Managed a team of 4 developers and implemented CI/CD pipelines. Built REST APIs and microservices handling 100k+ daily requests.', 1),
('Full-Stack Developer', 'Digital Innovation Labs', '2020-01-01', '2021-12-31', false, 'Developed full-stack web applications using JavaScript, PHP Laravel, and modern frameworks. Built responsive frontends with React and Vue.js, and designed database schemas with MySQL and MongoDB. Worked on projects ranging from e-commerce platforms to healthcare applications.', 2),
('Junior Software Developer', 'StartupHub Technologies', '2019-01-01', '2019-12-31', false, 'Assisted in developing web applications using JavaScript, PHP, and Laravel framework. Participated in code reviews and learned best practices for software development. Contributed to the development of reusable components and API integrations.', 3),
('Software Development Intern', 'Web Solutions Ltd.', '2018-01-01', '2018-12-31', false, 'Assisted in developing web applications and maintaining existing codebases. Gained experience in HTML, CSS, JavaScript, and PHP. Developed foundational skills in version control with Git and collaborative development practices.', 4);

-- Insert Reviews
INSERT INTO reviews (client_name, company, client_avatar_url, review_text, rating, display_order) VALUES
('Paul Trueman', 'TechCorp Solutions', '/images/1.jpg', 'Working with John Doe as our full-stack developer was an absolute pleasure. His technical expertise and problem-solving approach brought our complex application to life. The scalable architecture he built exceeded our expectations, and our users love the performance. Highly recommended!', 5, 1),
('Olivia Oldman', 'DataFlow Systems', '/images/2.jpg', 'I had the opportunity to collaborate with John, and I must say he is incredibly talented. His ability to understand our technical requirements and translate them into robust code was impressive. John''s Laravel APIs were efficient, and enhanced our application performance significantly. I look forward to working with him again!', 5, 2),
('Oscar Newman', 'CloudTech Ventures', '/images/3.jpg', 'John Doe is an exceptional software engineer. He has a deep understanding of modern technologies and knows how to build scalable applications. John''s React and Laravel expertise greatly improved our platform''s performance, and we couldn''t be happier with the results. Highly skilled and reliable!', 5, 3);

-- Insert Projects
INSERT INTO projects (title, category, description, detailed_description, client_name, project_date, github_url, featured_image_url, display_order) VALUES
('E-Commerce Platform', 'Web App', 'A comprehensive e-commerce platform built with React.js frontend and Laravel backend', 'A comprehensive e-commerce platform built with React.js frontend and Laravel backend, featuring real-time inventory management, secure payment processing, and advanced analytics dashboard. The platform handles over 10,000 daily transactions with 99.9% uptime.', 'TechCorp Solutions', '2023-03-01', 'https://github.com/johndoe', '/images/1.jpg', 1),
('REST API Service', 'API', 'Scalable REST API service for enterprise applications', 'Built a robust REST API service using Laravel that handles high-volume requests with advanced caching and rate limiting. Features include JWT authentication, comprehensive logging, and automated testing.', 'DataFlow Systems', '2023-01-15', 'https://github.com/johndoe', '/images/2.jpg', 2),
('React Native App', 'Mobile App', 'Cross-platform mobile application for task management', 'Developed a React Native application with real-time synchronization, offline capabilities, and push notifications. Features include user authentication, data visualization, and seamless cross-platform experience.', 'CloudTech Ventures', '2022-11-20', 'https://github.com/johndoe', '/images/3.jpg', 3),
('Analytics Dashboard', 'Dashboard', 'Real-time analytics dashboard with data visualization', 'Created an interactive dashboard using React and D3.js for real-time data visualization. Features include custom charts, export functionality, and role-based access control.', 'TechCorp Solutions', '2022-09-10', 'https://github.com/johndoe', '/images/4.jpg', 4),
('CRM System', 'Laravel', 'Customer relationship management system with automation', 'Built a comprehensive CRM system using Laravel with features like lead management, automated workflows, email campaigns, and detailed reporting. Integrated with third-party services for enhanced functionality.', 'StartupHub Technologies', '2022-06-15', 'https://github.com/johndoe', '/images/5.jpg', 5),
('Social Media App', 'React', 'Modern social media platform with real-time features', 'Developed a social media application using React and Node.js with real-time messaging, content sharing, and user interactions. Features include image uploads, comments, likes, and user profiles.', 'Digital Innovation Labs', '2022-04-01', 'https://github.com/johndoe', '/images/6.jpg', 6),
('Real-time Chat', 'Node.js', 'WebSocket-based real-time chat application', 'Built a real-time chat application using Node.js and Socket.io with features like private messaging, group chats, file sharing, and message encryption. Supports multiple rooms and user management.', 'Web Solutions Ltd.', '2022-01-20', 'https://github.com/johndoe', '/images/7.jpg', 7),
('Task Management', 'Vue.js', 'Collaborative task management and project tracking tool', 'Created a Vue.js application for task management with drag-and-drop functionality, team collaboration features, time tracking, and project analytics. Includes role-based permissions and notification system.', 'StartupHub Technologies', '2021-10-15', 'https://github.com/johndoe', '/images/8.jpg', 8);

-- Insert Project Images
INSERT INTO project_images (project_id, image_url, alt_text, display_order) VALUES
-- E-Commerce Platform Images
(1, '/images/1.jpg', 'E-Commerce Platform Main View', 1),
(1, '/images/2.jpg', 'E-Commerce Platform Product View', 2),
(1, '/images/3.jpg', 'E-Commerce Platform Checkout', 3),
(1, '/images/1_1.jpg', 'E-Commerce Platform Admin Dashboard', 4),
(1, '/images/2_1.jpg', 'E-Commerce Platform Analytics', 5),
(1, '/images/3_1.jpg', 'E-Commerce Platform Mobile View', 6),
-- REST API Service Images
(2, '/images/2.jpg', 'REST API Documentation', 1),
(2, '/images/3.jpg', 'API Testing Interface', 2),
(2, '/images/4.jpg', 'API Performance Metrics', 3),
-- React Native App Images
(3, '/images/3.jpg', 'Mobile App Home Screen', 1),
(3, '/images/4.jpg', 'Mobile App Task View', 2),
(3, '/images/5.jpg', 'Mobile App Settings', 3),
-- Analytics Dashboard Images
(4, '/images/4.jpg', 'Dashboard Overview', 1),
(4, '/images/5.jpg', 'Analytics Charts', 2),
(4, '/images/6.jpg', 'Data Export Options', 3),
-- CRM System Images
(5, '/images/5.jpg', 'CRM Dashboard', 1),
(5, '/images/6.jpg', 'Lead Management', 2),
(5, '/images/7.jpg', 'Customer Profiles', 3),
-- Social Media App Images
(6, '/images/6.jpg', 'Social Media Feed', 1),
(6, '/images/7.jpg', 'User Profile', 2),
(6, '/images/8.jpg', 'Messaging Interface', 3),
-- Real-time Chat Images
(7, '/images/7.jpg', 'Chat Interface', 1),
(7, '/images/8.jpg', 'Group Chat', 2),
(7, '/images/1.jpg', 'File Sharing', 3),
-- Task Management Images
(8, '/images/8.jpg', 'Task Board', 1),
(8, '/images/1.jpg', 'Project Timeline', 2),
(8, '/images/2.jpg', 'Team Collaboration', 3);

-- Insert Project Technologies
INSERT INTO project_technologies (project_id, technology_name) VALUES
-- E-Commerce Platform Technologies
(1, 'React.js'),
(1, 'Laravel'),
(1, 'MySQL'),
(1, 'Stripe'),
(1, 'WebSockets'),
(1, 'Redis'),
(1, 'Docker'),
(1, 'JWT'),
-- REST API Service Technologies
(2, 'Laravel'),
(2, 'MySQL'),
(2, 'Redis'),
(2, 'JWT'),
(2, 'Postman'),
(2, 'Docker'),
-- React Native App Technologies
(3, 'React Native'),
(3, 'Node.js'),
(3, 'MongoDB'),
(3, 'Socket.io'),
(3, 'Firebase'),
-- Analytics Dashboard Technologies
(4, 'React'),
(4, 'D3.js'),
(4, 'Node.js'),
(4, 'PostgreSQL'),
(4, 'Chart.js'),
-- CRM System Technologies
(5, 'Laravel'),
(5, 'MySQL'),
(5, 'Vue.js'),
(5, 'Bootstrap'),
(5, 'Mailgun'),
-- Social Media App Technologies
(6, 'React'),
(6, 'Node.js'),
(6, 'MongoDB'),
(6, 'Socket.io'),
(6, 'AWS S3'),
-- Real-time Chat Technologies
(7, 'Node.js'),
(7, 'Socket.io'),
(7, 'Express'),
(7, 'MongoDB'),
(7, 'JWT'),
-- Task Management Technologies
(8, 'Vue.js'),
(8, 'Laravel'),
(8, 'MySQL'),
(8, 'WebSockets'),
(8, 'Bootstrap');

-- Insert Section Visibility Settings (for admin dashboard toggles - content sections only)
INSERT INTO section_visibility (section_name, is_visible, display_order, description) VALUES
('about_section', true, 1, 'About section with bio and avatar'),
('services_section', true, 2, 'Services offered section'),
('language_skills_section', true, 3, 'Language proficiency section'),
('hard_skills_section', true, 4, 'Technical skills section'),
('experience_section', true, 5, 'Work experience timeline'),
('reviews_section', true, 6, 'Client testimonials section'),
('projects_section', true, 7, 'Portfolio projects section'),
('contact_section', true, 8, 'Contact form section');

-- Insert Site Settings (only content-related settings)
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_title', 'John Doe - Software Engineer', 'text', 'Main site title'),
('site_description', 'Professional portfolio of John Doe, a passionate software engineer specializing in JavaScript, PHP Laravel, and modern web technologies.', 'text', 'Site meta description'),
('copyright_text', '© 2023. John Doe. All rights reserved.', 'text', 'Copyright notice text'),
('author_credit', 'Nazar Miller', 'text', 'Template author credit'),
('author_url', 'https://themeforest.net/user/millerdigitaldesign/portfolio', 'text', 'Template author URL'),
('contact_email', 'contact@johndoe.com', 'text', 'Default contact email'),
('contact_phone', '+1 (555) 123-4567', 'text', 'Contact phone number'),
('logo_text', 'J', 'text', 'Logo text/initial');

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- User Profile Indexes
CREATE INDEX idx_user_profile_updated_at ON user_profile(updated_at);

-- Site Settings Indexes
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_site_settings_type ON site_settings(setting_type);

-- Section Visibility Indexes
CREATE INDEX idx_section_visibility_name ON section_visibility(section_name);
CREATE INDEX idx_section_visibility_visible ON section_visibility(is_visible);
CREATE INDEX idx_section_visibility_order ON section_visibility(display_order);

-- Social Links Indexes
CREATE INDEX idx_social_links_platform ON social_links(platform);
CREATE INDEX idx_social_links_display_order ON social_links(display_order);
CREATE INDEX idx_social_links_active ON social_links(is_active);

-- Services Indexes
CREATE INDEX idx_services_display_order ON services(display_order);
CREATE INDEX idx_services_active ON services(is_active);

-- Language Skills Indexes
CREATE INDEX idx_language_skills_language ON language_skills(language);
CREATE INDEX idx_language_skills_display_order ON language_skills(display_order);
CREATE INDEX idx_language_skills_active ON language_skills(is_active);

-- Skills Indexes
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_type ON skills(skill_type);
CREATE INDEX idx_skills_display_order ON skills(display_order);
CREATE INDEX idx_skills_active ON skills(is_active);

-- Experience Indexes
CREATE INDEX idx_experience_start_date ON experience(start_date);
CREATE INDEX idx_experience_display_order ON experience(display_order);
CREATE INDEX idx_experience_active ON experience(is_active);
CREATE INDEX idx_experience_current ON experience(is_current);

-- Reviews Indexes
CREATE INDEX idx_reviews_display_order ON reviews(display_order);
CREATE INDEX idx_reviews_active ON reviews(is_active);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Projects Indexes
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_active ON projects(is_active);
CREATE INDEX idx_projects_date ON projects(project_date);

-- Project Images Indexes
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_display_order ON project_images(display_order);
CREATE INDEX idx_project_images_active ON project_images(is_active);

-- Project Technologies Indexes
CREATE INDEX idx_project_technologies_project_id ON project_technologies(project_id);
CREATE INDEX idx_project_technologies_technology ON project_technologies(technology_name);

-- Contact Messages Indexes
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);

-- =====================================================
-- CREATE TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profile_updated_at BEFORE UPDATE ON user_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_section_visibility_updated_at BEFORE UPDATE ON section_visibility FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_language_skills_updated_at BEFORE UPDATE ON language_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active services view
CREATE VIEW active_services AS
SELECT * FROM services WHERE is_active = true ORDER BY display_order;

-- Active skills view
CREATE VIEW active_skills AS
SELECT * FROM skills WHERE is_active = true ORDER BY display_order;

-- Active language skills view
CREATE VIEW active_language_skills AS
SELECT * FROM language_skills WHERE is_active = true ORDER BY display_order;

-- Active experience view
CREATE VIEW active_experience AS
SELECT * FROM experience WHERE is_active = true ORDER BY display_order;

-- Active reviews view
CREATE VIEW active_reviews AS
SELECT * FROM reviews WHERE is_active = true ORDER BY display_order;

-- Active projects view
CREATE VIEW active_projects AS
SELECT * FROM projects WHERE is_active = true ORDER BY display_order;

-- Project details view with images and technologies
CREATE VIEW project_details AS
SELECT 
    p.*,
    array_agg(pi.image_url ORDER BY pi.display_order) as images,
    array_agg(DISTINCT pt.technology_name) as technologies
FROM projects p
LEFT JOIN project_images pi ON p.id = pi.project_id AND pi.is_active = true
LEFT JOIN project_technologies pt ON p.id = pt.project_id
WHERE p.is_active = true
GROUP BY p.id
ORDER BY p.display_order;

-- Visible sections view
CREATE VIEW visible_sections AS
SELECT * FROM section_visibility WHERE is_visible = true ORDER BY display_order;

-- Site settings view (key-value pairs)
CREATE VIEW site_settings_view AS
SELECT setting_key, setting_value, setting_type, description FROM site_settings;

-- =====================================================
-- GRANT PERMISSIONS (Adjust as needed for your setup)
-- =====================================================

-- Example permissions (uncomment and modify as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

-- =====================================================
-- DATABASE SCHEMA COMPLETE
-- =====================================================

-- Summary of tables created:
-- 1. user_profile - Main profile information
-- 2. site_settings - General site settings and configuration
-- 3. section_visibility - Section visibility toggles for admin dashboard
-- 4. social_links - Social media links (including Behance, Dribbble)
-- 5. services - Offered services
-- 6. language_skills - Language proficiency levels
-- 7. skills - Technical skills and tools
-- 8. experience - Work experience timeline
-- 9. reviews - Client testimonials
-- 10. projects - Portfolio projects
-- 11. project_images - Project screenshots/images
-- 12. project_technologies - Technologies used in projects
-- 13. contact_messages - Contact form submissions

-- All demo data from the website has been captured and inserted into the database.
-- The schema supports full CRUD operations and includes proper indexing for performance.
-- Section visibility toggles allow admin dashboard to show/hide sections dynamically.
-- Site settings provide centralized configuration management.
