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
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado);  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
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
