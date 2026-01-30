import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const dest = path.join(publicDir, 'near_miss_data.json');

// Use your dataset only: try both possible filenames
const possibleFiles = [
  'db.dashboard_incidents (1).json',
  'db.dashboard_incidents.json',
];
const src = possibleFiles
  .map((f) => path.join(root, f))
  .find((p) => fs.existsSync(p));

if (src) {
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('Dataset copied to public/near_miss_data.json (your data only, no sample data)');
} else {
  console.warn('No dataset found. Place db.dashboard_incidents.json or db.dashboard_incidents (1).json in project root.');
}
