
import { useState } from "react";
import { Todo } from "@/types/todo";
import { useTodo } from "@/context/TodoContext";
import { cn } from "@/lib/utils";
import { Check, Pencil, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, editTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = () => {
    if (editedTitle.trim() !== "") {
      editTodo(todo.id, editedTitle);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md animate-slide-up",
        todo.completed && "opacity-60"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={() => toggleTodo(todo.id)}
      >
        <div
          className={cn(
            "h-4 w-4 rounded border transition-colors",
            todo.completed ? "bg-primary border-primary" : "border-primary"
          )}
        >
          {todo.completed && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
      </Button>

      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            autoFocus
          />
          <Button size="icon" variant="ghost" onClick={handleEdit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setIsEditing(false);
              setEditedTitle(todo.title);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span
            className={cn(
              "flex-1 text-sm",
              todo.completed && "line-through text-muted-foreground"
            )}
          >
            {todo.title}
          </span>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
