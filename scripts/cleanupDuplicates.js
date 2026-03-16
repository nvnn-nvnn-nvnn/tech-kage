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

async function cleanupDuplicates() {
    // Get all parts ordered by asin and created_at
    const { data: allParts, error } = await supabase
        .from('parts')
        .select('id, asin, name')
        .order('asin')
        .order('id', { ascending: true });

    if (error) {
        console.error('Failed to fetch parts:', error.message);
        return;
    }

    console.log(`Total rows in parts table: ${allParts.length}`);

    // Group by ASIN, keep the first (oldest) id, delete the rest
    const seen = {};
    const toDelete = [];

    for (const part of allParts) {
        if (!part.asin) continue;

        if (seen[part.asin]) {
            toDelete.push(part.id);
        } else {
            seen[part.asin] = part.id;
        }
    }

    console.log(`Unique ASINs: ${Object.keys(seen).length}`);
    console.log(`Duplicate rows to delete: ${toDelete.length}`);

    if (toDelete.length === 0) {
        console.log('No duplicates found!');
        return;
    }

    // Delete in batches of 50
    let deleted = 0;
    for (let i = 0; i < toDelete.length; i += 50) {
        const batch = toDelete.slice(i, i + 50);
        const { error: delError } = await supabase
            .from('parts')
            .delete()
            .in('id', batch);

        if (delError) {
            console.error(`Failed to delete batch:`, delError.message);
        } else {
            deleted += batch.length;
        }
    }

    console.log(`\n✅ Deleted ${deleted} duplicate rows`);
}

cleanupDuplicates();
