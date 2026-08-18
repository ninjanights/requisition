import type { EmbedRequisitionResponse } from "../types/requisition";
import api from "./api";

export interface RebuildEmbeddingsResponse {
  total: number;
  embedded: number;
}

export const rebuildAllEmbeddings = async (): Promise<RebuildEmbeddingsResponse> => {
  const response = await api.post<RebuildEmbeddingsResponse>(
    "/embeddings/rebuild-all",
  );

  return response.data;
};


/**
 * POST /embeddings/{id}
 */
export const embedRequisition = async (
  id: number,
): Promise<EmbedRequisitionResponse> => {
  const response = await api.post<EmbedRequisitionResponse>(
    `/embeddings/${id}`,
  );

  return response.data;
};