import path from 'path';
import { fileURLToPath } from 'url';
import { sendError, sendSuccess } from '../utils/httpResponses.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function healthCheck(_req, res) {
  return sendSuccess(res, {
    status: 200,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
}

export function sendUploadedFile(req, res) {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../../uploads', filename);

  return res.sendFile(filepath, (err) => {
    if (err) {
      return sendError(res, {
        status: 404,
        error: 'File not found',
        message: 'Arquivo não encontrado'
      });
    }

    return undefined;
  });
}

export async function getStats(_req, res) {
  return sendSuccess(res, {
    status: 200,
    data: {
      message: 'Estatísticas em desenvolvimento',
      timestamp: new Date().toISOString()
    }
  });
}
