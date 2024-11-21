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

// Configure allowed origins
const allowedOrigins = [
  "http://localhost:3000", // Local React development
  process.env.NETLIFY_URL ||
    "https://673fa1d407ba318d2fb2b41b--statuesque-bienenstitch-61f515.netlify.app", // Netlify deployment
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these methods
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ], // Allow these headers
  })
);

// Automatically handle OPTIONS requests
app.options("*", cors());

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
