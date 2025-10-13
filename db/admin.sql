-- =====================================================
-- ADMIN AUTHENTICATION TABLE
-- Simple admin table for portfolio owner authentication
-- =====================================================

-- Drop existing admin table if it exists
DROP TABLE IF EXISTS admin CASCADE;

-- Create admin table
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookup
CREATE INDEX idx_admin_email ON admin(email);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_updated_at 
    BEFORE UPDATE ON admin 
    FOR EACH ROW 
    EXECUTE FUNCTION update_admin_updated_at_column();

-- Insert default admin account (password: admin123)
-- You should change this password after first login
INSERT INTO admin (email, password_hash) VALUES 
('admin@johndoe.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- =====================================================
-- ADMIN TABLE COMPLETE
-- =====================================================
-- 
-- Default admin credentials:
-- Email: admin@johndoe.com
-- Password: admin123
-- 
-- Note: Change the password after first login for security
-- =====================================================
