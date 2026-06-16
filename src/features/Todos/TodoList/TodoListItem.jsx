import { useState } from 'react';
import { isValidTodoTitle } from '../../../utils/todoValidation';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';

function TodoListItem({ todo, onToggleTodo, onUpdateTodo, onDeleteTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    const handleCancel = () => {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    };

    const handleUpdate = (event) => {
        if (!isEditing) return;
        event.preventDefault();
        onUpdateTodo({ ...todo, title: workingTitle });
        setIsEditing(false);
    };

    return (
        <li>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <TextInputWithLabel
                            value={workingTitle}
                            onChange={(event) => setWorkingTitle(event.target.value)}
                        />
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={!isValidTodoTitle(workingTitle)}
                        >
                            Update
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type="checkbox"
                            id={`checkbox${todo.id}`}
                            checked={todo.isCompleted}
                            onChange={() => onToggleTodo(todo)}
                        />
                        <label htmlFor={`checkbox${todo.id}`} onClick={() => setIsEditing(true)}>
                            {todo.title}
                        </label>
                        <button type="button" onClick={() => onDeleteTodo(todo.id)}>Delete</button>
                    </>
                )}
            </form>
        </li>
    );
}

export default TodoListItem;
