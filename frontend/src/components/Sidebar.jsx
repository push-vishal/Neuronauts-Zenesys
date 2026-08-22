import { 
  LayoutDashboard, Users, FolderKanban, ShoppingCart, 
  FileText, DollarSign, CreditCard, Receipt, LineChart, 
  Sparkles, Award, Building, Settings, ChevronLeft, ChevronRight, Activity
} from 'lucide-react';

export default function Sidebar({ isCollapsed, onToggleCollapse, activeNav, onSelectNav }) {
  const navGroups = [
    {
      group: null,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'WORKSPACE',
      items: [
        { id: 'vendors', label: 'Vendors', icon: Users },
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'expenses', label: 'Expenses', icon: DollarSign },
        { id: 'reimbursements', label: 'Reimbursements', icon: Receipt },
        { id: 'payments', label: 'Payments', icon: CreditCard },
      ]
    },
    {
      group: 'INSIGHTS',
      items: [
        { id: 'analytics', label: 'Analytics', icon: LineChart },
        { id: 'ai_insights', label: 'AI Insights', icon: Sparkles },
        { id: 'recommendations', label: 'Recommendations', icon: Award },
      ]
    },
    {
      group: 'SETTINGS',
      items: [
        { id: 'organization', label: 'Organization', icon: Building },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div style={{ background: '#149ECA', padding: '6px', borderRadius: '6px', color: '#FFFFFF', flexShrink: 0 }}>
          <Activity size={18} />
        </div>
        {!isCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <h1 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#172033', margin: 0 }}>FINOVA</h1>
            <p style={{ fontSize: '10px', color: '#64748B', margin: 0 }}>by Neuronauts</p>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {navGroups.map((grp, idx) => (
          <div key={idx}>
            {grp.group && !isCollapsed && (
              <div className="sidebar-group-title">{grp.group}</div>
            )}
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav(item.id)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle Footer */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(148, 163, 184, 0.15)', display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-end' }}>
        <button
          onClick={onToggleCollapse}
          style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
