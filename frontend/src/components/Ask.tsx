import { MessageSquareCode, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Ask = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-5 right-10 z-50 flex
     w-[155px] flex-col">
      {/* Ask Window */}
      <button
        type="button"
        onClick={() => navigate("/ask")}
        className="
          flex items-center gap-2
          px-1 py-1
          text-left
          text-[12px] font-bold
          text-neutral-800
              hover:text-pink-400
        "
      >
        <MessageSquareCode className="h-3 w-3 shrink-0 stroke-pink-400" />

        <span>Ask Window</span>
      </button>

      {/* Post Rack */}
      <button
        type="button"
        onClick={() => navigate("/requisitions/import")}
        className="
          flex items-center gap-2
          px-1 py-1
          text-left
          text-[12px] font-bold
          text-neutral-800
          hover:text-pink-400
        "
      >
        <Upload className="h-3 w-3 shrink-0  stroke-pink-400" />

        <span>Post Requisition</span>
      </button>
    </div>
  );
};

export default Ask;