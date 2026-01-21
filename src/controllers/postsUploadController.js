import { atualizarPost, criarPost } from '../models/postsModel.js';
import { sendError, sendSuccess } from '../utils/httpResponses.js';
import { buildShareUrl } from '../utils/postUtils.js';
import { safeDeleteFile } from '../utils/fileUtils.js';
import {
  buildFinalFilePath,
  buildImageUpdate,
  buildImageUrl,
  buildInitialPost,
  getImageDescription,
  moveUploadedFile,
  readImageBuffer
} from '../utils/uploadUtils.js';

export async function uploadImagem(req, res) {
  let tempFilePath = null;
  let finalFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Arquivo não encontrado',
        message: 'Nenhuma imagem foi enviada'
      });
    }

    tempFilePath = req.file.path;
    console.log('Arquivo recebido:', req.file);

    const novoPost = buildInitialPost(req.body.autor);

    const postCriado = await criarPost(novoPost);
    const postId = postCriado.insertedId.toString();

    const { newFileName, finalFilePath: resolvedFinalPath } = buildFinalFilePath(
      tempFilePath,
      postId,
      req.file.originalname
    );

    finalFilePath = resolvedFinalPath;
    moveUploadedFile(tempFilePath, finalFilePath);
    tempFilePath = null;

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imgUrl = buildImageUrl(baseUrl, newFileName);

    const imgBuffer = readImageBuffer(finalFilePath);
    const { descricao: descricaoIA, alt: altIA } = await getImageDescription(imgBuffer);

    const postAtualizado = buildImageUpdate({ imgUrl, descricao: descricaoIA, alt: altIA });

    await atualizarPost(postId, postAtualizado);

    return sendSuccess(res, {
      status: 201,
      data: {
        _id: postId,
        ...novoPost,
        ...postAtualizado,
        shareUrl: buildShareUrl(req, postId)
      },
      message: 'Imagem enviada e processada com sucesso'
    });
  } catch (error) {
    console.error('Erro durante upload:', error);

    safeDeleteFile(tempFilePath, 'arquivo temporário');
    safeDeleteFile(finalFilePath, 'arquivo final');

    return sendError(res, {
      status: 500,
      error: 'Erro no processamento',
      message: error.message || 'Falha ao processar upload'
    });
  }
}
