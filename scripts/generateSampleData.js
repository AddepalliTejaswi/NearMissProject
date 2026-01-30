/**
 * Generates sample Near Miss JSON dataset (~7,800 records) for dashboard testing.
 * Run: npm run generate-data
 * Output: public/near_miss_data.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CATEGORIES = [
  'Slip and Trip',
  'Fall from Height',
  'Struck By',
  'Caught In/Between',
  'Electrical Hazard',
  'Vehicle Incident',
  'Falling Objects',
  'Hazardous Material',
  'Fire/Explosion',
  'Other',
];

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

const LOCATIONS = [
  'Site A - North Block',
  'Site A - South Block',
  'Site B - Warehouse',
  'Site B - Office',
  'Site C - Foundation',
  'Site C - Structural',
  'Site D - MEP',
  'Site E - General',
];

const DEPARTMENTS = [
  'Civil',
  'Electrical',
  'Mechanical',
  'Safety',
  'Logistics',
  'Administration',
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function generateRecords(count) {
  const records = [];
  for (let i = 1; i <= count; i++) {
    const date = randomDate(2022, 2024);
    records.push({
      id: i,
      date: formatDate(date),
      dateReported: formatDate(new Date(date.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000)),
      category: randomChoice(CATEGORIES),
      severity: randomChoice(SEVERITIES),
      location: randomChoice(LOCATIONS),
      department: randomChoice(DEPARTMENTS),
      description: `Near miss incident #${i}`,
      reportedBy: `Reporter_${Math.floor(Math.random() * 200) + 1}`,
    });
  }
  return records;
}

const OUT_DIR = path.join(__dirname, '..', 'public');
const OUT_FILE = path.join(OUT_DIR, 'near_miss_data.json');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const records = generateRecords(7800);
fs.writeFileSync(OUT_FILE, JSON.stringify(records, null, 0), 'utf8');
console.log(`Generated ${records.length} records at ${OUT_FILE}`);
