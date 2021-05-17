import { expect } from "../test/helpers";
import "../test/db";
import { Quiz, Question, Choice } from "./models";
import _ from "lodash";

describe("quizzes/models", () => {
  let quiz!: Quiz;

  beforeEach(async () => {
    quiz = await Quiz.create();
  });

  it("should be created in the database", async () => {
    expect(await Quiz.query().findById(quiz.id)).to.deep.equal(quiz);
  });

  describe("questions", () => {
    let question!: Question;

    beforeEach(async () => {
      question = await quiz.createQuestion();
    });

    it("should be created in the database", async () => {
      expect(await Question.query().findById(question.id)).not.to.be.undefined;
    });

    it("should have a related quiz", () => {
      expect(question.quizId).to.be.equal(quiz.id);
    });

    it("should be created with increasing rank", async () => {
      const otherQuestion = await quiz.createQuestion(4);
      expect(otherQuestion.rank).to.be.equal(question.rank + 1);
    });

    describe("choices", () => {
      let choices!: Choice[];

      beforeEach(async () => {
        choices = question.choices as Choice[];
      });

      it("should be included in the related question", async () => {
        const choicesFromDb = (
          await Choice.query().where("questionId", question.id).orderBy("rank")
        ).map((choice) => ({
          ...choice,
          isCorrect: Boolean(choice.isCorrect), // cast to boolean because the DB driver returns number
        }));
        expect(choicesFromDb).to.deep.equal(choices);
      });

      it("should have exactly one correct choice", () => {
        expect(_.countBy(choices, (choice) => choice.isCorrect)).to.deep.equal({
          false: 3,
          true: 1,
        });
      });
    });
  });
});