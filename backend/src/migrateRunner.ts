import { migrate } from "./migrate";

async function main(): Promise<void> {
  await migrate();
  // eslint-disable-next-line no-console
  console.log("Migrations completed");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

