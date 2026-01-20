import React, { useState } from 'react';
import { FiDollarSign, FiUsers, FiBarChart2, FiSettings, FiPlus, FiDownload, FiSearch, FiFilter, FiLink, FiCopy, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateAffiliateCode } from './utils/codeGenerator'; // Reusing utility for mocking
import AffiliateForm from './components/AffiliateForm';
import AffiliateBatchAssignment from './components/AffiliateBatchAssignment';
import AffiliateDetails from './components/AffiliateDetails';
import './Affiliates.css';

const Affiliates = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // MOCK DATA - Affiliates
  const [affiliatesList, setAffiliatesList] = useState([
    { id: 101, name: 'John Doe', type: 'Individual', joined: '2024-01-15', referrals: 45, status: 'ACTIVE', email: 'john@example.com', phone: '+91 9876543210', commissionType: 'PERCENT', commissionValue: 15, affiliateCode: 'AFF-JD-001', address: '123 Main St, Mumbai', riskLevel: 'Low', fraudSignals: [] },
    { id: 102, name: 'CodeMasters Institute', type: 'Organization', joined: '2023-11-20', referrals: 128, status: 'ACTIVE', email: 'contact@codemasters.com', phone: '+91 1122334455', commissionType: 'FIXED', commissionValue: 2500, affiliateCode: 'AFF-CMI-002', address: 'Tech Park, Bangalore', riskLevel: 'High', fraudSignals: ['Multiple signups from same IP', 'Abnormal conversion rate'] },
    { id: 103, name: 'Sarah Tech', type: 'Influencer', joined: '2024-02-01', referrals: 310, status: 'ACTIVE', email: 'sarah@social.com', phone: '+91 9879879870', commissionType: 'PERCENT', commissionValue: 20, affiliateCode: 'AFF-ST-003', address: 'Digital Hub, Pune', riskLevel: 'Medium', fraudSignals: ['Self-referrals detected'] },
    { id: 104, name: 'Inactive User Demo', type: 'Individual', joined: '2024-03-01', referrals: 0, status: 'INACTIVE', email: 'inactive@demo.com', phone: '+91 0000000000', commissionType: 'PERCENT', commissionValue: 10, affiliateCode: 'AFF-INA-004', address: 'Nowhere', riskLevel: 'Low', fraudSignals: [] },
  ]);

  // Mock Chart Data
  const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
    { name: 'Aug', revenue: 5200 },
  ];

  // Mock Batches for Assignment
  const batches = {
    101: [{ id: 'B1', name: 'Sept 2024 - Weekend', startDate: '01 Sep 2024', price: 15000 }, { id: 'B2', name: 'Oct 2024 - Weekday', startDate: '01 Oct 2024', price: 12000 }],
    102: [{ id: 'B3', name: 'Nov 2024 - Fast Track', startDate: '15 Nov 2024', price: 20000 }],
    103: [{ id: 'B4', name: 'Dec 2024 - Evening', startDate: '01 Dec 2024', price: 18000 }]
  };

  return (
    <div className="affiliate-page">
      <header className="affiliate-header">
        <div className="page-title">
          <h1>Affiliate Management</h1>
          <p>Partner management, commission tracking, and payouts.</p>
        </div>
        <div className="marketing-actions">
          <button className={`btn-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className={`btn-tab ${activeTab === 'affiliates' ? 'active' : ''}`} onClick={() => setActiveTab('affiliates')}>Affiliates</button>
          <button className={`btn-tab ${activeTab === 'referrals' ? 'active' : ''}`} onClick={() => setActiveTab('referrals')}>Referrals</button>
          <button className={`btn-tab ${activeTab === 'payouts' ? 'active' : ''}`} onClick={() => setActiveTab('payouts')}>Payouts</button>
          <button className={`btn-tab ${activeTab === 'commission' ? 'active' : ''}`} onClick={() => setActiveTab('commission')}>Rules</button>
          <button className={`btn-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
        </div>
      </header>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <>
          <div className="affiliate-summary">
            <div className="summary-card highlight">
              <div>
                <div className="summary-label">Total Revenue Generated</div>
                <div className="summary-value">$45,200.00</div>
              </div>
              <div className="chart-placeholder" style={{ height: 100, width: '100%', marginTop: 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="summary-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="summary-label">Commissions Paid</div>
                  <div className="summary-value">$8,450.00</div>
                </div>
                <div className="p-2 rounded-circle bg-green-subtle text-green">
                  <FiDollarSign size={24} color="#16a34a" />
                </div>
              </div>
              <div style={{ marginTop: 'auto', fontSize: 13, color: '#16a34a' }}>
                <FiBarChart2 style={{ marginRight: 4 }} /> +15% vs last month
              </div>
            </div>
            <div className="summary-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="summary-label">Active Affiliates</div>
                  <div className="summary-value">124</div>
                </div>
                <div className="p-2 rounded-circle bg-blue-subtle text-blue">
                  <FiUsers size={24} color="#3b82f6" />
                </div>
              </div>
              <div style={{ marginTop: 'auto', fontSize: 13, color: '#64748b' }}>
                <span className="badge bg-warning-subtle text-warning">12 Pending</span>
              </div>
            </div>
          </div>

          <div className="table-responsive bg-white rounded shadow-sm border p-0">
            <div className="table-header border-bottom px-4 py-3">
              <h5 className="mb-0 fw-bold text-dark">Top Performing Affiliates</h5>
            </div>
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Affiliate Name</th>
                  <th>Type</th>
                  <th>Referrals</th>
                  <th>Revenue Ref.</th>
                  <th>Commission</th>
                  <th className="pe-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light text-secondary border rounded-circle d-flex align-items-center justify-content-center fw-bold small" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                          {['JD', 'AS', 'MR', 'TK', 'PL'][i - 1]}
                        </div>
                        <div>
                          <div className="fw-bold text-dark text-sm">
                            {['John Doe', 'Anna Smith', 'Mike Ross', 'Tom King', 'Penny Lane'][i - 1]}
                          </div>
                          <div className="text-muted text-xs">ID: #{2000 + i}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-light text-secondary border fw-normal">{i % 3 === 0 ? 'Group' : 'Individual'}</span></td>
                    <td className="fw-bold text-dark">{120 + i * 15}</td>
                    <td className="text-secondary">${(5000 + i * 850).toLocaleString()}</td>
                    <td className="fw-bold text-success">${(750 + i * 125).toLocaleString()}</td>
                    <td className="pe-4"><span className="badge bg-success bg-opacity-10 text-success">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* AFFILIATES TAB */}
      {activeTab === 'affiliates' && (
        <div className="affiliate-table-container">
          <div className="users-controls mb-0" style={{ padding: '16px 24px', display: 'flex', gap: 12 }}>
            <div className="search-box" style={{ flex: 1 }}>
              <FiSearch />
              <input type="text" placeholder="Search affiliates..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="filter-box">
              <select className="form-select" style={{ padding: '10px', borderRadius: 10, borderColor: '#e2e8f0' }}>
                <option>Type: All</option>
                <option>Individual</option>
                <option>Organization</option>
                <option>Influencer</option>
              </select>
            </div>
            <button className="btn-primary" style={{ display: 'flex', gap: 8, alignItems: 'center' }} onClick={() => setShowModal(true)}><FiPlus /> Add New</button>
          </div>
          <div className="table-responsive bg-white rounded shadow-sm border">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Type</th>
                  <th>Joined</th>
                  <th>Referrals</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliatesList
                  .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(aff => (
                    <tr key={aff.id} onClick={() => setSelectedAffiliate(aff)} style={{ cursor: 'pointer' }}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase" style={{ width: 40, height: 40 }}>
                            {aff.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{aff.name}</div>
                            <div className="small text-muted">{aff.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark border fw-normal">{aff.type}</span></td>
                      <td className="text-muted small">{aff.joined}</td>
                      <td className="text-muted small">{aff.joined}</td>
                      <td className="fw-bold">{aff.referrals}</td>
                      <td>
                        {aff.riskLevel === 'High' && <span className="badge bg-danger bg-opacity-10 text-danger border-0"><FiAlertTriangle className="me-1" /> High</span>}
                        {aff.riskLevel === 'Medium' && <span className="badge bg-warning bg-opacity-10 text-warning border-0"><FiAlertTriangle className="me-1" /> Medium</span>}
                        {aff.riskLevel === 'Low' && <span className="badge bg-success bg-opacity-10 text-success border-0">Low</span>}
                      </td>
                      <td>
                        <span className={`badge ${aff.status === 'ACTIVE' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                          {aff.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => { e.stopPropagation(); setSelectedAffiliate(aff); }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REFERRALS TAB */}
      {activeTab === 'referrals' && (
        <div className="table-responsive bg-white rounded shadow-sm border">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Referral Records</h5>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm"><FiFilter /> Filter</button>
              <button className="btn btn-outline-secondary btn-sm"><FiDownload /> Export</button>
            </div>
          </div>
          {/* Mock Referral Table */}
          <div className="p-5 text-center text-muted">
            <FiUsers size={40} className="mb-2 opacity-50" />
            <p>Referral tracking table will appear here.</p>
          </div>
        </div>
      )}

      {/* PAYOUTS TAB */}
      {activeTab === 'payouts' && (
        <div className="table-responsive bg-white rounded shadow-sm border">
          <div className="table-header border-bottom px-4 py-3">
            <h5 className="mb-0 fw-bold text-dark">Payout Requests</h5>
          </div>
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Request Date</th>
                <th>Affiliate</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th className="text-end pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="ps-4">Oct 24, 2024</td>
                <td className="fw-bold">John Doe</td>
                <td className="fw-bold text-dark">$450.00</td>
                <td><span className="badge bg-light text-dark border fw-normal">Bank Transfer</span></td>
                <td><span className="badge bg-warning bg-opacity-10 text-warning">Pending</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-dark">Process</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* COMMISSION RULES TAB */}
      {activeTab === 'commission' && (
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Batch Commission Assignments</h5>
                  <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={() => setShowAssignmentModal(true)}>
                    <FiPlus size={14} /> Assign Batch Rule
                  </button>
                </div>
                <p className="text-muted">Define special commission structures for specific batches and affiliates.</p>

                {/* Mock Rules List */}
                <div className="p-3 bg-light rounded text-center text-muted">
                  No special rules configured. Default affiliate strategy applies.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="commission-settings" style={{ maxWidth: 600 }}>
          <h3 className="mb-4">Affiliate Program Settings</h3>
          <div className="st-group">
            <label className="d-flex justify-content-between align-items-center mb-2">
              Enable Affiliate Program
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </label>
            <p className="small text-muted">If disabled, new signups will be paused.</p>
          </div>
          <hr className="my-4" style={{ borderColor: '#f1f5f9' }} />
          <div className="st-group">
            <label>Global Default Commission (%)</label>
            <input type="number" className="st-input" placeholder="e.g. 15" defaultValue={15} />
          </div>
          <div className="st-group">
            <label>Minimum Payout Threshold ($)</label>
            <input type="number" className="st-input" placeholder="e.g. 50" defaultValue={50} />
          </div>
          <button className="btn-save">Save Configuration</button>
        </div>
      )}

      {/* AFFILIATE DETAILS MODAL */}
      {selectedAffiliate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
          <div className="animate-scale-up w-full max-w-4xl" style={{ width: '100%', maxWidth: 800, maxHeight: '90vh' }}>
            <AffiliateDetails
              affiliate={selectedAffiliate}
              onClose={() => setSelectedAffiliate(null)}
            />
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <AffiliateForm
              onSubmit={(data) => {
                console.log("Creating:", data);
                setShowModal(false);
                alert("Affiliate Created Successfully!");
              }}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* BATCH ASSIGNMENT MODAL (Commission Rules) */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-lg p-0 w-full max-w-2xl" style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}>
            <AffiliateBatchAssignment
              affiliates={affiliatesList}
              batches={batches}
              onSave={(data) => {
                console.log("Batch Assignment Created:", data);
                setShowAssignmentModal(false);
                alert("Batch Assigned with Commission Rule!");
              }}
              onCancel={() => setShowAssignmentModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Affiliates;