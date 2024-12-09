import User from "./model.js"; // Import the User model

// Create a new user
export const createUser = async (user) => {
  // Assign _id if not provided. If your frontend or existing code relies on numeric or string IDs, you can do:
  if (!user._id) {
    user._id = Date.now().toString();
  }
  const newUser = await User.create(user);
  return newUser.toObject();
};

// Retrieve all users
export const findAllUsers = async () => {
  const users = await User.find({});
  return users;
};

// Retrieve a user by ID
export const findUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

// Retrieve a user by username
export const findUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  return user;
};

// Retrieve a user by credentials (username/password)
export const findUserByCredentials = async (username, password) => {
  const user = await User.findOne({ username, password });
  return user;
};

// Update a user by ID
export const updateUser = async (userId, userUpdates) => {
  const updatedUser = await User.findByIdAndUpdate(userId, userUpdates, {
    new: true,
  });
  return updatedUser;
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  return deletedUser;
};
