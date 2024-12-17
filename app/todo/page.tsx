import { TodoProvider } from "./_contexts/TodoContext";
import { TodoInput } from "./_components/TodoInput";
import { TodoList } from "./_components/TodoList";

export default function HomePage() {
  return (
    <TodoProvider>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">할 일 목록</h1>
        <TodoInput />
        <TodoList />
      </div>
    </TodoProvider>
  );
}
