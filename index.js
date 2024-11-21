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
      secure: process.env.NODE_ENV === "production", // HTTPS-only cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-origin cookies in production
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.NODE_SERVER_DOMAIN ||
            "kanbas-node-server-app-emvj.onrender.com" // Backend domain for production
          : undefined, // No domain for local development
    },
    proxy: process.env.NODE_ENV === "production", // Trust reverse proxies in production
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
