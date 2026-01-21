import 'dotenv/config';
import { ObjectId } from 'mongodb';
import conectarAoBanco from '../config/dbConfig.js';

// Conecta ao banco de dados utilizando a string de conexão fornecida como variável de ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

const getPostsCollection = () => {
  const db = conexao.db('imersao-instabytes');
  return db.collection('posts');
};

const ensureValidObjectId = (id, message = 'ID inválido') => {
  if (!ObjectId.isValid(id)) {
    throw new Error(message);
  }
};

// **BUSCAR TODOS OS POSTS COM PAGINAÇÃO**
export async function getTodosPosts(skip = 0, limit = 10) {
  try {
    const colecao = getPostsCollection();

    return await colecao
      .find({})
      .sort({ createdAt: -1 }) // Mais recentes primeiro
      .skip(skip)
      .limit(limit)
      .toArray();
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    throw new Error('Falha ao buscar posts do banco de dados');
  }
}

// **BUSCAR POST POR ID**
export async function getPostPorId(id) {
  try {
    const colecao = getPostsCollection();
    ensureValidObjectId(id, 'ID inválido');

    return await colecao.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Erro ao buscar post por ID:', error);
    throw new Error('Falha ao buscar post');
  }
}

// **CRIAR NOVO POST**
export async function criarPost(novoPost) {
  try {
    const colecao = getPostsCollection();

    // Validar dados obrigatórios
    if (!novoPost.descricao) {
      throw new Error('Descrição é obrigatória');
    }

    // Adicionar campos padrão se não existirem
    const postCompleto = {
      ...novoPost,
      curtidas: novoPost.curtidas || 0,
      comentarios: novoPost.comentarios || [],
      createdAt: novoPost.createdAt || new Date(),
      updatedAt: novoPost.updatedAt || new Date()
    };

    return await colecao.insertOne(postCompleto);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw new Error('Falha ao criar post no banco de dados');
  }
}

// **ATUALIZAR POST EXISTENTE**
export async function atualizarPost(id, dadosAtualizacao) {
  try {
    const colecao = getPostsCollection();
    ensureValidObjectId(id, 'ID inválido');

    // Adicionar timestamp de atualização
    const atualizacaoCompleta = {
      ...dadosAtualizacao,
      updatedAt: new Date()
    };

    return await colecao.updateOne({ _id: new ObjectId(id) }, { $set: atualizacaoCompleta });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    throw new Error('Falha ao atualizar post no banco de dados');
  }
}

// **DELETAR POST**
export async function deletarPost(id) {
  try {
    const colecao = getPostsCollection();
    ensureValidObjectId(id, 'ID inválido');

    return await colecao.deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    throw new Error('Falha ao deletar post do banco de dados');
  }
}

// **ADICIONAR COMENTÁRIO A UM POST**
export async function adicionarComentarioAoPost(postId, comentario) {
  try {
    const colecao = getPostsCollection();
    ensureValidObjectId(postId, 'ID do post inválido');

    // Validar dados do comentário
    if (!comentario.autor || !comentario.texto) {
      throw new Error('Autor e texto do comentário são obrigatórios');
    }

    const comentarioCompleto = {
      ...comentario,
      createdAt: comentario.createdAt || new Date(),
      _id: new ObjectId() // ID único para o comentário
    };

    return await colecao.updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: { comentarios: comentarioCompleto },
        $set: { updatedAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    throw new Error('Falha ao adicionar comentário ao post');
  }
}

// **REMOVER COMENTÁRIO DE UM POST**
export async function removerComentarioDoPost(postId, comentarioId) {
  try {
    const colecao = getPostsCollection();
    ensureValidObjectId(postId, 'IDs inválidos');
    ensureValidObjectId(comentarioId, 'IDs inválidos');

    return await colecao.updateOne(
      { _id: new ObjectId(postId) },
      {
        $pull: { comentarios: { _id: new ObjectId(comentarioId) } },
        $set: { updatedAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Erro ao remover comentário:', error);
    throw new Error('Falha ao remover comentário do post');
  }
}

// **CURTIR OU DESCURTIR POST**
export async function curtirOuDescurtirPost(postId, incremento = 1) {
  try {
    const colecao = getPostsCollection();
    ensureValidObjectId(postId, 'ID do post inválido');

    // Garantir que incremento seja numérico
    const incrementoNumerico = parseInt(incremento);
    if (isNaN(incrementoNumerico)) {
      throw new Error('Incremento deve ser um número');
    }

    return await colecao.updateOne(
      { _id: new ObjectId(postId) },
      {
        $inc: { curtidas: incrementoNumerico },
        $set: { updatedAt: new Date() }
      }
    );
  } catch (error) {
    console.error('Erro ao curtir/descurtir post:', error);
    throw new Error('Falha ao atualizar curtidas do post');
  }
}

// **BUSCAR POSTS POR AUTOR**
export async function getPostsPorAutor(autor, skip = 0, limit = 10) {
  try {
    const colecao = getPostsCollection();

    return await colecao
      .find({ autor: { $regex: autor, $options: 'i' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  } catch (error) {
    console.error('Erro ao buscar posts por autor:', error);
    throw new Error('Falha ao buscar posts por autor');
  }
}

// **BUSCAR POSTS COM FILTRO DE TEXTO**
export async function buscarPosts(termo, skip = 0, limit = 10) {
  try {
    const colecao = getPostsCollection();

    const filtro = {
      $or: [
        { descricao: { $regex: termo, $options: 'i' } },
        { alt: { $regex: termo, $options: 'i' } },
        { autor: { $regex: termo, $options: 'i' } }
      ]
    };

    return await colecao.find(filtro).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    throw new Error('Falha na busca de posts');
  }
}

// **OBTER ESTATÍSTICAS**
export async function obterEstatisticas() {
  try {
    const colecao = getPostsCollection();

    const [totalPosts, totalCurtidas, totalComentarios] = await Promise.all([
      colecao.countDocuments(),
      colecao.aggregate([{ $group: { _id: null, total: { $sum: '$curtidas' } } }]).toArray(),
      colecao
        .aggregate([
          { $project: { numComentarios: { $size: '$comentarios' } } },
          { $group: { _id: null, total: { $sum: '$numComentarios' } } }
        ])
        .toArray()
    ]);

    return {
      totalPosts,
      totalCurtidas: totalCurtidas[0]?.total || 0,
      totalComentarios: totalComentarios[0]?.total || 0
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw new Error('Falha ao obter estatísticas');
  }
}
