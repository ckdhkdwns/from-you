"use client";

import { createContext, useState, useContext } from "react";
import { Todo, TodoContextType } from "../_types/todo";
import { saveTodo } from "@/infra/dynamo/tables/todo";

export const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = async (text: string) => {
    setTodos((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        text,
        completed: false,
      },
    ]);
    await saveTodo(text);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo }}>
      {children}
    </TodoContext.Provider>
  );
}
