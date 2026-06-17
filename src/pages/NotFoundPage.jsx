import { Link } from 'react-router';
import { Compass } from 'lucide-react';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.iconRing}>
                    <Compass size={32} strokeWidth={1.5} />
                </div>
                <p className={styles.code}>404</p>
                <h1 className={styles.heading}>Page not found</h1>
                <p className={styles.sub}>
                    The page you're looking for doesn't exist or was moved.
                </p>
                <Link to="/todos" className={styles.btn}>
                    Back to todos
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
