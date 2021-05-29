import { expect, request } from "../test/helpers";
import "../test/db";
import { Quiz } from "../quizzes";
import { Question } from "./models";
import app from "../app";
import _ from "lodash";

function getQuestion(questionId: string) {
  return request(app.callback()).get(`/api/v1/questions/${questionId}`);
}

function answerQuestion(questionId: string, choiceId: string) {
  return request(app.callback())
    .put(`/api/v1/questions/${questionId}/answer`)
    .send({ choiceId });
}

describe("questions/routes", () => {
  let quiz!: Quiz;
  let question!: Question;

  beforeEach(async () => {
    quiz = await Quiz.create();
    question = await quiz.createQuestion();
  });

  describe("read", () => {
    let res!: ChaiHttp.Response;

    beforeEach(async () => {
      res = await getQuestion(question.id);
    });

    it("should respond with status 200", () => {
      expect(res).to.have.status(200);
    });

    it("should respond with a representation of the question", () => {
      expect(res.body.id).to.equal(question.id);
    });

    it("should contain no answer if the question is not answered", () => {
      expect(res.body.answer).not.to.exist;
      expect(res.body.correctAnswer).not.to.exist;
    });
  });

  it("should respond with 404 when the question does not exist", async () => {
    const res = await getQuestion("fake");
    expect(res).to.have.status(404);
  });

  describe("answer", () => {
    let res!: ChaiHttp.Response;
    let choiceId!: string;

    beforeEach(async () => {
      choiceId = _.head(question.choices)?.id as string;
      res = await answerQuestion(question.id, choiceId);
    });

    it("should respond with 204", () => {
      expect(res).to.have.status(204);
    });

    it("should subsequently return the answer", async () => {
      res = await getQuestion(question.id);
      expect(res.body.answer?.choiceId).to.equal(choiceId);
      expect(res.body.correctAnswer).to.exist;
    });

    it("should subsequently not accept an answer", async () => {
      res = await answerQuestion(question.id, choiceId);
      expect(res).to.have.status(409);
    });
  });

  it("should respond with 404 when answering a question that does not exist", async () => {
    const res = await request(app.callback()).put(
      "/api/v1/questions/fake/answer"
    );
    expect(res).to.have.status(404);
  });

  it("should respond with 422 when answering with malformed request", async () => {
    const res = await request(app.callback()).put(
      `/api/v1/questions/${question.id}/answer`
    );
    expect(res).to.have.status(422);
  });
});
