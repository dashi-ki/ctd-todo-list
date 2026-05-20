import { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';

function TodosPage({ token }) {
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    useEffect(() => {
        async function fetchTodos() {
            setIsTodoListLoading(true);
            try {
                const response = await fetch('/api/tasks', {
                    headers: { 'X-CSRF-TOKEN': token },
                    credentials: 'include'
                });
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch todos');
                }
                const data = await response.json();
                setTodoList(data.tasks);
            } catch (err) {
                setError(`Error: ${err.name} | ${err.message}`);
            } finally {
                setIsTodoListLoading(false);
            }
        }

        if (token) {
            fetchTodos();
        }
    }, [token]);

    async function addTodo(todoTitle) {
        const newTodo = {
            id: Date.now(),
            title: todoTitle,
            isCompleted: false
        };
        setTodoList(previous => [newTodo, ...previous]);
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include',
                body: JSON.stringify({ title: todoTitle, isCompleted: false })
            });
            if (!response.ok) {
                throw new Error('Failed to add todo');
            }
            const data = await response.json();
            setTodoList(previous => previous.map(todo =>
                todo.id === newTodo.id ? data : todo
            ));
        } catch (err) {
            setTodoList(previous => previous.filter(todo => todo.id !== newTodo.id));
            setError(`Error: ${err.name} | ${err.message}`);
        }
    }

    async function completeTodo(id) {
        const originalTodo = todoList.find(todo => todo.id === id);
        setTodoList(previous => previous.map(todo =>
            todo.id === id ? { ...todo, isCompleted: true } : todo
        ));
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include',
                body: JSON.stringify({ isCompleted: true })
            });
            if (!response.ok) {
                throw new Error('Failed to complete todo');
            }
        } catch (err) {
            setTodoList(previous => previous.map(todo =>
                todo.id === id ? originalTodo : todo
            ));
            setError(`Error: ${err.name} | ${err.message}`);
        }
    }

    async function updateTodo(editedTodo) {
        const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
        setTodoList(previous => previous.map(todo =>
            todo.id === editedTodo.id ? { ...editedTodo } : todo
        ));
        try {
            const response = await fetch(`/api/tasks/${editedTodo.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include',
                body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted })
            });
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
        } catch (err) {
            setTodoList(previous => previous.map(todo =>
                todo.id === editedTodo.id ? originalTodo : todo
            ));
            setError(`Error: ${err.name} | ${err.message}`);
        }
    }

    return (
        <div>
            {error && (
                <div>
                    <p>{error}</p>
                    <button onClick={() => setError('')}>Clear Error</button>
                </div>
            )}
            {isTodoListLoading && <p>Loading...</p>}
            <TodoForm onAddTodo={addTodo} />
            <TodoList
                todoList={todoList}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
            />
        </div>
    );
}

export default TodosPage;
