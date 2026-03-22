import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Category mapping: BuildCores -> Tech Kage
const CATEGORY_MAP = {
  'CPU': 'cpu',
  'GPU': 'video-card',
  'Motherboard': 'motherboard',
  'RAM': 'memory',
  'Storage': 'storage',
  'PSU': 'powersupply',
  'PCCase': 'case',
  'CPUCooler': 'cpu-cooler',
  'OS': 'os'
};

// Path to BuildCores repo
const BUILDCORES_PATH = path.join(__dirname, '../buildcores-open-db/open-db');

async function importCategory(buildCoresCategory, techKageCategory) {
  console.log(`\n📦 Importing ${buildCoresCategory} -> ${techKageCategory}...`);

  const categoryPath = path.join(BUILDCORES_PATH, buildCoresCategory);

  if (!fs.existsSync(categoryPath)) {
    console.log(`⚠️  Category folder not found: ${categoryPath}`);
    return;
  }

  const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} parts`);

  let imported = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const filePath = path.join(categoryPath, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const part = JSON.parse(rawData);

      // Transform BuildCores data to Tech Kage format
      const transformedPart = transformPart(part, techKageCategory);

      // Upsert to Supabase
      const { error } = await supabase
        .from('buildcores_parts')
        .upsert(transformedPart, { onConflict: 'buildcores_id' });

      if (error) {
        console.error(`❌ Error importing ${file}:`, error.message);
        errors++;
      } else {
        imported++;
        if (imported % 50 === 0) {
          console.log(`   ✓ Imported ${imported}/${files.length}...`);
        }
      }
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message);
      errors++;
    }
  }

  console.log(`✅ Imported ${imported} parts, ${errors} errors`);
}

function transformPart(part, category) {
  // Extract common fields
  const name = part.metadata?.name || 'Unknown';
  const buildcoresId = part.opendb_id;

  // Extract retailer SKUs
  const amazonSku = part.general_product_information?.amazon_sku || null;
  const neweggSku = part.general_product_information?.newegg_sku || null;
  const manufacturerUrl = part.general_product_information?.manufacturer_url || null;

  // Build specs object based on category
  let specs = {};

  if (category === 'cpu') {
    specs = {
      cores: part.cores?.total || null,
      threads: part.cores?.threads || null,
      base_clock: part.clocks?.performance?.base || null,
      boost_clock: part.clocks?.performance?.boost || null,
      socket: part.socket || null,
      tdp: part.specifications?.tdp || null,
      integrated_graphics: part.specifications?.integratedGraphics?.model || null,
      l1_cache: part.cache?.l1 || null,
      l2_cache: part.cache?.l2 || null,
      l3_cache: part.cache?.l3 || null,
      microarchitecture: part.microarchitecture || null,
      core_family: part.coreFamily || null,
      lithography: part.specifications?.lithography || null,
      memory_types: part.specifications?.memory?.types || [],
      ecc_support: part.specifications?.eccSupport || false,
      includes_cooler: part.specifications?.includesCooler || false
    };
  } else if (category === 'video-card') {
    specs = {
      chipset: part.chipset || null,
      memory: part.memory?.size || null,
      memory_type: part.memory?.type || null,
      core_clock: part.clocks?.core?.base || null,
      boost_clock: part.clocks?.core?.boost || null,
      tdp: part.specifications?.tdp || null,
      length: part.dimensions?.length || null,
      outputs: part.outputs || []
    };
  } else if (category === 'motherboard') {
    specs = {
      socket: part.socket || null,
      form_factor: part.formFactor || null,
      chipset: part.chipset || null,
      memory_max: part.memory?.max || null,
      memory_slots: part.memory?.slots || null,
      memory_type: part.memory?.type || null,
      pcie_slots: part.expansionSlots || [],
      m2_slots: part.m2Slots || [],
      sata_ports: part.sataPorts || null,
      usb_ports: part.usbPorts || []
    };
  } else if (category === 'memory') {
    specs = {
      capacity_gb: part.capacity || null,
      speed: part.speed || null,
      memory_type: part.type || null,
      cas_latency: part.casLatency || null,
      voltage: part.voltage || null,
      modules: part.modules || null,
      timings: part.timings || null
    };
  } else if (category === 'storage') {
    specs = {
      capacity_gb: part.capacity || null,
      type: part.type || null,
      interface: part.interface || null,
      form_factor: part.formFactor || null,
      cache: part.cache || null,
      read_speed: part.speeds?.read || null,
      write_speed: part.speeds?.write || null
    };
  } else if (category === 'powersupply') {
    specs = {
      wattage: part.wattage || null,
      efficiency_rating: part.efficiencyRating || null,
      modular: part.modular || null,
      form_factor: part.formFactor || null
    };
  } else if (category === 'case') {
    specs = {
      form_factor: part.formFactor || null,
      type: part.type || null,
      color: part.color || null,
      side_panel: part.sidePanel || null,
      external_bays: part.externalBays || null
    };
  } else if (category === 'cpu-cooler') {
    specs = {
      fan_rpm: part.fanRPM || null,
      noise_level: part.noiseLevel || null,
      cooling_type: part.type || null,
      radiator_size: part.radiatorSize || null,
      height: part.dimensions?.height || null
    };
  }

  return {
    buildcores_id: buildcoresId,
    name: name,
    category: category,
    specs: specs,
    manufacturer: part.metadata?.manufacturer || null,
    series: part.metadata?.series || part.series || null,
    variant: part.metadata?.variant || null,
    part_numbers: part.metadata?.part_numbers || [],
    amazon_sku: amazonSku,
    newegg_sku: neweggSku,
    manufacturer_url: manufacturerUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function createTable() {
  console.log('📋 Creating buildcores_parts table...');

  // Note: Run this SQL in Supabase dashboard first:
  console.log(`
  CREATE TABLE IF NOT EXISTS buildcores_parts (
    id BIGSERIAL PRIMARY KEY,
    buildcores_id UUID UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    specs JSONB,
    manufacturer TEXT,
    series TEXT,
    variant TEXT,
    part_numbers TEXT[],
    amazon_sku TEXT,
    newegg_sku TEXT,
    manufacturer_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_buildcores_category ON buildcores_parts(category);
  CREATE INDEX IF NOT EXISTS idx_buildcores_name ON buildcores_parts(name);
  CREATE INDEX IF NOT EXISTS idx_buildcores_manufacturer ON buildcores_parts(manufacturer);
  `);
}

async function main() {
  console.log('🚀 BuildCores Import Script\n');

  await createTable();

  console.log('\n⚠️  Make sure you created the table in Supabase first!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  // Import categories one by one
  for (const [buildCoresCategory, techKageCategory] of Object.entries(CATEGORY_MAP)) {
    await importCategory(buildCoresCategory, techKageCategory);
  }

  console.log('\n✅ Import complete!');
}

main().catch(console.error);
