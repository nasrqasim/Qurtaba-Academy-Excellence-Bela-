export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export function parsePagination(
  searchParams: URLSearchParams,
  defaultLimit = 50,
  maxLimit = 200
): PaginationParams | null {
  const pageRaw = searchParams.get('page');
  const limitRaw = searchParams.get('limit');

  if (!pageRaw && !limitRaw) {
    return null;
  }

  const page = Math.max(1, parseInt(pageRaw || '1', 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(limitRaw || String(defaultLimit), 10) || defaultLimit));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}
