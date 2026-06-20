import { db } from "./index";
import { courses } from "./schema";

async function seed() {
  await db.insert(courses).values([
    {
      code: "C026",
      name: "Computer Science",
      semester: 1,
      capacity: 150,
    },
    {
      code: "C015",
      name: "Information Technology",
      semester: 1,
      capacity: 120,
    },
    {
      code: "C104",
      name: "Software Engineering",
      semester: 2,
      capacity: 80,
    },
  ]);

  console.log("Seed completed.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
