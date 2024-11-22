// Kanbas/Users/routes.js

import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as modulesDao from "../Modules/dao.js";

/**
 * Sets up user-related routes.
 * @param {Express.Application} app - The Express application instance.
 */
export default function UserRoutes(app) {
  /**
   * Existing user routes...
   */

  /**
   * GET /api/users/:userId/courses
   * Retrieves courses that a specific user is enrolled in.
   * If userId is "current", it retrieves courses for the logged-in user.
   */
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;

    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401); // Unauthorized
        return;
      }
      userId = currentUser._id;
    }

    try {
      const courses = courseDao.findCoursesForEnrolledUser(userId);
      res.status(200).json(courses);
    } catch (error) {
      console.error("Error retrieving enrolled courses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  /**
   * DELETE /api/courses/:courseId
   * Deletes a course and all associated enrollments.
   */
  app.delete("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;

    const success = dao.deleteCourse(courseId);
    if (!success) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(204).send(); // No Content
  });

  // PUT /api/courses/:courseId
  app.put("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;

    const updatedCourse = dao.updateCourse(courseId, courseUpdates);
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(updatedCourse); // No Content
  });

  /**
   * GET /api/courses/:courseId/modules
   * Retrieves modules for a specific course.
   */
  app.get("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    const modules = modulesDao.findModulesForCourse(courseId);

    // Handle case where no modules are found
    if (!modules || modules.length === 0) {
      return res
        .status(404)
        .json({ error: "No modules found for this course." });
    }

    res.status(200).json(modules);
  });

  /**
   * POST /api/courses/:courseId/modules
   * Creates a new module for a specific course.
   */
  app.post("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId, // Assign the module to the course
    };
    const newModule = modulesDao.createModule(module);
    res.status(201).json(newModule);
  });

  /**
   * GET /api/courses
   * Retrieves all courses from the database.
   */
  app.get("/api/courses", (req, res) => {
    console.log("Fetching all courses..."); // Debug log
    const courses = dao.findAllCourses();

    if (!courses || courses.length === 0) {
      return res.status(404).json({ error: "No courses found." });
    }

    res.status(200).json(courses);
  });
}
