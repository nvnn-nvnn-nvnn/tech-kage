import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function getAsins() {
    const { data, error } = await supabase
        .from('parts')
        .select('asin');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const asinList = data.map(item => item.asin).join('\n');
    const filePath = path.join(__dirname, 'asins.txt');

    fs.writeFileSync(filePath, asinList, 'utf8');
    console.log(`✓ Wrote ${data.length} ASINs to asins.txt`);
}

getAsins();

export { getAsins };
