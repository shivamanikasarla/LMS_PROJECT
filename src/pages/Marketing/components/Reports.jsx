import React, { useState } from 'react';
import { FiDownload, FiFileText, FiClock, FiCheck, FiRefreshCw, FiCalendar } from 'react-icons/fi';

const Reports = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock Data for Export History
    const [exportHistory, setExportHistory] = useState([
        { id: 101, name: 'Q1 Lead Report', type: 'Leads', range: '2024-01-01 to 2024-03-31', format: 'CSV', requestedBy: 'John Doe', generatedAt: '2024-04-01 09:30 AM', status: 'Ready' },
        { id: 102, name: 'March Campaign Performance', type: 'Campaigns', range: '2024-03-01 to 2024-03-31', format: 'XLSX', requestedBy: 'Sarah Lee', generatedAt: '2024-04-02 02:15 PM', status: 'Ready' },
        { id: 103, name: 'Revenue Attribution Log', type: 'Revenue', range: '2024-03-01 to 2024-03-15', format: 'CSV', requestedBy: 'Mike Ross', generatedAt: '2024-03-16 10:00 AM', status: 'Expired' },
    ]);

    const handleGenerate = (e) => {
        e.preventDefault();
        setIsGenerating(true);
        const formData = new FormData(e.target);
        const newReport = {
            id: exportHistory.length + 101,
            name: `${formData.get('type')} Report`,
            type: formData.get('type'),
            range: `${formData.get('startDate')} to ${formData.get('endDate')}`,
            format: formData.get('format'),
            requestedBy: 'Current User',
            generatedAt: new Date().toLocaleString(),
            status: 'Processing'
        };

        setExportHistory([newReport, ...exportHistory]);

        // Simulate processing
        setTimeout(() => {
            setExportHistory(prev => prev.map(r => r.id === newReport.id ? { ...r, status: 'Ready' } : r));
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="reports-page fade-in">
            {/* 1. REPORT GENERATOR */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                        <FiFileText className="text-primary" /> Generate New Report
                    </h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleGenerate}>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label small text-muted fw-bold">Export Type</label>
                                <select name="type" className="form-select" required>
                                    <option value="Leads">All Leads</option>
                                    <option value="Campaigns">Campaign Performance</option>
                                    <option value="Revenue">Revenue Attribution</option>
                                    <option value="Coupons">Coupon Usage</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted fw-bold">Start Date</label>
                                <input type="date" name="startDate" className="form-control" required />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted fw-bold">End Date</label>
                                <input type="date" name="endDate" className="form-control" required />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted fw-bold">Format</label>
                                <div className="d-flex gap-3 mt-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="format" id="fmtCSV" value="CSV" defaultChecked />
                                        <label className="form-check-label" htmlFor="fmtCSV">CSV</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="format" id="fmtXLSX" value="XLSX" />
                                        <label className="form-check-label" htmlFor="fmtXLSX">Excel</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4 d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary px-4" disabled={isGenerating}>
                                    {isGenerating ? <><FiRefreshCw className="spin me-2" /> Generating...</> : 'Generate Report'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* 2. EXPORT HISTORY */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                        <FiClock className="text-secondary" /> Export History
                    </h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Report Name</th>
                                <th>Type</th>
                                <th>Date Range</th>
                                <th>Requested By</th>
                                <th>Generated At</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exportHistory.map(report => (
                                <tr key={report.id}>
                                    <td className="ps-4 fw-bold">{report.name}</td>
                                    <td><span className="badge bg-light text-dark border">{report.type}</span></td>
                                    <td className="small text-muted">{report.range}</td>
                                    <td className="small">{report.requestedBy}</td>
                                    <td className="small text-muted">{report.generatedAt}</td>
                                    <td>
                                        {report.status === 'Processing' && <span className="badge bg-warning bg-opacity-10 text-warning border-warning"><FiRefreshCw className="spin me-1" /> Processing</span>}
                                        {report.status === 'Ready' && <span className="badge bg-success bg-opacity-10 text-success border-success"><FiCheck className="me-1" /> Ready</span>}
                                        {report.status === 'Expired' && <span className="badge bg-secondary bg-opacity-10 text-secondary border-secondary">Expired</span>}
                                    </td>
                                    <td className="text-end pe-4">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            disabled={report.status !== 'Ready'}
                                            title="Download"
                                        >
                                            <FiDownload /> {report.format}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
