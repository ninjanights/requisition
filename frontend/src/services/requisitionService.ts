import api from "./api";
import type {
  Requisition,
  CreateRequisitionRequest,
  RequisitionDetails,
} from "../types/requisition";

export const getMyRequisitions = async (): Promise<Requisition[]> => {
  const response = await api.get<Requisition[]>("/requisitions");

  return response.data;
};

/**
 * GET /requisitions/{id}
 */
export const getRequisitionById = async (
  id: number,
): Promise<RequisitionDetails> => {
  const response = await api.get<RequisitionDetails>(`/requisitions/${id}`);
  console.log(response, "🥬");
  return response.data;
};

/**
 * POST /requisitions
 */
export const createRequisition = async (
  data: CreateRequisitionRequest,
): Promise<RequisitionDetails> => {
  const response = await api.post<RequisitionDetails>(
    "/requisitions",
    data,
  );

  return response.data;
};

/**
 * POST /requisitions/{id}/submit
 */
export const submitRequisition = async (id: number): Promise<RequisitionDetails> => {
  const response = await api.post<RequisitionDetails>(
    `/requisitions/${id}/submit`,
  );

  return response.data;
};



export const importRequisition = async (
  text: string,
): Promise<RequisitionDetails> => {
  const response = await api.post<RequisitionDetails>(
    "/requisitions/import",
    null,
    {
      params: {
        text,
      },
    },
  );

  return response.data;
};