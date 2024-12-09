import Course from "./model.js"; // Import the Course model
import Enrollment from "../Enrollments/model.js"; // Import the Enrollment model

/**
 * Retrieves all courses from the database.
 * @returns {Promise<Array>} An array of course objects.
 */
export async function findAllCourses() {
  const courses = await Course.find({});
  return courses;
}

/**
 * Creates a new course and adds it to the database.
 * @param {Object} course - The course object to create.
 * @returns {Object} The newly created course.
 */
export async function createCourse(course) {
  // If _id not provided, generate one based on Date.now
  if (!course._id) {
    course._id = Date.now().toString();
  }
  const newCourse = await Course.create(course);
  return newCourse.toObject();
}

/**
 * Updates an existing course in the database.
 * @param {string} courseId - The ID of the course to update.
 * @param {Object} updates - The updated course data.
 * @returns {Object|null} The updated course or null if not found.
 */
export async function updateCourse(courseId, updates) {
  const updatedCourse = await Course.findByIdAndUpdate(courseId, updates, {
    new: true,
  });
  return updatedCourse;
}

/**
 * Deletes a course and all enrollments associated with it.
 * @param {string} courseId - The ID of the course to delete.
 * @returns {boolean} True if the course existed and was deleted, false otherwise.
 */
export async function deleteCourse(courseId) {
  const courseExists = await Course.findById(courseId);
  if (!courseExists) {
    return false;
  }

  // Remove the course
  await Course.findByIdAndDelete(courseId);

  // Remove all enrollments for this course
  await Enrollment.deleteMany({ course: courseId });

  return true;
}

/**
 * Retrieves courses that a specific user is enrolled in.
 * @param {string} userId - The ID of the user.
 * @returns {Array} An array of courses the user is enrolled in.
 */
export async function findCoursesForEnrolledUser(userId) {
  // Find all enrollments for the user
  const enrollments = await Enrollment.find({ user: userId });
  const enrolledCourseIds = enrollments.map((e) => e.course);

  // Retrieve those courses
  const courses = await Course.find({ _id: { $in: enrolledCourseIds } });
  return courses;
}
