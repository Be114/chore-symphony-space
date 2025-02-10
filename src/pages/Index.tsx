
import { TodoProvider } from "@/context/TodoContext";
import { AddTodo } from "@/components/AddTodo";
import { TodoList } from "@/components/TodoList";

const Index = () => {
  return (
    <TodoProvider>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Todo App</h1>
            <p className="text-muted-foreground">
              シンプルで使いやすいタスク管理アプリ
            </p>
          </div>
          <AddTodo />
          <TodoList />
        </div>
      </div>
    </TodoProvider>
  );
}

export default Index;
