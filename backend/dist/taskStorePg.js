"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgTaskStore = void 0;
exports.pgPoolFromEnv = pgPoolFromEnv;
const pg_1 = require("pg");
function pgPoolFromEnv() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL is not set");
    }
    return new pg_1.Pool({ connectionString: databaseUrl });
}
class PgTaskStore {
    constructor(pool) {
        this.pool = pool;
    }
    async list() {
        const result = await this.pool.query("SELECT id, title, status, created_at FROM tasks ORDER BY id DESC");
        return result.rows.map((r) => ({
            id: r.id,
            title: r.title,
            status: r.status,
            createdAt: r.created_at
        }));
    }
    async create(title) {
        const result = await this.pool.query("INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, status, created_at", [title]);
        const row = result.rows[0];
        return {
            id: row.id,
            title: row.title,
            status: row.status,
            createdAt: row.created_at
        };
    }
    async deleteById(id) {
        const result = await this.pool.query("DELETE FROM tasks WHERE id = $1", [
            id
        ]);
        return (result.rowCount ?? 0) > 0;
    }
}
exports.PgTaskStore = PgTaskStore;
