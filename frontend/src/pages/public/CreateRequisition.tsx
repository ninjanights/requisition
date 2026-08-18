import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { createRequisition } from "../../services/requisitionService";
import { useNavigate } from "react-router-dom";
import { useRequisitions } from "../../context/RequisitionContext";
import { useAuth } from "../../context/AuthContext";
import {
  requisitionSchema,
  type RequisitionFormData,
} from "../../validation/validation";
interface FormItem {
  description: string;
  quantity: string;
  unit: string;
  estimated_rate: string;
}
type FormErrors = {
  projectName?: string;
  department?: string;
  items?: {
    description?: string;
    quantity?: string;
    unit?: string;
    estimated_rate?: string;
  }[];
};

const emptyItem = (): FormItem => ({
  description: "",
  quantity: "",
  unit: "",
  estimated_rate: "",
});

const CreateRequisition = () => {
  const [projectName, setProjectName] = useState("");
  const [department, setDepartment] = useState("");
  const [items, setItems] = useState<FormItem[]>([emptyItem()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const { refreshRequisitions } = useRequisitions();
  const { user } = useAuth();

  const updateItem = (index: number, field: keyof FormItem, value: string) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    setItems((current) => [...current, emptyItem()]);
  };

  const removeItem = (index: number) => {
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const getItemTotal = (item: FormItem) => {
    const quantity = Number(item.quantity);
    const rate = Number(item.estimated_rate);

    if (!quantity || !rate) {
      return 0;
    }

    return quantity * rate;
  };

  const grandTotal = items.reduce(
    (total, item) => total + getItemTotal(item),
    0,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (items.length === 0) {
      setError("Add at least one item.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        project_name: projectName,
        department,
        items: items.map((item) => ({
          description: item.description,
          quantity: Number(item.quantity),
          unit: item.unit,
          estimated_rate: Number(item.estimated_rate),
        })),
      };

      // ZOD VALIDATION
      const result = requisitionSchema.safeParse(payload);

      if (!result.success) {
        const formErrors: FormErrors = {};

        result.error.issues.forEach((issue) => {
          const [field, index, itemField] = issue.path;

          // project_name
          if (field === "project_name") {
            formErrors.projectName = issue.message;
          }

          // department
          if (field === "department") {
            formErrors.department = issue.message;
          }

          // items[index].field
          if (
            field === "items" &&
            typeof index === "number" &&
            typeof itemField === "string"
          ) {
            if (!formErrors.items) {
              formErrors.items = [];
            }

            if (!formErrors.items[index]) {
              formErrors.items[index] = {};
            }

            formErrors.items[index][
              itemField as
                | "description"
                | "quantity"
                | "unit"
                | "estimated_rate"
            ] = issue.message;
          }
        });

        setErrors(formErrors);

        // Clear validation messages after 3 seconds
        setTimeout(() => {
          setErrors({});
        }, 3000);

        return;
      }

      // result.data is now validated
      const validatedPayload = result.data;

      // API

      const created = await createRequisition(validatedPayload);

      console.log("Created requisition:", created);

      await refreshRequisitions();

      // REDIRECT

      if (user?.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to create requisition:", error);

      setError("Failed to create requisition.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-sm text-neutral-500">Requisition Management</p>

        <h1 className="text-3xl font-bold tracking-tight">
          Create Requisition
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Create a requisition and add the required items.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic information */}
        <div className="mb-8 overflow-hidden rounded-xl border-2 border-neutral-500">
          <div className="grid grid-cols-2">
            {/* Project */}
            <div className="border-b-2 border-r-2 border-neutral-500 p-5">
              <label
                htmlFor="project"
                className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
              >
                Project
              </label>

              <input
                id="project"
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Enter project name"
                // required
                className="mt-2 w-full border-0 bg-transparent
                           text-sm outline-none
                           placeholder:text-neutral-300"
              />
              {errors.projectName && (
                <span className="text-[10px] font-bold text-red-600">
                  {errors.projectName}
                </span>
              )}
            </div>

            {/* Department */}
            <div className="border-b-2 border-neutral-500 p-5">
              <label
                htmlFor="department"
                className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
              >
                Department
              </label>
              <input
                id="department"
                type="text"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                placeholder="Enter department"
                // required
                className="mt-2 w-full border-0 bg-transparent
                           text-sm outline-none
                           placeholder:text-neutral-300"
              />{" "}
              {errors.department && (
                <span className="whitespace-nowrap text-[10px] font-bold text-red-600">
                  {errors.department}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Items</h2>

            <p className="mt-1 text-sm text-neutral-500">
              Add one or more items to this requisition.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 rounded-lg
                       border-2 border-neutral-900
                       px-4 py-2 text-sm font-medium
                       transition hover:bg-neutral-900
                       hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        {/* Items table */}
        <div className="overflow-hidden rounded-xl border-2 border-neutral-500">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-500">
                <th className="w-10 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  #
                </th>

                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Description
                </th>

                <th className="w-28 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Qty
                </th>

                <th className="w-28 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Unit
                </th>

                <th className="w-36 px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Rate
                </th>

                <th className="w-36 px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Total
                </th>

                <th className="w-14 px-4 py-4" />
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                  <tr
                    key={index}
                    className={!isLast ? "border-b-2 border-neutral-500" : ""}
                  >
                    {/* Number */}
                    <td className="px-4 py-4 text-sm text-neutral-400">
                      {index + 1}
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(event) =>
                          updateItem(index, "description", event.target.value)
                        }
                        placeholder="Description"
                        // required
                        className="w-full rounded-md
                                   border border-neutral-300
                                   px-3 py-2 text-sm
                                   outline-none
                                   focus:border-neutral-700"
                      />{" "}
                      {errors.items?.[index]?.description && (
                        <span className="mt-1 block text-[10px] font-bold text-red-600">
                          {errors.items[index]?.description}
                        </span>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(index, "quantity", event.target.value)
                        }
                        placeholder="0"
                        // required
                        className="w-full rounded-md
                                   border border-neutral-300
                                   px-3 py-2 text-sm
                                   outline-none
                                   focus:border-neutral-700"
                      />
                      {errors.items?.[index]?.quantity && (
                        <span className="mt-1 block text-[10px] font-bold text-red-600">
                          {errors.items[index]?.quantity}
                        </span>
                      )}
                    </td>

                    {/* Unit */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(event) =>
                          updateItem(index, "unit", event.target.value)
                        }
                        placeholder="pcs"
                        // required
                        className="w-full rounded-md
                                   border border-neutral-300
                                   px-3 py-2 text-sm
                                   outline-none
                                   focus:border-neutral-700"
                      />
                      {errors.items?.[index]?.unit && (
                        <span className="mt-1 block text-[10px] font-bold text-red-600">
                          {errors.items[index]?.unit}
                        </span>
                      )}
                    </td>

                    {/* Rate */}
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.estimated_rate}
                        onChange={(event) =>
                          updateItem(
                            index,
                            "estimated_rate",
                            event.target.value,
                          )
                        }
                        placeholder="0.00"
                        // required
                        className="w-full rounded-md
                                   border border-neutral-300
                                   px-3 py-2 text-right
                                   text-sm outline-none
                                   focus:border-neutral-700"
                      />
                      {errors.items?.[index]?.estimated_rate && (
                        <span className="mt-1 block text-[10px] font-bold text-red-600">
                          {errors.items[index]?.estimated_rate}
                        </span>
                      )}
                    </td>

                    {/* Calculated total */}
                    <td className="px-4 py-4 text-right text-sm font-medium text-neutral-800">
                      ₹{getItemTotal(item).toLocaleString("en-IN")}
                    </td>

                    {/* Delete */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="rounded-md p-2
                                   text-neutral-400
                                   transition
                                   hover:bg-neutral-100
                                   hover:text-red-600
                                   disabled:cursor-not-allowed
                                   disabled:opacity-30"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Grand total */}
            <tfoot>
              <tr className="border-t-2 border-neutral-500">
                <td
                  colSpan={5}
                  className="px-4 py-5 text-right text-sm font-semibold text-neutral-700"
                >
                  Grand Total
                </td>

                <td
                  colSpan={2}
                  className="px-4 py-5 text-right text-base font-bold text-neutral-900"
                >
                  ₹{grandTotal.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Error */}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* Submit */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-neutral-900
                       px-6 py-3 text-sm font-medium
                       text-white transition
                       hover:bg-neutral-700
                       disabled:cursor-not-allowed
                       disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Requisition"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequisition;
