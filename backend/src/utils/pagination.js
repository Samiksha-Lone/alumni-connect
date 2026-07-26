function parsePagination(query = {}, defaults = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || defaults.page || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || defaults.limit || 12));

  return { page, limit };
}

function buildPaginationResponse(data, page, limit, total, extra = {}) {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
      ...extra,
    },
  };
}

module.exports = {
  parsePagination,
  buildPaginationResponse,
};
