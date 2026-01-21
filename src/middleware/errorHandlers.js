import { sendError } from '../utils/httpResponses.js';

export function globalErrorHandler(err, _req, res, _next) {
  console.error('Global error handler:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, {
      status: 413,
      error: 'File too large',
      message: 'O arquivo é muito grande. Tamanho máximo: 5MB'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return sendError(res, {
      status: 400,
      error: 'Invalid file field',
      message: 'Campo de arquivo inválido'
    });
  }

  return sendError(res, {
    status: 500,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Algo deu errado no servidor' : err.message
  });
}

export function notFoundHandler(req, res) {
  return sendError(res, {
    status: 404,
    error: 'Route not found',
    message: `Rota ${req.originalUrl} não encontrada`
  });
}
