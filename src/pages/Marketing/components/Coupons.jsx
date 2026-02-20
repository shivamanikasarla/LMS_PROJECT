import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiPower } from 'react-icons/fi';
import FilterBar from './FilterBar';

const Coupons = () => {
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [filters, setFilters] = useState({});

    const [coupons, setCoupons] = useState([
        { id: 1, code: 'WELCOME50', type: 'Flat', value: 50, validFrom: '2024-01-01', validTill: '2025-12-31', usageLimit: 500, usedCount: 124, status: 'Active' },
        { id: 2, code: 'SUMMER20', type: 'Percent', value: 20, validFrom: '2024-06-01', validTill: '2024-08-31', usageLimit: 1000, usedCount: 850, status: 'Active' },
        { id: 3, code: 'FLASH100', type: 'Flat', value: 100, validFrom: '2023-12-25', validTill: '2023-12-31', usageLimit: 50, usedCount: 50, status: 'Expired' },
    ]);

    return (
        <>
            <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                statusOptions={['Active', 'Expired', 'Disabled']}
            />
            <div className="table-responsive bg-white rounded shadow-sm border">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">All Coupons</h5>
                    <button className="btn btn-primary btn-sm" onClick={() => { setEditingCoupon(null); setShowCouponModal(true); }}><FiPlus /> New Coupon</button>
                </div>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Coupon Code</th>
                            <th>Discount</th>
                            <th>Validity</th>
                            <th>Usage</th>
                            <th>Status</th>
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(c => (
                            <tr key={c.id}>
                                <td className="ps-4 text-primary font-monospace fw-bold">{c.code}</td>
                                <td>{c.type === 'Flat' ? `$${c.value}` : `${c.value}%`}</td>
                                <td>
                                    <div className="small text-dark">{c.validFrom}</div>
                                    <div className="small text-muted">to {c.validTill}</div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="progress" style={{ width: 60, height: 6 }}>
                                            <div
                                                className="progress-bar bg-primary"
                                                role="progressbar"
                                                style={{ width: `${(c.usedCount / c.usageLimit) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="small text-muted">{c.usedCount} / {c.usageLimit}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${c.status === 'Active' ? 'bg-success bg-opacity-10 text-success' :
                                        c.status === 'Expired' ? 'bg-danger bg-opacity-10 text-danger' :
                                            'bg-secondary bg-opacity-10 text-secondary'
                                        }`}>{c.status}</span>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        {c.status !== 'Expired' && (
                                            <button
                                                className={`btn btn-sm ${c.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                title={c.status === 'Active' ? 'Disable' : 'Enable'}
                                                onClick={() => {
                                                    const newStatus = c.status === 'Active' ? 'Disabled' : 'Active';
                                                    setCoupons(coupons.map(coup => coup.id === c.id ? { ...coup, status: newStatus } : coup));
                                                }}
                                            >
                                                <FiPower />
                                            </button>
                                        )}
                                        <button className="btn btn-sm btn-outline-secondary" title="Edit" onClick={() => { setEditingCoupon(c); setShowCouponModal(true); }}>
                                            <FiEdit />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Delete"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this coupon?')) {
                                                    setCoupons(coupons.filter(coup => coup.id !== c.id));
                                                }
                                            }}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* COUPON MODAL */}
            {showCouponModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500 }}>
                        <h4 className="mb-4" style={{ marginTop: 0 }}>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const couponData = {
                                id: editingCoupon ? editingCoupon.id : coupons.length + 1,
                                code: formData.get('code'),
                                type: formData.get('type'),
                                value: parseFloat(formData.get('value')),
                                usageLimit: parseInt(formData.get('usageLimit')),
                                usedCount: editingCoupon ? editingCoupon.usedCount : 0,
                                status: 'Active',
                                validFrom: formData.get('validFrom'),
                                validTill: formData.get('validTill')
                            };

                            if (editingCoupon) {
                                setCoupons(coupons.map(c => c.id === editingCoupon.id ? couponData : c));
                            } else {
                                setCoupons([...coupons, couponData]);
                            }
                            setShowCouponModal(false);
                        }}>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label className="form-label">Coupon Code</label>
                                    <input type="text" name="code" className="form-control" defaultValue={editingCoupon?.code} placeholder="e.g. SAVE20" required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Type</label>
                                    <select name="type" className="form-select" defaultValue={editingCoupon?.type || 'Flat'} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                                        <option value="Flat">Flat ($)</option>
                                        <option value="Percent">Percent (%)</option>
                                    </select>
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Value</label>
                                    <input type="number" name="value" className="form-control" defaultValue={editingCoupon?.value} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                                </div>

                                <div className="col-6 mb-3">
                                    <label className="form-label">Valid From</label>
                                    <input type="date" name="validFrom" className="form-control" defaultValue={editingCoupon?.validFrom} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Valid Till</label>
                                    <input type="date" name="validTill" className="form-control" defaultValue={editingCoupon?.validTill} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label">Usage Limit</label>
                                    <input type="number" name="usageLimit" className="form-control" defaultValue={editingCoupon?.usageLimit || 100} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCouponModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Coupon</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Coupons;
