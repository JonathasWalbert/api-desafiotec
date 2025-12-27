export interface PaginationDTO {
  page: number;
  limit: number;
  state?: "CREATED" | "ANALYSIS" | "COMPLETED";
}
