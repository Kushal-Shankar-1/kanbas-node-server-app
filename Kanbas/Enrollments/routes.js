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
  app.post("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    try {
      const newEnrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
      if (!newEnrollment) {
        return res
          .status(400)
          .json({ error: "User is already enrolled in this course" });
      }
      res.status(201).json(newEnrollment);
    } catch (error) {
      console.error("Error enrolling user:", error);
      res.status(500).json({ error: "Failed to enroll user" });
    }
  });

  /**
   * DELETE /api/enrollments
   * Unenroll a user from a course.
   */
  app.delete("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    try {
      const removedEnrollment = enrollmentsDao.unenrollUserFromCourse(
        userId,
        courseId
      );
      if (!removedEnrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.status(200).json(removedEnrollment);
    } catch (error) {
      console.error("Error unenrolling user:", error);
      res.status(500).json({ error: "Failed to unenroll user" });
    }
  });

  /**
   * GET /api/users/:userId/enrollments
   * Retrieves enrollments for a specific user.
   */
  app.get("/api/users/:userId/enrollments", (req, res) => {
    const { userId } = req.params;
    try {
      const enrollments = enrollmentsDao.findEnrollmentsForUser(userId);
      res.status(200).json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  /**
   * GET /api/enrollments
   * Retrieves all enrollments.
   */
  app.get("/api/enrollments", (req, res) => {
    try {
      const enrollments = enrollmentsDao.findAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });
  
}
