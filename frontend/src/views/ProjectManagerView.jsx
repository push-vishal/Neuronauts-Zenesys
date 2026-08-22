import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, AlertTriangle, DollarSign } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function ProjectManagerView() {
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectCosts();
  }, []);

  const fetchProjectCosts = async () => {
    try {
      const res = await axios.get('/api/v1/projects/');
      setProjectsData(res.data);
    } catch (err) {
      console.error('Failed to fetch project costs', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ color: '#64748B' }}>Loading project cost intelligence...</p>;

  const projects = projectsData?.projects || [];
  const totalBudget = projectsData?.total_budget || 0;
  const totalSpend = projectsData?.total_spend || 0;
  const overbudgetCount = projectsData?.overbudget_projects_count || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px 0' }}>Total Projects Budget</p>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#172033', margin: 0 }}>
            {totalBudget > 0 ? `₹ ${totalBudget.toLocaleString('en-IN')}` : '₹ —'}
          </h3>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px 0' }}>Total Actual Spend</p>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#149ECA', margin: 0 }}>
            {totalSpend > 0 ? `₹ ${totalSpend.toLocaleString('en-IN')}` : '₹ —'}
          </h3>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px 0' }}>Overbudget Alerts</p>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: overbudgetCount > 0 ? '#DC2626' : '#172033', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{overbudgetCount} Project(s)</span>
            {overbudgetCount > 0 && <AlertTriangle size={20} color="#DC2626" />}
          </h3>
        </div>
      </div>

      {/* Project Breakdown */}
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#172033', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 color="#D97706" size={18} />
          <span>Project Cost & Budget Tracking</span>
        </h3>

        {projects.length === 0 ? (
          <EmptyState title="No projects yet" description="Create a project to start tracking budget and costs." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map((proj, idx) => {
              const budget = proj.budget_amount || 0;
              const spend = proj.actual_spend || 0;
              const percentage = budget > 0 ? Math.min(Math.round((spend / budget) * 100), 100) : 0;
              const isOverbudget = spend > budget;

              return (
                <div key={idx} style={{ background: '#F8FAFC', border: `1px solid ${isOverbudget ? '#FCA5A5' : '#E2E8F0'}`, padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#149ECA', fontFamily: 'monospace', fontWeight: 600 }}>{proj.project_code}</span>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#172033', margin: 0 }}>{proj.project_name}</h4>
                    </div>
                    <span className={`badge ${isOverbudget ? 'badge-danger' : 'badge-success'}`}>
                      {isOverbudget ? 'OVERBUDGET' : `ON TRACK (${percentage}%)`}
                    </span>
                  </div>

                  <div style={{ background: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden', margin: '8px 0' }}>
                    <div style={{ height: '100%', width: `${percentage}%`, background: isOverbudget ? '#DC2626' : '#149ECA', borderRadius: '4px' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B' }}>
                    <span>Actual Spend: <strong style={{ color: '#172033' }}>₹ {spend.toLocaleString('en-IN')}</strong></span>
                    <span>Budget: <strong style={{ color: '#172033' }}>₹ {budget.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
