import axios from "axios";

export type Equation = {
  name?: string;
  markup: string;
  wikipediaId?: string;
  wikipediaTimestamp?: string;
  retrievedAt?: string;
};

export type Choice = {
  id: string;
  label: string;
};

export type Answer = {
  choiceId: string;
};

export type Question = {
  id: string;
  equation: Equation;
  choices: Choice[];
  answer?: Answer;
  correctAnswer?: Answer;
};

export type Quiz = {
  id: string;
};

const apiOrigin =
  process.env.JEQZ_API_ORIGIN ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3030" : "");
const client = axios.create({
  baseURL: `${apiOrigin}/api/v1`,
  timeout: 1000,
});

export async function createQuiz() {
  const response = await client.post("/quizzes");
  return response.data as Quiz;
}

export async function getQuiz(quizId: string) {
  const response = await client.get(`/quizzes/${quizId}`);
  return response.data as Quiz;
}

export async function getQuizQuestions(quizId: string) {
  const response = await client.get(`/quizzes/${quizId}/questions`);
  return response.data as Question[];
}

export async function createQuestion(quizId: string) {
  const response = await client.post(`/quizzes/${quizId}/questions`);
  return response.data as Question;
}

export async function getQuestion(questionId: string) {
  const response = await client.get(`/questions/${questionId}`);
  return response.data as Question;
}

export async function answerQuestion(questionId: string, choiceId: string) {
  void (await client.put(`/questions/${questionId}/answer`, { choiceId }));
}
