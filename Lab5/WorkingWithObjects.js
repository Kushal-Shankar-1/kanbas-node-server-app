const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

const module = {
  id: "m1",
  name: "Introduction to NodeJS",
  description: "Learn the basics of Node.js and Express.js",
  course: "Full Stack Development",
};

export default function WorkingWithObjects(app) {
  app.get("/lab5/assignment", (req, res) => {
    res.json(assignment);
  });

  app.get("/lab5/assignment/title", (req, res) => {
    res.json(assignment.title);
  });

  app.get("/lab5/assignment/title/:newTitle", (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  });

  app.get("/lab5/module", (req, res) => {
    res.json(module);
  });

  app.get("/lab5/module/name", (req, res) => {
    res.json(module.name);
  });

  app.get("/lab5/module/name/:newName", (req, res) => {
    const { newName } = req.params;
    module.name = newName;
    res.json(module);
  });

  app.get("/lab5/assignment/score/:newScore", (req, res) => {
    const { newScore } = req.params;
    assignment.score = parseInt(newScore);
    res.json(assignment);
  });

  app.get("/lab5/assignment/completed/:status", (req, res) => {
    const { status } = req.params;
    assignment.completed = status === "true";
    res.json(assignment);
  });

  app.get("/lab5/module/description/:newDescription", (req, res) => {
    const { newDescription } = req.params;
    module.description = newDescription;
    res.json(module);
  });

  // Update specific fields of the assignment
  app.put("/lab5/assignment/:id", (req, res) => {
    const { id } = req.params;
    if (parseInt(id) !== assignment.id) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Update fields
    const updatedFields = req.body;
    Object.assign(assignment, updatedFields);

    res.json(assignment); // Return updated assignment
  });
}
