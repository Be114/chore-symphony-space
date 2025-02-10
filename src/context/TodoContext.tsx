
import React, { createContext, useContext, useState, useCallback } from "react";
import { Todo, TodoCategory } from "@/types/todo";
import { toast } from "sonner";

interface TodoContextType {
  todos: Todo[];
  categories: TodoCategory[];
  addTodo: (title: string, category: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, title: string) => void;
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

  const addTodo = useCallback((title: string, category: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      category,
      createdAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    toast.success("タスクを追加しました");
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast.success("タスクを削除しました");
  }, []);

  const editTodo = useCallback((id: string, title: string) => {
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
