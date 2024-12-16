export default function QueryParameters(app) {
  app.get("/lab5/calculator", (req, res) => {
    const { a, b, operation } = req.query;
    const numA = parseInt(a);
    const numB = parseInt(b);
    let result = 0;

    switch (operation) {
      case "add":
        result = numA + numB;
        break;
      case "subtract":
        result = numA - numB;
        break;
      case "multiply":
        result = numA * numB;
        break;
      case "divide":
        result = numB === 0 ? "Cannot divide by zero" : numA / numB;
        break;
      default:
        result = "Invalid operation";
    }
    res.send(result.toString());
  });
}
