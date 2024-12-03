import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts(req, res) {
    // Chama a função para buscar os posts
    const posts = await getTodosPosts();
    // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

export async function uploadImagem(req, res) {
    const baseUrl = process.env.BASE_URL;

    try {
        const tempPath = req.file.path;

        const novoPost = {
            imgUrl: "",
            descricao: "Descrição sendo gerada...",
            alt: "Alt sendo gerado...",
        };

        const postCriado = await criarPost(novoPost);
        const postId = postCriado.insertedId.toString();

        const filePath = `uploads/${postId}.png`;
        const imgUrl = `${baseUrl}/${postId}.png`;

        fs.renameSync(tempPath, filePath);

        const imgBuffer = fs.readFileSync(filePath);

        const { descricao, alt } = await gerarDescricaoComGemini(imgBuffer);
        console.log("Descrição e Alt gerados:", { descricao, alt });

        const postAtualizado = {
            imgUrl,
            descricao: descricao || "Descrição não disponível.",
            alt: alt || "Alt não disponível.",
        };

        await atualizarPost(postId, postAtualizado);

        res.status(200).json({ _id: postId, ...postAtualizado });
    } catch (erro) {
        console.error("Erro durante uploadImagem:", erro.message, erro.stack);
        res.status(500).json({ erro: erro.message || "Falha ao salvar o post ou gerar descrição" });
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;

    try {
        // Etapa 1: Verificar se o arquivo existe
        const imgPath = `uploads/${id}.png`;
        if (!fs.existsSync(imgPath)) {
            throw new Error(`Arquivo não encontrado: ${imgPath}`);
        }

        // Etapa 2: Ler o arquivo
        let imgBuffer;
        try {
            imgBuffer = fs.readFileSync(imgPath);
        } catch (err) {
            throw new Error(`Erro ao ler o arquivo: ${err.message}`);
        }

        // Etapa 3: Gerar descrição com Gemini
        let descricao;
        try {
            descricao = await gerarDescricaoComGemini(imgBuffer);
        } catch (err) {
            throw new Error(`Erro ao gerar descrição com Gemini: ${err.message}`);
        }

        // Etapa 4: Atualizar o post
        const post = {
            imgUrl: urlImagem,
            descricao: descricao || "Descrição não disponível.",
            alt: req.body.alt
        };

        let postCriado;
        try {
            postCriado = await atualizarPost(id, post);
        } catch (err) {
            throw new Error(`Erro ao atualizar o post no banco de dados: ${err.message}`);
        }

        // Resposta de sucesso
        res.status(200).json(postCriado);
    } catch (erro) {
        // Loga detalhes do erro no console
        console.error("Erro capturado:", erro);

        // Resposta ao cliente com informações do erro
        res.status(500).json({
            erro: erro.message || "Erro desconhecido",
            detalhes: erro.stack || "Sem stack disponível"
        });
    }
}
