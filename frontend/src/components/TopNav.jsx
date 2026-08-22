import { Search, Bell, Building, ChevronRight } from 'lucide-react';

export default function TopNav({ activeNav, orgName, onOpenOrgModal, searchQuery, onSearchChange }) {
  const getNavTitle = (nav) => {
    const titles = {
      dashboard: 'Dashboard',
      vendors: 'Vendors',
      projects: 'Projects',
      procurement: 'Procurement',
      invoices: 'Invoices',
      expenses: 'Expenses',
      reimbursements: 'Reimbursements',
      payments: 'Payments',
      analytics: 'Analytics',
      ai_insights: 'AI Insights',
      recommendations: 'Recommendations',
      organization: 'Organization Profile',
      settings: 'Settings'
    };
    return titles[nav] || 'Dashboard';
  };

  return (
    <header className="top-nav">
      {/* Page Title & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500 }}>FINOVA</span>
        <ChevronRight size={14} color="#6B7280" />
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          {getNavTitle(activeNav)}
        </h2>
      </div>

      {/* Center Search Bar */}
      <div className="search-input-wrapper">
        <Search size={16} color="#9CA3AF" />
        <input
          type="text"
          placeholder="Search invoices, vendors, POs..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>

      {/* Right User & Org Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Notification Bell */}
        <button
          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(148, 163, 184, 0.15)', padding: '8px', borderRadius: '6px', color: '#9CA3AF', cursor: 'pointer', display: 'flex' }}
          title="Notifications"
        >
          <Bell size={16} />
        </button>

        {/* Organization Badge */}
        <button
          onClick={onOpenOrgModal}
          style={{
            background: '#111827',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            padding: '6px 12px',
            borderRadius: '6px',
            color: '#F3F4F6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 500
          }}
        >
          <Building size={14} color="#38BDF8" />
          <span style={{ maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {orgName || 'Neuronauts Global'}
          </span>
        </button>
      </div>
    </header>
  );
}
