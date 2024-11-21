// src/Kanbas/Enrollments/dao.js

import Database from "../Database/index.js";

/**
 * Enrolls a user in a course by adding an enrollment record.
 * @param {string} userId - The ID of the user.
 * @param {string} courseId - The ID of the course.
 * @returns {Object} The newly created enrollment.
 */
export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;

  // Check if the user is already enrolled to prevent duplicates
  const isAlreadyEnrolled = enrollments.some(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );

  if (isAlreadyEnrolled) {
    return null; // User is already enrolled
  }

  const newEnrollment = {
    _id: Date.now().toString(),
    user: userId,
    course: courseId,
  };
  enrollments.push(newEnrollment);
  return newEnrollment;
}

/**
 * Unenrolls a user from a course by removing the enrollment record.
 * @param {string} userId - The ID of the user.
 * @param {string} courseId - The ID of the course.
 * @returns {Object|null} The removed enrollment or null if not found.
 */
export function unenrollUserFromCourse(userId, courseId) {
  const { enrollments } = Database;
  const enrollmentIndex = enrollments.findIndex(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );

  if (enrollmentIndex === -1) return null;

  const [removedEnrollment] = enrollments.splice(enrollmentIndex, 1);
  return removedEnrollment;
}

/**
 * Retrieves enrollments for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Array} An array of enrollments for the specified user.
 */
export function findEnrollmentsForUser(userId) {
  const { enrollments } = Database;
  return enrollments.filter((enrollment) => enrollment.user === userId);
}

export function findAllEnrollments() {
  const { enrollments } = Database;
  return enrollments;
}
