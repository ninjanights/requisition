import { MessageCircle, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Ask = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex w-[155px] flex-col gap-1">
      {/* Ask Window */}
      <button
        type="button"
        onClick={() => navigate("/ask")}
        className="
          flex items-center gap-2
          rounded-md
          bg-neutral-900
          px-3 py-2
          text-left
          text-xs font-semibold
          text-white
          hover:bg-neutral-800
        "
      >
        <MessageCircle className="h-4 w-4 shrink-0" />

        <span>Ask Window</span>
      </button>

      {/* Post Rack */}
      <button
        type="button"
        onClick={() => navigate("/requisitions/import")}
        className="
          flex items-center gap-2
          rounded-md
          border border-neutral-300
          bg-white
          px-3 py-2
          text-left
          text-xs font-semibold
          text-neutral-800
          hover:bg-neutral-100
        "
      >
        <Upload className="h-4 w-4 shrink-0" />

        <span>Post Rack</span>
      </button>
    </div>
  );
};

export default Ask;