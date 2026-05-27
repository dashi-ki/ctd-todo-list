import { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import useDebounce from '../../utils/useDebounce';

function TodosPage({ token }) {
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);
    const [sortBy, setSortBy] = useState('creationDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterTerm, setFilterTerm] = useState('');
    const debouncedFilterTerm = useDebounce(filterTerm, 300);
    const [filterError, setFilterError] = useState('');
    const [dataVersion, setDataVersion] = useState(0);

    const invalidateCache = useCallback(() => {
        setDataVersion(prev => prev + 1);
    }, []);

    useEffect(() => {
        async function fetchTodos() {
            setIsTodoListLoading(true);
            try {
                const paramsObject = {
                    sortBy,
                    sortDirection,
                };
                if (debouncedFilterTerm) {
                    paramsObject.find = debouncedFilterTerm;
                }
                const params = new URLSearchParams(paramsObject);
                const response = await fetch(`/api/tasks?${params}`, {
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
                setFilterError('');
            } catch (err) {
                if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
                    setFilterError(`Error filtering/sorting todos: ${err.message}`);
                } else {
                    setError(`Error fetching todos: ${err.message}`);
                }
            } finally {
                setIsTodoListLoading(false);
            }
        }

        if (token) {
            fetchTodos();
        }
    }, [token, sortBy, sortDirection, debouncedFilterTerm]);

    const handleFilterChange = (newTerm) => {
        setFilterTerm(newTerm);
    };

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
            invalidateCache();
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
            invalidateCache();
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
            invalidateCache();
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
            {filterError && (
                <div>
                    <p>{filterError}</p>
                    <button onClick={() => setFilterError('')}>Clear Filter Error</button>
                    <button onClick={() => {
                        setFilterTerm('');
                        setSortBy('creationDate');
                        setSortDirection('desc');
                        setFilterError('');
                    }}>Reset Filters</button>
                </div>
            )}
            {isTodoListLoading && <p>Loading...</p>}
            <SortBy
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortByChange={setSortBy}
                onSortDirectionChange={setSortDirection}
            />
            <FilterInput
                filterTerm={filterTerm}
                onFilterChange={handleFilterChange}
            />
            <TodoForm onAddTodo={addTodo} />
            <TodoList
                todoList={todoList}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                dataVersion={dataVersion}
            />
        </div>
    );
}

export default TodosPage;
