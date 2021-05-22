import { expect } from "../test/helpers";
import "../test/db";
import { Quiz } from "../quizzes";
import { Question, Choice } from "./models";
import _ from "lodash";

describe("quizzes/models", () => {
  let question!: Question;

  beforeEach(async () => {
    const quiz = await Quiz.create();
    question = await quiz.createQuestion();
  });

  it("should accept answer with choice it has", async () => {
    const { id: choiceId } = _.head(question.choices) as Choice;
    await question.answer(choiceId);
    const choices = await question.$relatedQuery("choices");
    choices.forEach((choice) =>
      expect(choice.isSelected).to.be.equal(_.toInteger(choice.id == choiceId))
    );
  });

  it("should not accept answer outside range", () => {
    return expect(question.answer("fake")).to.be.rejected;
  });

  it("should not accept answer to an already answered question", async () => {
    const { id: choiceId } = _.head(question.choices) as Choice;
    await question.answer(choiceId);
    return expect(question.answer(choiceId)).to.be.rejected;
  });
});
