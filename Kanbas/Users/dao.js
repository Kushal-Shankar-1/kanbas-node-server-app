import model from "./model.js";

/**
 * Creates a new user in the database.
 * @param {Object} user - The user object to create.
 * @returns {Promise} - The created user document.
 */
export const createUser = (user) => {
  delete user._id; // Prevent `_id` conflicts
  return model.create(user); // Insert the user
};

/**
 * Retrieves all users from the database.
 * @returns {Promise} - Array of all user documents.
 */
export const findAllUsers = () => model.find();

/**
 * Retrieves a user by their ID.
 * @param {String} userId - The ID of the user to find.
 * @returns {Promise} - The user document matching the ID.
 */
export const findUserById = (userId) => model.findById(userId);

/**
 * Retrieves a user by their username.
 * @param {String} username - The username of the user to find.
 * @returns {Promise} - The user document matching the username.
 */
export const findUserByUsername = (username) => model.findOne({ username });

/**
 * Retrieves a user by their credentials (username and password).
 * @param {String} username - The username of the user.
 * @param {String} password - The password of the user.
 * @returns {Promise} - The user document matching the credentials.
 */
export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password });

/**
 * Updates a user by their ID.
 * @param {String} userId - The ID of the user to update.
 * @param {Object} user - The user object containing updated fields.
 * @returns {Promise} - The result of the update operation.
 */
export const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });

/**
 * Deletes a user by their ID.
 * @param {String} userId - The ID of the user to delete.
 * @returns {Promise} - The result of the delete operation.
 */
export const deleteUser = (userId) => model.deleteOne({ _id: userId });

/**
 * Finds users by their role.
 * @param {String} role - The role to filter users by.
 * @returns {Promise} - The filtered users.
 */
export const findUsersByRole = (role) => model.find({ role });

/**
 * Finds users by partial match of their first or last name.
 * @param {String} partialName - The partial name to match.
 * @returns {Promise} - The filtered users.
 */
export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};
