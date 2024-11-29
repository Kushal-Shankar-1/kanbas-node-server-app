import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  /**
   * Create a new user.
   */
  const createUser = async (req, res) => {
    try {
      const newUser = await dao.createUser(req.body); // Call DAO to create user
      res.status(201).json(newUser); // Respond with the newly created user
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" }); // Handle errors
    }
  };

  /**
   * Delete a user by ID.
   */
  const deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;

      // Validate ObjectId
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const result = await dao.deleteUser(userId);

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Retrieve all users.
   */
  const findAllUsers = async (req, res) => {
    try {
      const { role, name } = req.query;

      if (role) {
        const users = await dao.findUsersByRole(role);
        res.json(users);
        return;
      }

      if (name) {
        const users = await dao.findUsersByPartialName(name);
        res.json(users);
        return;
      }

      const users = await dao.findAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Retrieve a user by ID.
   */
  const findUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await dao.findUserById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Update a user by ID.
   */
  const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const userUpdates = req.body;

      // Perform the update
      const updateResult = await dao.updateUser(userId, userUpdates);

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update session if the current user is being updated
      const currentUser = req.session["currentUser"];
      if (currentUser && currentUser._id === userId) {
        req.session["currentUser"] = { ...currentUser, ...userUpdates };
      }

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Sign up a new user.
   */
  const signup = async (req, res) => {
    try {
      const user = await dao.findUserByUsername(req.body.username);

      if (user) {
        return res.status(400).json({ message: "Username already in use" });
      }

      const newUser = await dao.createUser(req.body);
      req.session.currentUser = newUser;
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Sign in an existing user.
   */
  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await dao.findUserByCredentials(username, password);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.currentUser = user;
      res.status(200).json(user);
    } catch (error) {
      console.error("Error during signin:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Sign out the current user.
   */
  const signout = async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error during signout:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.status(200).json({ message: "Sign out successful" });
      });
    } catch (error) {
      console.error("Error during signout:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Retrieve the profile of the current user.
   */
  const profile = async (req, res) => {
    try {
      const currentUser = req.session.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Not signed in" });
      }

      res.status(200).json(currentUser);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Create a new course and enroll the creator.
   */
  const createCourse = async (req, res) => {
    try {
      const currentUser = req.session.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const newCourse = await courseDao.createCourse(req.body);
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // Define routes
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
