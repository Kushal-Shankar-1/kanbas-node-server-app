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

// Configure allowed origins (frontend and backend)
const allowedOrigins = [
  "http://localhost:3000", // Local React development
  process.env.NETLIFY_URL || "https://your-netlify-site.netlify.app", // Netlify deployment
];

// Configure CORS
app.use(
  cors({
    credentials: true, // Allow cookies/auth headers
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        console.error(`Blocked by CORS: ${origin}`); // Log blocked origins
        callback(new Error("Not allowed by CORS")); // Block other origins
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Minimal headers
  })
);

// Automatically handle OPTIONS requests for preflight
app.options("*", cors());

// Body parser to handle JSON payloads
app.use(bodyParser.json());

// Unified session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super secret session phrase", // Secret for signing session ID
    resave: false, // Avoid unnecessary session saves
    saveUninitialized: false, // Only create session when needed
    cookie: {
      secure: false, // Do not require HTTPS for cookies (same as local behavior)
      sameSite: "lax", // Consistent cookie policy
    },
  })
);

// Define API routes
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
  console.log(`Server is running on port ${PORT}`);
});
