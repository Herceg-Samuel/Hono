import { pgTable, serial, integer, unique } from "drizzle-orm/pg-core";

import { students } from "./students";
import { courses } from "./courses";
import { timestamps } from "./common";

export const registrations = pgTable(
  "registrations",
  {
    id: serial("id").primaryKey(),

    studentId: integer("student_id")
      .references(() => students.id, {
        onDelete: "cascade",
      })
      .notNull(),

    courseId: integer("course_id")
      .references(() => courses.id, {
        onDelete: "cascade",
      })
      .notNull(),

    ...timestamps,
  },
  (table) => [unique().on(table.studentId, table.courseId)],
);
