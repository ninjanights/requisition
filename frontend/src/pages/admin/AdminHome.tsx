import { useNavigate } from "react-router-dom";
import { Eye, Plus } from "lucide-react";

import { useRequisitions } from "../../context/RequisitionContext";
import type { Requisition } from "../../types/requisition";
import { useState } from "react";
import { embedRequisition } from "../../services/embeddingService";
import { rebuildAllEmbeddings } from "../../services/embeddingService";

const AdminHome = () => {
  const { requisitions, isLoading, error } = useRequisitions();
  const [isEmbeddingAll, setIsEmbeddingAll] = useState(false);
  const navigate = useNavigate();
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

  const handleEmbed = async (id: number) => {
    try {
      setEmbeddingId(id);
      await embedRequisition(id);
      // Refresh the requisition list
      window.location.reload();
    } catch (error) {
      console.error("Failed to embed requisition:", error);
    } finally {
      setEmbeddingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Requisitions</h1>
          <p className="mt-1 text-sm text-gray-500">
            All Requisitions of Admin and public.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleEmbedAll}
            disabled={isEmbeddingAll}
            className="rounded-lg border border-pink-300
               px-4 py-2.5 text-sm font-semibold
               text-pink-600 transition
               hover:bg-pink-50
               disabled:cursor-wait disabled:opacity-50"
          >
            {isEmbeddingAll ? "Embedding..." : "Embed All"}
          </button>

          <div className="h-6 w-px bg-neutral-400" />

          <button
            type="button"
            onClick={() => navigate("/requisitions/create")}
            className="flex items-center gap-2 rounded-lg
               bg-neutral-900 px-4 py-2.5
               text-sm font-medium text-white
               transition hover:bg-neutral-700"
          >
            <Plus className="h-4 w-4" />
            Create Requisition
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-gray-500">Loading requisitions...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && requisitions.length === 0 && (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-gray-500">No requisitions found.</p>
        </div>
      )}

      {!isLoading && requisitions.length > 0 && (
        <div className="flex gap-4">
          {/* ID column - lives outside the bordered table, left side */}
          <div className="flex flex-col">
            {/* spacer to align with header row height */}
            <div className="h-[29px]" />
            {requisitions.map((requisition) => (
              <div
                key={requisition.id}
                className="flex h-[52px] items-center text-sm font-semibold text-gray-400"
              >
                #{requisition.id}
              </div>
            ))}
          </div>{" "}
          {/* Right side: header (outside) + bordered table (inside) */}
          <div className="flex-1">
            {/* Header table - no borders, sits above the grid */}
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>

            {/* Body table - transparent, 4px grid lines, rounded-xl corners */}
            <div
              className="overflow-hidden rounded-xl border-[2px]
             border-neutral-500 bg-transparent"
            >
              <table className="w-full table-fixed border-collapse">
                <tbody>
                  {requisitions.map((requisition, rowIndex) => (
                    <tr
                      key={requisition.id}
                      className={
                        rowIndex % 2 === 0
                          ? "bg-[hsla(0,0%,75%)]"
                          : "bg-neutral-300"
                      }
                    >
                      {columns.map((col, colIndex) => {
                        const isLastRow = rowIndex === requisitions.length - 1;
                        const isLastCol = colIndex === columns.length - 1;

                        const borderClasses = [
                          !isLastCol ? "border-r-[2px]" : "",
                          !isLastRow ? "border-b-[2px]" : "",
                          "border-neutral-500",
                        ].join(" ");

                        if (col.key === "status") {
                          return (
                            <td
                              key={col.key}
                              className={`px-4 py-3 items-center flex justify-center ${borderClasses}`}
                            >
                              <span
                                className="rounded-full bg-nutral-100
                               px-3 py-1 text-[12px] font-bold"
                              >
                                {requisition.status}
                              </span>
                            </td>
                          );
                        }

                        if (col.key === "created_at") {
                          return (
                            <td
                              key={col.key}
                              className={`truncate px-4 py-3 
                                text-[12px] font-bold text-nutral-800 ${borderClasses}`}
                            >
                              {new Date(
                                requisition.created_at,
                              ).toLocaleDateString()}
                            </td>
                          );
                        }

                        return (
                          <td
                            key={col.key}
                            className={`truncate px-4 py-3 text-[12px]
                                 text-nutral-800 font-bold ${borderClasses}`}
                          >
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
            {/* spacer for header */}
            <div className="h-[29px]" />

            {requisitions.map((requisition) => (
              <div
                key={requisition.id}
                className="flex h-[52px] items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/requisitions/${requisition.id}`)}
                  className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                  title="View requisition"
                  aria-label={`View ${requisition.requisition_no}`}
                >
                  <Eye className="h-5 w-5" />
                </button>
                {requisition.is_embedded ? (
                  <span className="text-xs font-semibold text-pink-600">
                    {"<Embedded/>"}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleEmbed(requisition.id)}
                    disabled={embeddingId === requisition.id}
                    className="text-xs font-medium text-neutral-500 transition hover:text-neutral-900 disabled:cursor-wait disabled:opacity-50"
                  >
                    {embeddingId === requisition.id
                      ? "Embedding..."
                      : "Not Embedded"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
