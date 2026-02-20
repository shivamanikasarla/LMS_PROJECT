import React, { useState } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiShoppingCart, FiActivity } from 'react-icons/fi';
import FilterBar from './FilterBar';

const Analytics = () => {
    const [filters, setFilters] = useState({});

    // Mock Data for Charts
    const trafficData = [
        { date: 'Mon', visits: 4000, signup: 240, purchases: 100 },
        { date: 'Tue', visits: 3000, signups: 139, purchases: 80 },
        { date: 'Wed', visits: 2000, signups: 980, purchases: 200 },
        { date: 'Thu', visits: 2780, signups: 390, purchases: 150 },
        { date: 'Fri', visits: 1890, signups: 480, purchases: 120 },
        { date: 'Sat', visits: 2390, signups: 380, purchases: 110 },
        { date: 'Sun', visits: 3490, signups: 430, purchases: 130 },
    ];

    const sourceData = [
        { name: 'Google Ads', value: 400 },
        { name: 'Direct', value: 300 },
        { name: 'Email', value: 300 },
        { name: 'Social', value: 200 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Mock Data for Revenue Attribution
    const revenueData = [
        { orderId: '#ORD-1001', date: '2024-03-15', product: 'React Mastery', value: 150, discount: 15, netRevenue: 135, commission: 10, channel: 'Email' },
        { orderId: '#ORD-1002', date: '2024-03-14', product: 'Full Stack Bundle', value: 250, discount: 25, netRevenue: 225, commission: 20, channel: 'Social' },
        { orderId: '#ORD-1003', date: '2024-03-14', product: 'Python Intro', value: 50, discount: 0, netRevenue: 50, commission: 5, channel: 'Direct' },
        { orderId: '#ORD-1004', date: '2024-03-13', product: 'Backend API', value: 100, discount: 10, netRevenue: 90, commission: 8, channel: 'Affiliate' },
        { orderId: '#ORD-1005', date: '2024-03-13', product: 'React Mastery', value: 150, discount: 0, netRevenue: 150, commission: 12, channel: 'Email' },
    ];

    return (
        <>
            <FilterBar filters={filters} onFilterChange={setFilters} />

            <div className="analytics-dashboard">
                {/* 1. Key Metrics Grid */}
                <div className="row g-4 mb-4">
                    <div className="col-md-2">
                        <div className="p-3 bg-white border rounded shadow-sm text-center card-hover h-100">
                            <div className="text-primary mb-2"><FiUsers size={24} /></div>
                            <div className="text-muted small text-uppercase fw-bold">Visits</div>
                            <h4 className="my-1">24.5k</h4>
                            <div className="small text-success"><FiTrendingUp /> +12%</div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="p-3 bg-white border rounded shadow-sm text-center card-hover h-100">
                            <div className="text-info mb-2"><FiActivity size={24} /></div>
                            <div className="text-muted small text-uppercase fw-bold">Signups</div>
                            <h4 className="my-1">3,420</h4>
                            <div className="small text-success"><FiTrendingUp /> +8%</div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="p-3 bg-white border rounded shadow-sm text-center card-hover h-100">
                            <div className="text-success mb-2"><FiShoppingCart size={24} /></div>
                            <div className="text-muted small text-uppercase fw-bold">Purchases</div>
                            <h4 className="my-1">850</h4>
                            <div className="small text-success"><FiTrendingUp /> +15%</div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="p-3 bg-white border rounded shadow-sm text-center card-hover h-100">
                            <div className="text-warning mb-2"><FiTrendingUp size={24} /></div>
                            <div className="text-muted small text-uppercase fw-bold">Conv. Rate</div>
                            <h4 className="my-1">3.5%</h4>
                            <div className="small text-danger"><FiTrendingDown /> -0.2%</div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="p-3 bg-white border rounded shadow-sm text-center card-hover h-100">
                            <div className="text-secondary mb-2"><FiDollarSign size={24} /></div>
                            <div className="text-muted small text-uppercase fw-bold">CPL</div>
                            <h4 className="my-1">$4.50</h4>
                            <div className="small text-success"><FiTrendingDown /> -5%</div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="p-3 bg-white border rounded shadow-sm text-center card-hover h-100">
                            <div className="text-danger mb-2"><FiDollarSign size={24} /></div>
                            <div className="text-muted small text-uppercase fw-bold">CPA</div>
                            <h4 className="my-1">$28.00</h4>
                            <div className="small text-success"><FiTrendingDown /> -2%</div>
                        </div>
                    </div>
                </div>

                {/* 2. Charts Section */}
                <div className="row g-4 mb-4">
                    <div className="col-lg-8">
                        <div className="bg-white p-4 rounded border shadow-sm h-100">
                            <h5 className="mb-4">Traffic & Conversions Trend</h5>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trafficData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="visits" stroke="#8884d8" name="Visits" />
                                        <Line type="monotone" dataKey="signups" stroke="#82ca9d" name="Signups" />
                                        <Line type="monotone" dataKey="purchases" stroke="#ffc658" name="Purchases" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="bg-white p-4 rounded border shadow-sm h-100">
                            <h5 className="mb-4">Traffic Channel Split</h5>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sourceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {sourceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Global Revenue Attribution Table */}
                <div className="bg-white p-4 rounded border shadow-sm">
                    <h5 className="mb-3 d-flex align-items-center gap-2">
                        <FiDollarSign className="text-success" /> Revenue Attribution
                    </h5>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Product / Course</th>
                                    <th>Channel</th>
                                    <th className="text-end">Value</th>
                                    <th className="text-end">Discount</th>
                                    <th className="text-end fw-bold">Net Revenue</th>
                                    <th className="text-end">Commission</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="small fw-bold text-primary">{item.orderId}</td>
                                        <td className="small text-muted">{item.date}</td>
                                        <td className="small">{item.product}</td>
                                        <td><span className="badge bg-light text-dark border">{item.channel}</span></td>
                                        <td className="text-end small">${item.value}</td>
                                        <td className="text-end small text-danger">-${item.discount}</td>
                                        <td className="text-end fw-bold text-success">${item.netRevenue}</td>
                                        <td className="text-end small text-muted">-${item.commission}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="table-light fw-bold">
                                <tr>
                                    <td colSpan="6" className="text-end">Total Net Revenue</td>
                                    <td className="text-end text-success fs-6">${revenueData.reduce((acc, curr) => acc + curr.netRevenue, 0).toLocaleString()}</td>
                                    <td className="text-end text-muted small">-${revenueData.reduce((acc, curr) => acc + curr.commission, 0).toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;
