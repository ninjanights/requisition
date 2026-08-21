import { MessageSquareCode, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Ask = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        fixed left-6 top-1/2 z-50
        flex -translate-y-1/2 flex-col items-start
      "
    >
      {/* Ask Window */}
      <button
        type="button"
        onClick={() => navigate("/ask")}
        className="
          group flex items-center gap-2
          py-1.5
          text-neutral-600
        "
      >
        <MessageSquareCode
          className="
            h-4 w-4 shrink-0
            stroke-[#5B5656]
          "
        />

        <span
          className="
            whitespace-nowrap
            text-[12px] font-bold
            text-neutral-600
            opacity-0
            -translate-x-2
            transition-none
            group-hover:translate-x-0
            group-hover:opacity-100
          "
        >
          Ask Window
        </span>
      </button>

      {/* Middle dot */}
      <span className="text-[14px]  px-[6px] leading-none text-neutral-800">
        ·
      </span>

      {/* Post Requisition */}
      <button
        type="button"
        onClick={() => navigate("/requisitions/import")}
        className="
          group flex items-center gap-2
          py-1.5
          text-neutral-600
        "
      >
        <Upload
          className="
            h-4 w-4 shrink-0
            stroke-[#5B5656]
          "
        />

        <span
          className="
            whitespace-nowrap
            text-[12px] font-bold
            text-neutral-600
            opacity-0
            -translate-x-2
            transition-none
            group-hover:translate-x-0
            group-hover:opacity-100
          "
        >
          Post Requisition
        </span>
      </button>
    </div>
  );
};

export default Ask;