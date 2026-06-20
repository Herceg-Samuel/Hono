import { Hono } from "hono";
import { db } from "../db";
import { courses } from "../db/schema";

const app = new Hono();

app.get("/", async (c) => {
  const allCourses = await db.select().from(courses);

  return c.json({
    success: true,
    data: allCourses,
  });
});

export default app;
