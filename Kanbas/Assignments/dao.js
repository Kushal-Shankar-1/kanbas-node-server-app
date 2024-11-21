import Database from "../Database/index.js";

/**
 * Retrieves assignments for a specific module.
 * @param {string} moduleId - The ID of the module.
 * @returns {Array} An array of assignments for the specified module.
 */
export function findAssignmentsForModule(moduleId) {
  const { assignments } = Database;
  return assignments.filter((assignment) => assignment.module === moduleId);
}

/**
 * Creates a new assignment and adds it to the database.
 * @param {Object} assignment - The assignment object to create.
 * @returns {Object} The newly created assignment with a unique ID.
 */
export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: Date.now().toString() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

/**
 * Deletes an assignment by its ID.
 * @param {string} assignmentId - The ID of the assignment to delete.
 * @returns {boolean} True if the assignment was found and deleted, false otherwise.
 */
export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  const assignmentExists = assignments.some((a) => a._id === assignmentId);

  if (!assignmentExists) {
    return false; // Assignment not found
  }

  Database.assignments = assignments.filter((a) => a._id !== assignmentId);
  return true;
}

/**
 * Updates an assignment in the database by its ID.
 * @param {string} assignmentId - The ID of the assignment to update.
 * @param {Object} updates - The updates to apply to the assignment.
 * @returns {Object|null} The updated assignment or null if not found.
 */
export function updateAssignment(assignmentId, updates) {
  const { assignments } = Database;
  const assignment = assignments.find((a) => a._id === assignmentId);
  if (!assignment) return null;
  Object.assign(assignment, updates); // Apply updates
  return assignment;
}

/**
 * Retrieves assignments for a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Array} An array of assignments for the specified course.
 */
export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  return assignments.filter((assignment) => assignment.course === courseId);
}
