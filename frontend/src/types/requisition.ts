export type RequisitionStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected";

export interface Requisition {
  id?: number;
  title?: string;
  description?: string;
  status?: RequisitionStatus;
  created_at?: string;
  updated_at?: string;
}
