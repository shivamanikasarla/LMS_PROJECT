import React, { useState } from 'react';
import { FiPlus, FiBarChart2, FiEdit, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import FilterBar from './FilterBar';

const Campaigns = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showManageCampaignModal, setShowManageCampaignModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showCampaignAnalyticsModal, setShowCampaignAnalyticsModal] = useState(false);
    const [filters, setFilters] = useState({});

    const [campaigns, setCampaigns] = useState([
        {
            id: 1,
            name: 'Summer Bootcamp Sale',
            type: 'Email',
            status: 'Active',
            sent: 12500,
            clicks: 3400,
            conversions: 120,
            revenue: '$14,500',
            startDate: '2024-03-01',
            endDate: '2024-03-31',
            budget: 5000,
            leads: 450
        },
        {
            id: 2,
            name: 'Instagram Ad - React',
            type: 'Social',
            status: 'Paused',
            sent: 50000,
            clicks: 8900,
            conversions: 45,
            revenue: '$5,200',
            startDate: '2024-02-15',
            endDate: '2024-03-15',
            budget: 2000,
            leads: 120
        },
        {
            id: 3,
            name: 'New Year Early Bird',
            type: 'Email',
            status: 'Completed',
            sent: 8000,
            clicks: 2100,
            conversions: 310,
            revenue: '$35,000',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            budget: 1500,
            leads: 600
        },
    ]);

    const revenueData = [
        { orderId: '#ORD-001', value: 100, currency: 'USD', product: 'React Course', discount: 10, netRevenue: 90, commission: 5 },
        { orderId: '#ORD-002', value: 200, currency: 'USD', product: 'Full Stack Bundle', discount: 20, netRevenue: 180, commission: 10 },
        { orderId: '#ORD-003', value: 150, currency: 'USD', product: 'Backend Masterclass', discount: 0, netRevenue: 150, commission: 8 },
        { orderId: '#ORD-004', value: 100, currency: 'USD', product: 'React Course', discount: 15, netRevenue: 85, commission: 5 },
    ];

    return (
        <>
            <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                statusOptions={['Active', 'Paused', 'Completed']}
            />
            <div className="table-responsive bg-white rounded shadow-sm border">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Campaigns</h5>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}><FiPlus /> New Campaign</button>
                </div>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Campaign Name</th>
                            <th>Channel</th>
                            <th>Timeline</th>
                            <th>Budget</th>
                            <th>Conversions</th>
                            <th>Status</th>
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map(c => {
                            const conversionRate = ((c.conversions / (c.clicks || 1)) * 100).toFixed(1);
                            return (
                                <tr key={c.id}>
                                    <td className="ps-4">
                                        <div className="fw-bold text-dark">{c.name}</div>
                                        <div className="small text-muted">ID: #{c.id}</div>
                                    </td>
                                    <td><span className="badge bg-light text-dark border">{c.type}</span></td>
                                    <td>
                                        <div className="small text-dark">{c.startDate}</div>
                                        <div className="small text-muted">to {c.endDate}</div>
                                    </td>
                                    <td>${c.budget.toLocaleString()}</td>
                                    <td>
                                        <div className="fw-bold">{c.conversions}</div>
                                        <div className="small text-muted">{conversionRate}% Rate</div>
                                    </td>
                                    <td>
                                        <span className={`badge ${c.status === 'Active' ? 'bg-success bg-opacity-10 text-success' :
                                            c.status === 'Paused' ? 'bg-warning bg-opacity-10 text-warning' :
                                                'bg-secondary bg-opacity-10 text-secondary'
                                            }`}>{c.status}</span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button className="btn btn-sm btn-outline-info" title="Analytics" onClick={() => { setSelectedCampaign(c); setShowCampaignAnalyticsModal(true); }}>
                                                <FiBarChart2 />
                                            </button>
                                            <button className="btn btn-sm btn-outline-secondary" title="Edit" onClick={() => { setSelectedCampaign(c); setShowManageCampaignModal(true); }}>
                                                <FiEdit />
                                            </button>
                                            {c.status !== 'Completed' && (
                                                <button
                                                    className={`btn btn-sm ${c.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                    title={c.status === 'Active' ? 'Pause' : 'Resume'}
                                                    onClick={() => {
                                                        const newStatus = c.status === 'Active' ? 'Paused' : 'Active';
                                                        setCampaigns(campaigns.map(camp => camp.id === c.id ? { ...camp, status: newStatus } : camp));
                                                    }}
                                                >
                                                    {c.status === 'Active' ? <FiTrendingDown /> : <FiTrendingUp />}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* CREATE CAMPAIGN MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500 }}>
                        <h4 className="mb-4" style={{ marginTop: 0 }}>Create New Campaign</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newCampaign = {
                                id: campaigns.length + 1,
                                name: formData.get('name'),
                                type: formData.get('type'),
                                status: 'Active',
                                startDate: formData.get('startDate'),
                                endDate: formData.get('endDate'),
                                budget: parseFloat(formData.get('budget')),
                                sent: 0,
                                clicks: 0,
                                conversions: 0,
                                revenue: '$0',
                                leads: 0
                            };
                            setCampaigns([...campaigns, newCampaign]);
                            setShowCreateModal(false);
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Campaign Name</label>
                                <input type="text" name="name" className="form-control" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Channel</label>
                                <select name="type" className="form-select">
                                    <option value="Email">Email Marketing</option>
                                    <option value="Social">Social Media Ad</option>
                                    <option value="SMS">SMS Campaign</option>
                                    <option value="Affiliate">Affiliate Program</option>
                                </select>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Start Date</label>
                                    <input type="date" name="startDate" className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">End Date</label>
                                    <input type="date" name="endDate" className="form-control" required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Budget ($)</label>
                                <input type="number" name="budget" className="form-control" required />
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Campaign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MANAGE CAMPAIGN MODAL (Edit) */}
            {showManageCampaignModal && selectedCampaign && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500 }}>
                        <h4 className="mb-4" style={{ marginTop: 0 }}>Edit Campaign</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedCampaigns = campaigns.map(c => c.id === selectedCampaign.id ? {
                                ...c,
                                name: formData.get('name'),
                                status: formData.get('status'),
                                budget: parseFloat(formData.get('budget')),
                                endDate: formData.get('endDate')
                            } : c);
                            setCampaigns(updatedCampaigns);
                            setShowManageCampaignModal(false);
                        }}>
                            <div className="mb-3">
                                <label className="form-label">Campaign Name</label>
                                <input type="text" name="name" className="form-control" defaultValue={selectedCampaign.name} />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">End Date</label>
                                    <input type="date" name="endDate" className="form-control" defaultValue={selectedCampaign.endDate} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Budget ($)</label>
                                    <input type="number" name="budget" className="form-control" defaultValue={selectedCampaign.budget} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select name="status" className="form-select" defaultValue={selectedCampaign.status}>
                                    <option value="Active">Active</option>
                                    <option value="Paused">Paused</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowManageCampaignModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CAMPAIGN ANALYTICS MODAL */}
            {showCampaignAnalyticsModal && selectedCampaign && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 900, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="mb-1" style={{ marginTop: 0 }}>Analytics: {selectedCampaign.name}</h4>
                                <div className="small text-muted">{selectedCampaign.startDate} - {selectedCampaign.endDate}</div>
                            </div>
                            <button className="btn-close" onClick={() => setShowCampaignAnalyticsModal(false)}></button>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div className="p-3 bg-light rounded text-center">
                                    <div className="small text-muted">Budget</div>
                                    <div className="fw-bold">${selectedCampaign.budget}</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 bg-light rounded text-center">
                                    <div className="small text-muted">Spend</div>
                                    <div className="fw-bold text-danger">${Math.round(selectedCampaign.budget * 0.8)}</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 bg-light rounded text-center">
                                    <div className="small text-muted">Leads</div>
                                    <div className="fw-bold text-primary">{selectedCampaign.leads || 0}</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="p-3 bg-light rounded text-center">
                                    <div className="small text-muted">ROI</div>
                                    <div className="fw-bold text-success">245%</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Sent', value: selectedCampaign.sent },
                                    { name: 'Clicks', value: selectedCampaign.clicks },
                                    { name: 'Leads', value: selectedCampaign.leads || 0 },
                                    { name: 'Conv.', value: selectedCampaign.conversions }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* REVENUE ATTRIBUTION TABLE */}
                        <div className="mt-5">
                            <h5 className="mb-3">Revenue Attribution</h5>
                            <div className="table-responsive border rounded">
                                <table className="table table-sm table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Product</th>
                                            <th className="text-end">Value</th>
                                            <th className="text-end">Discount</th>
                                            <th className="text-end fw-bold">Net Revenue</th>
                                            <th className="text-end">Commission</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {revenueData.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="small">{item.orderId}</td>
                                                <td className="small">{item.product}</td>
                                                <td className="text-end small">${item.value}</td>
                                                <td className="text-end small text-danger">-${item.discount}</td>
                                                <td className="text-end fw-bold text-success">${item.netRevenue}</td>
                                                <td className="text-end small text-muted">-${item.commission}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="table-light fw-bold">
                                        <tr>
                                            <td colSpan="4" className="text-end">Total</td>
                                            <td className="text-end text-success">${revenueData.reduce((acc, curr) => acc + curr.netRevenue, 0)}</td>
                                            <td className="text-end text-muted">-${revenueData.reduce((acc, curr) => acc + curr.commission, 0)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button className="btn btn-secondary" onClick={() => setShowCampaignAnalyticsModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Campaigns;
