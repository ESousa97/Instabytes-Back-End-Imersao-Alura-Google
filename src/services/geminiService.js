import { GoogleGenerativeAI } from '@google/generative-ai';

// Verificar se a API key está configurada
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY não configurada! As descrições automáticas não funcionarão.');
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const model = genAI?.getGenerativeModel({
  model: 'gemini-2.0-flash-001',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024
  }
});

/**
 * Gera descrição e texto alternativo para uma imagem usando Google Gemini AI
 * @param {Buffer} imageBuffer - Buffer da imagem
 * @param {string} customPrompt - Prompt personalizado (opcional)
 * @returns {Promise<{descricao: string, alt: string}>}
 */
export default async function gerarDescricaoComGemini(imageBuffer, customPrompt = null) {
  // Fallback caso a API não esteja configurada
  if (!genAI || !model) {
    console.warn('Gemini AI não configurado, usando descrição padrão');
    return {
      descricao: 'Uma imagem interessante foi compartilhada! 📸',
      alt: 'Imagem compartilhada pelo usuário'
    };
  }

  const promptPadrao = `
Analise esta imagem e gere:

1. Uma descrição natural e envolvente para redes sociais, como se fosse um post real
2. Um texto alternativo objetivo para acessibilidade

IMPORTANTE:
- A descrição deve ser em português brasileiro
- Seja criativo mas preciso
- Use emojis quando apropriado
- Mantenha tom positivo e engajador
- Máximo 200 caracteres para descrição
- Máximo 100 caracteres para alt text

Retorne APENAS um JSON válido no formato:
{
  "descricao": "sua descrição aqui",
  "alt": "seu texto alternativo aqui"
}`;

  const prompt = customPrompt || promptPadrao;

  try {
    // Preparar imagem para a API
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: 'image/png' // Assumindo PNG, pode ser ajustado
      }
    };

    console.log('🤖 Enviando imagem para Gemini AI...');

    // Fazer a requisição para a API
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log('📝 Resposta bruta do Gemini:', text);

    // Limpar e processar resposta
    const cleanedText = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/^\s*[\r\n]/gm, '')
      .trim();

    // Tentar fazer parse do JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.warn('Erro no parse JSON, tentando extrair manualmente:', parseError.message);

      // Fallback: tentar extrair com regex
      const descricaoMatch = cleanedText.match(/"descricao":\s*"([^"]+)"/);
      const altMatch = cleanedText.match(/"alt":\s*"([^"]+)"/);

      if (descricaoMatch && altMatch) {
        parsedResponse = {
          descricao: descricaoMatch[1],
          alt: altMatch[1]
        };
      } else {
        throw new Error('Não foi possível extrair descrição e alt text');
      }
    }

    // Validar e sanitizar resposta
    const descricao = parsedResponse.descricao
      ? parsedResponse.descricao.substring(0, 200).trim()
      : 'Uma imagem interessante foi compartilhada! 📸';

    const alt = parsedResponse.alt
      ? parsedResponse.alt.substring(0, 100).trim()
      : 'Imagem compartilhada pelo usuário';

    console.log('✅ Descrição gerada com sucesso!');

    return {
      descricao,
      alt
    };
  } catch (error) {
    console.error('❌ Erro ao comunicar com Gemini AI:', error.message);

    // Log detalhado para debug
    if (error.response) {
      console.error('Resposta da API:', error.response.data);
    }

    // Retornar descrição padrão em caso de erro
    const fallbackDescricoes = [
      'Uma nova imagem foi compartilhada! ✨',
      'Momento especial capturado em imagem 📷',
      'Imagem interessante para compartilhar! 🖼️',
      'Nova foto adicionada à galeria 🎯',
      'Compartilhando um momento único 📸'
    ];

    const descricaoAleatoria =
      fallbackDescricoes[Math.floor(Math.random() * fallbackDescricoes.length)];

    return {
      descricao: descricaoAleatoria,
      alt: 'Imagem compartilhada pelo usuário'
    };
  }
}

/**
 * Gera múltiplas variações de descrição para uma imagem
 * @param {Buffer} imageBuffer - Buffer da imagem
 * @param {number} quantidade - Número de variações (padrão: 3)
 * @returns {Promise<Array<{descricao: string, alt: string}>>}
 */
export async function gerarVariacoesDescricao(imageBuffer, quantidade = 3) {
  if (!genAI || !model) {
    console.warn('Gemini AI não configurado');
    return [];
  }

  const prompts = [
    'Descreva esta imagem de forma poética e artística',
    'Descreva esta imagem de forma técnica e objetiva',
    'Descreva esta imagem de forma divertida e descontraída'
  ];

  const variacoes = [];

  for (let i = 0; i < Math.min(quantidade, prompts.length); i++) {
    try {
      const resultado = await gerarDescricaoComGemini(imageBuffer, prompts[i]);
      variacoes.push(resultado);
    } catch (error) {
      console.error(`Erro na variação ${i + 1}:`, error.message);
    }
  }

  return variacoes;
}

/**
 * Analisa se uma imagem pode conter conteúdo inadequado
 * @param {Buffer} imageBuffer - Buffer da imagem
 * @returns {Promise<{seguro: boolean, motivo?: string}>}
 */
export async function analisarSegurancaImagem(imageBuffer) {
  if (!genAI || !model) {
    return { seguro: true, motivo: 'Análise não disponível' };
  }

  const promptSeguranca = `
Analise se esta imagem contém:
- Conteúdo sexual explícito
- Violência gráfica
- Discurso de ódio visual
- Conteúdo inadequado para menores

Responda APENAS com JSON:
{
  "seguro": true/false,
  "motivo": "explicação se não for seguro"
}`;

  try {
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: 'image/png'
      }
    };

    const result = await model.generateContent([promptSeguranca, imagePart]);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const analise = JSON.parse(cleanedText);

    return {
      seguro: analise.seguro !== false, // Padrão seguro se não especificado
      motivo: analise.motivo || null
    };
  } catch (error) {
    console.error('Erro na análise de segurança:', error.message);
    return { seguro: true, motivo: 'Erro na análise' };
  }
}
