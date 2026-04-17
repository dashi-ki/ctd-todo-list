function TodoList() {
     const todoList = [
    {id: 1, title: "Complete coding assignment"},
    {id: 2, title: "Review React basics"},
    {id: 3, title: "Update project README"}
  ]
    
    return (
        <>
            <ul>
                {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
            </ul>
        </>
    )
}

export default TodoList;
