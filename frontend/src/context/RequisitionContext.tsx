import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import { getMyRequisitions } from "../services/requisitionService";

import type { Requisition } from "../types/requisition";

interface RequisitionContextType {
  requisitions: Requisition[];

  page: number;
  pageSize: number;
  total: number;
  totalPages: number;

  isLoading: boolean;
  error: string | null;

  setPage: (page: number) => void;
  refreshRequisitions: () => Promise<void>;
}

const RequisitionContext = createContext<RequisitionContextType | undefined>(
  undefined,
);

interface RequisitionProviderProps {
  children: ReactNode;
}

export const RequisitionProvider = ({ children }: RequisitionProviderProps) => {
  const { user, isLoading: authLoading } = useAuth();

  const [requisitions, setRequisitions] = useState<Requisition[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshRequisitions = async () => {
    // Always attempt to load requisitions after auth state is known.
    // Public sessions may not have a `user` but can still have
    // requisitions tied to a `requisition_session` cookie on the backend.

    try {
      setIsLoading(true);
      setError(null);

      const data = await getMyRequisitions(page, pageSize);
      console.log(data, "paginated requisitions ---------");
      setRequisitions(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        setRequisitions([]);
        setTotal(0);
        setTotalPages(0);
        setError(null);
        return;
      }
      console.error("Failed to fetch requisitions:", error);

      setRequisitions([]);
      setTotal(0);
      setTotalPages(0);
      setError("Failed to load requisitions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    // Regardless of whether `user` exists, refresh requisitions so
    // public visitors (with a requisition session cookie) will see their data.
    refreshRequisitions();
  }, [user, authLoading, page]);

  return (
      <RequisitionContext.Provider
      value={{
        requisitions,
        page,
        pageSize,
        total,
        totalPages,
        isLoading,
        error,
        setPage,
        refreshRequisitions,
      }}
    >
      {children}
    </RequisitionContext.Provider>
  );
};

export const useRequisitions = () => {
  const context = useContext(RequisitionContext);

  if (!context) {
    throw new Error("useRequisitions must be used inside RequisitionProvider");
  }

  return context;
};
