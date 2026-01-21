import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { criarPost, atualizarPost, deletarPost, getPostPorId } from '../models/postsModel.js';
import { sendSuccess } from '../utils/httpResponses.js';
import { buildShareUrl } from '../utils/postUtils.js';
import { buildPostUpdate, handleNotFound, handleServerError } from './postControllerUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteFileIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export async function postarNovoPost(req, res) {
  try {
    const { descricao, autor } = req.body;

    const novoPost = {
      descricao: descricao.trim(),
      autor: autor || 'Anônimo',
      imgUrl: null,
      alt: null,
      curtidas: 0,
      comentarios: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const postCriado = await criarPost(novoPost);

    return sendSuccess(res, {
      status: 201,
      data: {
        _id: postCriado.insertedId,
        ...novoPost,
        shareUrl: buildShareUrl(req, postCriado.insertedId)
      },
      message: 'Post criado com sucesso'
    });
  } catch (error) {
    return handleServerError(res, error, 'Falha ao criar post');
  }
}

export async function atualizarNovoPost(req, res) {
  try {
    const { id } = req.params;
    const { descricao, alt, autor } = req.body;

    const postExistente = await getPostPorId(id);
    if (!postExistente) {
      return handleNotFound(res);
    }

    const postAtualizado = buildPostUpdate({ descricao, alt, autor });

    const resultado = await atualizarPost(id, postAtualizado);

    if (resultado.matchedCount === 0) {
      return handleNotFound(res);
    }

    const postCompleto = await getPostPorId(id);

    return sendSuccess(res, {
      status: 200,
      data: {
        ...postCompleto,
        shareUrl: buildShareUrl(req, id)
      },
      message: 'Post atualizado com sucesso'
    });
  } catch (error) {
    return handleServerError(res, error, 'Falha ao atualizar post');
  }
}

export async function deletarPostController(req, res) {
  try {
    const { id } = req.params;

    const postExistente = await getPostPorId(id);
    if (!postExistente) {
      return handleNotFound(res);
    }

    if (postExistente.imgUrl) {
      try {
        const urlParts = postExistente.imgUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = path.join(__dirname, '../../uploads', fileName);

        deleteFileIfExists(filePath);
        console.log(`Arquivo ${fileName} deletado com sucesso`);
      } catch (fileError) {
        console.warn('Erro ao deletar arquivo de imagem:', fileError.message);
      }
    }

    const resultado = await deletarPost(id);

    if (resultado.deletedCount === 0) {
      return handleNotFound(res);
    }

    return sendSuccess(res, {
      status: 200,
      data: {
        _id: id,
        deleted: true
      },
      message: 'Post deletado com sucesso'
    });
  } catch (error) {
    return handleServerError(res, error, 'Falha ao deletar post');
  }
}
