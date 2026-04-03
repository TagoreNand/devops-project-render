"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const migrate_1 = require("./migrate");
async function main() {
    await (0, migrate_1.migrate)();
    // eslint-disable-next-line no-console
    console.log("Migrations completed");
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
