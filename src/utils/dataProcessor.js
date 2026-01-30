/**
 * Data processing for Near Miss / Incident dashboard.
 * Handles missing/empty values and builds aggregates for charts.
 */

const SEVERITY_LABELS = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Critical' };
const UNKNOWN = 'Unknown / Unspecified';

function safeStr(value) {
  if (value == null || value === '') return UNKNOWN;
  const s = String(value).trim();
  return s === '' ? UNKNOWN : s;
}

function safeNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Load and normalize raw records. Returns array of normalized objects.
 * @param {Array} raw - Raw JSON array from API/file
 */
export function normalizeRecords(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r) => r != null && typeof r === 'object')
    .map((r) => ({
      id: safeStr(r.id || r.incident_number),
      incident_date: safeNum(r.incident_date),
      year: safeNum(r.year),
      month: safeNum(r.month),
      primary_category: safeStr(r.primary_category),
      action_cause: safeStr(r.action_cause),
      severity_level: safeNum(r.severity_level, 1),
      severity_label: SEVERITY_LABELS[Math.min(4, Math.max(1, safeNum(r.severity_level, 1)))] || 'Low',
      region: safeStr(r.region),
      location: safeStr(r.location),
      job: safeStr(r.job),
      gbu: safeStr(r.gbu),
      behavior_type: safeStr(r.behavior_type),
      unsafe_condition_or_behavior: safeStr(r.unsafe_condition_or_behavior),
    }));
}

/**
 * Aggregate by key field for bar/pie charts. Returns [{ name, value }, ...]
 */
export function aggregateBy(records, fieldName, limit = 15) {
  const counts = {};
  records.forEach((r) => {
    const key = r[fieldName] ?? UNKNOWN;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/**
 * Monthly trend: [{ month, year, yearMonth, count }, ...] sorted by time
 */
export function monthlyTrend(records) {
  const byMonth = {};
  records.forEach((r) => {
    const key = `${r.year}-${String(r.month).padStart(2, '0')}`;
    if (r.year && r.month) {
      byMonth[key] = (byMonth[key] || 0) + 1;
    }
  });
  return Object.entries(byMonth)
    .map(([yearMonth, count]) => {
      const [y, m] = yearMonth.split('-');
      return {
        yearMonth,
        year: parseInt(y, 10),
        month: parseInt(m, 10),
        count,
        label: `${y}-${m}`,
      };
    })
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}

/**
 * Severity distribution for donut/pie
 */
export function severityDistribution(records) {
  const bySeverity = {};
  records.forEach((r) => {
    const label = r.severity_label || SEVERITY_LABELS[r.severity_level] || UNKNOWN;
    bySeverity[label] = (bySeverity[label] || 0) + 1;
  });
  return Object.entries(bySeverity).map(([name, value]) => ({ name, value }));
}

/**
 * Year-over-year counts for trend line
 */
export function yearlyTrend(records) {
  const byYear = {};
  records.forEach((r) => {
    if (r.year) {
      byYear[r.year] = (byYear[r.year] || 0) + 1;
    }
  });
  return Object.entries(byYear)
    .map(([year, count]) => ({ year: String(year), count }))
    .sort((a, b) => a.year.localeCompare(b.year));
}
