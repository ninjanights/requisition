import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, Plus } from "lucide-react";

import { useRequisitions } from "../../context/RequisitionContext";
import { embedRequisition, rebuildAllEmbeddings } from "../../services/embeddingService";
import { submitRequisition } from "../../services/requisitionService";
import type { Requisition } from "../../types/requisition";

const AdminHome = () => {
  const {
    requisitions,
    isLoading,
    error,
    refreshRequisitions,
    page,
    totalPages,
    setPage,
  } = useRequisitions();
  const [isEmbeddingAll, setIsEmbeddingAll] = useState(false);
  const navigate = useNavigate();
  const getStatusTextClass = (status: Requisition["status"]) => {
    switch (status) {
      case "Draft":
        return "text-neutral-700";
      case "Submitted":
        return "text-neutral-700";
      case "Approved":
        return "text-neutral-700";
      case "Rejected":
        return "text-neutral-700";
      default:
        return "text-neutral-700";
    }
  };

  const getStatusDotClass = (status: Requisition["status"]) => {
    switch (status) {
      case "Draft":
        return "bg-[#D8C9A7]";
      case "Submitted":
        return "bg-[#9F8383]";
      case "Approved":
        return "bg-blue-300";
      case "Rejected":
        return "bg-rose-300";
      default:
        return "bg-neutral-400";
    }
  };
  const columns: {
    key: keyof Requisition;
    label: string;
  }[] = [
    { key: "requisition_no", label: "requisition_no" },
    { key: "project_name", label: "project_name" },
    { key: "department", label: "department" },
    { key: "requested_by", label: "requested_by" },
    { key: "created_at", label: "created_at" },
    { key: "status", label: "status" },
  ];

  const handleEmbedAll = async () => {
    try {
      setIsEmbeddingAll(true);
      const result = await rebuildAllEmbeddings();
      console.log(result);
      window.location.reload();
    } catch (error) {
      console.error("Failed to embed requisitions:", error);
    } finally {
      setIsEmbeddingAll(false);
    }
  };

  const [embeddingId, setEmbeddingId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const handleEmbed = async (id: number) => {
    try {
      setEmbeddingId(id);
      await embedRequisition(id);
      window.location.reload();
    } catch (error) {
      console.error("Failed to embed requisition:", error);
    } finally {
      setEmbeddingId(null);
    }
  };

  const handleSubmit = async (id: number) => {
    try {
      setSubmittingId(id);
      await submitRequisition(id);
      await refreshRequisitions();
    } catch (error) {
      console.error("Failed to submit requisition:", error);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="app-page">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="app-title">All Requisitions</h1>
          <p className="app-subtitle">All Requisitions of Admin and public.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleEmbedAll}
            disabled={isEmbeddingAll}
            className="app-button-secondary px-4 py-2"
          >
            {isEmbeddingAll ? "Embedding..." : "Embed All"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/requisitions/create")}
            className="app-button px-4 py-2.5"
          >
            <Plus className="h-4 w-4" />
            Create Requisition
          </button>
        </div>
      </div>

      {isLoading && <p className="text-[12px] font-bold text-neutral-500">Loading requisitions...</p>}

      {error && <p className="app-error">{error}</p>}

      {!isLoading && !error && requisitions.length === 0 && (
        <div className="app-panel flex min-h-[40vh] items-center justify-center p-8">
          <p className="text-[12px] font-bold text-neutral-500">No requisitions found.</p>
        </div>
      )}

      {!isLoading && requisitions.length > 0 && (
        <div className="flex gap-4">
          <div className="flex flex-col">
            <div className="h-[29px]" />
            {requisitions.map((requisition) => (
              <div
                key={requisition.id}
                className="flex h-[52px] items-center text-[14px] font-semibold text-[#574964]"
              >
                #{requisition.id}
              </div>
            ))}
          </div>

          <div className="flex-1">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="pb-2 text-left text-[12px] font-bold uppercase text-[#574964]"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>

            <div className="app-panel">
              <table className="w-full table-fixed border-collapse">
                <tbody>
                  {requisitions.map((requisition, rowIndex) => (
                    <tr
                      key={requisition.id}
                      className={`${rowIndex % 2 === 0 ? "bg-[hsl(0,0%,75%)]" : "bg-neutral-300"} h-[52px]`}
                    >
                      {columns.map((col, colIndex) => {
                        const isLastRow = rowIndex === requisitions.length - 1;
                        const isLastCol = colIndex === columns.length - 1;
                        const borderClasses = [
                          !isLastCol ? "border-r-2" : "",
                          !isLastRow ? "border-b-2" : "",
                          "border-neutral-800",
                        ].join(" ");

                        if (col.key === "status") {
                          return (
                            <td key={col.key} className={`h-[52px] px-4 py-3 ${borderClasses}`}>
                              {requisition.status === "Submitted" ? (
                                <span className="flex items-center gap-2 text-[14px] font-semibold">
                                  <span
                                    className={`h-2.5 w-2.5 rounded-full ${getStatusDotClass(requisition.status)}`}
                                  />
                                  <span className={getStatusTextClass(requisition.status)}>
                                    {requisition.status}
                                  </span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSubmit(requisition.id)}
                                  disabled={submittingId === requisition.id}
                                  className="flex items-center gap-2 text-[14px] font-semibold disabled:cursor-wait disabled:opacity-50"
                                >
                                  <span
                                    className={`h-2.5 w-2.5 rounded-full ${getStatusDotClass(requisition.status)}`}
                                  />
                                  <span className={getStatusTextClass(requisition.status)}>
                                    {submittingId === requisition.id ? "Submitting..." : requisition.status}
                                  </span>
                                </button>
                              )}
                            </td>
                          );
                        }

                        if (col.key === "created_at") {
                          return (
                            <td key={col.key} className={`h-[52px] truncate px-4 py-3 text-[14px] font-semibold text-neutral-600 ${borderClasses}`}>
                              {new Date(requisition.created_at).toLocaleDateString()}
                            </td>
                          );
                        }

                        return (
                          <td key={col.key} className={`h-[52px] truncate px-4 py-3 text-[14px] font-semibold text-neutral-700 ${borderClasses}`}>
                            {requisition[col.key]}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="h-[29px]" />
            {requisitions.map((requisition) => (
              <div key={requisition.id} className="flex h-[52px] items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/requisitions/${requisition.id}`)}
                  className="rounded-md p-2 text-[#574964] transition hover:bg-neutral-200"
                  title="View requisition"
                  aria-label={`View ${requisition.requisition_no}`}
                >
                  <Eye className="h-5 w-5" />
                </button>
                {requisition.is_embedded ? (
                  <span className="text-[12px] font-bold text-[#574964]">{"<Embedded/>"}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleEmbed(requisition.id)}
                    disabled={embeddingId === requisition.id}
                    className="text-[12px] font-bold text-neutral-500 transition hover:text-[#574964] disabled:cursor-wait disabled:opacity-50"
                  >
                    {embeddingId === requisition.id ? "Embedding..." : "Not Embedded"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center 
        gap-3">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="text-[#574964] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <span className="text-[12px] font-semibold text-neutral-600">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="text-[#574964] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminHome;












