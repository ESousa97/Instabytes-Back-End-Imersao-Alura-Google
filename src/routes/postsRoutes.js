import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { 
  listarPosts, 
  obterPostPorId,
  postarNovoPost, 
  uploadImagem, 
  atualizarNovoPost,
  deletarPostController,
  adicionarComentario,
  curtirPost
} from "../controllers/postsController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Gera nome único para evitar conflitos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Validação de arquivos
const fileFilter = (req, file, cb) => {
  // Tipos de arquivo permitidos
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (JPEG, JPG, PNG, GIF, WEBP)'), false);
  }
};

// Configuração do Multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1 // apenas 1 arquivo por vez
  },
  fileFilter: fileFilter
});

// Middleware para tratamento de erros de upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'File too large',
        message: 'Arquivo muito grande. Tamanho máximo: 5MB'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected field',
        message: 'Campo de arquivo inesperado'
      });
    }
  }
  
  if (err.message.includes('Apenas imagens são permitidas')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: err.message
    });
  }
  
  next(err);
};

// Middleware de validação para posts
const validarPost = (req, res, next) => {
  const { descricao } = req.body;
  
  if (!descricao || descricao.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Descrição é obrigatória'
    });
  }
  
  if (descricao.length > 1000) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Descrição deve ter no máximo 1000 caracteres'
    });
  }
  
  next();
};

// Middleware de validação para comentários
const validarComentario = (req, res, next) => {
  const { autor, texto } = req.body;
  
  if (!autor || autor.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Nome do autor é obrigatório'
    });
  }
  
  if (!texto || texto.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Texto do comentário é obrigatório'
    });
  }
  
  if (texto.length > 500) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Comentário deve ter no máximo 500 caracteres'
    });
  }
  
  next();
};

// Middleware de validação para edição de posts
const validarEdicaoPost = (req, res, next) => {
  const { descricao, alt, autor } = req.body;
  
  // Pelo menos um campo deve ser fornecido
  if (!descricao && !alt && !autor) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Pelo menos um campo deve ser fornecido para atualização'
    });
  }
  
  // Validar descricao se fornecida
  if (descricao !== undefined) {
    if (typeof descricao !== 'string' || descricao.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Descrição deve ser um texto válido'
      });
    }
    
    if (descricao.length > 1000) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Descrição deve ter no máximo 1000 caracteres'
      });
    }
  }
  
  // Validar alt se fornecido
  if (alt !== undefined) {
    if (typeof alt !== 'string') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Texto alternativo deve ser um texto válido'
      });
    }
    
    if (alt.length > 200) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Texto alternativo deve ter no máximo 200 caracteres'
      });
    }
  }
  
  // Validar autor se fornecido
  if (autor !== undefined) {
    if (typeof autor !== 'string' || autor.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Nome do autor deve ser um texto válido'
      });
    }
    
    if (autor.length > 50) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Nome do autor deve ter no máximo 50 caracteres'
      });
    }
  }
  
  next();
};

// Definição das rotas
const routes = (app) => {
  // Middleware global para logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // **ROTAS PÚBLICAS**
  
  // Listar todos os posts (com paginação)
  app.get("/posts", listarPosts);
  
  // Obter post específico por ID
  app.get("/posts/:id", obterPostPorId);
  
  // Criar novo post (apenas texto)
  app.post("/posts", validarPost, postarNovoPost);
  
  // Upload de imagem com geração automática de legenda
  app.post("/upload", 
    upload.single("imagem"), 
    handleUploadError,
    uploadImagem
  );
  
  // Atualizar post existente
  app.put("/posts/:id", validarEdicaoPost, atualizarNovoPost);
  
  // Deletar post
  app.delete("/posts/:id", deletarPostController);
  
  // Adicionar comentário a um post
  app.post("/posts/:id/comentarios", validarComentario, adicionarComentario);
  
  // Curtir/descurtir post
  app.post("/posts/:id/curtir", curtirPost);
  
  // **ROTAS DE UTILIDADE**
  
  // Verificar se arquivo existe
  app.get("/uploads/:filename", (req, res) => {
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
  app.get("/stats", async (req, res) => {
    try {
      // Aqui você pode implementar estatísticas como:
      // - Total de posts
      // - Total de comentários
      // - Posts mais curtidos
      // etc.
      res.json({
        message: "Estatísticas em desenvolvimento",
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
