<div align="center">

# InstaBytes Backend

[![CI](https://img.shields.io/github/actions/workflow/status/ESousa97/Instabytes-Back-End-Imersao-Alura-Google/ci.yml?style=flat&logo=github-actions&logoColor=white)](https://github.com/ESousa97/Instabytes-Back-End-Imersao-Alura-Google/actions/workflows/ci.yml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/ESousa97/Instabytes-Back-End-Imersao-Alura-Google/codeql.yml?style=flat&logo=github-actions&logoColor=white&label=CodeQL)](https://github.com/ESousa97/Instabytes-Back-End-Imersao-Alura-Google/actions/workflows/codeql.yml)
[![CodeFactor](https://img.shields.io/codefactor/grade/github/ESousa97/Instabytes-Back-End-Imersao-Alura-Google?style=flat&logo=codefactor&logoColor=white)](https://www.codefactor.io/repository/github/esousa97/instabytes-back-end-imersao-alura-google)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat&logo=opensourceinitiative&logoColor=white)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-Archived-lightgrey.svg?style=flat&logo=archive&logoColor=white)](#)

**API REST para gerenciamento de posts com upload de imagens e geração automática de descrição e alt-text via Google Gemini — Node.js, Express e MongoDB.**

[Documentação](docs/ARCHITECTURE.md)

</div>

---

> **⚠️ Projeto Arquivado**
> Este projeto não recebe mais atualizações ou correções. O código permanece disponível como referência e pode ser utilizado livremente sob a licença MIT. Fique à vontade para fazer fork caso deseje continuar o desenvolvimento.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints](#endpoints)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração](#configuração)
  - [Uso Local](#uso-local)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Qualidade e Governança](#qualidade-e-governança)
- [FAQ](#faq)
- [Licença](#licença)
- [Contato](#contato)

---

## Sobre o Projeto

Este projeto é a API backend de uma plataforma social de compartilhamento de imagens que integra Google Gemini para gerar automaticamente descrições e alt-text acessível. Desenvolvido com Node.js, Express e MongoDB, expõe endpoints RESTful para CRUD de posts, upload de imagens com processamento IA, comentários, curtidas e health check.

O repositório prioriza:

- **Geração de descrições via IA** — Google Gemini analisa conteúdo visual e gera descrições criativas + alt-text automaticamente, com fallback seguro quando a API não está disponível
- **Arquitetura em camadas** — Separação entre controllers, models, routes e services seguindo MVC
- **MongoDB** — Schema flexível ideal para posts sociais com comentários aninhados e metadados variáveis
- **Upload com Multer** — Processamento de imagens multipart/form-data com validação de formato e tamanho
- **CORS configurável** — Integração segura com frontend via origens permitidas

### Por que Node.js + Express + MongoDB?

Node.js com event loop assíncrono é ideal para APIs I/O intensivas como processamento de uploads e chamadas à API Gemini. Express oferece middleware ecosystem maduro com simplicidade. MongoDB elimina impedance mismatch para dados semi-estruturados típicos de posts sociais (comentários aninhados, metadados variáveis, diferentes tipos de conteúdo).

---

## Funcionalidades

- **Upload com IA** — Imagem enviada via multipart → armazenada → processada pelo Gemini → descrição e alt-text gerados automaticamente
- **CRUD completo de posts** — Criar, listar, buscar por ID, atualizar e remover posts
- **Comentários** — Adicionar comentários a posts existentes
- **Curtidas** — Sistema de curtidas em posts
- **Health check** — Endpoint `/health` para monitoramento
- **Estatísticas** — Endpoint `/stats` com métricas da plataforma
- **Fallback de IA** — Funcionamento gracioso quando Gemini não está disponível

---

## Tecnologias

### Core

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat&logo=google&logoColor=white)

### Ferramentas de Desenvolvimento

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6600?style=flat&logoColor=white)
![Dotenv](https://img.shields.io/badge/Dotenv-ECD53F?style=flat&logo=dotenv&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)

**Requisitos mínimos:**

- Node.js 18+ e npm 8+
- MongoDB 6+ (local ou Atlas)
- Google Gemini API Key (opcional, para geração de descrições)

---

## Arquitetura

A API segue uma arquitetura em camadas com separação clara de responsabilidades:

```mermaid
graph TB
    subgraph Cliente
        A[Frontend React / Mobile / Terceiros]
    end

    subgraph Camada de Apresentação
        B[Express.js API\nMiddleware CORS / Rate Limiting]
    end

    subgraph Camada de Controle
        C[Posts Controller\nUpload Controller]
    end

    subgraph Camada de Serviços
        D[Gemini AI Service\nImage Processing]
    end

    subgraph Integrações Externas
        E[Google Gemini API]
        F[Multer - Upload de Imagens]
    end

    subgraph Camada de Persistência
        G[Mongoose Models\nSchema Validation]
    end

    subgraph Infraestrutura
        H[MongoDB Atlas]
    end

    A -->|HTTP/JSON| B
    B -->|Routing / Validation| C
    C -->|Business Logic| D
    D -->|AI Processing| E
    D -->|File Upload| F
    C -->|CRUD| G
    G -->|Queries| H
```

### Fluxo de Upload com IA

```
POST /upload (multipart/form-data)
  → Multer valida e armazena imagem em /uploads
    → Controller invoca GeminiService
      → Gemini analisa conteúdo visual da imagem
        → Descrição + alt-text retornam
          → Post criado no MongoDB com metadados
            → Response JSON com post completo
```

> Para detalhes completos, consulte [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Estrutura do Projeto

```
Instabytes-Backend/
├── server.js                      # Entry point, configuração Express e middleware
├── src/
│   ├── config/
│   │   └── dbConfig.js            # Conexão MongoDB com retry logic
│   ├── controllers/
│   │   └── postsController.js     # Handlers REST com validação e error handling
│   ├── models/
│   │   └── postsModel.js          # Schema Mongoose com validações e indexes
│   ├── routes/
│   │   └── postsRoutes.js         # Rotas RESTful com middleware
│   └── services/
│       └── geminiService.js       # Integração Google Gemini para análise de imagem
├── uploads/                       # Diretório temporário de imagens
├── docs/
│   └── ARCHITECTURE.md            # Documentação de arquitetura
├── tests/                         # Testes automatizados
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Pipeline de CI
│       └── codeql.yml             # Análise de segurança
├── services.sh                    # Script de configuração Google Cloud
├── package.json                   # Dependências e scripts
├── CONTRIBUTING.md                # Guia de contribuição
├── SECURITY.md                    # Política de segurança
└── LICENSE                        # Licença MIT
```

---

## Endpoints

| Método   | Rota                      | Descrição                                  |
| -------- | ------------------------- | ------------------------------------------ |
| `GET`    | `/health`                 | Health check da API                        |
| `GET`    | `/stats`                  | Estatísticas da plataforma                 |
| `GET`    | `/posts`                  | Listar todos os posts                      |
| `GET`    | `/posts/:id`              | Buscar post por ID                         |
| `POST`   | `/posts`                  | Criar post textual                         |
| `POST`   | `/upload`                 | Upload de imagem com geração IA            |
| `PUT`    | `/posts/:id`              | Atualizar post                             |
| `DELETE` | `/posts/:id`              | Remover post                               |
| `POST`   | `/posts/:id/comentarios`  | Adicionar comentário                       |
| `POST`   | `/posts/:id/curtir`       | Curtir post                                |

---

## Começando

### Pré-requisitos

```bash
node --version  # v18 ou superior
npm --version   # v8 ou superior
```

MongoDB disponível (local ou Atlas).

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/ESousa97/Instabytes-Back-End-Imersao-Alura-Google.git
cd Instabytes-Back-End-Imersao-Alura-Google
```

2. **Instale as dependências**

```bash
npm install
```

### Configuração

Crie um arquivo `.env` na raiz:

```env
STRING_CONEXAO=mongodb+srv://user:pass@cluster.mongodb.net/instabytes
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3000
```

### Uso Local

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000/`.

---

## Scripts Disponíveis

```bash
# Desenvolvimento com watch
npm run dev

# Lint
npm run lint

# Testes
npm test

# Build (placeholder)
npm run build

# Auditoria de dependências
npm run audit
```

---

## Qualidade e Governança

O projeto adota práticas de governança para manter a qualidade do código:

- **CI** — Pipeline com lint, testes e build via GitHub Actions
- **Security** — Análise CodeQL semanal e em cada push/PR
- **Coverage** — Relatórios integrados ao Codecov

> Para diretrizes de contribuição, consulte [`CONTRIBUTING.md`](CONTRIBUTING.md). Para política de segurança, consulte [`SECURITY.md`](SECURITY.md).

---

## FAQ

<details>
<summary><strong>A API funciona sem o Google Gemini configurado?</strong></summary>

Sim. O Gemini é opcional — quando a API Key não está configurada ou o serviço está indisponível, o upload funciona normalmente mas sem geração automática de descrição e alt-text.
</details>

<details>
<summary><strong>Quais formatos de imagem são suportados?</strong></summary>

JPEG, PNG, GIF e WEBP. O Multer valida formato e tamanho antes do processamento.
</details>

<details>
<summary><strong>É possível customizar as descrições geradas pela IA?</strong></summary>

Sim. O `geminiService.js` aceita prompts customizados para diferentes contextos (e-commerce, arte, etc.). Modifique o prompt para ajustar estilo, idioma ou nível de detalhe.
</details>

<details>
<summary><strong>Qual banco de dados é utilizado?</strong></summary>

MongoDB (local ou Atlas). A natureza semi-estruturada de posts sociais com comentários aninhados e metadados variáveis favorece a abordagem NoSQL.
</details>

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License - você pode usar, copiar, modificar e distribuir este código.
```

---

## Contato

**José Enoque Costa de Sousa**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/enoque-sousa-bb89aa168/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/ESousa97)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=flat&logo=todoist&logoColor=white)](https://enoquesousa.vercel.app)

---

<div align="center">

**[⬆ Voltar ao topo](#instabytes-backend)**

Feito com ❤️ por [José Enoque](https://github.com/ESousa97)

**Status do Projeto:** Archived — Sem novas atualizações

</div>
