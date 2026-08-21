import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useRequisition } from "../../hooks/useRequisition";

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

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
      <div className="app-page">
        <p className="text-[12px] font-bold text-neutral-500">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-page app-error">
        {error}
      </div>
    );
  }

  if (!requisition) {
    return (
      <div className="app-page">
        <p className="text-[12px] font-bold text-neutral-500">
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
    <div className="app-page">

      {/* Back */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-6 flex items-center gap-2
                   text-[12px] font-bold text-neutral-500
                   transition hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">

        <div>
          <p className="app-kicker">
            Requisition
          </p>

          <h1 className="app-title">
            {requisition.requisitionNo}
          </h1>
        </div>

        <span className="rounded-full bg-neutral-100 px-4 py-2 text-[12px] font-bold uppercase text-[#635666]">
          {requisition.status}
        </span>

      </div>

      {/* Requisition information */}
      <div className="app-panel mb-8">

        <div className="grid grid-cols-2">

          {/* Project */}
          <div className="border-b-2 border-r-2 border-neutral-800 p-5">
            <p className="text-[12px] font-bold uppercase text-neutral-500">
              Project
            </p>

            <p className="mt-2 text-[12px] font-bold text-neutral-800">
              {requisition.project}
            </p>
          </div>

          {/* Department */}
          <div className="border-b-2 border-neutral-800 p-5">
            <p className="text-[12px] font-bold uppercase text-neutral-500">
              Department
            </p>

            <p className="mt-2 text-[12px] font-bold text-neutral-800">
              {requisition.department}
            </p>
          </div>

          {/* Requested By */}
          <div className="border-r-2 border-neutral-800 p-5">
            <p className="text-[12px] font-bold uppercase text-neutral-500">
              Requested By
            </p>

            <p className="mt-2 text-[12px] font-bold text-neutral-800">
              #{requisition.requestedBy}
            </p>
          </div>

          {/* Created */}
          <div className="p-5">
            <p className="text-[12px] font-bold uppercase text-neutral-500">
              Created
            </p>

            <p className="mt-2 text-[12px] font-bold text-neutral-800">
              {formatDateTime(requisition.createdDate)}
            </p>
          </div>

        </div>
      </div>

      {/* Items */}
      <div>

        <div className="mb-4">
          <h2 className="text-[16px] font-bold text-neutral-900">
            Items
          </h2>

          <p className="app-subtitle">
            Items included in this requisition.
          </p>
        </div>

        <div className="app-panel">

          <table className="w-full table-fixed border-collapse">

            <thead>
              <tr className="border-b-2 border-neutral-800">

                <th className="w-12 px-4 py-4 text-left text-[12px] font-bold uppercase text-neutral-500">
                  #
                </th>

                <th className="px-4 py-4 text-left text-[12px] font-bold uppercase text-neutral-500">
                  Description
                </th>

                <th className="w-24 px-4 py-4 text-left text-[12px] font-bold uppercase text-neutral-500">
                  Unit
                </th>

                <th className="w-24 px-4 py-4 text-right text-[12px] font-bold uppercase text-neutral-500">
                  Qty
                </th>

                <th className="w-32 px-4 py-4 text-right text-[12px] font-bold uppercase text-neutral-500">
                  Rate
                </th>

                <th className="w-32 px-4 py-4 text-right text-[12px] font-bold uppercase text-neutral-500">
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
                        ? "border-b-2 border-neutral-800"
                        : ""
                    }
                  >

                    <td className="px-4 py-4 text-[12px] font-bold text-neutral-500">
                      {index + 1}
                    </td>

                    <td className="truncate px-4 py-4 text-[12px] font-bold text-neutral-800">
                      {item.description}
                    </td>

                    <td className="px-4 py-4 text-[12px] font-bold text-neutral-600">
                      {item.unit}
                    </td>

                    <td className="px-4 py-4 text-right text-[12px] font-bold text-neutral-600">
                      {Number(item.qty)}
                    </td>

                    <td className="px-4 py-4 text-right text-[12px] font-bold text-neutral-600">
                      ₹{Number(item.rate).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-4 text-right text-[12px] font-bold text-neutral-800">
                      ₹{Number(item.total).toLocaleString("en-IN")}
                    </td>

                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-neutral-800">

                <td
                  colSpan={5}
                  className="px-4 py-5 text-right text-[12px] font-bold text-neutral-700"
                >
                  Grand Total
                </td>

                <td className="px-4 py-5 text-right text-[14px] font-bold text-[#635666]">
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




