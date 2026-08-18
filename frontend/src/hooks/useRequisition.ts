import { useCallback, useEffect, useState } from "react";

import { getRequisitionById } from "../services/requisitionService";

import type { RequisitionDetails } from "../types/requisition";

export const useRequisition = (id: number | null) => {
  const [requisition, setRequisition] = useState<RequisitionDetails | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchRequisition = useCallback(async () => {
    if (id === null) {
      setRequisition(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getRequisitionById(id);
      setRequisition(data);
    } catch (error) {
      console.error("Failed to fetch requisition:", error);

      setRequisition(null);
      setError("Failed to load requisition.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequisition();
  }, [fetchRequisition]);

  return {
    requisition,
    isLoading,
    error,
    refresh: fetchRequisition,
  };
};
