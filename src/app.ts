import { Hono } from "hono";
import coursesRoute from "./routes/courses";
import studentsRoute from "./routes/students";
import registrationsRoute from "./routes/registrations";
import studentRegistrationsRoute from "./routes/studentRegistrations";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "API is running",
  });
});

app.route("/courses", coursesRoute);
app.route("/students", studentsRoute);
app.route("/register", registrationsRoute);
app.route("/students", studentRegistrationsRoute);

export default app;
