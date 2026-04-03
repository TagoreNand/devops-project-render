import request from "supertest";
import { createApp } from "../src/app";
import { FakeTaskStore } from "./fakeTaskStore";

describe("Tasks API (unit)", () => {
  it("can create, list, and delete tasks", async () => {
    const store = new FakeTaskStore();
    const app = createApp(store);

    const created = await request(app).post("/api/tasks").send({ title: "Demo" });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe("Demo");
    expect(created.body.status).toBe("open");

    const listRes = await request(app).get("/api/tasks");
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].title).toBe("Demo");

    const deleteRes = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(deleteRes.status).toBe(204);

    const listAfter = await request(app).get("/api/tasks");
    expect(listAfter.status).toBe(200);
    expect(listAfter.body.length).toBe(0);
  });
});

