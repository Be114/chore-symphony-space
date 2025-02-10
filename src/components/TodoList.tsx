
import { useTodo } from "@/context/TodoContext";
import { TodoItem } from "./TodoItem";

export function TodoList() {
  const { todos } = useTodo();

  if (todos.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        タスクがありません
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
