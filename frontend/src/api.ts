import axios from "axios";

export type Equation = {
  name?: string;
  markup: string;
};

export type Choice = {
  value: string;
  label: string;
  isSelected?: boolean;
  isCorrect?: boolean;
};

export type Question = {
  id: string;
  equation: Equation;
  choices: Choice[];
};

export type Quiz = {
  id: string;
  questionId: string;
};

const client = axios.create({
  baseURL: "http://localhost:3030",
  timeout: 1000,
});

export async function createQuiz() {
  const response = await client.post("/quizzes");
  return response.data as Quiz;
}

export async function getQuestion(questionId: string) {
  const response = await client.get(`/questions/${questionId}`);
  return response.data as Question;
}

export async function answerQuestion(questionId: string, answer: string) {
  void (await client.post(
    `/questions/${questionId}/answer`,
    {},
    { params: { answer } }
  ));
}
