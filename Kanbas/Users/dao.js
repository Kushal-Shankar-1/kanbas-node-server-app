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
  console.log(
    `Searching for user with username: "${username}" and password: "${password}"`
  );
  try {
    const query = {
      username: new RegExp(`^${username}$`, "i"), // Case-insensitive match
      password: new RegExp(`^${password}$`, "i"),
    };
    console.log("Raw query object:", query);

    // Use User instead of model
    const user = await User.findOne(query);
    console.log("Raw Query Result:", user);

    if (!user) {
      console.log("No user found with provided credentials.");
    } else {
      console.log("User found:", user);
    }

    return user;
  } catch (error) {
    console.error("Error querying database:", error);
    throw error;
  }
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

// Finds users by their role.
export const findUsersByRole = (role) => {
  return User.find({ role: role });
};

// Finds users by partial match of their first or last name.
export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // case-insensitive
  return User.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};
