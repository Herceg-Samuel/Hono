import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "./common";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  regNo: varchar("reg_no", { length: 50 }).notNull().unique(),

  ...timestamps,
});
