import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../styles/admin.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/admin/stats', { withCredentials: true })
            .then(res => {
                const d = res.data;
                setStats({
                    TotalUsers: Number(d.totalUsers) || 0,
                    VerifiedUsers: Number(d.verifiedUsers) || 0,
                    UnverifiedUsers: Number(d.unverifiedUsers) || 0,
                    ActiveUsers: Number(d.activeUsers) || 0
                });
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load stats:', err);
                setError("Failed to load statistics.");
                setLoading(false);
            });
    }, []);

    const pieData = useMemo(() => stats ? {
        labels: ['Verified Users', 'Unverified Users'],
        datasets: [{
            label: 'Users',
            data: [stats.VerifiedUsers, stats.UnverifiedUsers],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 2
        }]
    } : null, [stats]);

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#333' } },
            tooltip: { enabled: true }
        }
    };

    if (loading) return (
        <div className="admin-root">
            <div className="admin-dashboard-root">
                <p className="loading-text" style={{ color: "#fff", textAlign: "center" }}>
                    Loading stats...
                </p>
            </div>
        </div>
    );

    if (error) return (
        <div className="admin-root">
            <div className="admin-dashboard-root">
                <p className="error">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="admin-root">
            <div className="admin-dashboard-root">
                <div className="dashboard">

                    {/* Dashboard Header */}
                    <div className="dashboard-header">
                        <h1>FinLog Admin Dashboard</h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        {['TotalUsers', 'VerifiedUsers', 'UnverifiedUsers', 'ActiveUsers'].map((key, idx) => (
                            <div className="stat-card" key={idx}>
                                <div className="stat-number">{stats[key]}</div>
                                <div className="stat-label">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart Container */}
                    <div className="chart-container">
                        <div className="chart-title">User Verification Status</div>

                        <div className="chart-wrapper">
                            {stats.TotalUsers > 0 && pieData ? (
                                <Pie data={pieData} options={pieOptions} />
                            ) : (
                                <p style={{ textAlign: "center", color: "#333" }}>
                                    No users registered yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
