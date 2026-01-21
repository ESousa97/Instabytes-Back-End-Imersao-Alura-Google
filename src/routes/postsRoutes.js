import path from 'path';
import { fileURLToPath } from 'url';
import { upload, handleUploadError } from '../middleware/upload.js';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definição das rotas
const routes = (app) => {
  // Middleware global para logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

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
  app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../../uploads', filename);

    res.sendFile(filepath, (err) => {
      if (err) {
        res.status(404).json({
          error: 'File not found',
          message: 'Arquivo não encontrado'
        });
      }
    });
  });

  // Estatísticas da aplicação
  app.get('/stats', async (req, res) => {
    try {
      // Aqui você pode implementar estatísticas como:
      // - Total de posts
      // - Total de comentários
      // - Posts mais curtidos
      // etc.
      res.json({
        message: 'Estatísticas em desenvolvimento',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Server error',
        message: 'Erro ao buscar estatísticas'
      });
    }
  });
};

export default routes;
