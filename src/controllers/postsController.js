import {
  getTodosPosts,
  getPostPorId,
  criarPost,
  atualizarPost,
  deletarPost,
  adicionarComentarioAoPost,
  curtirOuDescurtirPost
} from '../models/postsModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import gerarDescricaoComGemini from '../services/geminiService.js';
import { sendError, sendSuccess } from '../utils/httpResponses.js';
import { buildShareUrl, normalizePostResponse, parsePagination } from '../utils/postUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handleNotFound = (res) =>
  sendError(res, {
    status: 404,
    error: 'Post não encontrado',
    message: 'O post solicitado não existe'
  });

const handleServerError = (res, error, message) => {
  console.error(message, error);
  return sendError(res, {
    status: 500,
    error: 'Erro interno do servidor',
    message
  });
};

const safeDeleteFile = (filePath, label) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.error(`Erro ao limpar ${label}:`, cleanupError);
    }
  }
};

// **LISTAR POSTS COM PAGINAÇÃO**
export async function listarPosts(req, res) {
  try {
    const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 100, maxLimit: 100 });

    const posts = await getTodosPosts(skip, limit);

    // Adicionar URLs completas para as imagens
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

// **OBTER POST POR ID**
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

// **CRIAR NOVO POST (APENAS TEXTO)**
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

// **UPLOAD DE IMAGEM COM IA**
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

    // Criar post inicial
    const novoPost = {
      descricao: 'Gerando descrição automática...',
      alt: 'Gerando texto alternativo...',
      imgUrl: '',
      autor: req.body.autor || 'Anônimo',
      curtidas: 0,
      comentarios: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'processing'
    };

    const postCriado = await criarPost(novoPost);
    const postId = postCriado.insertedId.toString();

    // Renomear arquivo com ID do post
    const fileExtension = path.extname(req.file.originalname);
    const newFileName = `${postId}${fileExtension}`;
    finalFilePath = path.join(path.dirname(tempFilePath), newFileName);

    fs.renameSync(tempFilePath, finalFilePath);
    tempFilePath = null; // Arquivo já foi movido

    // Gerar URL da imagem
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imgUrl = `${baseUrl}/uploads/${newFileName}`;

    // Ler arquivo para IA
    let imgBuffer;
    try {
      imgBuffer = fs.readFileSync(finalFilePath);
    } catch (readError) {
      throw new Error(`Erro ao ler arquivo: ${readError.message}`);
    }

    // Gerar descrição com IA
    let descricaoIA, altIA;
    try {
      const resultadoIA = await gerarDescricaoComGemini(imgBuffer);
      descricaoIA = resultadoIA.descricao || 'Descrição não disponível';
      altIA = resultadoIA.alt || 'Imagem enviada pelo usuário';
    } catch (iaError) {
      console.warn('Erro na IA, usando descrição padrão:', iaError.message);
      descricaoIA = 'Uma imagem foi compartilhada';
      altIA = 'Imagem compartilhada';
    }

    // Atualizar post com informações finais
    const postAtualizado = {
      imgUrl,
      descricao: descricaoIA,
      alt: altIA,
      updatedAt: new Date(),
      status: 'completed'
    };

    await atualizarPost(postId, postAtualizado);

    // Retornar resposta de sucesso
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

    // Limpeza de arquivos em caso de erro
    safeDeleteFile(tempFilePath, 'arquivo temporário');
    safeDeleteFile(finalFilePath, 'arquivo final');

    return sendError(res, {
      status: 500,
      error: 'Erro no processamento',
      message: error.message || 'Falha ao processar upload'
    });
  }
}

// **ATUALIZAR POST EXISTENTE**
export async function atualizarNovoPost(req, res) {
  try {
    const { id } = req.params;
    const { descricao, alt, autor } = req.body;

    // Verificar se o post existe
    const postExistente = await getPostPorId(id);
    if (!postExistente) {
      return handleNotFound(res);
    }

    const postAtualizado = {
      updatedAt: new Date()
    };

    // Atualizar apenas os campos fornecidos
    if (descricao !== undefined) {
      postAtualizado.descricao = descricao.trim();
    }

    if (alt !== undefined) {
      postAtualizado.alt = alt.trim();
    }

    if (autor !== undefined) {
      postAtualizado.autor = autor.trim();
    }

    const resultado = await atualizarPost(id, postAtualizado);

    if (resultado.matchedCount === 0) {
      return handleNotFound(res);
    }

    // Buscar o post atualizado
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

// **DELETAR POST**
export async function deletarPostController(req, res) {
  try {
    const { id } = req.params;

    // Verificar se o post existe
    const postExistente = await getPostPorId(id);
    if (!postExistente) {
      return handleNotFound(res);
    }

    // Deletar arquivo de imagem se existir
    if (postExistente.imgUrl) {
      try {
        // Extrair nome do arquivo da URL
        const urlParts = postExistente.imgUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = path.join(__dirname, '../../uploads', fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Arquivo ${fileName} deletado com sucesso`);
        }
      } catch (fileError) {
        console.warn('Erro ao deletar arquivo de imagem:', fileError.message);
        // Não interromper o processo se não conseguir deletar o arquivo
      }
    }

    // Deletar post do banco de dados
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

// **ADICIONAR COMENTÁRIO**
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

// **CURTIR/DESCURTIR POST**
export async function curtirPost(req, res) {
  try {
    const { id } = req.params;
    const { acao } = req.body; // 'curtir' ou 'descurtir'

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
