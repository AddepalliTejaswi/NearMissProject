import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  normalizeRecords,
  aggregateBy,
  monthlyTrend,
  severityDistribution,
  yearlyTrend,
} from './utils/dataProcessor';
import './App.css';

const DATA_URL = '/near_miss_data.json';
const CHART_COLORS = ['#1d9bf0', '#00ba7c', '#ffad1f', '#f4212e', '#7856ff', '#7f57c2', '#0ea5e9', '#14b8a6'];

function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data (${res.status}). Ensure public/near_miss_data.json exists.`);
        return res.json();
      })
      .then((raw) => {
        if (cancelled) return;
        const data = Array.isArray(raw) ? raw : (raw.data != null ? raw.data : []);
        setRecords(normalizeRecords(data));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load dataset');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Near Miss Data Analysis Dashboard</h1>
          <p className="subtitle">Construction incident & near miss analytics</p>
        </header>
        <div className="loading">
          <div className="spinner" />
          <p>Loading dataset…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <h1>Near Miss Data Analysis Dashboard</h1>
        </header>
        <div className="error-box">
          <p><strong>Error:</strong> {error}</p>
          <p>Place <code>db.dashboard_incidents (1).json</code> in the project root and run <code>npm run dev</code> (data is copied to <code>public/near_miss_data.json</code>).</p>
        </div>
      </div>
    );
  }

  const byCategory = aggregateBy(records, 'primary_category', 12);
  const byRegion = aggregateBy(records, 'region', 10);
  const byActionCause = aggregateBy(records, 'action_cause', 10);
  const byBehavior = aggregateBy(records, 'behavior_type', 6);
  const severity = severityDistribution(records);
  const monthly = monthlyTrend(records);
  const yearly = yearlyTrend(records);

  return (
    <div className="app">
      <header className="header">
        <h1>Near Miss Data Analysis Dashboard</h1>
        <p className="subtitle">Construction incident & near miss analytics</p>
        <div className="kpi">
          <span className="kpi-item"><strong>{records.length.toLocaleString()}</strong> total incidents</span>
        </div>
      </header>

      <main className="dashboard">
        <section className="card chart-card full-width">
          <h2>Monthly trend</h2>
          <div className="chart-wrap tall">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthly} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" stroke="#1d9bf0" strokeWidth={2} dot={{ r: 3 }} name="Incidents" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card chart-card">
          <h2>By primary category</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byCategory} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis type="category" dataKey="name" width={140} stroke="var(--text-secondary)" fontSize={11} tick={{ fill: 'var(--text-primary)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="value" fill="#1d9bf0" name="Count" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card chart-card">
          <h2>Severity distribution</h2>
          <div className="chart-wrap pie-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={severity}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {severity.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} formatter={(v) => [v, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card chart-card">
          <h2>By region</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byRegion} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} angle={-35} textAnchor="end" height={70} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="value" fill="#00ba7c" name="Count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card chart-card">
          <h2>By action cause</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byActionCause} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} angle={-40} textAnchor="end" height={80} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="value" fill="#ffad1f" name="Count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card chart-card full-width">
          <h2>Year-over-year</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={yearly} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="count" fill="#7856ff" name="Incidents" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card chart-card">
          <h2>Condition vs behavior</h2>
          <div className="chart-wrap pie-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byBehavior}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {byBehavior.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} formatter={(v) => [v, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Near Miss Dashboard — Data from construction incident records. Missing or empty fields shown as &quot;Unknown / Unspecified&quot;.</p>
      </footer>
    </div>
  );
}

export default App;
