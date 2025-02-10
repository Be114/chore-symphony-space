
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  createdAt: Date;
}

export type TodoCategory = {
  id: string;
  name: string;
  color: string;
};
