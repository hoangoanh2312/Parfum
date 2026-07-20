export type AdminResource = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminResourceSort = "newest" | "oldest" | "name_asc" | "name_desc";

export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type AdminResourceList = {
  items: AdminResource[];
  pagination: Pagination;
};

