export function sendSuccess(res, { status = 200, data, message, pagination } = {}) {
  const payload = { success: true, data };

  if (message) {
    payload.message = message;
  }

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(status).json(payload);
}

export function sendError(res, { status = 500, error, message, success = false } = {}) {
  const payload = { success, error, message };
  return res.status(status).json(payload);
}
