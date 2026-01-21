import { adicionarComentarioAoPost, curtirOuDescurtirPost } from '../models/postsModel.js';
import { sendError, sendSuccess } from '../utils/httpResponses.js';
import { handleNotFound, handleServerError } from './postControllerUtils.js';

export async function adicionarComentario(req, res) {
  try {
    const { id } = req.params;
    const { autor, texto } = req.body;

    const comentario = {
      autor: autor.trim(),
      texto: texto.trim(),
      createdAt: new Date()
    };

    const resultado = await adicionarComentarioAoPost(id, comentario);

    if (resultado.matchedCount === 0) {
      return handleNotFound(res);
    }

    return sendSuccess(res, {
      status: 201,
      data: comentario,
      message: 'Comentário adicionado com sucesso'
    });
  } catch (error) {
    return handleServerError(res, error, 'Falha ao adicionar comentário');
  }
}

export async function curtirPost(req, res) {
  try {
    const { id } = req.params;
    const { acao } = req.body;

    if (!acao || !['curtir', 'descurtir'].includes(acao)) {
      return sendError(res, {
        status: 400,
        error: 'Validation error',
        message: "Ação inválida. Use 'curtir' ou 'descurtir'"
      });
    }

    const incremento = acao === 'descurtir' ? -1 : 1;

    const resultado = await curtirOuDescurtirPost(id, incremento);

    if (resultado.matchedCount === 0) {
      return handleNotFound(res);
    }

    return sendSuccess(res, {
      status: 200,
      data: {
        acao,
        incremento
      },
      message: `Post ${acao === 'descurtir' ? 'descurtido' : 'curtido'} com sucesso`
    });
  } catch (error) {
    return handleServerError(res, error, 'Falha ao processar curtida');
  }
}
