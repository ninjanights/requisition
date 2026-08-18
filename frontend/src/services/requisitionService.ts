import api from "./api";
import type {
  Requisition,
  CreateRequisitionRequest,
  RequisitionDetails,
} from "../types/requisition";

export const getMyRequisitions = async (): Promise<Requisition[]> => {
  const response = await api.get<Requisition[]>("/api/requisitions");

  return response.data;
};

/**
 * GET /api/requisitions/{id}
 */
export const getRequisitionById = async (
  id: number,
): Promise<RequisitionDetails> => {
  const response = await api.get<RequisitionDetails>(`/api/requisitions/${id}`);
  console.log(response, "🥬");
  return response.data;
};

/**
 * POST /api/requisitions
 */
export const createRequisition = async (
  data: CreateRequisitionRequest,
): Promise<RequisitionDetails> => {
  const response = await api.post<RequisitionDetails>(
    "/api/requisitions",
    data,
  );

  return response.data;
};

/**
 * POST /api/requisitions/{id}/submit
 */
export const submitRequisition = async (id: number): Promise<RequisitionDetails> => {
  const response = await api.post<RequisitionDetails>(
    `/api/requisitions/${id}/submit`,
  );

  return response.data;
};



export const importRequisition = async (
  text: string,
): Promise<RequisitionDetails> => {
  const response = await api.post<RequisitionDetails>(
    "/api/requisitions/import",
    null,
    {
      params: {
        text,
      },
    },
  );

  return response.data;
};