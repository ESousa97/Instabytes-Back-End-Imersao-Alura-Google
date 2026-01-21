export function buildShareUrl(req, postId) {
  return `${req.protocol}://${req.get('host')}/posts/${postId}`;
}

export function normalizePostResponse(post, req) {
  return {
    ...post,
    imgUrl: post.imgUrl || null,
    shareUrl: buildShareUrl(req, post._id),
    createdAt: post.createdAt || new Date(),
    updatedAt: post.updatedAt || new Date()
  };
}

export function parsePagination(query, { defaultLimit = 100, maxLimit = 100 } = {}) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const rawLimit = parseInt(query.limit, 10) || defaultLimit;
  const limit = Math.min(Math.max(rawLimit, 1), maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
