import type { QuestionResponse, QuestionRequest } from "./../types/question";
import api from "./api";

/**
 * POST /questions
 */
export const askQuestion = async (
  data: QuestionRequest,
): Promise<QuestionResponse> => {
  const response = await api.post<QuestionResponse>("/questions", data);

  return response.data;
};
