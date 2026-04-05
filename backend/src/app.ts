import express from "express";
import { PgTaskStore, pgPoolFromEnv } from "./taskStorePg";
import { TaskStore } from "./taskStore";

export function createApp(taskStore?: TaskStore) {
  const app = express();
  app.use(express.json());

  const store = taskStore ?? new PgTaskStore(pgPoolFromEnv());

  app.get("/", (_req: express.Request, res: express.Response) => {
    res.status(200).json({
      service: "devops-advanced-backend",
      message: "API is running. Try GET /health or GET /api/tasks.",
      endpoints: {
        health: "GET /health",
        listTasks: "GET /api/tasks",
        createTask: "POST /api/tasks (JSON body: { \"title\": \"...\" })",
        deleteTask: "DELETE /api/tasks/:id"
      }
    });
  });

  app.get("/health", (_req: express.Request, res: express.Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/api/tasks", async (_req: express.Request, res: express.Response) => {
    const tasks = await store.list();
    res.status(200).json(tasks);
  });

  app.post("/api/tasks", async (req: express.Request, res: express.Response) => {
    const title = req.body?.title;
    if (typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({ error: "`title` must be a non-empty string" });
      return;
    }
    if (title.length > 200) {
      res.status(400).json({ error: "`title` must be <= 200 chars" });
      return;
    }
    const task = await store.create(title.trim());
    res.status(201).json(task);
  });

  app.delete("/api/tasks/:id", async (req: express.Request, res: express.Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "`id` must be a number" });
      return;
    }

    const deleted = await store.deleteById(id);
    if (!deleted) {
      res.status(404).json({ error: "task not found" });
      return;
    }

    res.status(204).send();
  });

  // Basic error handler to keep responses consistent.
  // (In production you may want to add request IDs and structured logging.)
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      // eslint-disable-next-line no-console
      console.error(err);
      res.status(500).json({ error: "internal_error" });
    }
  );

  return app;
}

