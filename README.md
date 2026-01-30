# Near Miss Data Analysis Dashboard

An interactive dashboard for visualizing construction near-miss and incident data from a JSON dataset (~7,800 records).

## Features

- **Data loading**: Loads JSON from `public/near_miss_data.json` (copied from `db.dashboard_incidents (1).json` on build/dev).
- **Robust handling**: Handles missing or empty fields; they appear as "Unknown / Unspecified" in charts.
- **Visualizations** (7 charts):
  1. **Monthly trend** – Line chart of incidents over time (by month).
  2. **By primary category** – Horizontal bar chart of incident categories.
  3. **Severity distribution** – Donut chart (Low / Medium / High / Critical).
  4. **By region** – Bar chart of incidents by region.
  5. **By action cause** – Bar chart of action/cause types.
  6. **Year-over-year** – Bar chart of total incidents per year.
  7. **Condition vs behavior** – Pie chart of Unsafe Condition vs Behavior types.

## Setup

### Prerequisites

- Node.js 18+ and npm.

### Steps

1. **Clone or download** the repository.

2. **Place the dataset** in the project root:
   - File name: `db.dashboard_incidents (1).json`
   - The app copies it to `public/near_miss_data.json` when you run `npm run dev` or `npm run build`.

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```
   Open the URL shown (e.g. http://localhost:3000).

5. **Optional – copy data only** (e.g. if the JSON is updated):
   ```bash
   npm run prepare-data
   ```

### Build for production

```bash
npm run build
npm run preview
```

### Troubleshooting

- **Data not loading**: Ensure `db.dashboard_incidents (1).json` is in the project root, then run `npm run prepare-data` and restart the app.
- **Dev server fails (e.g. EPERM on Windows)**: Try running the terminal as Administrator, or use `npm run build` then `npm run preview` to serve the built app.

## Tech stack

- **Frontend**: React 18, Vite 5
- **Charts**: Recharts
- **Data**: JSON (no backend; static file in `public/`)

## Assumptions and limitations

- **Data format**: Expects an array of objects with fields such as `incident_date`, `primary_category`, `severity_level`, `region`, `action_cause`, `behavior_type`, `year`, `month`, etc. Other fields are ignored; missing fields are treated as "Unknown / Unspecified".
- **Severity**: `severity_level` is mapped as 1 = Low, 2 = Medium, 3 = High, 4 = Critical.
- **Performance**: All processing is done in the browser after loading the full JSON; suitable for ~7,800 records. For much larger datasets, consider server-side aggregation or pagination.
- **Run locally**: The app is designed to run locally (e.g. `npm run dev` or `npm run preview` after build). No live backend or database is required.

## Repository structure

```
├── public/
│   └── near_miss_data.json   (generated from db.dashboard_incidents (1).json)
├── scripts/
│   ├── copyData.js           (copies JSON to public)
│   └── generateSampleData.js (optional sample data generator)
├── src/
│   ├── App.jsx, App.css
│   ├── main.jsx, index.css
│   └── utils/
│       └── dataProcessor.js
├── db.dashboard_incidents (1).json  (your dataset – place in root)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## License

MIT.
