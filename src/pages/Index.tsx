
import { TodoProvider } from "@/context/TodoContext";
import { AddTodo } from "@/components/AddTodo";
import { TodoList } from "@/components/TodoList";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <TodoProvider>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Todo App</h1>
              <p className="text-muted-foreground">
                シンプルで使いやすいタスク管理アプリ
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              ログアウト
            </Button>
          </div>
          <AddTodo />
          <TodoList />
        </div>
      </div>
    </TodoProvider>
  );
};

export default Index;
