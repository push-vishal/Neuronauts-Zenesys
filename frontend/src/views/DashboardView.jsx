import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, CreditCard, FolderKanban, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function DashboardView({ onNavigate }) {
  const [projectsData, setProjectsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    let ignore = false;
    const fetchDashboardData = async () => {
      try {
        const [projRes, anaRes, recRes, invRes] = await Promise.all([
          axios.get('/api/v1/projects/').catch(() => ({ data: { projects: [] } })),
          axios.get('/api/v1/analytics/').catch(() => ({ data: null })),
          axios.get('/api/v1/recommendations/').catch(() => ({ data: { recommendations: [] } })),
          axios.get('/api/v1/invoices/').catch(() => ({ data: { invoices: [] } }))
        ]);

        if (!ignore) {
          setProjectsData(projRes.data);
          if (anaRes.data) setAnalyticsData(anaRes.data);
          if (recRes.data?.recommendations) setRecommendations(recRes.data.recommendations);
          if (invRes.data?.invoices) setInvoices(invRes.data.invoices);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardData();
    return () => {
      ignore = true;
    };
  }, []);

  const projects = projectsData?.projects || [];
  const totalSpend = analyticsData?.total_spend || projectsData?.total_spend || 0;
  const totalBudget = analyticsData?.total_budget || projectsData?.total_budget || 0;
  const overbudgetCount = projectsData?.overbudget_projects_count || 0;
  const outstandingPayables = invoices
    .filter(i => (i.payment_status || 'Pending') === 'Pending')
    .reduce((sum, i) => sum + (parseFloat(i.total_amount) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Total Processed Spend</span>
            <DollarSign size={16} color="#149ECA" />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#172033', margin: 0 }}>
            {totalSpend > 0 ? `₹ ${totalSpend.toLocaleString('en-IN')}` : '₹ —'}
          </h3>
          <p style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', margin: 0 }}>
            Derived from live transaction records
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Project Budget</span>
            <FolderKanban size={16} color="#2563EB" />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#172033', margin: 0 }}>
            {totalBudget > 0 ? `₹ ${totalBudget.toLocaleString('en-IN')}` : '₹ —'}
          </h3>
          <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', margin: 0 }}>
            {projects.length > 0 ? `Across ${projects.length} active project(s)` : 'No active projects'}
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Outstanding Payables</span>
            <CreditCard size={16} color="#D97706" />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#D97706', margin: 0 }}>
            ₹ {outstandingPayables.toLocaleString('en-IN')}
          </h3>
          <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', margin: 0 }}>Verified Invoices Awaiting Settlement</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Overbudget Risks</span>
            <AlertCircle size={16} color="#DC2626" />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: overbudgetCount > 0 ? '#DC2626' : '#16A34A', margin: 0 }}>
            {overbudgetCount > 0 ? `${overbudgetCount} Project(s)` : '0 Risks'}
          </h3>
          <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', margin: 0 }}>Pre-commitment enforcement active</p>
        </div>
      </div>

      {/* Main Dashboard Overview Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Project Cost Summary */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', margin: 0 }}>Project Cost Overview</h3>
            <button onClick={() => onNavigate('projects')} style={{ background: 'transparent', border: 'none', color: '#149ECA', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {projects.length === 0 ? (
            <EmptyState title="No projects yet" description="Create a project to start tracking project costs." actionLabel="Create Project" onAction={() => onNavigate('projects')} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map((proj, i) => {
                const utilPct = proj.budget_amount > 0 ? Math.min(Math.round((proj.actual_spend / proj.budget_amount) * 100), 100) : 0;
                const isOver = proj.actual_spend > proj.budget_amount;
                return (
                  <div key={i} style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: '#172033' }}>{proj.project_name}</span>
                      <span className={`badge ${isOver ? 'badge-danger' : 'badge-success'}`}>{utilPct}% Utilized</span>
                    </div>
                    <div style={{ background: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${utilPct}%`, height: '100%', background: isOver ? '#DC2626' : '#149ECA' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Intelligence Summary */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#149ECA" />
              <span>AI Procurement Intelligence</span>
            </h3>
            <button onClick={() => onNavigate('recommendations')} style={{ background: 'transparent', border: 'none', color: '#149ECA', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {recommendations.length === 0 ? (
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '6px', fontSize: '13px' }}>
              <p style={{ color: '#149ECA', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>AI Intelligence Status</p>
              <p style={{ color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                FINOVA is monitoring transactions. Upload invoices to detect price drift and 3-way match variances.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recommendations.slice(0, 2).map((rec, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '6px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ color: '#172033' }}>{rec.title}</strong>
                    <span className="badge badge-warning">{rec.impact}</span>
                  </div>
                  <p style={{ color: '#64748B', margin: 0, lineHeight: '1.4' }}>{rec.what_happened}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
