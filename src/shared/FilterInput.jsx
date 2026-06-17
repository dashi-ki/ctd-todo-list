import { Search, X } from 'lucide-react';
import styles from './FilterInput.module.css';

function FilterInput({ filterTerm, onFilterChange }) {
    return (
        <div className={styles.wrapper}>
            <Search size={16} className={styles.icon} aria-hidden="true" />
            <input
                id="filterInput"
                type="search"
                className={styles.input}
                value={filterTerm}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="Search todos…"
                aria-label="Search todos"
                autoComplete="off"
            />
            {filterTerm && (
                <button
                    type="button"
                    className={styles.clear}
                    onClick={() => onFilterChange('')}
                    aria-label="Clear search"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

export default FilterInput;
