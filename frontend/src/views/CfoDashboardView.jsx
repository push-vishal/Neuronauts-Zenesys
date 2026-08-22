import { Shield, Award, Sparkles } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function CfoDashboardView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Shield size={24} color="#149ECA" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#172033', margin: 0 }}>CFO Financial Intelligence Dashboard</h3>
        </div>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          Executive-level visibility into procurement anomalies, vendor price shifts, and measurable cost-saving evidence.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px 0' }}>YTD Organization Spend</p>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#172033', margin: 0 }}>₹ —</h3>
          <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>No transaction data yet</p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px 0' }}>Identified Cost Savings</p>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#16A34A', margin: 0 }}>₹ —</h3>
          <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>No savings calculated yet</p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px 0' }}>Vendor Price-Drift Incidents</p>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#DC2626', margin: 0 }}>0 Vendors</h3>
          <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>Not enough data to evaluate</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award color="#149ECA" size={18} />
          <span>Executive Evidence-Based Recommendations</span>
        </h3>

        <EmptyState
          icon={Sparkles}
          title="No AI insights yet"
          description="FINOVA needs transaction history before generating reliable executive recommendations and cost-saving evidence."
        />
      </div>
    </div>
  );
}
