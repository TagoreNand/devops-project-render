"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const taskStorePg_1 = require("./taskStorePg");
function createApp(taskStore) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const store = taskStore ?? new taskStorePg_1.PgTaskStore((0, taskStorePg_1.pgPoolFromEnv)());
    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "ok" });
    });
    app.get("/api/tasks", async (_req, res) => {
        const tasks = await store.list();
        res.status(200).json(tasks);
    });
    app.post("/api/tasks", async (req, res) => {
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
    app.delete("/api/tasks/:id", async (req, res) => {
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
    app.use((err, _req, res, _next) => {
        // eslint-disable-next-line no-console
        console.error(err);
        res.status(500).json({ error: "internal_error" });
    });
    return app;
}
