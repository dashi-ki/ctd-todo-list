import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from "react"

const todos = [
    {id: 1, title: "Complete coding assignment"},
    {id: 2, title: "Review React basics"},
    {id: 3, title: "Update project README"}
  ]

function App() {
 const [todoList, setTodoList] = useState(todos);

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <TodoList todoList={todoList} />
      
     
    </div>
  )
}

export default App
