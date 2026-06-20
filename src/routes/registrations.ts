import { Hono } from "hono";
import { registerStudent } from "../services/registration.service";
import { registerSchema } from "../validators/registration.validator";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const app = new Hono();

app.post("/", async (c) => {
  const body = await c.req.json();

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        message: "Invalid input",
        errors: parsed.error.flatten(),
      },
      400,
    );
  }

  const { studentId, courseId } = parsed.data;

  try {
    const result = await registerStudent(studentId, courseId);

    return c.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    const map: Record<string, ContentfulStatusCode> = {
      STUDENT_NOT_FOUND: 404,
      COURSE_NOT_FOUND: 404,
      ALREADY_REGISTERED: 409,
      COURSE_FULL: 409,
    };

    const status: ContentfulStatusCode = map[err.message] ?? 500;

    return c.json(
      {
        success: false,
        message: err.message,
      },
      status,
    );
  }
});

export default app;
