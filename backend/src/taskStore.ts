export type Task = {
  id: number;
  title: string;
  status: string;
  createdAt: string;
};

export interface TaskStore {
  list(): Promise<Task[]>;
  create(title: string): Promise<Task>;
  deleteById(id: number): Promise<boolean>;
}

