"use client";

import { useTodos } from "../_hooks/useTodos";

export function TodoList() {
  const { todos, toggleTodo } = useTodos();

  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <li 
          key={todo.id}
          onClick={() => toggleTodo(todo.id)}
          className={`p-2 cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  )
}