import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Load relevantParts.json
const relevantParts = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../public/top100/relevantParts.json'), 'utf8')
);

async function updatePrices() {
    let updated = 0;
    let failed = 0;

    for (const part of relevantParts) {
        if (!part.asin) continue;

        const updateData = {};
        if (part['price.value']) updateData.price = part['price.value'];
        if (part.thumbnailImage) updateData.thumbnail_image = part.thumbnailImage;

        if (Object.keys(updateData).length === 0) continue;

        const { error } = await supabase
            .from('parts')
            .update(updateData)
            .eq('asin', part.asin);

        if (error) {
            console.error(`Failed ${part.asin}:`, error.message);
            failed++;
        } else {
            updated++;
        }
    }

    console.log(`\n✅ Updated ${updated} parts (price + thumbnail_image)`);
    if (failed > 0) console.log(`❌ Failed: ${failed}`);
}

updatePrices();
