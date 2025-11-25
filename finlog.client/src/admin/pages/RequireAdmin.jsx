import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function RequireAdmin({ children }) {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        axios.get('/api/admin/auth/check', { withCredentials: true })
            .then(res => setIsAdmin(res.data.isAdmin))
            .catch(() => setIsAdmin(false));
    }, []);

    if (isAdmin === null) return <p>Loading...</p>;
    return isAdmin ? children : <Navigate to="/admin/login" />;
}