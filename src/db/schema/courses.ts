import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

import { timestamps } from "./common";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),

  code: varchar("code", { length: 20 }).notNull().unique(),

  name: varchar("name", { length: 255 }).notNull(),

  semester: integer("semester").notNull(),

  capacity: integer("capacity").notNull(),

  ...timestamps,
});
