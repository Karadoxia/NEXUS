import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.hr.prisma",
  migrations: {
    path: "prisma/migrations-hr",
  },
  datasource: {
    url: process.env["HR_DATABASE_URL"],
  },
});
