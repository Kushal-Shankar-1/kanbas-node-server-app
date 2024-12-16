import "dotenv/config"; // Load .env variables
import connectDB from "./db.js";

// Import Mongoose models
import User from "./Kanbas/Users/model.js";
import Course from "./Kanbas/Courses/model.js";
import Module from "./Kanbas/Modules/model.js";
import Assignment from "./Kanbas/Assignments/model.js";
import Enrollment from "./Kanbas/Enrollments/model.js";

// Import JSON data from your local files
import users from "./Kanbas/Database/users.js";
import courses from "./Kanbas/Database/courses.js";
import modules from "./Kanbas/Database/modules.js";
import assignments from "./Kanbas/Database/assignments.js";
import enrollments from "./Kanbas/Database/enrollments.js";

(async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Connected to MongoDB. Starting data seeding...");

    // Clear existing data from all collections
    await User.deleteMany({});
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Assignment.deleteMany({});
    await Enrollment.deleteMany({});

    console.log("Old data cleared. Inserting new data...");

    // Insert data from JSON arrays
    await User.insertMany(users);
    await Course.insertMany(courses);
    await Module.insertMany(modules);
    await Assignment.insertMany(assignments);
    await Enrollment.insertMany(enrollments);

    console.log("Data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
})();
