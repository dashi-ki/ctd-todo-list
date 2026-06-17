import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, LayoutList } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ErrorBanner from '../shared/ErrorBanner';
import styles from './ProfilePage.module.css';

function Avatar({ email }) {
    const initials = email
        ? email.slice(0, 2).toUpperCase()
        : '??';
    return <div className={styles.avatar}>{initials}</div>;
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ '--stat-color': color }}>
                <Icon size={18} strokeWidth={1.75} />
            </div>
            <div className={styles.statValue}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
        </div>
    );
}

function PriorityRow({ label, color, total, completed }) {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return (
        <div className={styles.priorityRow}>
            <span className={styles.priorityDot} style={{ background: color }} />
            <span className={styles.priorityLabel}>{label}</span>
            <div className={styles.priorityBar}>
                <div className={styles.priorityBarFill} style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className={styles.priorityCount}>{completed}/{total}</span>
        </div>
    );
}

function ProfilePage() {
    const { email, token } = useAuth();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;
        async function fetchTodos() {
            try {
                const response = await fetch('/api/tasks?limit=100', {
                    headers: { 'X-CSRF-TOKEN': token },
                    credentials: 'include',
                });
                if (response.status === 401) throw new Error('Your session has expired. Please log in again.');
                if (response.status === 404) { setTodos([]); setLoading(false); return; }
                if (!response.ok) throw new Error("Couldn't load your stats. Please try again.");
                const data = await response.json();
                setTodos(Array.isArray(data.tasks) ? data.tasks : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTodos();
    }, [token]);

    const total     = todos.length;
    const completed = todos.filter((t) => t.isCompleted).length;
    const active    = total - completed;
    const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byPriority = ['high', 'medium', 'low'].map((p) => {
        const group = todos.filter((t) => t.priority === p);
        return {
            key: p,
            label: p.charAt(0).toUpperCase() + p.slice(1),
            color: `var(--color-priority-${p})`,
            total: group.length,
            completed: group.filter((t) => t.isCompleted).length,
        };
    });

    const displayName = email?.split('@')[0] ?? 'User';

    return (
        <div className={styles.page}>
            {/* ── Header ── */}
            <div className={styles.header}>
                <Avatar email={email} />
                <div className={styles.userInfo}>
                    <p className={styles.userName}>{displayName}</p>
                    {email && email !== displayName && (
                        <p className={styles.userEmail}>{email}</p>
                    )}
                </div>
            </div>

            {loading && <p className={styles.loading}>Loading stats…</p>}
            <ErrorBanner message={error} onDismiss={() => setError('')} />

            {!loading && !error && (
                <>
                    {/* ── Stat cards ── */}
                    <div className={styles.statsGrid}>
                        <StatCard icon={LayoutList}   label="Total"     value={total}     color="var(--color-primary)" />
                        <StatCard icon={CheckCircle2} label="Completed" value={completed} color="var(--color-priority-low)" />
                        <StatCard icon={Circle}       label="Active"    value={active}    color="var(--color-priority-medium)" />
                    </div>

                    {/* ── Progress bar ── */}
                    {total > 0 && (
                        <div className={styles.progressSection}>
                            <div className={styles.progressHeader}>
                                <span>Overall progress</span>
                                <span className={styles.progressPct}>{pct}%</span>
                            </div>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                    )}

                    {/* ── Priority breakdown ── */}
                    {total > 0 && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>By priority</h3>
                            <div className={styles.priorityList}>
                                {byPriority.map(({ key, ...props }) => (
                                    <PriorityRow key={key} {...props} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ProfilePage;
