// scripts/migrateToSupabase.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Load JSON files
const cpuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/top100/cpu.json'), 'utf8'));
const gpuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/top100/video-card.json'), 'utf8'));
const motherboardData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/top100/motherboard.json'), 'utf8'));
const memoryData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/top100/memory.json'), 'utf8'));
const storageData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/top100/internal-hard-drive.json'), 'utf8'));
const psuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/top100/power-supply.json'), 'utf8'));
const caseData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/top100/case.json'), 'utf8'));
const coolerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/top100/cpu-cooler.json'), 'utf8'));

async function migrateParts() {
    const categories = [
        { name: 'cpu', data: cpuData },
        { name: 'cpu-cooler', data: coolerData },
        { name: 'motherboard', data: motherboardData },
        { name: 'memory', data: memoryData },
        { name: 'storage', data: storageData },
        { name: 'video-card', data: gpuData },
        { name: 'case', data: caseData },
        { name: 'powersupply', data: psuData }
    ];

    console.log('Starting migration to Supabase...\n');

    for (const category of categories) {
        console.log(`\n Migrating ${category.name}...`);
        let successCount = 0;
        let errorCount = 0;

        for (const part of category.data) {
            // Skip parts without ASIN (matching frontend filter)
            if (!part.asin || part.asin.trim() === '') {
                continue;
            }

            try {
                // Construct name for cases (which use manufacturer + partNumber)
                const partName = part.name || `${part.manufacturer} ${part.partNumber}`;

                // Insert part
                const { data: partData, error: partError } = await supabase
                    .from('parts')
                    .insert({
                        category: category.name,
                        name: partName,
                        manufacturer: part.manufacturer || partName?.split(' ')[0],
                        asin: part.asin,
                        specs: part // Store all specs as JSONB
                    })
                    .select()
                    .single();

                if (partError) {
                    console.error(`  Error inserting ${part.name}:`, partError.message);
                    errorCount++;
                    continue;
                }

                // Insert current price
                if (part.price && part.asin) {
                    const { error: priceError } = await supabase.from('current_prices').insert({
                        part_id: partData.id,
                        retailer: 'Amazon',
                        price: part.price,
                        availability: 'In Stock',
                        product_url: `https://www.amazon.com/dp/${part.asin}`
                    });

                    if (priceError) {
                        console.error(`  Error inserting price for ${part.name}:`, priceError.message);
                    }
                }

                successCount++;
            } catch (err) {
                console.error(`  Unexpected error with ${part.name}:`, err.message);
                errorCount++;
            }
        }

        console.log(`  ${successCount} parts migrated, ${errorCount} errors`);
    }

    console.log('\n Migration complete!');
}

migrateParts();