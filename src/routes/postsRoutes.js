import { upload, handleUploadError } from '../middleware/upload.js';
import requestLogger from '../middleware/requestLogger.js';
import { validarPost, validarComentario, validarEdicaoPost } from '../middleware/validation.js';
import {
  listarPosts,
  obterPostPorId,
  postarNovoPost,
  uploadImagem,
  atualizarNovoPost,
  deletarPostController,
  adicionarComentario,
  curtirPost
} from '../controllers/postsController.js';
import { getStats, sendUploadedFile } from '../controllers/systemController.js';

// Definição das rotas
const routes = (app) => {
  // Middleware global para logging
  app.use(requestLogger);

  // **ROTAS PÚBLICAS**

  // Listar todos os posts (com paginação)
  app.get('/posts', listarPosts);

  // Obter post específico por ID
  app.get('/posts/:id', obterPostPorId);

  // Criar novo post (apenas texto)
  app.post('/posts', validarPost, postarNovoPost);

  // Upload de imagem com geração automática de legenda
  app.post('/upload', upload.single('imagem'), handleUploadError, uploadImagem);

  // Atualizar post existente
  app.put('/posts/:id', validarEdicaoPost, atualizarNovoPost);

  // Deletar post
  app.delete('/posts/:id', deletarPostController);

  // Adicionar comentário a um post
  app.post('/posts/:id/comentarios', validarComentario, adicionarComentario);

  // Curtir/descurtir post
  app.post('/posts/:id/curtir', curtirPost);

  // **ROTAS DE UTILIDADE**

  // Verificar se arquivo existe
  app.get('/uploads/:filename', sendUploadedFile);

  // Estatísticas da aplicação
  app.get('/stats', getStats);
};

export default routes;
