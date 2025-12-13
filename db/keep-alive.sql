-- =====================================================
-- KEEP ALIVE TABLE
-- This table is used to keep Supabase database active
-- by performing regular queries
-- =====================================================

CREATE TABLE IF NOT EXISTS keep_alive (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'active',
    last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ping_count INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on last_ping for faster queries
CREATE INDEX IF NOT EXISTS idx_keep_alive_last_ping ON keep_alive(last_ping);

-- Insert initial row
INSERT INTO keep_alive (status, last_ping, ping_count, metadata)
VALUES (
    'active',
    CURRENT_TIMESTAMP,
    1,
    '{"initialized": true, "purpose": "supabase_keep_alive"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Create function to update ping
CREATE OR REPLACE FUNCTION update_keep_alive_ping()
RETURNS void AS $$
BEGIN
    UPDATE keep_alive
    SET 
        last_ping = CURRENT_TIMESTAMP,
        ping_count = ping_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 1;
    
    -- If no row exists, create one
    IF NOT FOUND THEN
        INSERT INTO keep_alive (status, last_ping, ping_count, metadata)
        VALUES (
            'active',
            CURRENT_TIMESTAMP,
            1,
            '{"initialized": true, "purpose": "supabase_keep_alive"}'::jsonb
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON keep_alive TO anon;
GRANT SELECT, INSERT, UPDATE ON keep_alive TO authenticated;
GRANT EXECUTE ON FUNCTION update_keep_alive_ping() TO anon;
GRANT EXECUTE ON FUNCTION update_keep_alive_ping() TO authenticated;

