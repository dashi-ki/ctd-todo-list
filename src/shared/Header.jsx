import { useAuth } from '../contexts/AuthContext';
import Logoff from './Logoff';

function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <div>
            <h1>Todo List</h1>
            {isAuthenticated && <Logoff />}
        </div>
    );
}

export default Header;
