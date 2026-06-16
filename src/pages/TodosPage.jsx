import { useReducer, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import TodoForm from '../features/Todos/TodoForm';
import TodoList from '../features/Todos/TodoList/TodoList';
import SortBy from '../shared/SortBy';
import FilterInput from '../shared/FilterInput';
import StatusFilter from '../shared/StatusFilter';
import useDebounce from '../utils/useDebounce';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer';
import { useAuth } from '../contexts/AuthContext';

function TodosPage() {
    const { token } = useAuth();
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status') || 'all';
    const [state, dispatch] = useReducer(todoReducer, initialTodoState);
    const {
        todoList,
        error,
        filterError,
        isTodoListLoading,
        sortBy,
        sortDirection,
        filterTerm,
    } = state;

    const debouncedFilterTerm = useDebounce(filterTerm, 300);

    useEffect(() => {
        async function fetchTodos() {
            dispatch({ type: TODO_ACTIONS.FETCH_START });
            try {
                const paramsObject = { sortBy, sortDirection, limit: 100 };
                if (statusFilter === 'completed') paramsObject.isCompleted = true;
                else if (statusFilter === 'active') paramsObject.isCompleted = false;
                if (debouncedFilterTerm) paramsObject.find = debouncedFilterTerm;

                const params = new URLSearchParams(paramsObject);
                const response = await fetch(`/api/tasks?${params}`, {
                    headers: { 'X-CSRF-TOKEN': token },
                    credentials: 'include',
                });
                if (response.status === 401) throw new Error('Unauthorized');
                if (!response.ok) throw new Error('Failed to fetch todos');

                const data = await response.json();
                dispatch({
                    type: TODO_ACTIONS.FETCH_SUCCESS,
                    payload: { todos: data.tasks ?? [] },
                });
            } catch (err) {
                const isFilterError = !!(debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc');
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: { message: `Error fetching todos: ${err.message}`, isFilterError },
                });
            }
        }

        if (token) fetchTodos();
    }, [token, sortBy, sortDirection, debouncedFilterTerm, statusFilter]);

    const handleFilterChange = (newTerm) => {
        dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { filterTerm: newTerm } });
    };

    async function addTodo(todoTitle) {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
                credentials: 'include',
                body: JSON.stringify({ title: todoTitle, isCompleted: false }),
            });
            if (!response.ok) throw new Error('Failed to add todo');
            const data = await response.json();
            dispatch({ type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: { todo: data } });
        } catch (err) {
            dispatch({ type: TODO_ACTIONS.ADD_TODO_ERROR, payload: { message: `Error adding todo: ${err.message}` } });
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
            if (!response.ok) throw new Error('Failed to update todo');
            dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS, payload: { todo: editedTodo } });
        } catch (err) {
            dispatch({ type: TODO_ACTIONS.UPDATE_TODO_ERROR, payload: { message: `Error updating todo: ${err.message}` } });
        }
    }

    // Toggle completion by sending the flipped isCompleted value
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
            if (!response.ok) throw new Error('Failed to delete todo');
            dispatch({ type: TODO_ACTIONS.DELETE_TODO_SUCCESS, payload: { id } });
        } catch (err) {
            dispatch({ type: TODO_ACTIONS.DELETE_TODO_ERROR, payload: { message: `Error deleting todo: ${err.message}` } });
        }
    }

    return (
        <div>
            {error && (
                <div>
                    <p>{error}</p>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>Clear Error</button>
                </div>
            )}
            {filterError && (
                <div>
                    <p>{filterError}</p>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>Clear Filter Error</button>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}>Reset Filters</button>
                </div>
            )}
            {isTodoListLoading && <p>Loading...</p>}
            <SortBy
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortByChange={(newSortBy) =>
                    dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy: newSortBy, sortDirection } })
                }
                onSortDirectionChange={(newSortDirection) =>
                    dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy, sortDirection: newSortDirection } })
                }
            />
            <StatusFilter />
            <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
            <TodoForm onAddTodo={addTodo} />
            <TodoList
                todoList={todoList}
                onToggleTodo={toggleTodo}
                onUpdateTodo={updateTodo}
                onDeleteTodo={deleteTodo}
                statusFilter={statusFilter}
            />
        </div>
    );
}

export default TodosPage;
