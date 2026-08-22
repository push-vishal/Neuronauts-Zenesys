import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LogIn, UserPlus, LogOut, ShieldCheck, AlertCircle, X, CheckCircle, Building, Save } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, user, orgDetails, onUpdateOrg, onAuthSuccess }) {
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [orgForm, setOrgForm] = useState({
    name: orgDetails?.name || 'Neuronauts Global Enterprise',
    industry: orgDetails?.industry || 'Software & AI Technology',
    size: orgDetails?.size || '51-200 employees',
    taxId: orgDetails?.taxId || 'GST-9921408',
    currency: orgDetails?.currency || 'INR (₹)'
  });

  if (!isOpen) return null;

  const handleSaveOrg = (e) => {
    e.preventDefault();
    onUpdateOrg(orgForm);
    setMessage('Organization profile updated successfully!');
    setTimeout(() => { setMessage(null); onClose(); }, 1000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (signUpErr) throw signUpErr;
        if (data?.session) {
          setMessage('Account created and signed in successfully!');
          if (data?.user) onAuthSuccess(data.user);
          setTimeout(onClose, 1000);
        } else if (data?.user) {
          setMessage('Registration successful! Please check your email inbox to confirm registration.');
          onAuthSuccess(data.user);
        }
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
        setMessage('Successfully signed in!');
        if (data?.user) onAuthSuccess(data.user);
        setTimeout(onClose, 800);
      }
    } catch (err) {
      console.error('Supabase Auth Exception:', err);
      let errMsg = err.message || 'Authentication failed';
      if (errMsg.includes('Invalid login credentials')) {
        errMsg = 'Invalid email or password. Click "Need an account? Sign Up" below if registering.';
      } else if (errMsg.includes('Email not confirmed')) {
        errMsg = 'Your email is not confirmed yet. Please check your email inbox for the confirmation link.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try { await supabase.auth.signOut(); } catch (err) { console.error(err); }
    onAuthSuccess(null);
    setMessage('Signed out successfully.');
    setLoading(false);
    setTimeout(onClose, 600);
  };

  const inputStyle = { width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', color: '#172033', fontSize: '13px' };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(23, 32, 51, 0.4)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', position: 'relative' }}>
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveSubTab('organization')}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: 'none', background: activeSubTab === 'organization' ? '#E0F2FE' : 'transparent', color: activeSubTab === 'organization' ? '#149ECA' : '#64748B', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Building size={16} />
            <span>Organization Profile</span>
          </button>
          <button
            onClick={() => setActiveSubTab('account')}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: 'none', background: activeSubTab === 'account' ? '#E0F2FE' : 'transparent', color: activeSubTab === 'account' ? '#149ECA' : '#64748B', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <ShieldCheck size={16} />
            <span>User Account</span>
          </button>
        </div>

        {activeSubTab === 'organization' ? (
          <form onSubmit={handleSaveOrg} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#172033', margin: 0 }}>Edit Organization Profile</h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Configure company identity, industry sector, and financial defaults</p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Organization Name</label>
              <input type="text" required value={orgForm.name} onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Industry Sector</label>
                <select value={orgForm.industry} onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })} style={inputStyle}>
                  <option value="Software & AI Technology">Software & AI Technology</option>
                  <option value="Manufacturing & Supply Chain">Manufacturing & Supply Chain</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                  <option value="Construction & Engineering">Construction & Engineering</option>
                  <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                  <option value="Financial & Legal Services">Financial & Legal Services</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Company Size</label>
                <select value={orgForm.size} onChange={(e) => setOrgForm({ ...orgForm, size: e.target.value })} style={inputStyle}>
                  <option value="1-50 employees">1-50 employees</option>
                  <option value="51-200 employees">51-200 employees</option>
                  <option value="201-1000 employees">201-1000 employees</option>
                  <option value="1000+ Enterprise">1000+ Enterprise</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Tax / GST ID</label>
                <input type="text" value={orgForm.taxId} onChange={(e) => setOrgForm({ ...orgForm, taxId: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Default Currency</label>
                <select value={orgForm.currency} onChange={(e) => setOrgForm({ ...orgForm, currency: e.target.value })} style={inputStyle}>
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
              </div>
            </div>

            {message && (
              <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', padding: '10px', borderRadius: '6px', color: '#16A34A', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
              <Save size={16} />
              <span>Save Organization Settings</span>
            </button>
          </form>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#172033', margin: 0 }}>
                {user ? 'User Account' : isSignUp ? 'Create FINOVA Account' : 'Sign In to FINOVA'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                {user ? `Signed in as ${user.email}` : 'Access secure procurement & cloud intelligence'}
              </p>
            </div>

            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#172033' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748B' }}>User ID</p>
                  <code style={{ fontSize: '12px', color: '#149ECA' }}>{user.id}</code>
                </div>
                <button onClick={handleSignOut} disabled={loading} className="btn-primary" style={{ background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="user@organization.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Password</label>
                  <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="•••••••• (Min 6 chars)" />
                </div>

                {error && (
                  <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '10px', borderRadius: '6px', color: '#DC2626', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{error}</span>
                  </div>
                )}

                {message && (
                  <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', padding: '10px', borderRadius: '6px', color: '#16A34A', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={16} />
                    <span>{message}</span>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
                  {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
                  <span>{loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                  <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }} style={{ background: 'transparent', border: 'none', color: '#149ECA', fontSize: '12px', cursor: 'pointer' }}>
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
