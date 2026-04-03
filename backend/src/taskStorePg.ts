import { Pool } from "pg";
import { Task, TaskStore } from "./taskStore";

type TaskRow = {
  id: number;
  title: string;
  status: string;
  created_at: string;
};

export function pgPoolFromEnv(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({ connectionString: databaseUrl });
}

export class PgTaskStore implements TaskStore {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async list(): Promise<Task[]> {
    const result = await this.pool.query<TaskRow>(
      "SELECT id, title, status, created_at FROM tasks ORDER BY id DESC"
    );

    return result.rows.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      createdAt: r.created_at
    }));
  }

  async create(title: string): Promise<Task> {
    const result = await this.pool.query<TaskRow>(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, status, created_at",
      [title]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      status: row.status,
      createdAt: row.created_at
    };
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM tasks WHERE id = $1", [
      id
    ]);
    return (result.rowCount ?? 0) > 0;
  }
}

