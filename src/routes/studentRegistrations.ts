import { Hono } from "hono";
import { db } from "../db";
import { registrations, courses } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/:id/registrations", async (c) => {
  const studentId = Number(c.req.param("id"));

  if (!studentId) {
    return c.json({ success: false, message: "Invalid student id" }, 400);
  }

  const result = await db
    .select({
      courseId: courses.id,
      code: courses.code,
      name: courses.name,
    })
    .from(registrations)
    .innerJoin(courses, eq(registrations.courseId, courses.id))
    .where(eq(registrations.studentId, studentId));

  return c.json({
    success: true,
    data: result,
  });
});

export default app;
