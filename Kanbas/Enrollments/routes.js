import * as enrollmentsDao from "./dao.js";

/**
 * Sets up routes for enrollments.
 * @param {Express.Application} app - The Express application instance.
 */
export default function EnrollmentRoutes(app) {
  /**
   * POST /api/enrollments
   * Enroll a user in a course.
   */
  app.post("/api/enrollments", async (req, res) => {
    const { userId, courseId } = req.body;
    try {
      const newEnrollment = await enrollmentsDao.enrollUserInCourse(
        userId,
        courseId
      );
      if (!newEnrollment) {
        return res
          .status(400)
          .json({ error: "User is already enrolled in this course" });
      }
      return res.status(201).json(newEnrollment);
    } catch (error) {
      console.error("Error enrolling user:", error);
      return res.status(500).json({ error: "Failed to enroll user" });
    }
  });

  /**
   * DELETE /api/enrollments
   * Unenroll a user from a course.
   */
  app.delete("/api/enrollments", async (req, res) => {
    const { userId, courseId } = req.body;
    try {
      const removedEnrollment = await enrollmentsDao.unenrollUserFromCourse(
        userId,
        courseId
      );
      if (!removedEnrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      return res.status(200).json(removedEnrollment);
    } catch (error) {
      console.error("Error unenrolling user:", error);
      return res.status(500).json({ error: "Failed to unenroll user" });
    }
  });

  /**
   * GET /api/users/:userId/enrollments
   * Retrieves enrollments for a specific user.
   */
  app.get("/api/users/:userId/enrollments", async (req, res) => {
    const { userId } = req.params;
    try {
      const enrollments = await enrollmentsDao.findEnrollmentsForUser(userId);
      if (!enrollments) return res.json([]); // Return empty array if none
      return res.status(200).json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return res.status(500).json([]);
    }
  });

  /**
   * GET /api/enrollments
   * Retrieves all enrollments.
   */
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await enrollmentsDao.findAllEnrollments();
      if (!enrollments) return res.json([]);
      return res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return res.status(500).json([]);
    }
  });

  /**
   * GET /api/courses/:cid/users
   * Retrieves all users enrolled in the specified course.
   */

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params; // Course ID from URL
    try {
      const users = await enrollmentsDao.findUsersForCourse(cid);

      if (!users || users.length === 0) {
        return res
          .status(404)
          .json({ error: "No users found for this course." });
      }

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users for course:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch users for course." });
    }
  };

  app.get("/api/courses/:cid/users", findUsersForCourse);
}
