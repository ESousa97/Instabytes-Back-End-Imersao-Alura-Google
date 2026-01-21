import { sendError } from '../utils/httpResponses.js';

export const handleNotFound = (res) =>
  sendError(res, {
    status: 404,
    error: 'Post não encontrado',
    message: 'O post solicitado não existe'
  });

export const handleServerError = (res, error, message) => {
  console.error(message, error);
  return sendError(res, {
    status: 500,
    error: 'Erro interno do servidor',
    message
  });
};

export const buildPostUpdate = ({ descricao, alt, autor }) => {
  const postAtualizado = { updatedAt: new Date() };

  if (descricao !== undefined) {
    postAtualizado.descricao = descricao.trim();
  }

  if (alt !== undefined) {
    postAtualizado.alt = alt.trim();
  }

  if (autor !== undefined) {
    postAtualizado.autor = autor.trim();
  }

  return postAtualizado;
};
