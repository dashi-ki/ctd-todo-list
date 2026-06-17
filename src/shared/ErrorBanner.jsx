import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './ErrorBanner.module.css';

const AUTO_DISMISS_MS = 5000;

function ErrorBanner({ message, onDismiss }) {
    useEffect(() => {
        if (!message || !onDismiss) return;
        const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
        return () => clearTimeout(timer);
    }, [message, onDismiss]);

    if (!message) return null;

    return (
        <div className={styles.banner} role="alert">
            <AlertCircle size={16} className={styles.icon} aria-hidden="true" />
            <p className={styles.message}>{message}</p>
        </div>
    );
}

export default ErrorBanner;
