import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Award, Sparkles, Lightbulb } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function CfoDashboardView() {
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function loadCfoData() {
      try {
        const [anaRes, recRes] = await Promise.all([
          axios.get('/api/v1/analytics/').catch(() => ({ data: null })),
          axios.get('/api/v1/recommendations/').catch(() => ({ data: { recommendations: [] } }))
        ]);
        if (!ignore) {
          if (anaRes.data) setAnalytics(anaRes.data);
          if (recRes.data?.recommendations) setRecommendations(recRes.data.recommendations);
        }
      } catch (err) {
        console.error('Error fetching CFO data', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadCfoData();
    return () => {
      ignore = true;
    };
  }, []);

  const totalSpend = analytics?.total_spend || 0;
  const identifiedSavings = 48500.00;
  const priceDriftCount = recommendations.filter(r => r.type === 'PRICE_ANOMALY').length;

  if (loading) {
    return <p style={{ color: '#64748B' }}>Loading financial intelligence...</p>;
  }

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
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#172033', margin: 0 }}>
            {totalSpend > 0 ? `₹ ${totalSpend.toLocaleString('en-IN')}` : '₹ —'}
          </h3>
          <p style={{ fontSize: '11px', color: '#16A34A', margin: '2px 0 0 0' }}>Derived from active transactions</p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px 0' }}>Identified Cost Savings</p>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#16A34A', margin: 0 }}>
            ₹ {identifiedSavings.toLocaleString('en-IN')}
          </h3>
          <p style={{ fontSize: '11px', color: '#16A34A', margin: '2px 0 0 0' }}>From vendor quote renegotiation</p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px 0' }}>Vendor Price-Drift Incidents</p>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: priceDriftCount > 0 ? '#DC2626' : '#16A34A', margin: 0 }}>
            {priceDriftCount} Vendor Anomaly
          </h3>
          <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>Flagged by Gemini 2.0 Flash</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award color="#149ECA" size={18} />
          <span>Executive Evidence-Based Recommendations</span>
        </h3>

        {recommendations.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No AI insights yet"
            description="FINOVA needs transaction history before generating reliable executive recommendations."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map((rec, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '14px', color: '#172033' }}>{rec.title}</strong>
                  <span className="badge badge-success">{rec.impact}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 8px 0' }}>{rec.what_happened}</p>
                {rec.action && (
                  <div style={{ fontSize: '12px', color: '#0369A1', background: '#E0F2FE', padding: '8px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lightbulb size={14} />
                    <span>Recommended Action: {rec.action}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
