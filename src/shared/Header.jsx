import { useAuth } from '../contexts/AuthContext';
import Logoff from './Logoff';
import Navigation from './Navigation';

function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <div>
            <h1>Todo List</h1>
            <Navigation />
            {isAuthenticated && <Logoff />}
        </div>
    );
}

export default Header;
