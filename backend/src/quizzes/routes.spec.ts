import { expect, request } from "../test/helpers";
import "../test/db";
import { Quiz } from "./models";
import app from "../app";
import { Question, Choice } from "../questions";
import _ from "lodash";

describe("quizzes/routes", () => {
  describe("create/read", () => {
    let res!: ChaiHttp.Response;
    let quizId!: string;

    beforeAll(async () => {
      res = await request(app.callback()).post("/quizzes");
      quizId = res.body.id;
    });

    it("should respond with 201", () => {
      expect(res).to.have.status(201);
    });

    it("should respond with the location of the quiz", async () => {
      expect(res).to.have.header("Location");
      expect(
        await request(app.callback()).get(res.header.location)
      ).to.have.status(200);
    });

    it("should create quiz in the database", async () => {
      expect(await Quiz.query().findById(quizId)).not.to.be.undefined;
    });
  });

  describe("create questions", () => {
    let quiz!: Quiz;
    let question!: Question;
    let choice!: Choice;

    beforeEach(async () => {
      quiz = await Quiz.create();
      question = await quiz.createQuestion();
      choice = _.head(question.choices) as Choice;
    });

    describe("when the previous question is answered", () => {
      let res!: ChaiHttp.Response;

      beforeEach(async () => {
        await question.answer(choice.id);
        res = await request(app.callback()).post(
          `/quizzes/${quiz.id}/questions`
        );
      });

      it("should respond with status 201", () => {
        expect(res).to.have.status(201);
      });

      it("should respond with the location of the new question", async () => {
        expect(res).to.have.header("Location");
        expect(
          await request(app.callback()).get(res.header.location)
        ).to.have.status(200);
      });

      it("should respond with representation of the new question", async () => {
        expect(res.body.id).to.exist.and.not.equal(question.id);
      });
    });

    it("should respond with 409 if the previous question is not answered", async () => {
      const res = await request(app.callback()).post(
        `/quizzes/${quiz.id}/questions`
      );
      expect(res).to.have.status(409);
    });
  });
});
