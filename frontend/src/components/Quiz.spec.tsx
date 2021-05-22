import React from "react";
import Quiz from "./Quiz";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { expect } from "../test/helpers";
import sinon, { SinonStub } from "sinon";
import * as api from "../api";
import { question } from "./Question.spec";

const quizId = "c532b5ce-aa11-4733-b43f-b26bc94168b6";

describe("Quiz", () => {
  let getQuestion!: SinonStub;
  let answerQuestion!: SinonStub;

  beforeEach(async () => {
    getQuestion = sinon.stub(api, "getQuestion").resolves(question);
    answerQuestion = sinon.stub(api, "answerQuestion").resolves();
    await act(async () => {
      render(<Quiz id={quizId} questionId={question.id} />);
    });
  });

  afterEach(() => {
    getQuestion.restore();
    answerQuestion.restore();
  });

  it("should fetch question", async () => {
    expect(getQuestion).to.have.been.calledWith(question.id);
  });

  it("should answer question via API request", async () => {
    const choice = question.choices[0];
    const input = screen.getByLabelText(choice.label);
    await act(async () => {
      fireEvent.click(input);
    });
    expect(answerQuestion).to.have.been.calledWith(question.id, choice.id);
  });
});
