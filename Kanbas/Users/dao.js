import db from "../Database/index.js";

let { users } = db;

// Create a new user
export const createUser = (user) => {
  const newUser = { ...user, _id: Date.now() }; // Add a unique ID
  users = [...users, newUser];
  return newUser;
};

// Retrieve all users
export const findAllUsers = () => users;

// Retrieve a user by ID
export const findUserById = (userId) =>
  users.find((user) => user._id === userId);

// Retrieve a user by username
export const findUserByUsername = (username) =>
  users.find((user) => user.username === username);

// Retrieve a user by credentials
export const findUserByCredentials = (username, password) =>
  users.find(
    (user) => user.username === username && user.password === password
  );

// Update a user by ID
export const updateUser = (userId, user) => {
  users = users.map((u) => (u._id === Number(userId) ? { ...u, ...user } : u));
  return users.find((u) => u._id === Number(userId));
};

// Delete a user by ID
export const deleteUser = (userId) => {
  const userToDelete = users.find((u) => u._id === userId);
  users = users.filter((u) => u._id !== userId);
  return userToDelete;
};