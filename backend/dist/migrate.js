"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = migrate;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const taskStorePg_1 = require("./taskStorePg");
async function migrate() {
    const pool = (0, taskStorePg_1.pgPoolFromEnv)();
    try {
        const migrationPath = node_path_1.default.join(__dirname, "..", "migrations", "001_init.sql");
        const sql = await promises_1.default.readFile(migrationPath, "utf8");
        await pool.query(sql);
    }
    finally {
        // Ensure we don't keep connections open during `fly release`.
        await pool.end();
    }
}
