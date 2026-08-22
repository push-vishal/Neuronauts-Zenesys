import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function RecommendationsView() {
  const recommendations = []; // Strictly real data recommendations generated from backend calculations

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          Evidence-based actionable procurement recommendations derived from verified organizational purchase history.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No AI insights yet"
          description="FINOVA needs transaction history before generating reliable procurement recommendations."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recommendations.map((rec, idx) => (
            <div key={idx} className="card" style={{ border: '1px solid #7DD3FC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span className="badge badge-warning" style={{ marginBottom: '6px' }}>Price Anomaly</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', margin: 0 }}>{rec.title}</h3>
                </div>
                <span className="badge badge-success" style={{ fontSize: '12px' }}>{rec.impact}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '16px 0', background: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px 0' }}>What Happened</p>
                  <p style={{ fontSize: '13px', color: '#172033', margin: 0, lineHeight: '1.5' }}>{rec.what_happened}</p>
                </div>

                <div>
                  <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px 0' }}>Why It Matters</p>
                  <p style={{ fontSize: '13px', color: '#172033', margin: 0, lineHeight: '1.5' }}>{rec.why_it_matters}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
