import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import AuthModal from './components/Auth';

// Views & Pages
import LandingPage from './views/LandingPage';
import DashboardView from './views/DashboardView';
import VendorsView from './views/VendorsView';
import ProjectsView from './views/ProjectsView';
import ProcurementView from './views/ProcurementView';
import InvoicesView from './views/InvoicesView';
import ExpensesView from './views/ExpensesView';
import ReimbursementsView from './views/ReimbursementsView';
import PaymentsView from './views/PaymentsView';
import AnalyticsView from './views/AnalyticsView';
import RecommendationsView from './views/RecommendationsView';

export default function App() {
  // Page mode: 'landing' or 'app'
  const [currentMode, setCurrentMode] = useState('landing');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Organization Profile State
  const [orgDetails, setOrgDetails] = useState(() => {
    const saved = localStorage.getItem('finova_org');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to default
      }
    }
    return {
      name: 'Neuronauts Global Enterprise',
      industry: 'Software & AI Technology',
      size: '51-200 employees',
      taxId: 'GST-9921408',
      currency: 'INR (₹)'
    };
  });

  const handleUpdateOrg = (updated) => {
    setOrgDetails(updated);
    localStorage.setItem('finova_org', JSON.stringify(updated));
  };

  // Supabase Auth State
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setCurrentMode('app');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setCurrentMode('app');
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSelectNav = (navId) => {
    if (navId === 'organization' || navId === 'settings') {
      setIsAuthOpen(true);
    } else {
      setActiveNav(navId);
    }
  };

  // If user is on landing page mode
  if (currentMode === 'landing') {
    return (
      <>
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          user={user}
          orgDetails={orgDetails}
          onUpdateOrg={handleUpdateOrg}
          onAuthSuccess={(u) => {
            setUser(u);
            setIsAuthOpen(false);
            setCurrentMode('app');
          }}
        />
        <LandingPage
          onNavigateToApp={() => setCurrentMode('app')}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Auth & Organization Edit Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        orgDetails={orgDetails}
        onUpdateOrg={handleUpdateOrg}
        onAuthSuccess={(u) => setUser(u)}
      />

      {/* Collapsible Enterprise Light Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
      />

      {/* Main Workspace Layout Area */}
      <div className="main-layout">
        {/* Top Navigation Bar */}
        <TopNav
          activeNav={activeNav}
          orgName={orgDetails.name}
          onOpenOrgModal={() => setIsAuthOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={(val) => setSearchQuery(val)}
        />

        {/* Content Area */}
        <main className="content-area">
          {activeNav === 'dashboard' && <DashboardView onNavigate={(nav) => setActiveNav(nav)} />}
          {activeNav === 'vendors' && <VendorsView />}
          {activeNav === 'projects' && <ProjectsView />}
          {activeNav === 'procurement' && <ProcurementView />}
          {activeNav === 'invoices' && <InvoicesView />}
          {activeNav === 'expenses' && <ExpensesView />}
          {activeNav === 'reimbursements' && <ReimbursementsView />}
          {activeNav === 'payments' && <PaymentsView />}
          {activeNav === 'analytics' && <AnalyticsView />}
          {activeNav === 'ai_insights' && <RecommendationsView />}
          {activeNav === 'recommendations' && <RecommendationsView />}
        </main>
      </div>
    </div>
  );
}