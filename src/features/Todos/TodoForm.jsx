import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { isValidTodoTitle, sanitizeTodoTitle } from '../../utils/todoValidation';
import styles from './TodoForm.module.css';

const PRIORITIES = [
    { value: 'low',    color: '--color-priority-low',    label: 'Low priority' },
    { value: 'medium', color: '--color-priority-medium', label: 'Medium priority' },
    { value: 'high',   color: '--color-priority-high',   label: 'High priority' },
];

function TodoForm({ onAddTodo }) {
    const inputRef = useRef();
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValidTodoTitle(title)) return;
        onAddTodo(sanitizeTodoTitle(title), priority);
        setTitle('');
        setPriority('medium');
        inputRef.current.focus();
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                id="todoTitle"
                type="text"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a task…"
                aria-label="New todo title"
                autoComplete="off"
                maxLength={200}
            />

            <div className={styles.priorityPicker} role="group" aria-label="Priority">
                {PRIORITIES.map(({ value, color, label }) => (
                    <button
                        key={value}
                        type="button"
                        className={`${styles.priorityDot} ${priority === value ? styles.priorityDotActive : ''}`}
                        style={{ '--p-color': `var(${color})` }}
                        onClick={() => setPriority(value)}
                        aria-pressed={priority === value}
                        aria-label={label}
                        disabled={!title}
                    />
                ))}
            </div>

            <button
                type="submit"
                className={styles.submit}
                disabled={!isValidTodoTitle(title)}
            >
                <Plus size={15} aria-hidden="true" />
                Add
            </button>
        </form>
    );
}

export default TodoForm;
