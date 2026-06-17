import { Outlet, Link, useSearchParams, useLocation, useNavigate } from 'react-router';
import { User, Power, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logoff from '../shared/Logoff';
import styles from './SidebarLayout.module.css';

const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Date' },
    { value: 'title',     label: 'Title' },
];

const PRIORITY_OPTIONS = [
    { value: 'high',   label: 'High',   color: '--color-priority-high' },
    { value: 'medium', label: 'Medium', color: '--color-priority-medium' },
    { value: 'low',    label: 'Low',    color: '--color-priority-low' },
];

// Preserves sort params when switching status tabs
function StatusLink({ status, label }) {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const currentStatus = searchParams.get('status') || 'all';
    const isTodosPage = location.pathname === '/todos';
    const isActive = isTodosPage && currentStatus === status;

    // Build URL keeping current sort params
    const params = new URLSearchParams();
    params.set('status', status);
    const sortBy = searchParams.get('sortBy');
    const sortDirection = searchParams.get('sortDirection');
    if (sortBy) params.set('sortBy', sortBy);
    if (sortDirection) params.set('sortDirection', sortDirection);

    return (
        <Link
            to={`/todos?${params}`}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
            {label}
        </Link>
    );
}

function SidebarLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isTodosPage = location.pathname === '/todos';
    const [searchParams, setSearchParams] = useSearchParams();

    const sortBy        = searchParams.get('sortBy')        || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    const activePriorities = new Set(
        (searchParams.get('priority') || '').split(',').filter(Boolean)
    );

    const setSortBy = (value) =>
        setSearchParams((prev) => { prev.set('sortBy', value); return prev; });

    const toggleDirection = () =>
        setSearchParams((prev) => {
            prev.set('sortDirection', sortDirection === 'desc' ? 'asc' : 'desc');
            return prev;
        });

    const togglePriority = (value) =>
        setSearchParams((prev) => {
            const current = new Set((prev.get('priority') || '').split(',').filter(Boolean));
            current.has(value) ? current.delete(value) : current.add(value);
            if (current.size > 0) prev.set('priority', [...current].join(','));
            else prev.delete('priority');
            return prev;
        });

    const handleLogoff = async () => {
        const result = await logout();
        if (result.success) navigate('/login');
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>

                {/* ── Mobile top bar: title + icon actions ── */}
                <div className={styles.mobileTopBar}>
                    <Link to="/todos" className={styles.appName}>Todo List</Link>
                    <div className={styles.mobileActions}>
                        <Link to="/profile" className={styles.iconBtn} aria-label="Profile">
                            <User size={18} />
                        </Link>
                        <button
                            type="button"
                            className={styles.iconBtn}
                            aria-label="Log off"
                            onClick={handleLogoff}
                        >
                            <Power size={18} />
                        </button>
                    </div>
                </div>

                {/* ── Desktop app name ── */}
                <Link to="/todos" className={styles.appName}>Todo List</Link>

                {/* ── Status filter nav — todos only ── */}
                {isTodosPage && (
                    <nav className={styles.nav}>
                        <StatusLink status="all"       label="All" />
                        <StatusLink status="active"    label="Active" />
                        <StatusLink status="completed" label="Completed" />
                    </nav>
                )}

                {/* ── Priority filter — todos only ── */}
                {isTodosPage && (
                    <div className={styles.prioritySection}>
                        <span className={styles.sectionLabel}>Priority</span>
                        {PRIORITY_OPTIONS.map(({ value, label, color }) => {
                            const isActive = activePriorities.has(value);
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    className={`${styles.priorityRow} ${isActive ? styles.priorityRowActive : ''}`}
                                    onClick={() => togglePriority(value)}
                                    aria-pressed={isActive}
                                >
                                    <span
                                        className={`${styles.priorityBullet} ${isActive ? styles.priorityBulletActive : ''}`}
                                        style={{ '--p-color': `var(${color})` }}
                                    />
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Sort controls — todos only ── */}
                {isTodosPage && (
                    <div className={styles.sortSection}>
                        <span className={styles.sectionLabel}>Sort by</span>
                        {SORT_OPTIONS.map(({ value, label }) => (
                            <div key={value} className={styles.sortRow}>
                                <button
                                    type="button"
                                    className={`${styles.sortItem} ${sortBy === value ? styles.sortItemActive : ''}`}
                                    onClick={() => setSortBy(value)}
                                >
                                    {label}
                                </button>
                                {sortBy === value && (
                                    <button
                                        type="button"
                                        className={styles.directionBtn}
                                        onClick={toggleDirection}
                                        aria-label={sortDirection === 'desc' ? 'Sort ascending' : 'Sort descending'}
                                    >
                                        {sortDirection === 'desc'
                                            ? <ArrowDown size={14} />
                                            : <ArrowUp size={14} />}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.spacer} />

                {/* ── Desktop bottom: profile + logout ── */}
                <div className={styles.bottom}>
                    <Link to="/profile" className={styles.navItem} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={15} strokeWidth={1.75} />
                        Profile
                    </Link>
                    <Logoff />
                </div>

            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}

export default SidebarLayout;
