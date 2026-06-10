import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogoff = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/login');
        }
    };

    return (
        <button onClick={handleLogoff}>Log Off</button>
    );
}

export default Logoff;
