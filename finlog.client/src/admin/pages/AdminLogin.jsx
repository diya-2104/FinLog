import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import '../styles/admin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/auth/login', { email, password });
            navigate('/admin/dashboard');
        } catch {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="admin-login">
            <h2>FinLog Admin</h2>
            <form onSubmit={handleLogin}>
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}