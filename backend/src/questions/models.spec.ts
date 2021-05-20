import { expect } from "../test/helpers";
import "../test/db";
import { Quiz } from "../quizzes";
import { Question } from "./models";
import _ from "lodash";

describe("quizzes/models", () => {
  let question!: Question;

  beforeEach(async () => {
    const quiz = await Quiz.create();
    question = await quiz.createQuestion();
  });

  _.range(1, 5).forEach((rank) => {
    it(`should accept answer inside range (${rank})`, async () => {
      await question.answer(rank);
      const choices = await question.$relatedQuery("choices");
      choices.forEach((choice) =>
        expect(choice.isSelected).to.be.equal(_.toInteger(choice.rank == rank))
      );
    });
  });

  it("should not accept answer outside range", () => {
    return expect(question.answer(0)).to.be.rejected;
  });

  it("should not accept answer to an already answered question", async () => {
    await question.answer(1);
    return expect(question.answer(2)).to.be.rejected;
  });
});
