import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/admin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await axios.post('/api/admin/auth/login', { email, password }, { withCredentials: true });
            navigate('/admin/dashboard');
        } catch {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="admin-root">
            <div className="admin-login-root">
                <div className="admin-login">
                    <h2>FinLog Admin</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button onClick={handleLogin}>Login</button>

                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </div>
    );
}
