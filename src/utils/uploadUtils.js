import fs from 'fs';
import path from 'path';
import gerarDescricaoComGemini from '../services/geminiService.js';

export function buildInitialPost(autor) {
  return {
    descricao: 'Gerando descrição automática...',
    alt: 'Gerando texto alternativo...',
    imgUrl: '',
    autor: autor || 'Anônimo',
    curtidas: 0,
    comentarios: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'processing'
  };
}

export function buildFinalFilePath(tempFilePath, postId, originalName) {
  const fileExtension = path.extname(originalName);
  const newFileName = `${postId}${fileExtension}`;
  const finalFilePath = path.join(path.dirname(tempFilePath), newFileName);

  return { newFileName, finalFilePath };
}

export function moveUploadedFile(tempFilePath, finalFilePath) {
  fs.renameSync(tempFilePath, finalFilePath);
}

export function buildImageUrl(baseUrl, fileName) {
  return `${baseUrl}/uploads/${fileName}`;
}

export function readImageBuffer(filePath) {
  try {
    return fs.readFileSync(filePath);
  } catch (readError) {
    throw new Error(`Erro ao ler arquivo: ${readError.message}`);
  }
}

export async function getImageDescription(imageBuffer) {
  try {
    const resultadoIA = await gerarDescricaoComGemini(imageBuffer);

    return {
      descricao: resultadoIA.descricao || 'Descrição não disponível',
      alt: resultadoIA.alt || 'Imagem enviada pelo usuário'
    };
  } catch (iaError) {
    console.warn('Erro na IA, usando descrição padrão:', iaError.message);

    return {
      descricao: 'Uma imagem foi compartilhada',
      alt: 'Imagem compartilhada'
    };
  }
}

export function buildImageUpdate({ imgUrl, descricao, alt }) {
  return {
    imgUrl,
    descricao,
    alt,
    updatedAt: new Date(),
    status: 'completed'
  };
}
