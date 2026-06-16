export const TODO_ACTIONS = {
  // Fetch
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',

  // Add
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',

  // Update (covers both title edits and toggling completion)
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  // Delete
  DELETE_TODO_SUCCESS: 'DELETE_TODO_SUCCESS',
  DELETE_TODO_ERROR: 'DELETE_TODO_ERROR',

  // UI
  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
  RESET_FILTERS: 'RESET_FILTERS',
};

export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: true,
  sortBy: 'createdAt',
  sortDirection: 'desc',
  filterTerm: '',
};

export function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };

    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        isTodoListLoading: false,
        todoList: action.payload.todos,
        filterError: '',
      };

    case TODO_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        isTodoListLoading: false,
        error: action.payload.isFilterError ? state.error : action.payload.message,
        filterError: action.payload.isFilterError ? action.payload.message : state.filterError,
        // On a filter/search error, clear the list so an empty state shows
        // instead of leaving the previous (unfiltered) results on screen.
        todoList: action.payload.isFilterError ? [] : state.todoList,
      };

    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      return {
        ...state,
        todoList: [action.payload.todo, ...state.todoList],
      };

    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
      };

    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.todo.id ? action.payload.todo : todo
        ),
      };

    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
      };

    case TODO_ACTIONS.DELETE_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.filter((todo) => todo.id !== action.payload.id),
      };

    case TODO_ACTIONS.DELETE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
      };

    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterTerm: action.payload.filterTerm,
      };

    case TODO_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: '',
      };

    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
      return {
        ...state,
        filterError: '',
      };

    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: '',
        sortBy: 'createdAt',
        sortDirection: 'desc',
        filterError: '',
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
