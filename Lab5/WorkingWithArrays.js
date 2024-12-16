let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithArrays(app) {
  // Create a new todo using GET (for testing purposes)
  app.get("/lab5/todos/create", (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      title: "New Task",
      completed: false,
    };
    todos.push(newTodo);
    res.json(todos);
  });

  // Delete a todo using GET (for testing purposes)
  app.get("/lab5/todos/:id/delete", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.json(todos); // Respond with the updated list of todos
  });

  // Retrieve a todo by ID
  app.get("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
    } else {
      res.json(todo);
    }
  });

  // Retrieve all todos or filter by completion
  app.get("/lab5/todos", (req, res) => {
    const { completed } = req.query;

    if (completed !== undefined) {
      const completedBool = completed.toLowerCase() === "true";
      const filteredTodos = todos.filter((t) => t.completed === completedBool);
      res.json(filteredTodos);
      return;
    }

    res.json(todos);
  });

  // Create a new todo using POST
  app.post("/lab5/todos", (req, res) => {
    const newTodo = { ...req.body, id: new Date().getTime() };
    if (!newTodo.title) {
      newTodo.title = `Task ${todos.length + 1}`;
    }
    todos.push(newTodo);
    res.json(newTodo);
  });

  // Delete a todo using DELETE
  app.delete("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      console.error(`Failed to delete: Todo with ID ${id} not found`);
      res.status(404).json({ message: `Todo with ID ${id} not found` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  });

  // Update a todo using PUT
  app.put("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      console.error(`Failed to update: Todo with ID ${id} not found`);
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    todos = todos.map((t) =>
      t.id === parseInt(id) ? { ...t, ...req.body } : t
    );
    res.sendStatus(200);
  });

  // Update a todo's title using GET
  app.get("/lab5/todos/:id/title/:title", (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));

    // Handle case where the todo does not exist
    if (!todo) {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
      return;
    }

    // Update the title of the todo
    todo.title = title;

    // Respond with the updated todos list
    res.json(todos);
  });

  // Update a todo's completed property using GET
  app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
    const { id, completed } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));

    // Handle case where the todo does not exist
    if (!todo) {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
      return;
    }

    // Update the completed property
    todo.completed = completed === "true";

    // Respond with the updated todos list
    res.json(todos);
  });

  // Update a todo's description using GET
  app.get("/lab5/todos/:id/description/:description", (req, res) => {
    const { id, description } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));

    // Handle case where the todo does not exist
    if (!todo) {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
      return;
    }

    // Update the description property
    todo.description = description;

    // Respond with the updated todos list
    res.json(todos);
  });
}
