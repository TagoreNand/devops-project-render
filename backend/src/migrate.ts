import fs from "fs/promises";
import path from "path";
import { pgPoolFromEnv } from "./taskStorePg";

export async function migrate(): Promise<void> {
  const pool = pgPoolFromEnv();
  try {
    const migrationPath = path.join(
      __dirname,
      "..",
      "migrations",
      "001_init.sql"
    );
    const sql = await fs.readFile(migrationPath, "utf8");
    await pool.query(sql);
  } finally {
    // Ensure we don't keep connections open during `fly release`.
    await pool.end();
  }
}

