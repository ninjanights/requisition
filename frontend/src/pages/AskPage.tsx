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
    <div className="mx-auto flex max-w-3xl flex-col px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Ask about requisitions
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
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
          className="
            flex-1 rounded-xl border border-neutral-300
            bg-white px-4 py-3 text-sm
            outline-none transition
            focus:border-neutral-700
            focus:ring-1 focus:ring-neutral-700
          "
        />

        <button
          type="button"
          onClick={handleAsk}
          disabled={!question.trim() || isLoading}
          className="
            rounded-xl bg-neutral-900
            px-6 py-3 text-sm font-semibold text-white
            transition hover:bg-neutral-700
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {isLoading ? "Asking..." : "Ask"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
              Answer
            </h2>

            {source && (
              <span
                className={`
                  rounded-full px-3 py-1 text-xs font-semibold
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

          <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-800">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default AskPage;
