-- =====================================================
-- MIGRATIONS FOR CATEGORIES AND FLOATING SKILLS
-- =====================================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create floating_skills table for right banner
CREATE TABLE IF NOT EXISTS floating_skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon_url TEXT NOT NULL,
    alt_text VARCHAR(200),
    position_top VARCHAR(20), -- e.g., "30%", "15%"
    position_left VARCHAR(20), -- e.g., "10%", "20%"
    position_bottom VARCHAR(20), -- e.g., "15%", "45%"
    position_right VARCHAR(20), -- e.g., "15%"
    width VARCHAR(20) DEFAULT "80px",
    height VARCHAR(20) DEFAULT "80px",
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create banner_images table for right banner background and person images
CREATE TABLE IF NOT EXISTS banner_images (
    id SERIAL PRIMARY KEY,
    image_type VARCHAR(50) NOT NULL, -- 'background' or 'person'
    image_url TEXT NOT NULL,
    alt_text VARCHAR(200),
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(200) NOT NULL,
    field_of_study VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    gpa VARCHAR(20),
    location VARCHAR(200),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description, display_order) VALUES
('Web App', 'Web applications and websites', 1),
('Mobile App', 'Mobile applications', 2),
('API', 'REST APIs and backend services', 3),
('Dashboard', 'Analytics and admin dashboards', 4),
('Laravel', 'Laravel PHP framework projects', 5),
('React', 'React.js applications', 6),
('Node.js', 'Node.js backend applications', 7),
('Vue.js', 'Vue.js applications', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert default floating skills
INSERT INTO floating_skills (name, icon_url, alt_text, position_top, position_left, width, height, display_order) VALUES
('React', 'https://cdn-icons-png.flaticon.com/128/10826/10826338.png', 'React', '30%', '10%', '80px', '80px', 1),
('Laravel', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnhoVwuJmtF1Lu4t9WcsZ7fESV9KdIQ7pVHw&s', 'Laravel', NULL, '20%', '80px', '80px', 2),
('JavaScript', 'https://cdn-icons-png.flaticon.com/128/5968/5968292.png', 'JavaScript', NULL, NULL, '80px', '80px', 3)
ON CONFLICT DO NOTHING;

-- Update floating skills with proper positioning
UPDATE floating_skills SET position_bottom = '15%' WHERE name = 'Laravel';
UPDATE floating_skills SET position_bottom = '45%', position_right = '15%' WHERE name = 'JavaScript';

-- Insert default banner images
INSERT INTO banner_images (image_type, image_url, alt_text, is_default, is_active) VALUES
('background', 'https://miller.bslthemes.com/courtney-demo/light/img/person/bg-1.jpg', 'Background image', true, true),
('person', 'https://static.vecteezy.com/system/resources/thumbnails/045/592/915/small_2x/black-businessman-with-crossed-arms-on-transparent-background-png.png', 'Person image', true, true)
ON CONFLICT DO NOTHING;

-- Insert education section visibility
INSERT INTO section_visibility (section_name, is_visible, display_order, description) VALUES
('education_section', true, 6, 'Education timeline section')
ON CONFLICT (section_name) DO NOTHING;

-- Insert default education data
INSERT INTO education (institution, degree, field_of_study, start_date, end_date, is_current, description, gpa, location, display_order, is_active) VALUES
('University of Technology', 'Bachelor of Science', 'Computer Science', '2018-09-01', '2022-06-01', false, 'Focused on software engineering, algorithms, and data structures. Completed capstone project on web application development.', '3.8/4.0', 'Toronto, Canada', 1, true),
('Tech Institute', 'Master of Science', 'Software Engineering', '2022-09-01', '2024-05-01', false, 'Advanced studies in software architecture, machine learning, and distributed systems. Thesis on scalable web applications.', '3.9/4.0', 'Toronto, Canada', 2, true)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_floating_skills_display_order ON floating_skills(display_order);
CREATE INDEX IF NOT EXISTS idx_floating_skills_is_active ON floating_skills(is_active);
CREATE INDEX IF NOT EXISTS idx_banner_images_type ON banner_images(image_type);
CREATE INDEX IF NOT EXISTS idx_banner_images_is_active ON banner_images(is_active);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON education(display_order);
CREATE INDEX IF NOT EXISTS idx_education_is_active ON education(is_active);
