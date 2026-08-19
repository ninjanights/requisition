import { useRequisitions } from "../../context/RequisitionContext";
import type { Requisition } from "../../types/requisition";
import { Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useBackendStatus from "../../hooks/useBackendStatus";
import { useAuth } from "../../context/AuthContext";
import { embedRequisition } from "../../services/embeddingService";
import { submitRequisition } from "../../services/requisitionService";
const PublicHome = () => {
  const { requisitions, isLoading, error, refreshRequisitions } =
    useRequisitions();
  const online = useBackendStatus();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [embeddingId, setEmbeddingId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

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

  const handleSubmit = async (id: number) => {
    try {
      setSubmittingId(id);
      await submitRequisition(id);
      // refresh the list from context
      await refreshRequisitions();
    } catch (error) {
      console.error("Failed to submit requisition:", error);
    } finally {
      setSubmittingId(null);
    }
  };

  useEffect(() => {
    // If an admin is logged in and visits the public home, redirect to /admin
    if (!authLoading && user?.role === "ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, [authLoading, user, navigate]);
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

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Requisitions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Requisitions associated with your session.
          </p>
        </div>

        <div className="flex items-center gap-4">
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
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-xs font-bold text-neutral-500">{online ? "Awake" : "Sleeping"}</p>
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
                        rowIndex % 2 === 0 ? "bg-neutral-400" : "bg-neutral-300"
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
                              className={`px-4 py-3 ${borderClasses}`}
                            >
                              {requisition.status === "submitted" ? (
                                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800">
                                  {requisition.status}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSubmit(requisition.id)}
                                  disabled={submittingId === requisition.id}
                                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 disabled:cursor-wait disabled:opacity-50"
                                  title={`Submit ${requisition.requisition_no}`}
                                >
                                  {submittingId === requisition.id
                                    ? "Submitting..."
                                    : requisition.status}
                                </button>
                              )}
                            </td>
                          );
                        }

                        if (col.key === "created_at") {
                          return (
                            <td
                              key={col.key}
                              className={`truncate px-4 py-3 
                                text-sm text-gray-500 ${borderClasses}`}
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
                            className={`truncate px-4 py-3 text-sm
                                 text-gray-600 ${borderClasses}`}
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
                <div key={requisition.id} className="flex h-[52px] items-center gap-3">
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
                {/* status is now clickable in the table cell; no separate submit button here */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicHome;
