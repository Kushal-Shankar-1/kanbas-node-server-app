import * as dao from "./dao.js";
function QuestionRoutes(app) {
  app.post("/api/quizzes/:qid/question", async (req, res) => {
    const newQuestion = await dao.createQuestion(req.params.qid, req.body);
    res.json(newQuestion);
  });
  app.delete("/api/questions/:quid", async (req, res) => {
    const status = await dao.deleteQuestion(req.params.quid);
    res.json(status);
  });
  app.get("/api/quizzes/:qid/questions", async (req, res) => {
    const { qid } = req.params;
    const questions = await dao.findQuestionByQuiz(qid);
    res.send(questions);
  });
  app.put("/api/questions/:quid", async (req, res) => {
    const { quid } = req.params;
    const status = await dao.updateQuestion(quid, req.body);
    res.json(status);
  });
  app.get("/api/questions/:quid", async (req, res) => {
    const question = await dao.findQuestion(req.params.quid);
    res.send(question);
  });
}
export default QuestionRoutes;
