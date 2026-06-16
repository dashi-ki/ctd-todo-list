import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';
import EmptyState from './EmptyState.jsx';

function TodoList({ todoList, onToggleTodo, onUpdateTodo, onDeleteTodo, statusFilter = 'active' }) {
    const filteredTodoList = useMemo(() => {
        switch (statusFilter) {
            case 'completed':
                return todoList.filter((todo) => todo.isCompleted);
            case 'active':
                return todoList.filter((todo) => !todo.isCompleted);
            case 'all':
            default:
                return todoList;
        }
    }, [todoList, statusFilter]);

    const getEmptyMessage = () => {
        switch (statusFilter) {
            case 'completed':
                return 'No completed todos yet. Complete some tasks to see them here.';
            case 'active':
                return 'No active todos. Add a todo above to get started.';
            case 'all':
            default:
                return 'Add todo above to get started.';
        }
    };

    return filteredTodoList.length === 0 ? (
        <EmptyState message={getEmptyMessage()} />
    ) : (
        <ul style={{ listStyle: 'none' }}>
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
