import { ClipboardList, CheckCheck, Clock, SearchX, Filter } from 'lucide-react';
import styles from './EmptyState.module.css';

const VARIANTS = {
    'first-use': {
        Icon: ClipboardList,
        color: 'var(--color-primary)',
        heading: 'No todos yet',
        sub: 'Add your first task above to get started.',
    },
    'all-caught-up': {
        Icon: CheckCheck,
        color: 'var(--color-priority-low)',
        heading: "You're all caught up!",
        sub: 'No active tasks. Add something new above.',
    },
    'none-completed': {
        Icon: Clock,
        color: 'var(--color-priority-medium)',
        heading: 'Nothing completed yet',
        sub: 'Finish a task and it will show up here.',
    },
    'search-filtered': {
        Icon: SearchX,
        color: 'var(--color-text-muted)',
        heading: 'No results found',
    },
    'priority-filtered': {
        Icon: Filter,
        color: 'var(--color-text-muted)',
        heading: 'No tasks match this priority',
        sub: 'Try selecting a different priority or reset filters.',
    },
};

function EmptyState({ reason = 'first-use', filterTerm, statusFilter, onReset }) {
    const { Icon, color, heading, sub } = VARIANTS[reason] ?? VARIANTS['first-use'];
    const isFilterable = reason === 'search-filtered' || reason === 'priority-filtered';

    const searchSub = filterTerm
        ? `No tasks matching "${filterTerm}"${statusFilter !== 'all' ? ` in ${statusFilter} tasks` : ''}.`
        : `No ${statusFilter !== 'all' ? statusFilter + ' ' : ''}tasks match the current filters.`;

    return (
        <div className={styles.wrapper}>
            <div className={styles.iconRing} style={{ '--icon-color': color }}>
                <Icon size={28} strokeWidth={1.5} />
            </div>
            <p className={styles.heading}>{heading}</p>
            <p className={styles.sub}>{isFilterable ? searchSub : sub}</p>
            {isFilterable && onReset && (
                <button type="button" className={styles.resetBtn} onClick={onReset}>
                    Reset filters
                </button>
            )}
        </div>
    );
}

export default EmptyState;
