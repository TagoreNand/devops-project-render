import { Task, TaskStore } from "../src/taskStore";

export class FakeTaskStore implements TaskStore {
  private tasks: Task[] = [];
  private nextId = 1;

  async list(): Promise<Task[]> {
    return [...this.tasks].sort((a, b) => b.id - a.id);
  }

  async create(title: string): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.nextId++,
      title,
      status: "open",
      createdAt: now
    };
    this.tasks.push(task);
    return task;
  }

  async deleteById(id: number): Promise<boolean> {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length !== before;
  }
}

