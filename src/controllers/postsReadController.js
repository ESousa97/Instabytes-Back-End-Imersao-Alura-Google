import { getPostPorId, getTodosPosts } from '../models/postsModel.js';
import { sendSuccess } from '../utils/httpResponses.js';
import { normalizePostResponse, parsePagination } from '../utils/postUtils.js';
import { handleNotFound, handleServerError } from './postControllerUtils.js';

export async function listarPosts(req, res) {
  try {
    const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 100, maxLimit: 100 });

    const posts = await getTodosPosts(skip, limit);

    const postsComUrls = posts.map((post) => normalizePostResponse(post, req));

    return sendSuccess(res, {
      status: 200,
      data: postsComUrls,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit
      }
    });
  } catch (error) {
    return handleServerError(res, error, 'Falha ao buscar posts');
  }
}

export async function obterPostPorId(req, res) {
  try {
    const { id } = req.params;

    const post = await getPostPorId(id);

    if (!post) {
      return handleNotFound(res);
    }

    const postCompleto = normalizePostResponse(post, req);

    return sendSuccess(res, {
      status: 200,
      data: postCompleto
    });
  } catch (error) {
    return handleServerError(res, error, 'Falha ao buscar post');
  }
}
