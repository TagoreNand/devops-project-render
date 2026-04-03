import request from "supertest";
import { createApp } from "../src/app";
import { migrate } from "../src/migrate";
import { PgTaskStore, pgPoolFromEnv } from "../src/taskStorePg";

const runDbTests =
  process.env.RUN_DB_TESTS === "1" && typeof process.env.DATABASE_URL === "string";

const describeIf = runDbTests ? describe : describe.skip;

describeIf("Tasks API (integration - Postgres)", () => {
  it("persists tasks using the real database", async () => {
    await migrate();

    const pool = pgPoolFromEnv();
    const store = new PgTaskStore(pool);
    const app = createApp(store);

    try {
      const created = await request(app)
        .post("/api/tasks")
        .send({ title: "From integration test" });
      expect(created.status).toBe(201);

      const listRes = await request(app).get("/api/tasks");
      expect(listRes.status).toBe(200);
      expect(listRes.body.some((t: any) => t.title === "From integration test")).toBe(
        true
      );

      const deleteRes = await request(app).delete(
        `/api/tasks/${created.body.id}`
      );
      expect(deleteRes.status).toBe(204);
    } finally {
      await pool.end();
    }
  });
});

