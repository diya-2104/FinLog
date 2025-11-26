import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../api/api';

export default function RequireAdmin({ children }) {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        api.get('/api/admin/auth/check')
            .then(res => setIsAdmin(res.data.isAdmin))
            .catch(() => setIsAdmin(false));
    }, []);

    if (isAdmin === null) return <p>Loading...</p>;
    return isAdmin ? children : <Navigate to="/admin/login" />;
}