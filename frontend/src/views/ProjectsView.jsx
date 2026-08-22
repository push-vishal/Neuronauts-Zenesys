import { useState, useEffect } from 'react';
import axios from 'axios';
import { FolderKanban, Eye } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function ProjectsView() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/v1/projects/');
        if (!ignore) {
          setProjects(res.data.projects || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProjects();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          Track project budget allocations and actual costs derived from transaction records.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#64748B' }}>Loading projects...</p>
      ) : projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" description="Create a project to start tracking budget and costs." />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Budget</th>
                <th>Actual Cost</th>
                <th>Remaining</th>
                <th>Utilization</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => {
                const budget = p.budget_amount || 0;
                const actual = p.actual_spend || 0;
                const remaining = budget - actual;
                const utilPct = budget > 0 ? Math.round((actual / budget) * 100) : 0;
                const isOver = actual > budget;

                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#172033' }}>
                      {p.project_name} <span style={{ fontSize: '11px', color: '#149ECA', fontFamily: 'monospace' }}>({p.project_code})</span>
                    </td>
                    <td>₹ {budget.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 600, color: isOver ? '#DC2626' : '#172033' }}>₹ {actual.toLocaleString('en-IN')}</td>
                    <td style={{ color: remaining < 0 ? '#DC2626' : '#16A34A' }}>
                      ₹ {remaining.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: '#E2E8F0', height: '6px', width: '80px', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(utilPct, 100)}%`, height: '100%', background: isOver ? '#DC2626' : '#149ECA' }} />
                        </div>
                        <span style={{ fontSize: '12px' }}>{utilPct}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${isOver ? 'badge-danger' : 'badge-success'}`}>
                        {isOver ? 'OVERBUDGET' : 'ON TRACK'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => setSelectedProject(p)} style={{ background: 'transparent', border: 'none', color: '#149ECA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Detail Drawer */}
      {selectedProject && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(23, 32, 51, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end', zIndex: 100 }}>
          <div style={{ width: '440px', background: '#FFFFFF', borderLeft: '1px solid #E2E8F0', height: '100%', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', margin: 0 }}>Project Details</h3>
              <button onClick={() => setSelectedProject(null)} className="btn-secondary" style={{ padding: '4px 8px' }}>Close</button>
            </div>
            <div className="card" style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#149ECA', fontFamily: 'monospace', fontWeight: 600 }}>{selectedProject.project_code}</span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', margin: '4px 0 12px 0' }}>{selectedProject.project_name}</h4>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 4px 0' }}>Budget: <strong style={{ color: '#172033' }}>₹ {(selectedProject.budget_amount || 0).toLocaleString('en-IN')}</strong></p>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Actual Spend: <strong style={{ color: '#172033' }}>₹ {(selectedProject.actual_spend || 0).toLocaleString('en-IN')}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
