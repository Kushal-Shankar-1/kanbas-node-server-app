import Enrollment from "./model.js";
import User from "../Users/model.js";

/**
 * Enrolls a user in a course by adding an enrollment record.
 * @param {string} userId - The ID of the user.
 * @param {string} courseId - The ID of the course.
 * @returns {Object|null} The newly created enrollment or null if already enrolled.
 */
export async function enrollUserInCourse(userId, courseId) {
  // Check if user is already enrolled
  const isAlreadyEnrolled = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });
  if (isAlreadyEnrolled) {
    return null; // User is already enrolled
  }

  const newEnrollment = {
    _id: Date.now().toString(),
    user: userId,
    course: courseId,
  };
  const created = await Enrollment.create(newEnrollment);
  return created.toObject();
}

/**
 * Unenrolls a user from a course by removing the enrollment record.
 * @param {string} userId - The ID of the user.
 * @param {string} courseId - The ID of the course.
 * @returns {Object|null} The removed enrollment or null if not found.
 */
export async function unenrollUserFromCourse(userId, courseId) {
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });
  if (!enrollment) return null;

  await Enrollment.findByIdAndDelete(enrollment._id);
  return enrollment.toObject();
}

/**
 * Retrieves enrollments for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Array} An array of enrollments for the specified user.
 */
export async function findEnrollmentsForUser(userId) {
  const enrollments = await Enrollment.find({ user: userId });
  return enrollments;
}

/**
 * Retrieves all enrollments.
 * @returns {Array} An array of all enrollments.
 */
export async function findAllEnrollments() {
  const enrollments = await Enrollment.find({});
  return enrollments;
}

/**
 * Retrieves all users enrolled in a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
 */
export const findUsersForCourse = async (courseId) => {
  try {
    // Find enrollments for the course
    const enrollments = await Enrollment.find({ course: courseId });

    // Extract user IDs from enrollments
    const userIds = enrollments.map((enrollment) => enrollment.user);

    // Fetch user details for the extracted IDs
    const users = await User.find({ _id: { $in: userIds } });

    return users;
  } catch (error) {
    console.error("Error retrieving users for course:", error);
    throw error;
  }
};
