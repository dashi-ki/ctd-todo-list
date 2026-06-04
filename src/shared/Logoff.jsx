import { useAuth } from '../contexts/AuthContext';

function Logoff() {
    const { logout } = useAuth();

    const handleLogoff = async () => {
        await logout();
    };

    return (
        <button onClick={handleLogoff}>Log Off</button>
    );
}

export default Logoff;
