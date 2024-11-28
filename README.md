<div style="font-family: Arial;">

<div style="text-align: center;"><h1> INSTABYTE BACK END </h1></div>

<br>

<div style="font-weight: 600; text-align: center;">
<p>Este projeto é uma API para gerenciamento de posts, incluindo upload de imagens e geração de descrições automáticas usando a tecnologia Google Gemini AI.</p>
</div>

<div style="text-align: left;"><h2> 📋 Visão Geral </h2></div>

<h3>A API foi desenvolvida com as seguintes funcionalidades:</h3>

- Gerenciamento de posts `(CRUD)`.
- Upload de imagens com suporte a descrições automáticas.
- Conexão com banco de dados `MongoDB`.
- Integração com Google Generative AI (`Gemini`) para gerar descrições de imagens.

<div style="text-align: left;"><h2> 🛠️ Tecnologias Utilizadas </h2></div>

- **Node.js:** Plataforma de execução JavaScript.
- **Express:** Framework para criação de APIs.
- **MongoDB:** Banco de dados NoSQL.
- **Multer:** Middleware para upload de arquivos.
- **Dotenv:** Gerenciamento de variáveis de ambiente.
- **Google Generative AI:** Geração de descrições automatizadas de imagens.

<div style="text-align: left;"><h2> 📂 Estrutura do Projeto </h2></div>

```plaintext

Instabyte-back
│
├── config/
│   └── dbConfig.js        # Configuração da conexão com o MongoDB.
│
├── controllers/
│   └── postsController.js # Controladores das rotas de posts.
│
├── models/
│   └── postsModel.js      # Modelos para interação com o banco.
│
├── routes/
│   └── postsRoutes.js     # Definição das rotas da API.
│
├── services/
│   └── geminiService.js   # Integração com Google Gemini AI.
│
├── uploads/               # Diretório para armazenar imagens enviadas.
│
├── package.json           # Gerenciamento de dependências e scripts.
├── server.js              # Inicialização do servidor.
└── services.sh            # Para deploy no Google Cloud.

```

<div style="text-align: left;"><h2> 🔧 Configuração do Ambiente </h2></div>

<h3>Pré-requisitos</h3>

- **Node.js** `(>= 14.0.0)`
- **NPM** `(>= 6.0.0)`
- MongoDB Atlas (ou localmente configurado).
- Conta no Google Cloud com API Gemini ativada.

<h3>Instalação</h3>

1. Clone este repositório:

    ```bash
    git clone https://github.com/ESousa97/instabyte-back-imersao
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Configure o arquivo `.env` com as seguintes variáveis:
    ```bash
    STRING_CONEXAO="sua-string-de-conexao-mongodb"
    GEMINI_API_KEY="sua-chave-de-api-do-gemini"
    ```
### Importante:

- *Os valores das variáveis estão colocados entre `" "` aspas duplas devido o deploy do `Google-Cloud`, sem aspas o shell pode interpretar esses caracters de forma errada, causando erros ou comportamentos inesperados.*

<div style="text-align: left;"><h2> 🚀 Como Executar </h2></div>

<h3>Inicie o servidor</h3>

```bash
npm run dev
```
- *A Api estará disponível em <a>http://localhost:3000</a>*

### Serviços Google Cloud (habilite via `services.sh`)

- Execute os comandos para habilitar os serviços necessários:

```bash
sh services.sh
```

---

<div style="text-align: left;"><h2> 📑 Endpoints da API </h2></div>

<h3>Posts</h3>

#### Listar todos os posts

`GET /posts`

- **Resposta:** Lista de todos os posts cadastrados.

#### Criar um novo post

`POST /posts`

- **Corpo:**
    ```json
    {
  "titulo": "string",
  "descricao": "string"
    }
    ```
- **Resposta:** Detalhes do post criado.

#### Atualizar post

`PUT /upload/:id`

- Atualiza as informações de uma imagem, gerando uma descrição automática.

<h3>Uploads</h3>

#### Upload de imagens

`POST /upload`

- **Parâmetro:** Arquivo de imagem (campo `imagem` no formulário).
- **Resposta:** Detalhes do post com a imagem.

---

<div style="text-align: left;"><h2> 🧩 Funcionalidades em Detalhes </h2></div>

<h3>Conexão com MongoDB</h3>

A conexão com o MongoDB é realizada através do arquivo `dbConfig.js`, utilizando a string de conexão definida nas variáveis de ambiente.

<h3>Upload de Imagens</h3>

O upload de imagens é gerenciado com Multer, armazenando os arquivos no diretório `uploads/`.

<h3>Integração com Google Gemini AI</h3>

A função `gerarDescricaoComGemini` usa a API Gemini para gerar descrições automáticas das imagens enviadas.

---

## 📝 Licença

Este projeto está licenciado sob os termos da [Licença MIT](LICENSE).


</div>