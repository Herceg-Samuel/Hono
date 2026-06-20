import { db } from "../db";
import { registrations, students, courses } from "../db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function registerStudent(studentId: number, courseId: number) {
  return await db.transaction(async (tx) => {
    // 1. Validate student
    const student = await tx
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (student.length === 0) {
      throw new Error("STUDENT_NOT_FOUND");
    }

    // 2. Validate course
    const course = await tx
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (course.length === 0) {
      throw new Error("COURSE_NOT_FOUND");
    }

    // 3. Check duplicate registration
    const existing = await tx
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
      throw new Error("ALREADY_REGISTERED");
    }

    // 4. SAFE CAPACITY CHECK (inside transaction)
    const countResult = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(registrations)
      .where(eq(registrations.courseId, courseId));

    const currentCount = Number(countResult[0].count);
    const capacity = course[0].capacity;

    if (currentCount >= capacity) {
      throw new Error("COURSE_FULL");
    }

    // 5. Insert registration
    const result = await tx
      .insert(registrations)
      .values({
        studentId,
        courseId,
      })
      .returning();

    return result[0];
  });
}
