export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
}
