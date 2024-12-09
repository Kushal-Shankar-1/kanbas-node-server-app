import Assignment from "./model.js";

/**
 * Retrieves assignments for a specific module.
 * @param {string} moduleId - The ID of the module.
 * @returns {Promise<Array>} An array of assignments.
 */
export async function findAssignmentsForModule(moduleId) {
  const assignments = await Assignment.find({ module: moduleId });
  return assignments;
}

/**
 * Creates a new assignment and adds it to the database.
 * @param {Object} assignment - The assignment object to create.
 * @returns {Promise<Object>} The newly created assignment.
 */
export async function createAssignment(assignment) {
  if (!assignment._id) {
    assignment._id = Date.now().toString();
  }
  const newAssignment = await Assignment.create(assignment);
  return newAssignment.toObject();
}

/**
 * Deletes an assignment by its ID.
 * @param {string} assignmentId - The ID of the assignment to delete.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
export async function deleteAssignment(assignmentId) {
  const assignmentExists = await Assignment.findById(assignmentId);
  if (!assignmentExists) return false;

  await Assignment.findByIdAndDelete(assignmentId);
  return true;
}

/**
 * Updates an assignment by its ID.
 * @param {string} assignmentId - The ID of the assignment to update.
 * @param {Object} updates - The updates to apply.
 * @returns {Promise<Object|null>} The updated assignment or null if not found.
 */
export async function updateAssignment(assignmentId, updates) {
  const updatedAssignment = await Assignment.findByIdAndUpdate(
    assignmentId,
    updates,
    { new: true }
  );
  return updatedAssignment;
}

/**
 * Retrieves assignments for a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Array>} Assignments for the specified course.
 */
export async function findAssignmentsForCourse(courseId) {
  const assignments = await Assignment.find({ course: courseId });
  return assignments;
}
