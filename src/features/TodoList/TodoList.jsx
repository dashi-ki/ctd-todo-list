import TodoListItem from './TodoListItem.jsx';
import EmptyState from './EmptyState.jsx';


function TodoList({ todoList, onCompleteTodo, onUpdateTodo }) {
    const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
    return filteredTodoList.length === 0 ? (
        <EmptyState />
        ) : (
        <ul style={{ listStyle: "none" }}>
            {filteredTodoList.map((todo) => (
                <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>
            ))}
        </ul>
    );
}

export default TodoList;
