import { Link } from 'react-router';

function NotFoundPage() {
    return (
        <div>
            <h2>404: Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <div className="buttonGroup">
                <Link className="linkButton" to="/">Go Home</Link>
                <Link className="linkButton" to="/about">About</Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
