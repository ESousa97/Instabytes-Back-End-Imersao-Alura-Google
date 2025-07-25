import {
  getTodosPosts,
  getPostPorId,
  criarPost,
  atualizarPost,
  adicionarComentarioAoPost,
  curtirOuDescurtirPost
} from "../models/postsModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import gerarDescricaoComGemini from "../services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// **LISTAR POSTS COM PAGINAÇÃO**
export async function listarPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await getTodosPosts(skip, limit);
    
    // Adicionar URLs completas para as imagens
    const postsComUrls = posts.map(post => ({
      ...post,
      imgUrl: post.imgUrl ? post.imgUrl : null,
      shareUrl: `${req.protocol}://${req.get('host')}/posts/${post._id}`,
      createdAt: post.createdAt || new Date(),
      updatedAt: post.updatedAt || new Date()
    }));

    res.status(200).json({
      success: true,
      data: postsComUrls,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit
      }
    });
  } catch (error) {
    console.error("Erro ao listar posts:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "Falha ao buscar posts"
    });
  }
}

// **OBTER POST POR ID**
export async function obterPostPorId(req, res) {
  try {
    const { id } = req.params;
    
    const post = await getPostPorId(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post não encontrado",
        message: "O post solicitado não existe"
      });
    }

    // Adicionar informações extras
    const postCompleto = {
      ...post,
      shareUrl: `${req.protocol}://${req.get('host')}/posts/${post._id}`,
      createdAt: post.createdAt || new Date(),
      updatedAt: post.updatedAt || new Date()
    };

    res.status(200).json({
      success: true,
      data: postCompleto
    });
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "Falha ao buscar post"
    });
  }
}

// **CRIAR NOVO POST (APENAS TEXTO)**
export async function postarNovoPost(req, res) {
  try {
    const { descricao, autor } = req.body;
    
    const novoPost = {
      descricao: descricao.trim(),
      autor: autor || "Anônimo",
      imgUrl: null,
      alt: null,
      curtidas: 0,
      comentarios: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const postCriado = await criarPost(novoPost);
    
    res.status(201).json({
      success: true,
      data: {
        _id: postCriado.insertedId,
        ...novoPost,
        shareUrl: `${req.protocol}://${req.get('host')}/posts/${postCriado.insertedId}`
      },
      message: "Post criado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "Falha ao criar post"
    });
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
        error: "Arquivo não encontrado",
        message: "Nenhuma imagem foi enviada"
      });
    }

    tempFilePath = req.file.path;
    console.log("Arquivo recebido:", req.file);

    // Criar post inicial
    const novoPost = {
      descricao: "Gerando descrição automática...",
      alt: "Gerando texto alternativo...",
      imgUrl: "",
      autor: req.body.autor || "Anônimo",
      curtidas: 0,
      comentarios: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "processing"
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
      descricaoIA = resultadoIA.descricao || "Descrição não disponível";
      altIA = resultadoIA.alt || "Imagem enviada pelo usuário";
    } catch (iaError) {
      console.warn("Erro na IA, usando descrição padrão:", iaError.message);
      descricaoIA = "Uma imagem foi compartilhada";
      altIA = "Imagem compartilhada";
    }

    // Atualizar post com informações finais
    const postAtualizado = {
      imgUrl,
      descricao: descricaoIA,
      alt: altIA,
      updatedAt: new Date(),
      status: "completed"
    };

    await atualizarPost(postId, postAtualizado);

    // Retornar resposta de sucesso
    res.status(201).json({
      success: true,
      data: {
        _id: postId,
        ...novoPost,
        ...postAtualizado,
        shareUrl: `${req.protocol}://${req.get('host')}/posts/${postId}`
      },
      message: "Imagem enviada e processada com sucesso"
    });

  } catch (error) {
    console.error("Erro durante upload:", error);

    // Limpeza de arquivos em caso de erro
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error("Erro ao limpar arquivo temporário:", cleanupError);
      }
    }
    
    if (finalFilePath && fs.existsSync(finalFilePath)) {
      try {
        fs.unlinkSync(finalFilePath);
      } catch (cleanupError) {
        console.error("Erro ao limpar arquivo final:", cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      error: "Erro no processamento",
      message: error.message || "Falha ao processar upload"
    });
  }
}

// **ATUALIZAR POST EXISTENTE**
export async function atualizarNovoPost(req, res) {
  try {
    const { id } = req.params;
    const { descricao, alt } = req.body;

    const postAtualizado = {
      descricao: descricao.trim(),
      updatedAt: new Date()
    };

    if (alt) {
      postAtualizado.alt = alt.trim();
    }

    const resultado = await atualizarPost(id, postAtualizado);

    if (resultado.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Post não encontrado",
        message: "O post solicitado não existe"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: id,
        ...postAtualizado
      },
      message: "Post atualizado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "Falha ao atualizar post"
    });
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
      return res.status(404).json({
        success: false,
        error: "Post não encontrado",
        message: "O post solicitado não existe"
      });
    }

    res.status(201).json({
      success: true,
      data: comentario,
      message: "Comentário adicionado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "Falha ao adicionar comentário"
    });
  }
}

// **CURTIR/DESCURTIR POST**
export async function curtirPost(req, res) {
  try {
    const { id } = req.params;
    const { acao } = req.body; // 'curtir' ou 'descurtir'

    const incremento = acao === 'descurtir' ? -1 : 1;
    
    const resultado = await curtirOuDescurtirPost(id, incremento);

    if (resultado.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Post não encontrado",
        message: "O post solicitado não existe"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        acao,
        incremento
      },
      message: `Post ${acao === 'descurtir' ? 'descurtido' : 'curtido'} com sucesso`
    });
  } catch (error) {
    console.error("Erro ao curtir post:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      message: "Falha ao processar curtida"
    });
  }
}
