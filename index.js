import express from "express";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import bodyParser from "body-parser";

import connectDB from "./db.js"; // Import the connectDB function
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
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Automatically handle OPTIONS requests for preflight
app.options("*", cors());

// Body parser to handle JSON payloads
app.use(bodyParser.json());

// Unified session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super secret session phrase",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.NODE_SERVER_DOMAIN ||
            "kanbas-node-server-app-emvj.onrender.com"
          : undefined,
    },
    proxy: process.env.NODE_ENV === "production",
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

const PORT = process.env.PORT || 4000;

// Connect to the database FIRST, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
