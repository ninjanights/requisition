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
    <div className="app-page">
      <h1 className="app-title">Import Requisition</h1>

      <p className="app-subtitle">
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
        className="app-input mt-6 min-h-[300px] p-4"
      />

      {error && (
        <p className="app-error mt-3">{error}</p>
      )}

      <button
        type="button"
        onClick={handleImport}
        disabled={!text.trim() || isLoading}
        className="app-button mt-4 px-5 py-3"
      >
        {isLoading ? "Importing..." : "Import Requisition"}
      </button>
    </div>
  );
};

export default RackPage;

