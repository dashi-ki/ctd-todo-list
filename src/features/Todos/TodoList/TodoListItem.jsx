import { useState, useRef, useEffect } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { isValidTodoTitle, sanitizeTodoTitle } from '../../../utils/todoValidation';
import styles from './TodoListItem.module.css';

const PRIORITY_COLORS = {
    high:   '--color-priority-high',
    medium: '--color-priority-medium',
    low:    '--color-priority-low',
};

const PRIORITIES = [
    { value: 'low',    color: '--color-priority-low',    label: 'Low priority' },
    { value: 'medium', color: '--color-priority-medium', label: 'Medium priority' },
    { value: 'high',   color: '--color-priority-high',   label: 'High priority' },
];

function TodoListItem({ todo, onToggleTodo, onUpdateTodo, onDeleteTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);
    const [workingPriority, setWorkingPriority] = useState(todo.priority || 'medium');
    const inputRef = useRef();

    useEffect(() => {
        if (isEditing) inputRef.current?.focus();
    }, [isEditing]);

    const handleCancel = () => {
        setWorkingTitle(todo.title);
        setWorkingPriority(todo.priority || 'medium');
        setIsEditing(false);
    };

    const handleUpdate = (e) => {
        e?.preventDefault();
        if (!isValidTodoTitle(workingTitle)) return;
        onUpdateTodo({ ...todo, title: sanitizeTodoTitle(workingTitle), priority: workingPriority });
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleCancel();
    };

    const priorityColor = PRIORITY_COLORS[todo.priority] || PRIORITY_COLORS.medium;

    return (
        <li className={styles.item} style={{ '--p-color': `var(${priorityColor})` }}>
            {isEditing ? (
                <>
                    <form className={styles.editForm} onSubmit={handleUpdate}>
                        <input
                            ref={inputRef}
                            className={styles.editInput}
                            value={workingTitle}
                            onChange={(e) => setWorkingTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength={200}
                            aria-label="Edit todo"
                        />
                        <div className={styles.editPriorityPicker} role="group" aria-label="Priority">
                            {PRIORITIES.map(({ value, color, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`${styles.editPriorityDot} ${workingPriority === value ? styles.editPriorityDotActive : ''}`}
                                    style={{ '--p-color': `var(${color})` }}
                                    onClick={() => setWorkingPriority(value)}
                                    aria-pressed={workingPriority === value}
                                    aria-label={label}
                                />
                            ))}
                        </div>
                        <div className={styles.editActions}>
                            <button
                                type="submit"
                                className={styles.saveBtn}
                                disabled={!isValidTodoTitle(workingTitle)}
                            >
                                Save
                            </button>
                            <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <div className={styles.mainRow}>
                        <input
                            type="checkbox"
                            id={`checkbox${todo.id}`}
                            className={styles.checkbox}
                            checked={todo.isCompleted}
                            onChange={() => onToggleTodo(todo)}
                        />
                        <label
                            htmlFor={`checkbox${todo.id}`}
                            className={`${styles.title} ${todo.isCompleted ? styles.titleCompleted : ''}`}
                        >
                            {todo.title}
                        </label>
                        <div className={`${styles.actions} ${styles.actionsDesktop}`}>
                            <button
                                type="button"
                                className={styles.editBtn}
                                onClick={() => setIsEditing(true)}
                                aria-label="Edit todo"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => onDeleteTodo(todo.id)}
                                aria-label="Delete todo"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    <div className={styles.bottomRow}>
                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.editBtn}
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => onDeleteTodo(todo.id)}
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    </div>
                </>
            )}
        </li>
    );
}

export default TodoListItem;
