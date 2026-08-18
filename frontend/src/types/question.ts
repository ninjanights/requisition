export interface QuestionRequest {
  question: string;
}

export interface QuestionResponse {
  question: string;
  answer: string;
  source: "SQL" | "RAG";
}