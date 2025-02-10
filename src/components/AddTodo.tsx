
import { useState } from "react";
import { useTodo } from "@/context/TodoContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddTodo() {
  const { addTodo, categories } = useTodo();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTodo(title.trim(), category);
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを入力..."
        className="flex-1"
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${cat.color}`} />
                <span>{cat.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!title.trim()}>
        追加
      </Button>
    </form>
  );
}
