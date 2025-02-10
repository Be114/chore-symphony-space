
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Todo, TodoCategory } from "@/types/todo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface TodoContextType {
  todos: Todo[];
  categories: TodoCategory[];
  addTodo: (title: string, category: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  editTodo: (id: string, title: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const defaultCategories: TodoCategory[] = [
  { id: "1", name: "仕事", color: "bg-rose-500" },
  { id: "2", name: "個人", color: "bg-blue-500" },
  { id: "3", name: "買い物", color: "bg-green-500" },
];

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories] = useState<TodoCategory[]>(defaultCategories);
  const { user } = useAuth();

  // Todoの初期読み込み
  useEffect(() => {
    if (user) {
      const fetchTodos = async () => {
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          toast.error("Todoの読み込みに失敗しました");
          return;
        }

        setTodos(
          data.map((todo) => ({
            ...todo,
            createdAt: new Date(todo.created_at),
          }))
        );
      };

      fetchTodos();
    }
  }, [user]);

  const addTodo = useCallback(async (title: string, category: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title, category, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast.error("Todoの追加に失敗しました");
      return;
    }

    const newTodo: Todo = {
      ...data,
      createdAt: new Date(data.created_at),
    };

    setTodos((prev) => [newTodo, ...prev]);
    toast.success("タスクを追加しました");
  }, [user]);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", id);

    if (error) {
      toast.error("Todoの更新に失敗しました");
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [todos]);

  const deleteTodo = useCallback(async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      toast.error("Todoの削除に失敗しました");
      return;
    }

    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast.success("タスクを削除しました");
  }, []);

  const editTodo = useCallback(async (id: string, title: string) => {
    const { error } = await supabase
      .from("todos")
      .update({ title })
      .eq("id", id);

    if (error) {
      toast.error("Todoの更新に失敗しました");
      return;
    }

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title } : todo))
    );
    toast.success("タスクを更新しました");
  }, []);

  return (
    <TodoContext.Provider
      value={{ todos, categories, addTodo, toggleTodo, deleteTodo, editTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}
