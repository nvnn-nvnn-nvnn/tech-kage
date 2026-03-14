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

// Load the new relevantParts.json
const relevantParts = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../public/top100/relevantParts.json'), 'utf8')
);

// Create a lookup map by ASIN for fast matching
const relevantPartsMap = new Map();
relevantParts.forEach(part => {
    if (part.asin) {
        relevantPartsMap.set(part.asin, part);
    }
});

console.log(`Loaded ${relevantPartsMap.size} parts from relevantParts.json`);

// Determine category from breadCrumbs
function getCategoryFromBreadCrumbs(breadCrumbs) {
    if (!breadCrumbs) return null;
    
    const lower = breadCrumbs.toLowerCase();
    
    if (lower.includes('cpu processor')) return 'cpu';
    if (lower.includes('cpu cooling') || lower.includes('water cooling')) return 'cpu-cooler';
    if (lower.includes('motherboard')) return 'motherboard';
    if (lower.includes('memory')) return 'memory';
    if (lower.includes('internal components') && lower.includes('ssd') || lower.includes('hard drive')) return 'storage';
    if (lower.includes('graphics card')) return 'video-card';
    if (lower.includes('power suppl')) return 'powersupply';
    if (lower.includes('computer case')) return 'case';
    
    return null;
}

async function mergePartsData() {
    // Fetch all existing parts from Supabase
    const { data: existingParts, error } = await supabase
        .from('parts')
        .select('*');

    if (error) {
        console.error('Error fetching parts:', error);
        return;
    }

    console.log(`Fetched ${existingParts.length} existing parts from database`);

    let updatedCount = 0;
    let newCount = 0;
    const updates = [];
    const inserts = [];

    // Process existing parts - update with new data if ASIN matches
    for (const existingPart of existingParts) {
        const relevantData = relevantPartsMap.get(existingPart.asin);
        
        if (relevantData) {
            // Merge: keep existing specs, add/update new fields
            const mergedPart = {
                ...existingPart,
                // New fields from relevantParts.json
                thumbnail_image: relevantData.thumbnailImage || existingPart.thumbnail_image,
                amazon_url: relevantData.url || existingPart.amazon_url,
                description: relevantData.description || existingPart.description,
                reviews_count: relevantData.reviewsCount || existingPart.reviews_count,
                brand: relevantData.brand?.replace('Visit the ', '').replace(' Store', '') || existingPart.brand,
                // Update price if available
                price: relevantData['price.value'] || existingPart.price,
            };

            updates.push(mergedPart);
            updatedCount++;
            
            // Remove from map so we know which are truly new
            relevantPartsMap.delete(existingPart.asin);
        }
    }

    // Check remaining relevantParts that weren't matched - these are NEW parts
    for (const [asin, part] of relevantPartsMap) {
        const category = getCategoryFromBreadCrumbs(part.breadCrumbs);
        
        if (category) {
            const newPart = {
                asin: part.asin,
                name: part.title,
                category: category,
                price: part['price.value'] || 0,
                thumbnail_image: part.thumbnailImage,
                amazon_url: part.url,
                description: part.description,
                reviews_count: part.reviewsCount,
                brand: part.brand?.replace('Visit the ', '').replace(' Store', ''),
                // Specs will be empty - can be filled later
                specs: {}
            };
            
            inserts.push(newPart);
            newCount++;
        }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Parts to UPDATE (existing + new data): ${updatedCount}`);
    console.log(`Parts to INSERT (completely new): ${newCount}`);

    // Preview some updates
    console.log(`\n=== Sample Updates ===`);
    updates.slice(0, 3).forEach(p => {
        console.log(`- ${p.name}: $${p.price}, image: ${p.thumbnail_image ? 'YES' : 'NO'}`);
    });

    // Preview some inserts
    if (inserts.length > 0) {
        console.log(`\n=== Sample Inserts ===`);
        inserts.slice(0, 3).forEach(p => {
            console.log(`- [${p.category}] ${p.name}: $${p.price}`);
        });
    }

    // Ask for confirmation before applying
    console.log(`\n⚠️  Run with --apply flag to actually update the database`);
    
    if (process.argv.includes('--apply')) {
        console.log('\nApplying updates to database...');
        
        // Update existing parts
        for (const part of updates) {
            const { error: updateError } = await supabase
                .from('parts')
                .update({
                    thumbnail_image: part.thumbnail_image,
                    amazon_url: part.amazon_url,
                    description: part.description,
                    reviews_count: part.reviews_count,
                    brand: part.brand,
                    price: part.price,
                })
                .eq('asin', part.asin);

            if (updateError) {
                console.error(`Error updating ${part.asin}:`, updateError.message);
            }
        }
        
        console.log(`✓ Updated ${updates.length} parts`);

        // Insert new parts
        if (inserts.length > 0) {
            const { error: insertError } = await supabase
                .from('parts')
                .insert(inserts);

            if (insertError) {
                console.error('Error inserting new parts:', insertError.message);
            } else {
                console.log(`✓ Inserted ${inserts.length} new parts`);
            }
        }

        console.log('\n✅ Database update complete!');
    }
}

mergePartsData();
