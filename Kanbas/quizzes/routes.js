import * as dao from "./dao.js";

function QuizRoutes(app) {
  app.post("/api/courses/:cid/quizzes", async (req, res) => {
    const newQuiz = await dao.createQuiz(req.params.cid, req.body);
    res.json(newQuiz);
  });
  app.delete("/api/quizzes/:qid", async (req, res) => {
    const status = await dao.deleteQuiz(req.params.qid);
    res.json(status);
  });
  app.get("/api/courses/:cid/quizzes", async (req, res) => {
    const { cid } = req.params;
    const quizzes = await dao.findQuizzesByCourse(cid);
    res.send(quizzes);
  });
  app.put("/api/quizzes/:qid", async (req, res) => {
    const { qid } = req.params;
    const status = await dao.updateQuiz(qid, req.body);
    res.json(status);
  });
  app.put("/api/quizzes/:qid/:published", async (req, res) => {
    const { qid } = req.params;
    const status = await dao.updatePublished(qid, req.params.published);
    res.json(status);
  });
  app.get("/api/quizzes/:qid", async (req, res) => {
    const quiz = await dao.findQuizById(req.params.qid);
    res.send(quiz);
  });
}

export default QuizRoutes;
