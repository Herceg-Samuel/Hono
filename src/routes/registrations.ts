import { Hono } from "hono";
import { db } from "../db";
import { registrations, students, courses } from "../db/schema";
import { and, eq } from "drizzle-orm";

const app = new Hono();

app.post("/", async (c) => {
  const body = await c.req.json();

  const { studentId, courseId } = body;

  if (!studentId || !courseId) {
    return c.json(
      {
        success: false,
        message: "studentId and courseId are required",
      },
      400,
    );
  }

  // 1. Check student exists
  const student = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (student.length === 0) {
    return c.json({ success: false, message: "Student not found" }, 404);
  }

  // 2. Check course exists
  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (course.length === 0) {
    return c.json({ success: false, message: "Course not found" }, 404);
  }

  // 3. Check duplicate registration
  const existing = await db
    .select()
    .from(registrations)
    .where(
      and(
        eq(registrations.studentId, studentId),
        eq(registrations.courseId, courseId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return c.json({ success: false, message: "Already registered" }, 409);
  }

  // 4. Check capacity
  const registeredCount = await db
    .select()
    .from(registrations)
    .where(eq(registrations.courseId, courseId));

  if (registeredCount.length >= course[0].capacity) {
    return c.json({ success: false, message: "Course is full" }, 409);
  }

  // 5. Register student
  const result = await db
    .insert(registrations)
    .values({
      studentId,
      courseId,
    })
    .returning();

  return c.json({
    success: true,
    data: result[0],
  });
});

app.delete("/", async (c) => {
  const body = await c.req.json();

  const { studentId, courseId } = body;

  if (!studentId || !courseId) {
    return c.json(
      {
        success: false,
        message: "studentId and courseId are required",
      },
      400,
    );
  }

  // 1. Check if registration exists
  const existing = await db
    .select()
    .from(registrations)
    .where(
      and(
        eq(registrations.studentId, studentId),
        eq(registrations.courseId, courseId),
      ),
    )
    .limit(1);

  if (existing.length === 0) {
    return c.json(
      {
        success: false,
        message: "Registration not found",
      },
      404,
    );
  }

  // 2. Delete registration
  await db
    .delete(registrations)
    .where(
      and(
        eq(registrations.studentId, studentId),
        eq(registrations.courseId, courseId),
      ),
    );

  return c.json({
    success: true,
    message: "Course dropped successfully",
  });
});

export default app;
