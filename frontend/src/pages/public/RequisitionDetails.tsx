import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useRequisition } from "../../hooks/useRequisition";

const RequisitionDetails = () => {
  const { id } = useParams();

  const {
    requisition,
    isLoading,
    error,
  } = useRequisition(
    id ? Number(id) : null,
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-neutral-500">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-red-600">
        {error}
      </div>
    );
  }

  if (!requisition) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-neutral-500">
          Requisition not found.
        </p>
      </div>
    );
  }

  const grandTotal = requisition.items.reduce(
    (total, item) => total + Number(item.total),
    0,
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">

      {/* Back */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-6 flex items-center gap-2
                   text-sm text-neutral-500
                   transition hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">

        <div>
          <p className="mb-1 text-sm text-neutral-500">
            Requisition
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            {requisition.requisitionNo}
          </h1>
        </div>

        <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium uppercase tracking-wide text-neutral-700">
          {requisition.status}
        </span>

      </div>

      {/* Requisition information */}
      <div className="mb-8 overflow-hidden rounded-xl border-2 border-neutral-500">

        <div className="grid grid-cols-2">

          {/* Project */}
          <div className="border-b-2 border-r-2 border-neutral-500 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Project
            </p>

            <p className="mt-2 text-sm font-medium text-neutral-800">
              {requisition.project}
            </p>
          </div>

          {/* Department */}
          <div className="border-b-2 border-neutral-500 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Department
            </p>

            <p className="mt-2 text-sm font-medium text-neutral-800">
              {requisition.department}
            </p>
          </div>

          {/* Requested By */}
          <div className="border-r-2 border-neutral-500 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Requested By
            </p>

            <p className="mt-2 text-sm font-medium text-neutral-800">
              #{requisition.requestedBy}
            </p>
          </div>

          {/* Created */}
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Created
            </p>

            <p className="mt-2 text-sm font-medium text-neutral-800">
              {new Date(
                requisition.createdAt,
              ).toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* Items */}
      <div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Items
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Items included in this requisition.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border-2 border-neutral-500">

          <table className="w-full table-fixed border-collapse">

            <thead>
              <tr className="border-b-2 border-neutral-500">

                <th className="w-12 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  #
                </th>

                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Description
                </th>

                <th className="w-24 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Unit
                </th>

                <th className="w-24 px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Qty
                </th>

                <th className="w-32 px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Rate
                </th>

                <th className="w-32 px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Total
                </th>

              </tr>
            </thead>

            <tbody>
              {requisition.items.map((item, index) => {

                const isLast =
                  index ===
                  requisition.items.length - 1;

                return (
                  <tr
                    key={index}
                    className={
                      !isLast
                        ? "border-b-2 border-neutral-500"
                        : ""
                    }
                  >

                    <td className="px-4 py-4 text-sm text-neutral-400">
                      {index + 1}
                    </td>

                    <td className="truncate px-4 py-4 text-sm font-medium text-neutral-800">
                      {item.description}
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-600">
                      {item.unit}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-neutral-600">
                      {Number(item.qty)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm text-neutral-600">
                      ₹{Number(item.rate).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-medium text-neutral-800">
                      ₹{Number(item.total).toLocaleString("en-IN")}
                    </td>

                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-neutral-500">

                <td
                  colSpan={5}
                  className="px-4 py-5 text-right text-sm font-semibold text-neutral-700"
                >
                  Grand Total
                </td>

                <td className="px-4 py-5 text-right text-base font-bold text-neutral-900">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </td>

              </tr>
            </tfoot>

          </table>

        </div>

      </div>

    </div>
  );
};

export default RequisitionDetails;