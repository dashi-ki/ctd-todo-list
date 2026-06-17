import { useReducer, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import TodoForm from '../features/Todos/TodoForm';
import TodoList from '../features/Todos/TodoList/TodoList';
import FilterInput from '../shared/FilterInput';
import ErrorBanner from '../shared/ErrorBanner';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer';
import { useAuth } from '../contexts/AuthContext';

function TodosPage() {
    const { token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // All UI state lives in the URL — sidebar owns writing these
    const statusFilter   = searchParams.get('status')        || 'all';
    const sortBy         = searchParams.get('sortBy')        || 'createdAt';
    const sortDirection  = searchParams.get('sortDirection') || 'desc';
    const priorityFilter = (searchParams.get('priority') || '').split(',').filter(Boolean);

    const [state, dispatch] = useReducer(todoReducer, initialTodoState);
    const { todoList, error, isTodoListLoading, filterTerm } = state;

    // Fetch all todos once — sort/filter/search happen client-side
    useEffect(() => {
        async function fetchTodos() {
            dispatch({ type: TODO_ACTIONS.FETCH_START });
            try {
                const response = await fetch('/api/tasks?limit=100', {
                    headers: { 'X-CSRF-TOKEN': token },
                    credentials: 'include',
                });
                if (response.status === 401) throw new Error('Your session has expired. Please log in again.');
                // API returns 404 when user has no tasks — treat as empty
                if (response.status === 404) {
                    dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { todos: [] } });
                    return;
                }
                if (!response.ok) throw new Error('Something went wrong loading your tasks.');
                const data = await response.json();
                dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { todos: data.tasks ?? [] } });
            } catch (err) {
                dispatch({ type: TODO_ACTIONS.FETCH_ERROR, payload: { message: err.message } });
            }
        }

        if (token) fetchTodos();
    }, [token]); // re-fetch only on login/logout

    // Client-side search + sort — instant, no loading flash
    const processedList = useMemo(() => {
        let list = [...todoList];

        // Search
        if (filterTerm.trim()) {
            const term = filterTerm.trim().toLowerCase();
            list = list.filter((t) => t.title.toLowerCase().includes(term));
        }

        // Sort
        list.sort((a, b) => {
            if (sortBy === 'title') {
                const cmp = a.title.localeCompare(b.title);
                return sortDirection === 'asc' ? cmp : -cmp;
            }
            // createdAt (default)
            const dateA = new Date(a.createdAt ?? 0);
            const dateB = new Date(b.createdAt ?? 0);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return list;
    }, [todoList, filterTerm, sortBy, sortDirection]);

    const handleFilterChange = (newTerm) =>
        dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { filterTerm: newTerm } });

    const handleResetFilters = () => {
        dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
        setSearchParams((prev) => {
            prev.set('status', 'all');
            prev.delete('priority');
            return prev;
        });
    };

    async function addTodo(todoTitle, priority = 'medium') {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
                credentials: 'include',
                body: JSON.stringify({ title: todoTitle, isCompleted: false, priority }),
            });
            if (!response.ok) throw new Error("Couldn't add the task. Please try again.");
            const data = await response.json();
            dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: { todo: data } });
        } catch (err) {
            dispatch({ type: TODO_ACTIONS.ADD_TODO_ERROR, payload: { message: err.message } });
        }
    }

    async function updateTodo(editedTodo) {
        try {
            const response = await fetch(`/api/tasks/${editedTodo.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
                credentials: 'include',
                body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted }),
            });
            if (!response.ok) throw new Error("Couldn't save changes. Please try again.");
            dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS, payload: { todo: editedTodo } });
        } catch (err) {
            dispatch({ type: TODO_ACTIONS.UPDATE_TODO_ERROR, payload: { message: err.message } });
        }
    }

    async function toggleTodo(todo) {
        await updateTodo({ ...todo, isCompleted: !todo.isCompleted });
    }

    async function deleteTodo(id) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': token },
                credentials: 'include',
            });
            if (!response.ok) throw new Error("Couldn't delete the task. Please try again.");
            dispatch({ type: TODO_ACTIONS.DELETE_TODO_SUCCESS, payload: { id } });
        } catch (err) {
            dispatch({ type: TODO_ACTIONS.DELETE_TODO_ERROR, payload: { message: err.message } });
        }
    }

    return (
        <div>
            <ErrorBanner
                message={error}
                onDismiss={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
            />
            <TodoForm onAddTodo={addTodo} />
            <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
            <TodoList
                todoList={processedList}
                onToggleTodo={toggleTodo}
                onUpdateTodo={updateTodo}
                onDeleteTodo={deleteTodo}
                statusFilter={statusFilter}
                priorityFilter={priorityFilter}
                filterTerm={filterTerm}
                onResetFilters={handleResetFilters}
                isLoading={isTodoListLoading}
            />
        </div>
    );
}

export default TodosPage;
