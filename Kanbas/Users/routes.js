import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

let currentUser = null; // Keeps track of the logged-in user

export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    try {
      const newUser = await dao.createUser(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Failed to create user" });
    }
  };

  const deleteUser = async (req, res) => {
    const userId = Number(req.params.userId);
    try {
      const deletedUser = await dao.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(deletedUser);
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Failed to delete user" });
    }
  };

  const findAllUsers = async (req, res) => {
    try {
      const { role, name } = req.query;

      // If role is specified, filter by role
      if (role) {
        const users = await dao.findUsersByRole(role);
        return res.json(users);
      }

      // If name is specified, filter by partial name match
      if (name) {
        const users = await dao.findUsersByPartialName(name);
        return res.json(users);
      }

      // Otherwise, return all users
      const users = await dao.findAllUsers();
      return res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  const findUserById = async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await dao.findUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  };

  const updateUser = async (req, res) => {
    const userId = Number(req.params.userId);
    const userUpdates = req.body;
    try {
      const updatedUser = await dao.updateUser(userId, userUpdates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update currentUser if it matches the updated user
      if (currentUser?._id === userId) {
        currentUser = updatedUser;
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Failed to update user" });
    }
  };

  const signup = async (req, res) => {
    try {
      const existingUser = await dao.findUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already in use" });
      }

      // Destroy the current session (if any) before proceeding
      req.session.destroy((err) => {
        if (err) {
          console.error("Error clearing session during signup:", err);
        }
      });

      // Create the new user
      await dao.createUser(req.body);
      // Do not set the session; redirect to Sign In for login
      return res
        .status(201)
        .json({ message: "Signup successful. Please log in." });
    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).json({ error: "Failed to sign up" });
    }
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await dao.findUserByCredentials(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      currentUser = user;
      req.session.currentUser = user; // Store in session for persistence
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error during signin:", error);
      return res.status(500).json({ error: "Failed to sign in" });
    }
  };

  const signout = async (req, res) => {
    currentUser = null;
    return res.status(200).json({ message: "Sign out successful" });
  };

  const profile = async (req, res) => {
    console.log("Incoming request to /api/users/profile");
    console.log("Session User:", req.session.currentUser);

    if (!req.session.currentUser) {
      console.error("No user found in session");
      return res.status(401).json({ error: "Not signed in" });
    }

    return res.status(200).json(req.session.currentUser);
  };

  const createCourse = async (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const newCourse = await courseDao.createCourse(req.body);
      const enrollment = await enrollmentsDao.enrollUserInCourse(
        currentUser._id,
        newCourse._id
      );

      if (!enrollment) {
        return res
          .status(400)
          .json({ error: "User is already enrolled in this course" });
      }

      return res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      return res.status(500).json({ error: "Failed to create course" });
    }
  };

  app.get("/api/users/profile", profile);

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/users/profile", profile);
  app.post("/api/users/current/courses", createCourse);
}
