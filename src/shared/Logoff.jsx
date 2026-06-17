import { useNavigate } from 'react-router';
import { Power } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import styles from './Logoff.module.css';

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
        <button className={styles.btn} onClick={handleLogoff}>
            <Power size={15} strokeWidth={1.75} />
            Log out
        </button>
    );
}

export default Logoff;
