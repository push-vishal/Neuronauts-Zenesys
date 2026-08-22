import { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Lightbulb } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function RecommendationsView() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function loadRecs() {
      try {
        const res = await axios.get('/api/v1/recommendations/');
        if (!ignore && res.data?.recommendations) {
          setRecommendations(res.data.recommendations);
        }
      } catch (err) {
        console.error('Error fetching recommendations', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadRecs();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          Evidence-based actionable procurement recommendations derived from verified organizational purchase history.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#64748B' }}>Loading AI recommendations...</p>
      ) : recommendations.length === 0 ? (
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
                  <span className={`badge ${rec.type === 'AUDIT_RISK' ? 'badge-danger' : rec.type === 'BUDGET_OVERRUN' ? 'badge-danger' : 'badge-warning'}`} style={{ marginBottom: '6px' }}>
                    {rec.type || 'Insight'}
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#172033', margin: 0 }}>{rec.title}</h3>
                </div>
                <span className="badge badge-success" style={{ fontSize: '12px' }}>{rec.impact}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '14px 0', background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px 0' }}>What Happened</p>
                  <p style={{ fontSize: '13px', color: '#172033', margin: 0, lineHeight: '1.5' }}>{rec.what_happened}</p>
                </div>

                <div>
                  <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px 0' }}>Why It Matters</p>
                  <p style={{ fontSize: '13px', color: '#172033', margin: 0, lineHeight: '1.5' }}>{rec.why_it_matters}</p>
                </div>
              </div>

              {rec.action && (
                <div style={{ background: '#E0F2FE', padding: '10px 14px', borderRadius: '6px', border: '1px solid #7DD3FC', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Lightbulb size={16} color="#149ECA" />
                  <span style={{ fontSize: '13px', color: '#0369A1', fontWeight: 600 }}>Action: {rec.action}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
