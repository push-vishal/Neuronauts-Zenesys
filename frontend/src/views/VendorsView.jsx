import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Search, Eye } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function VendorsView() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Initial real vendor state populated dynamically from backend
  const [vendors, setVendors] = useState([]);
  const [newVendor, setNewVendor] = useState({ name: '', category: 'Hardware & Supplies', email: '' });

  useEffect(() => {
    let ignore = false;
    async function loadVendors() {
      try {
        const res = await axios.get('/api/v1/procurement/vendors');
        if (!ignore && res.data?.vendors) {
          setVendors(res.data.vendors);
        }
      } catch (err) {
        console.error('Error fetching vendors', err);
      }
    }
    loadVendors();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/procurement/vendors', {
        name: newVendor.name,
        category: newVendor.category,
        email: newVendor.email,
        total_spend: 0.0,
        open_invoices: 0
      });
      const saved = res.data?.vendor || {
        id: `v_${Date.now()}`,
        name: newVendor.name,
        category: newVendor.category,
        total_spend: 0.00,
        open_invoices: 0,
        performance: 'Not Evaluated',
        status: 'Active'
      };
      setVendors([saved, ...vendors]);
      setNewVendor({ name: '', category: 'Hardware & Supplies', email: '' });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error creating vendor', err);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || v.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="search-input-wrapper" style={{ width: '260px' }}>
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#172033', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Hardware & Supplies">Hardware & Supplies</option>
            <option value="Software & Cloud Services">Software & Cloud Services</option>
            <option value="Professional Services">Professional Services</option>
          </select>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(23, 32, 51, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', marginBottom: '16px' }}>Add New Vendor</h3>
            <form onSubmit={handleAddVendor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Vendor Name</label>
                <input
                  type="text"
                  required
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' }}
                  placeholder="Enter vendor name"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Category</label>
                <select
                  value={newVendor.category}
                  onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' }}
                >
                  <option value="Hardware & Supplies">Hardware & Supplies</option>
                  <option value="Software & Cloud Services">Software & Cloud Services</option>
                  <option value="Professional Services">Professional Services</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Vendor Data Table / Empty State */}
      {filteredVendors.length === 0 ? (
        <EmptyState icon={Users} title="No vendors yet" description="Add your first vendor to start managing procurement." actionLabel="Add Vendor" onAction={() => setShowAddModal(true)} />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th>Total Spend</th>
                <th>Open Invoices</th>
                <th>Risk / Performance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600, color: '#172033' }}>{v.name}</td>
                  <td style={{ color: '#64748B' }}>{v.category}</td>
                  <td style={{ fontWeight: 600, color: '#172033' }}>₹ {v.total_spend.toLocaleString('en-IN')}</td>
                  <td>{v.open_invoices}</td>
                  <td>
                    <span className="badge badge-info">{v.performance}</span>
                  </td>
                  <td>
                    <span className="badge badge-success">{v.status}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedVendor(v)}
                      style={{ background: 'transparent', border: 'none', color: '#149ECA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Vendor Detail Drawer */}
      {selectedVendor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(23, 32, 51, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end', zIndex: 100 }}>
          <div style={{ width: '440px', background: '#FFFFFF', borderLeft: '1px solid #E2E8F0', height: '100%', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#172033', margin: 0 }}>Vendor Profile</h3>
              <button onClick={() => setSelectedVendor(null)} className="btn-secondary" style={{ padding: '4px 8px' }}>Close</button>
            </div>
            <div className="card" style={{ marginBottom: '16px' }}>
              <span className="badge badge-info" style={{ marginBottom: '8px' }}>{selectedVendor.category}</span>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#172033', margin: '4px 0 12px 0' }}>{selectedVendor.name}</h4>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 4px 0' }}>Total Spend: <strong style={{ color: '#172033' }}>₹ {selectedVendor.total_spend.toLocaleString('en-IN')}</strong></p>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 4px 0' }}>Open Invoices: <strong style={{ color: '#172033' }}>{selectedVendor.open_invoices}</strong></p>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Performance Rating: <strong style={{ color: '#149ECA' }}>{selectedVendor.performance}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
