import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function gerarDescricaoComGemini(imageBuffer) {
    const prompt =
        "Gere uma descrição bem humana como se fosse um post, escreva conforme a imagem mesmo, o que sentir sobre ela, não exagere mais também não deixe muito seco, der um ar de emoção conforme a imagem passar, em português do Brasil para a seguinte imagem. Em seguida, gere um texto alternativo para a mesma imagem. Retorne no seguinte formato JSON puro (sem comentários ou caracteres adicionais): { \"descricao\": \"Descrição da imagem\", \"alt\": \"Texto alternativo da imagem\" }";

    try {
        const image = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/png",
            },
        };
        const res = await model.generateContent([prompt, image]);
        const responseText = res.response.text();

        console.log("Resposta bruta do Gemini:", responseText); // Log para depuração

        // Remove formatação indesejada, se necessário
        const sanitizedResponse = responseText.replace(/```json|```/g, "").trim();

        // Faz o parse do JSON
        const { descricao, alt } = JSON.parse(sanitizedResponse);

        return { descricao, alt };
    } catch (erro) {
        console.error("Erro ao obter descrição e alt-text:", erro.message, erro);
        throw new Error("Erro ao obter descrição e alt-text do Gemini.");
    }
}
