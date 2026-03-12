// scripts/createSavedBuildsTable.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function createSavedBuildsTable() {
    console.log('Creating saved_builds table...\n');

    try {
        // Create the table
        const { error } = await supabase.rpc('exec_sql', {
            sql: `
                -- Create saved_builds table for storing user's PC build configurations
                CREATE TABLE IF NOT EXISTS saved_builds (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                    build_name VARCHAR(255) NOT NULL,
                    description TEXT,
                    parts JSONB NOT NULL,
                    total_price DECIMAL(10, 2),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );

                -- Create index for faster user queries
                CREATE INDEX IF NOT EXISTS idx_saved_builds_user_id ON saved_builds(user_id);
                CREATE INDEX IF NOT EXISTS idx_saved_builds_created_at ON saved_builds(created_at DESC);

                -- Enable RLS (Row Level Security)
                ALTER TABLE saved_builds ENABLE ROW LEVEL SECURITY;

                -- Drop existing policies if they exist
                DROP POLICY IF EXISTS "Users can view own builds" ON saved_builds;
                DROP POLICY IF EXISTS "Users can insert own builds" ON saved_builds;
                DROP POLICY IF EXISTS "Users can update own builds" ON saved_builds;
                DROP POLICY IF EXISTS "Users can delete own builds" ON saved_builds;

                -- Policy: Users can only view their own builds
                CREATE POLICY "Users can view own builds" ON saved_builds
                    FOR SELECT
                    USING (auth.uid() = user_id);

                -- Policy: Users can insert their own builds
                CREATE POLICY "Users can insert own builds" ON saved_builds
                    FOR INSERT
                    WITH CHECK (auth.uid() = user_id);

                -- Policy: Users can update their own builds
                CREATE POLICY "Users can update own builds" ON saved_builds
                    FOR UPDATE
                    USING (auth.uid() = user_id);

                -- Policy: Users can delete their own builds
                CREATE POLICY "Users can delete own builds" ON saved_builds
                    FOR DELETE
                    USING (auth.uid() = user_id);
            `
        });

        if (error) {
            console.error('Error creating table:', error);
            console.log('\nNote: If exec_sql function does not exist, please run the SQL manually in Supabase SQL Editor.');
            process.exit(1);
        }

        console.log('✓ saved_builds table created successfully!');
    } catch (err) {
        console.error('Unexpected error:', err.message);
        console.log('\nPlease run the SQL migration manually in Supabase SQL Editor:');
        console.log('File: backend/migrations/create_saved_builds.sql');
    }
}

createSavedBuildsTable();
