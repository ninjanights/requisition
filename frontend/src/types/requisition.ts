export type RequisitionStatus = "draft" | "submitted" | "approved" | "rejected";

export interface Requisition {
  id: number;
  requisition_no: string;
  project_name: string;
  requested_by: number;
  department: string;
  status: RequisitionStatus;
  is_embedded: boolean;

  created_at: string;
}

export interface RequisitionItem {
  description: string;
  qty: string;
  rate: string;
  total: string;
  unit: string;
}

export interface RequisitionDetails {
  id: number;
  requisitionNo: string;
  project: string;
  requestedBy: number;
  department: string;
  status: RequisitionStatus;
  createdAt: string;
  items: RequisitionItem[];
}
export interface EmbedAllRequisitionsResponse {
  message: string;
  embedded_count: number;
}
export interface CreateRequisitionItem {
  description: string;
  quantity: number;
  unit: string;
  estimated_rate: number;
}

export interface CreateRequisitionRequest {
  project_name: string;
  department: string;
  items: CreateRequisitionItem[];
}


export interface EmbedRequisitionResponse {
  message: string;
  requisition_id: number;
  embedded: boolean;
}