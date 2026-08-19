import { useState } from "react";
import { askQuestion } from "../services/questionService";
import type { QuestionRequest } from "../types/question";

const AskPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState<"RAG" | "SQL" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError("");
      setAnswer("");
      setSource(null);
      const request: QuestionRequest = {
        question,
      };
      const response = await askQuestion(request);

      setAnswer(response.answer);
      setSource(response.source);
    } catch (error) {
      console.error(error);
      setError("Failed to get an answer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-page flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="app-title">
          Ask about requisitions
        </h1>

        <p className="app-subtitle">
          Ask a question about your purchase requisitions.
        </p>
      </div>

      {/* Question input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAsk();
            }
          }}
          placeholder="Ask something about the requisitions..."
          className="app-input flex-1 px-4 py-3"
        />

        <button
          type="button"
          onClick={handleAsk}
          disabled={!question.trim() || isLoading}
          className="app-button px-6 py-3"
        >
          {isLoading ? "Asking..." : "Ask"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6">
          <p className="app-error">{error}</p>
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div className="app-panel mt-8 p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[12px] font-bold uppercase text-neutral-500">
              Answer
            </h2>

            {source && (
              <span
                className={`
                  rounded-full px-3 py-1 text-[12px] font-bold
                  ${
                    source === "RAG"
                      ? "bg-pink-100 text-pink-600"
                      : "bg-blue-100 text-blue-600"
                  }
                `}
              >
                {source}
              </span>
            )}
          </div>

          <p className="whitespace-pre-wrap text-[12px] font-bold leading-7 text-neutral-800">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default AskPage;

