import express from "express";
import * as assignmentsDao from "./dao.js";

/**
 * Sets up assignment-related routes.
 * @param {Express.Application} app - The Express application instance.
 */
export default function AssignmentRoutes(app) {
  /**
   * GET /api/modules/:moduleId/assignments
   * Retrieves assignments for a specific module.
   */
  app.get("/api/modules/:moduleId/assignments", (req, res) => {
    const { moduleId } = req.params;
    try {
      const assignments = assignmentsDao.findAssignmentsForModule(moduleId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  /**
   * POST /api/modules/:moduleId/assignments
   * Creates a new assignment for a module.
   */
  app.post("/api/modules/:moduleId/assignments", (req, res) => {
    const { moduleId } = req.params;
    const {
      title,
      description,
      dueDate,
      availableFrom,
      availableUntil,
      points,
    } = req.body;

    // Validation: Ensure required fields are present
    if (!title || !description || !points) {
      return res
        .status(400)
        .json({ error: "Title, description, and points are required" });
    }

    try {
      const newAssignment = {
        title,
        description,
        points,
        dueDate: dueDate || null,
        availableFrom: availableFrom || null,
        availableUntil: availableUntil || null,
        module: moduleId,
        _id: Date.now().toString(), // Generate unique ID
      };
      const createdAssignment = assignmentsDao.createAssignment(newAssignment);
      res.status(201).json(createdAssignment); // Respond with the created assignment
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  /**
   * PUT /api/assignments/:assignmentId
   * Updates an assignment by its ID.
   */
  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const updates = req.body;
    try {
      const updatedAssignment = assignmentsDao.updateAssignment(
        assignmentId,
        updates
      );
      if (!updatedAssignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(updatedAssignment);
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).json({ error: "Failed to update assignment" });
    }
  });

  /**
   * DELETE /api/assignments/:assignmentId
   * Deletes an assignment by its ID.
   */
  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    try {
      const status = assignmentsDao.deleteAssignment(assignmentId);
      if (!status) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.sendStatus(204); // No Content
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  });

  /**
   * GET /api/courses/:courseId/assignments
   * Retrieves assignments for a specific course.
   */
  app.get("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    try {
      const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments for course:", error);
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  app.post("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const newAssignment = { ...req.body, course: courseId };
  
    try {
      const createdAssignment = assignmentsDao.createAssignment(newAssignment);
      res.status(201).json(createdAssignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });
  
}
