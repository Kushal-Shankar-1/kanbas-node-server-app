let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithArrays(app) {
  // Retrieve all todos
  app.get("/lab5/todos", (req, res) => {
    res.json(todos);
  });

  // Create a new todo using POST
  app.post("/lab5/todos", (req, res) => {
    const newTodo = { ...req.body, id: new Date().getTime() };
    if (!newTodo.title) {
      newTodo.title = `Task ${todos.length + 1}`; // Assign default title if missing
    }
    todos.push(newTodo);
    res.json(newTodo);
  });

  // Delete a todo using DELETE
  app.delete("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  });

  // Update a todo using PUT
  app.put("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    todos = todos.map((t) =>
      t.id === parseInt(id) ? { ...t, ...req.body } : t
    );
    res.sendStatus(200);
  });
}
