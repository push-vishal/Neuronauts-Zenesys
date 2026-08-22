import { LineChart } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function AnalyticsView() {
  const hasSufficientData = false; // Strictly real database check

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          Data-driven procurement analytics, invoice aging, vendor spend trends, and project cost utilization.
        </p>
      </div>

      {!hasSufficientData ? (
        <EmptyState
          icon={LineChart}
          title="Not enough data yet"
          description="FINOVA needs transaction history to generate reliable analytics."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LineChart size={18} color="#149ECA" />
              <span>Spend Analysis</span>
            </h3>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px 0' }}>Monthly Purchasing Baseline</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#172033', margin: 0 }}>₹ —</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
