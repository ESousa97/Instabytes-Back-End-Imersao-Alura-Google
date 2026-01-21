export function validarPost(req, res, next) {
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

  return next();
}

export function validarComentario(req, res, next) {
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

  return next();
}

export function validarEdicaoPost(req, res, next) {
  const { descricao, alt, autor } = req.body;

  if (!descricao && !alt && !autor) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Pelo menos um campo deve ser fornecido para atualização'
    });
  }

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

  return next();
}
