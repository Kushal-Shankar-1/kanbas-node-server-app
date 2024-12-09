import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function UserRoutes(app) {
  /**
   * GET /api/users/:userId/courses
   * Retrieves courses that a specific user is enrolled in.
   */
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;

    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json([]); // Return empty array if not signed in
      }
      userId = currentUser._id;
    }

    try {
      const courses = await courseDao.findCoursesForEnrolledUser(userId);
      if (!courses || courses.length === 0) {
        return res.json([]); // Empty array if no courses
      }
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error retrieving enrolled courses:", error);
      return res.status(500).json([]);
    }
  };

  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  /**
   * DELETE /api/courses/:courseId
   * Deletes a course and all associated enrollments.
   */
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;

    try {
      const success = await dao.deleteCourse(courseId);
      if (!success) {
        return res.status(404).json({ error: "Course not found" });
      }
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting course:", error);
      return res.status(500).json({ error: "Failed to delete course" });
    }
  });

  // PUT /api/courses/:courseId
  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;

    try {
      const updatedCourse = await dao.updateCourse(courseId, courseUpdates);
      if (!updatedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }
      return res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      return res.status(500).json({ error: "Failed to update course" });
    }
  });

  /**
   * GET /api/courses/:courseId/modules
   * Retrieves modules for a specific course.
   */
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    try {
      const modules = await modulesDao.findModulesForCourse(courseId);
      if (!modules || modules.length === 0) {
        return res.status(200).json([]); // Return empty array if no modules
      }
      return res.status(200).json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      return res.status(500).json([]);
    }
  });

  /**
   * POST /api/courses/:courseId/modules
   * Creates a new module for a specific course.
   */
  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = { ...req.body, course: courseId };
    try {
      const newModule = await modulesDao.createModule(module);
      return res.status(201).json(newModule);
    } catch (error) {
      console.error("Error creating module:", error);
      return res.status(500).json({ error: "Failed to create module" });
    }
  });

  /**
   * GET /api/courses
   * Retrieves all courses from the database.
   */
  app.get("/api/courses", async (req, res) => {
    console.log("Fetching all courses...");
    try {
      const courses = await dao.findAllCourses();
      if (!courses || courses.length === 0) {
        return res.status(200).json([]); // Empty array if no courses
      }
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res.status(500).json([]);
    }
  });
}
