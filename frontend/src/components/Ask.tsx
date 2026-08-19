import { MessageSquareCode, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Ask = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed left-6 top-1/2 z-50 
    flex w-[155px] -translate-y-1/2 flex-col items-start">
      {/* Ask Window */}
      <button
        type="button"
        onClick={() => navigate("/ask")}
        className="
          flex items-center gap-2
          px-1 py-1
          text-left
          text-[12px] font-bold
          text-neutral-500
              hover:text-[#281c59]
        "
      >
        <MessageSquareCode className="h-3 w-3 shrink-0 stroke-[#281c59]" />

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
          text-neutral-500
          hover:text-[#281c59]
        "
      >
        <Upload className="h-3 w-3 shrink-0  stroke-[#281c59]" />

        <span>Post Requisition</span>
      </button>
    </div>
  );
};

export default Ask;