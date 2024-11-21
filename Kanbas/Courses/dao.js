// src/Kanbas/Courses/dao.js

import Database from "../Database/index.js";

/**
 * Retrieves all courses from the database.
 * @returns {Array} An array of course objects.
 */
export function findAllCourses() {
  return Database.courses;
}

/**
 * Creates a new course and adds it to the database.
 * @param {Object} course - The course object to create.
 * @returns {Object} The newly created course with a unique _id.
 */
export function createCourse(course) {
  const newCourse = { ...course, _id: Date.now().toString() };
  Database.courses = [...Database.courses, newCourse];
  return newCourse;
}

/**
 * Updates an existing course in the database.
 * @param {string} courseId - The ID of the course to update.
 * @param {Object} updates - The updated course data.
 * @returns {Object|null} The updated course object or null if not found.
 */
export function updateCourse(courseId, updates) {
  const courseIndex = Database.courses.findIndex(
    (course) => course._id === courseId
  );
  if (courseIndex === -1) return null;

  const updatedCourse = { ...Database.courses[courseIndex], ...updates };
  Database.courses[courseIndex] = updatedCourse;
  return updatedCourse;
}

/**
 * Deletes a course and all enrollments associated with it.
 * @param {string} courseId - The ID of the course to delete.
 * @returns {boolean} True if the course existed and was deleted, false otherwise.
 */
export function deleteCourse(courseId) {
  const { courses, enrollments } = Database;

  const courseExists = courses.some((course) => course._id === courseId);
  if (!courseExists) {
    return false; // Course not found
  }

  // Remove the course
  Database.courses = courses.filter((course) => course._id !== courseId);

  // Remove all enrollments for the course
  Database.enrollments = enrollments.filter(
    (enrollment) => enrollment.course !== courseId
  );

  return true;
}

/**
 * Retrieves courses that a specific user is enrolled in.
 * @param {string} userId - The ID of the user.
 * @returns {Array} An array of course objects the user is enrolled in.
 */
export function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments } = Database;
  const enrolledCourses = courses.filter((course) =>
    enrollments.some(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === course._id
    )
  );
  return enrolledCourses;
}
