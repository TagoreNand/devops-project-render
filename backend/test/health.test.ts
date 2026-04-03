import request from "supertest";
import { createApp } from "../src/app";
import { FakeTaskStore } from "./fakeTaskStore";

describe("GET /health", () => {
  it("returns ok", async () => {
    const app = createApp(new FakeTaskStore());
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

