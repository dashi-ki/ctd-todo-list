import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';
import EmptyState from './EmptyState.jsx';
import styles from './TodoListItem.module.css';

function TodoList({
    todoList,
    onToggleTodo,
    onUpdateTodo,
    onDeleteTodo,
    statusFilter = 'all',
    priorityFilter = [],
    filterTerm = '',
    onResetFilters,
    isLoading = false,
}) {
    const filteredTodoList = useMemo(() => {
        let list = todoList;
        switch (statusFilter) {
            case 'completed': list = list.filter((t) => t.isCompleted);  break;
            case 'active':    list = list.filter((t) => !t.isCompleted); break;
            default:          break;
        }
        if (priorityFilter.length > 0) {
            list = list.filter((t) => priorityFilter.includes(t.priority));
        }
        return list;
    }, [todoList, statusFilter, priorityFilter]);

    const emptyReason = useMemo(() => {
        if (filteredTodoList.length > 0) return null;

        // Priority filter is hiding results that exist in todoList
        if (todoList.length > 0 && priorityFilter.length > 0) return 'priority-filtered';

        // API returned empty — figure out why
        if (todoList.length === 0) {
            if (filterTerm || statusFilter !== 'all') {
                // Special cases: status-only filter with no search
                if (!filterTerm && statusFilter === 'active')    return 'all-caught-up';
                if (!filterTerm && statusFilter === 'completed') return 'none-completed';
                return 'search-filtered';
            }
            return 'first-use';
        }

        return 'first-use';
    }, [filteredTodoList, todoList, filterTerm, statusFilter, priorityFilter]);

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <span className={styles.spinner} aria-hidden="true" />
                Loading tasks…
            </div>
        );
    }

    if (emptyReason) {
        return (
            <EmptyState
                reason={emptyReason}
                filterTerm={filterTerm}
                statusFilter={statusFilter}
                onReset={onResetFilters}
            />
        );
    }

    return (
        <ul className={styles.list}>
            {filteredTodoList.map((todo) => (
                <TodoListItem
                    key={todo.id}
                    todo={todo}
                    onToggleTodo={onToggleTodo}
                    onUpdateTodo={onUpdateTodo}
                    onDeleteTodo={onDeleteTodo}
                />
            ))}
        </ul>
    );
}

export default TodoList;
