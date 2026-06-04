import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';
import EmptyState from './EmptyState.jsx';


function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion }) {
    const filteredTodoList = useMemo(() => {
        return {
            version: dataVersion,
            todos: todoList.filter((todo) => !todo.isCompleted),
        };
    }, [todoList, dataVersion]);

    return filteredTodoList.todos.length === 0 ? (
        <EmptyState />
        ) : (
        <ul style={{ listStyle: "none" }}>
            {filteredTodoList.todos.map((todo) => (
                <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>
            ))}
        </ul>
    );
}

export default TodoList;
