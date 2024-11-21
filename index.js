// Kanbas/index.js
import express from "express";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import bodyParser from "body-parser";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kanbas/Users/routes.js";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from "./Kanbas/Assignments/routes.js";
import EnrollmentRoutes from "./Kanbas/Enrollments/routes.js";

const app = express();

// Configure CORS to allow credentials and restrict origin
app.use(
  cors({
    credentials: true, // Allow cookies to be sent
    origin: process.env.NETLIFY_URL || "http://localhost:3000", // Restrict to React app
  })
);

// Configure body parser to parse JSON bodies
app.use(bodyParser.json());

// Configure session handling
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "super secret session phrase", // Secret for signing session ID
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
};

// Modify session options for production
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true; // Trust the first proxy
  sessionOptions.cookie = {
    sameSite: "none", // Allow cross-site cookies
    secure: true, // Send cookies over HTTPS only
    domain: process.env.NODE_SERVER_DOMAIN, // Set to your server's domain
  };
}

app.use(session(sessionOptions));

// Define routes
Lab5(app);
Hello(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
