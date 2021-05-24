import { expect } from "../test/helpers";
import "../test/db";
import { Quiz } from "./models";
import { Question, Choice } from "../questions";
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

    describe("choices", () => {
      let choices!: Choice[];

      beforeEach(async () => {
        choices = question.choices as Choice[];
      });

      it("should be included in the related question", async () => {
        const choicesFromDb = (
          await question.$relatedQuery("choices").withGraphFetched("equation")
        ).map((choice) => ({
          ...choice,
          isCorrect: !!choice.isCorrect, // cast to boolean because the DB driver returns number
        }));
        expect(choicesFromDb).to.deep.equalInAnyOrder(choices);
      });

      it("should have exactly one correct choice", () => {
        expect(_.countBy(choices, (choice) => choice.isCorrect)).to.deep.equal({
          false: 3,
          true: 1,
        });
      });

      it("should allow creating question if the previous is answered", async () => {
        const choice = _.head(choices) as Choice;
        await question.answer(choice.id);
        return expect(quiz.createQuestion()).to.be.fulfilled;
      });
    });

    it("should not allow creating question if the previous is unanswered", () => {
      return expect(quiz.createQuestion()).to.be.rejected;
    });
  });
});
