//import { useEffect, useState } from 'react';
//import axios from 'axios';
//import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
//import { Pie } from 'react-chartjs-2';
//import '../styles/admin.css';

//ChartJS.register(ArcElement, Tooltip, Legend);

//export default function Dashboard() {
//    const [stats, setStats] = useState(null);

//    useEffect(() => {
//        console.log('Making API call to /api/admin/stats');
//        axios.get('/api/admin/stats', { withCredentials: true })
//            .then(res => {
//                console.log('API response received:', res.data);
//                setStats(res.data);
//            })
//            .catch(err => {
//                console.error('Stats fetch error:', err);
//                console.error('Error details:', err.response);
//                setStats({ TotalUsers: 0, VerifiedUsers: 0, UnverifiedUsers: 0, ActiveUsers: 0 });
//            });
//    }, []);

//    if (!stats) return <div className="admin-container"><p>Loading stats...</p></div>;

//    return (
//        <div className="dashboard">
//            <div className="admin-container">
//                <div className="dashboard-header">
//                    <h1>FinLog Admin Dashboard</h1>
//                </div>
                
//                <div className="stats-grid">
//                    <div className="stat-card">
//                        <div className="stat-number">{stats.TotalUsers}</div>
//                        <div className="stat-label">Total Users</div>
//                    </div>
//                    <div className="stat-card">
//                        <div className="stat-number">{stats.VerifiedUsers}</div>
//                        <div className="stat-label">Verified Users</div>
//                    </div>
//                    <div className="stat-card">
//                        <div className="stat-number">{stats.ActiveUsers}</div>
//                        <div className="stat-label">Active Users</div>
//                    </div>
//                </div>

//                <div className="chart-container">
//                    <div className="chart-title">User Verification Status</div>
//                    {stats.TotalUsers > 0 ? (
//                        <Pie 
//                            data={{
//                                labels: ['Verified Users', 'Unverified Users'],
//                                datasets: [{
//                                    data: [stats.VerifiedUsers, stats.UnverifiedUsers],
//                                    backgroundColor: ['#28a745', '#dc3545'],
//                                    borderWidth: 2,
//                                    borderColor: '#fff'
//                                }]
//                            }}
//                            options={{
//                                responsive: true,
//                                plugins: {
//                                    legend: {
//                                        position: 'bottom'
//                                    }
//                                }
//                            }}
//                        />
//                    ) : (
//                        <p style={{textAlign: 'center', color: '#666', fontSize: '16px'}}>No users registered yet</p>
//                    )}
//                </div>
//            </div>
//        </div>
//    );
//}
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../styles/admin.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Making API call to /api/admin/stats');

        axios.get('/api/admin/stats', { withCredentials: true })
            .then(res => {
                const d = res.data;

                console.log("Raw API Response:", d);

                // Convert to numbers to avoid chart condition bugs
                const parsed = {
                    TotalUsers: Number(d.TotalUsers) || 0,
                    VerifiedUsers: Number(d.VerifiedUsers) || 0,
                    UnverifiedUsers: Number(d.UnverifiedUsers) || 0,
                    ActiveUsers: Number(d.ActiveUsers) || 0
                };

                console.log("Parsed Stats:", parsed);

                setStats(parsed);
            })
            .catch(err => {
                console.error("Stats fetch error:", err);
                setError("Failed to load statistics.");
            });
    }, []);

    if (!stats && !error) {
        return (
            <div className="admin-container">
                <p>Loading stats...</p>
            </div>
        );
    }

    const pieData = stats && {
        labels: ['Verified Users', 'Unverified Users'],
        datasets: [{
            data: [
                stats.VerifiedUsers,
                stats.UnverifiedUsers
            ],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 2
        }]
    };

    return (
        <div className="dashboard">
            <div className="admin-container">

                <div className="dashboard-header">
                    <h1>FinLog Admin Dashboard</h1>
                </div>

                {/* Error Message */}
                {error && (
                    <p className="error-msg" style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                {/* Stats Grid */}
                {stats && (
                    <>
                        <div className="stats-grid">

                            <div className="stat-card">
                                <div className="stat-number">{stats.TotalUsers}</div>
                                <div className="stat-label">Total Users</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-number">{stats.VerifiedUsers}</div>
                                <div className="stat-label">Verified Users</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-number">{stats.UnverifiedUsers}</div>
                                <div className="stat-label">Unverified Users</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-number">{stats.ActiveUsers}</div>
                                <div className="stat-label">Active Users</div>
                            </div>

                        </div>

                        {/* Pie Chart */}
                        <div className="chart-container">
                            <div className="chart-title">User Verification Status</div>

                            {stats.TotalUsers > 0 ? (
                                <Pie
                                    data={pieData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom'
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <p style={{
                                    textAlign: 'center',
                                    color: '#666',
                                    fontSize: '16px'
                                }}>
                                    No users registered yet
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
