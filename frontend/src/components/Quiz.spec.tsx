import React from "react";
import Quiz from "./Quiz";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { expect } from "../test/helpers";
import sinon, { SinonStub } from "sinon";
import * as api from "../api";
import { question } from "./Question.spec";

const quizId = "c532b5ce-aa11-4733-b43f-b26bc94168b6";

const conflictError = {
  isAxiosError: true,
  response: {
    status: 409,
  },
};

describe("Quiz", () => {
  let createQuestion!: SinonStub;
  let getQuizQuestions!: SinonStub;
  let getQuestion!: SinonStub;
  let answerQuestion!: SinonStub;

  beforeEach(async () => {
    createQuestion = sinon.stub(api, "createQuestion").rejects();
    getQuizQuestions = sinon.stub(api, "getQuizQuestions").resolves([question]);
    getQuestion = sinon.stub(api, "getQuestion").resolves(question);
    answerQuestion = sinon.stub(api, "answerQuestion").resolves();
    await act(async () => {
      render(<Quiz quiz={{ id: quizId }} />);
    });
  });

  afterEach(() => {
    createQuestion.restore();
    getQuizQuestions.restore();
    getQuestion.restore();
    answerQuestion.restore();
  });

  it("should display question counter", () => {
    expect(screen.getByText("Question 1")).to.exist;
  });

  it("should display score", () => {
    expect(screen.getByText("Score 0 / 0")).to.exist;
  });

  describe("before answering", () => {
    it("should display enabled choices", () => {
      question.choices.forEach((choice) => {
        expect(screen.getByLabelText(choice.label)).to.not.have.attribute(
          "disabled"
        );
      });
    });

    it("should display disabled next question button", () => {
      expect(screen.getByRole("button")).to.have.attribute("disabled");
    });
  });

  describe("after answering", () => {
    let choice!: api.Choice;

    beforeEach(async () => {
      choice = question.choices[0];
      const input = screen.getByLabelText(choice.label);
      getQuestion.resolves({
        ...question,
        answer: { choiceId: choice.id },
        correctAnswer: { choiceId: choice.id },
      });
      await act(async () => {
        fireEvent.click(input);
      });
    });

    it("should answer question via API request", () => {
      expect(answerQuestion).to.have.been.calledWith(question.id, choice.id);
    });

    it("should update score", () => {
      expect(screen.getByText("Score 1 / 1")).to.exist;
    });

    it("should display disabled choices", () => {
      question.choices.forEach((choice) => {
        expect(screen.getByLabelText(choice.label)).to.have.attribute(
          "disabled"
        );
      });
    });

    it("should display enabled next question button", () => {
      expect(screen.getByRole("button")).to.not.have.attribute("disabled");
    });

    describe("after clicking the next question button", () => {
      beforeEach(async () => {
        createQuestion.resolves(question);
        const button = screen.getByRole("button");
        await act(async () => {
          fireEvent.click(button);
        });
      });

      it("should create a new question", () => {
        expect(createQuestion).to.have.been.calledWith(quizId);
      });

      it("should update question counter", () => {
        expect(screen.getByText("Question 2")).to.exist;
      });
    });

    it("should refresh if next question fails with conflict", async () => {
      createQuestion.rejects(conflictError);
      getQuizQuestions.resetHistory();
      const button = screen.getByRole("button");
      await act(async () => {
        fireEvent.click(button);
      });
      expect(getQuizQuestions).to.have.been.calledOnceWith(quizId);
    });
  });

  it("should refresh if answering question fails with conflict", async () => {
    answerQuestion.rejects(conflictError);
    const choice = question.choices[0];
    const input = screen.getByLabelText(choice.label);
    getQuizQuestions.resetHistory();
    await act(async () => {
      fireEvent.click(input);
    });
    expect(getQuizQuestions).to.have.been.calledOnceWith(quizId);
  });
});
