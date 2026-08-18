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
  isLoading: boolean;
  error: string | null;
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

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const refreshRequisitions = async () => {
    // Always attempt to load requisitions after auth state is known.
    // Public sessions may not have a `user` but can still have
    // requisitions tied to a `requisition_session` cookie on the backend.

    try {
      setIsLoading(true);
      setError(null);

      const data = await getMyRequisitions();
      console.log(data, "datall");
      setRequisitions(data);
    } catch (error) {
      console.error("Failed to fetch requisitions:", error);

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
  }, [user, authLoading]);

  return (
    <RequisitionContext.Provider
      value={{
        requisitions,
        isLoading,
        error,
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
