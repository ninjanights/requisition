import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { importRequisition } from "../services/requisitionService";

const RackPage = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleImport = async () => {
    if (!text.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      const requisition = await importRequisition(text);

      navigate(`/requisitions/${requisition.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to import requisition.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">Import Requisition</h1>

      <p className="mt-1 text-sm text-neutral-500">
        Paste requisition information in any format.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Example:

Project: New Office Setup
Department: IT

10 Dell laptops - ₹75000 each
5 wireless keyboards - ₹1500 each
20 monitors - ₹12000 each`}
        className="mt-6 min-h-[300px] w-full rounded-xl border-2
                   border-neutral-300 bg-neutral-50 p-4 text-sm
                   outline-none transition
                   focus:border-neutral-700"
      />

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}

      <button
        type="button"
        onClick={handleImport}
        disabled={!text.trim() || isLoading}
        className="mt-4 rounded-lg bg-neutral-900 px-5 py-3
                   text-sm font-semibold text-white
                   transition hover:bg-neutral-700
                   disabled:cursor-not-allowed
                   disabled:opacity-50"
      >
        {isLoading ? "Importing..." : "Import Requisition"}
      </button>
    </div>
  );
};

export default RackPage;
