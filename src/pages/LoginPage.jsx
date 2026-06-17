import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    const from = location.state?.from?.pathname || '/todos';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAuthError('');
        setIsLoggingOn(true);
        const result = await login(email, password);
        if (!result.success) {
            setAuthError(result.error);
            setIsLoggingOn(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.brand}>
                    <span className={styles.appName}>Todo List</span>
                    <span className={styles.tagline}>Sign in to your account</span>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {authError && (
                        <div className={styles.error}>
                            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                            {authError}
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            className={styles.input}
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input
                            className={styles.input}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button className={styles.submit} type="submit" disabled={isLoggingOn}>
                        {isLoggingOn ? (
                            <>
                                <span className={styles.spinner} />
                                Signing in…
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
