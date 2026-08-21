import api from "./api";

import type {
  RequisitionPaginatedResponse,
  CreateRequisitionRequest,
  RequisitionDetails,
} from "../types/requisition";

export const getMyRequisitions = async (
  page = 1,
  pageSize = 10,
  status?: string,
): Promise<RequisitionPaginatedResponse> => {
  const response = await api.get<RequisitionPaginatedResponse>(
    "/requisitions",
    {
      params: {
        page,
        page_size: pageSize,
        ...(status && { status }),
      },
    },
  );

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