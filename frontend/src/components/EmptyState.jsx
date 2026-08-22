import { Inbox, Plus } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = "No data yet", 
  description = "No transaction data available in database.", 
  actionLabel, 
  onAction 
}) {
  return (
    <div style={{
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      padding: '48px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        background: '#E0F2FE',
        border: '1px solid #7DD3FC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#149ECA',
      }}>
        <Icon size={24} />
      </div>
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', margin: '0 0 4px 0' }}>{title}</h3>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, maxWidth: '360px' }}>{description}</p>
      </div>

      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary" style={{ marginTop: '8px' }}>
          <Plus size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
