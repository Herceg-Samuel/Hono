import { Hono } from "hono";
import { db } from "../db";
import { students } from "../db/schema";

const app = new Hono();

app.post("/", async (c) => {
  const body = await c.req.json();

  const { name, regNo } = body;

  // 1. Basic validation
  if (!name || !regNo) {
    return c.json(
      {
        success: false,
        message: "name and regNo are required",
      },
      400,
    );
  }

  try {
    // 2. Insert into DB
    const result = await db
      .insert(students)
      .values({
        name,
        regNo,
      })
      .returning();

    // 3. Return created student
    return c.json({
      success: true,
      data: result[0],
    });
  } catch (error: any) {
    // 4. Handle duplicate regNo (unique constraint)
    if (error.code === "23505") {
      return c.json(
        {
          success: false,
          message: "Registration number already exists",
        },
        409,
      );
    }

    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500,
    );
  }
});

export default app;
