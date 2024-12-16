import * as UsersDAO from "./Kanbas/Users/dao.js";

// Test Data
const testUser = {
  username: "test_user",
  password: "test_pass",
  role: "STUDENT",
};

// Create User
const createdUser = UsersDAO.createUser(testUser);
console.log("Created User:", createdUser);

// Find All Users
console.log("All Users:", UsersDAO.findAllUsers());

// Find User by ID
const foundUser = UsersDAO.findUserById(createdUser._id);
console.log("Found User by ID:", foundUser);

// Find User by Username
const foundByUsername = UsersDAO.findUserByUsername("test_user");
console.log("Found by Username:", foundByUsername);

// Find User by Credentials
const foundByCredentials = UsersDAO.findUserByCredentials(
  "test_user",
  "test_pass"
);
console.log("Found by Credentials:", foundByCredentials);

// Update User
const updatedUser = UsersDAO.updateUser(createdUser._id, {
  password: "new_pass",
});
console.log("Updated User:", updatedUser);

// Delete User
const deletedUser = UsersDAO.deleteUser(createdUser._id);
console.log("Deleted User:", deletedUser);

// Verify User Deletion
console.log("All Users after Deletion:", UsersDAO.findAllUsers());
