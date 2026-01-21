import fs from 'fs';

export function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function safeDeleteFile(filePath, label) {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.error(`Erro ao limpar ${label}:`, cleanupError);
    }
  }
}
