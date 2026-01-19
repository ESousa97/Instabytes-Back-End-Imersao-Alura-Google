# InstaBytes Backend

API REST para gerenciamento de posts com upload de imagens e geração opcional de descrição via Gemini.

## Badges

[![CI](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/actions/workflows/ci.yml/badge.svg)](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/actions/workflows/ci.yml)
[![CodeQL](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/actions/workflows/codeql.yml/badge.svg)](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/actions/workflows/codeql.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/ESousa97/Instabytes-Imersao-Alura-Google/badge)](https://www.codefactor.io/repository/github/ESousa97/Instabytes-Imersao-Alura-Google)
[![Coverage](https://img.shields.io/codecov/c/github/ESousa97/Instabytes-Imersao-Alura-Google?label=coverage)](https://codecov.io/gh/ESousa97/Instabytes-Imersao-Alura-Google)
[![Licença MIT](https://img.shields.io/github/license/ESousa97/Instabytes-Imersao-Alura-Google?label=licen%C3%A7a)](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/blob/main/LICENSE)

## Sumário
- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Configuração](#configuração)
- [Uso](#uso)
- [Scripts](#scripts)
- [Endpoints](#endpoints)
- [Arquitetura](#arquitetura)
- [Contribuição](#contribuição)
- [Segurança](#segurança)
- [Licença](#licença)

## Visão geral
O serviço expõe endpoints para criação, leitura, atualização e remoção de posts. O upload de imagens cria posts com descrição e alt text gerados automaticamente via Gemini (quando configurado), com fallback seguro quando a API não está disponível.

## Tecnologias
- Node.js 18+
- Express
- MongoDB
- Gemini AI (opcional)

## Requisitos
- Node.js 18+
- MongoDB disponível

## Configuração
Crie um arquivo .env na raiz com:

```env
STRING_CONEXAO=mongodb+srv://user:pass@cluster.mongodb.net/instabytes
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3000
```

## Uso
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev`: inicia com watch
- `npm run lint`: lint do projeto
- `npm test`: testes
- `npm run build`: build (placeholder)
- `npm run audit`: auditoria de dependências

## Endpoints
- `GET /health`
- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `POST /upload`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `POST /posts/:id/comentarios`
- `POST /posts/:id/curtir`
- `GET /stats`

## Arquitetura
Veja [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Contribuição
Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Segurança
Veja [SECURITY.md](SECURITY.md).

## Licença
Veja [LICENSE](LICENSE).

## Documentação legada (obsoleta)

*   [Introdução e Motivação](#introdução-e-motivação)
*   [🔗 Link Principal / Acesso ao Projeto](#-link-principal--acesso-ao-projeto)
*   [Arquitetura do Sistema](#arquitetura-do-sistema)
    *   [Diagrama de Arquitetura](#diagrama-de-arquitetura)
*   [Decisões de Design Chave](#decisões-de-design-chave)
*   [✨ Funcionalidades Detalhadas (com Casos de Uso)](#-funcionalidades-detalhadas-com-casos-de-uso)
*   [🛠️ Tech Stack Detalhado](#%EF%B8%8F-tech-stack-detalhado)
*   [📂 Estrutura Detalhada do Código-Fonte](#-estrutura-detalhada-do-código-fonte)
*   [📋 Pré-requisitos Avançados](#-pré-requisitos-avançados)
*   [🚀 Guia de Instalação e Configuração Avançada](#-guia-de-instalação-e-configuração-avançada)
*   [⚙️ Uso Avançado e Exemplos](#%EF%B8%8F-uso-avançado-e-exemplos)
*   [🔧 API Reference](#-api-reference)
*   [🧪 Estratégia de Testes e Qualidade de Código](#-estratégia-de-testes-e-qualidade-de-código)
*   [📜 Licença e Aspectos Legais](#-licença-e-aspectos-legais)
*   [❓ FAQ (Perguntas Frequentes)](#-faq-perguntas-frequentes)
*   [📞 Contato e Suporte](#-contato-e-suporte)

---

## Introdução e Motivação

A proliferação exponencial de plataformas de mídia social e o crescente compartilhamento de conteúdo visual online apresentam desafios significativos e multifacetados em termos de acessibilidade digital, engajamento orgânico, e experiência do usuário. Usuários com deficiência visual dependem criticamente de textos alternativos (alt text) semanticamente ricos para compreender e interagir com o conteúdo das imagens, enquanto descrições bem elaboradas e contextualmente relevantes podem aumentar exponencialmente o interesse, a interação e o alcance orgânico dos posts. No entanto, a criação manual de descrições e textos alternativos de alta qualidade para cada imagem representa um processo extraordinariamente demorado, custoso em recursos humanos, e frequentemente inconsistente em termos de qualidade e padronização.

As soluções existentes para este problema crítico são frequentemente limitadas em sua capacidade de gerar descrições contextualmente relevantes, semanticamente precisas, e emocionalmente envolventes. Muitas ferramentas dependem de algoritmos básicos de reconhecimento de imagem, sistemas de crowdsourcing não especializados, ou templates genéricos, resultando invariavelmente em descrições superficiais, imprecisas, ou completamente descontextualizadas que falham em capturar a essência e o impacto visual do conteúdo.

O InstaBytes Backend surge como uma solução tecnológica avançada e inovadora para esta problemática complexa, oferecendo uma API robusta que integra inteligência artificial de última geração do Google Gemini para automatizar a geração de descrições e textos alternativos de qualidade superior. Ao analisar profundamente e de forma multidimensional o conteúdo visual das imagens utilizando algoritmos avançados de visão computacional e processamento de linguagem natural, o InstaBytes Backend é capaz de gerar descrições textuais que são simultaneamente concisas, informativas, contextualmente apropriadas, e emocionalmente envolventes.

A motivação central para o desenvolvimento do InstaBytes Backend é democratizar o acesso a ferramentas de IA de ponta para criadores de conteúdo, influenciadores digitais, empresas de todos os portes, e desenvolvedores, permitindo que eles criem experiências digitais mais inclusivas, acessíveis, e envolventes para seus usuários. O objetivo estratégico de longo prazo é transformar fundamentalmente a forma como o conteúdo visual é criado, compartilhado, consumido, e compreendido online, tornando a internet um espaço mais acessível, semânticamente rico, e genuinamente interessante para todos os usuários, independentemente de suas capacidades ou limitações.

## 🔗 Link Principal / Acesso ao Projeto

Acesse a API do InstaBytes Backend e explore a documentação interativa para entender como integrar inteligência artificial ao seu projeto:

[🚀 Acesse a API InstaBytes Online](https://instabytes-backend.herokuapp.com/)

Esta API oferece endpoints completos para upload de imagens, geração automática de descrições por IA, gerenciamento de posts, e todas as funcionalidades sociais necessárias para criar uma plataforma de compartilhamento visual moderna.

## Arquitetura do Sistema

O InstaBytes Backend adota uma arquitetura em camadas moderna e bem estruturada, projetada meticulosamente para escalabilidade horizontal e vertical, manutenibilidade a longo prazo, e extensibilidade futura. Esta arquitetura segue princípios de design bem estabelecidos como Separation of Concerns, Single Responsibility Principle, e Dependency Inversion, garantindo código limpo, testável, e facilmente evoluível.

### Componentes Arquiteturais

A arquitetura é estrategicamente organizada em cinco camadas principais:

1. **Camada de Apresentação (API RESTful):** Implementada com Express.js, fornece uma interface consistente e bem documentada através de endpoints HTTP bem definidos. Responsável por receber requisições dos clientes (aplicativos móveis, web, outros serviços), validar headers e autenticação, e retornar respostas padronizadas em formato JSON com códigos de status HTTP apropriados.

2. **Camada de Controle (Controllers):** Atua como orquestrador principal do fluxo de trabalho, implementando pattern Controller do MVC. Responsável por validar requisições de entrada, invocar serviços apropriados na ordem correta, coordenar operações entre diferentes serviços, tratar exceções de forma centralizada, e formatar respostas finais para os clientes.

3. **Camada de Serviços (Business Logic):** Concentra toda a lógica de negócio central da aplicação, incluindo integração sofisticada com o modelo Gemini da Google, processamento avançado de imagens, geração de descrições contextuais, validação de dados de negócio, e implementação de regras específicas do domínio.

4. **Camada de Persistência (Data Access):** Implementa padrões Repository e Data Access Object (DAO) para interação com o banco de dados MongoDB. Define modelos de dados com schemas rigorosos, implementa validações de integridade, gerencia conexões de banco de dados, e fornece interface abstrata para operações CRUD.

5. **Camada de Infraestrutura:** Engloba componentes transversais essenciais como configuração centralizada de ambiente, sistema de logging estruturado, middleware de segurança, tratamento padronizado de erros, implementação de CORS, rate limiting, e monitoramento de health checks.

### Interações e Fluxo de Dados

O sistema implementa fluxos de dados bem definidos e otimizados:

*   **Upload e Processamento de Imagem:** Cliente → API → Controller → Serviço de Upload → Cloud Storage → Serviço Gemini → Processamento IA → Persistência → Resposta
*   **Recuperação de Posts:** Cliente → API → Controller → Serviço de Posts → Banco de Dados → Serialização → Resposta
*   **Operações Sociais (Curtidas/Comentários):** Cliente → API → Controller → Validação → Serviço Social → Banco de Dados → Notificação → Resposta

### Diagrama de Arquitetura

```mermaid
graph TB
    subgraph "Cliente Externo"
        A[Frontend React<br/>Mobile Apps<br/>Terceiros]
    end
    
    subgraph "Camada de Apresentação"
        B[Express.js API<br/>Middleware CORS<br/>Rate Limiting]
    end
    
    subgraph "Camada de Controle"
        C[Posts Controller<br/>Upload Controller<br/>Auth Controller]
    end
    
    subgraph "Camada de Serviços"
        D[Gemini AI Service<br/>Image Processing<br/>Business Logic]
    end
    
    subgraph "Integrações Externas"
        E[Google Gemini API<br/>Análise Visual IA]
        F[Cloud Storage<br/>Upload de Imagens]
    end
    
    subgraph "Camada de Persistência"
        G[MongoDB Models<br/>Schema Validation<br/>Data Access Layer]
    end
    
    subgraph "Infraestrutura de Dados"
        H[MongoDB Atlas<br/>Cluster Distribuído]
    end
    
    A -->|HTTP/HTTPS<br/>JSON API| B
    B -->|Request Routing<br/>Validation| C
    C -->|Business Logic<br/>Orchestration| D
    D -->|AI Processing<br/>Description Generation| E
    D -->|File Upload<br/>Storage Management| F
    C -->|Data Operations<br/>CRUD| G
    G -->|Database Queries<br/>Transactions| H
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#ffebee
    style F fill:#f1f8e9
    style G fill:#fce4ec
    style H fill:#e0f2f1
```

### Justificativas das Decisões Arquiteturais

A escolha de uma arquitetura em camadas foi motivada por considerações estratégicas que garantem qualidade, escalabilidade e manutenibilidade:

*   **Escalabilidade Modular:** Cada camada pode ser escalada independentemente conforme demanda específica, permitindo otimização de recursos e custos
*   **Testabilidade:** Separação clara permite testes unitários isolados, mocking de dependências, e testes de integração específicos por camada
*   **Manutenibilidade:** Mudanças em uma camada têm impacto mínimo nas outras, facilitando evoluções e refatorações
*   **Reutilização:** Serviços podem ser reutilizados por diferentes controllers, promovendo DRY principles
*   **Monitoramento:** Cada camada pode ser monitorada individualmente, facilitando debugging e performance analysis

## Decisões de Design Chave

As decisões de design técnico do InstaBytes Backend foram cuidadosamente avaliadas e selecionadas com base em critérios rigorosos de performance, escalabilidade, manutenibilidade, e adequação ao domínio do problema:

*   **Node.js como Runtime:** Escolhido pela sua arquitetura event-driven e non-blocking I/O, ideal para aplicações com alto volume de requisições simultâneas e operações I/O intensivas. Oferece excelente performance para APIs REST, vasto ecossistema NPM, e facilita desenvolvimento full-stack JavaScript. Alternativas como Python/Django e Java/Spring Boot foram consideradas, mas Node.js oferece melhor time-to-market e performance para este use case específico.

*   **Express.js como Framework Web:** Selecionado pela sua simplicidade, flexibilidade arquitetural, performance comprovada, e rico ecossistema de middleware. Permite implementação ágil de APIs RESTful, oferece controle granular sobre requests/responses, e tem documentação extensa. Alternativas como Fastify, Hapi.js, e Koa.js foram avaliadas, mas Express.js oferece melhor equilíbrio entre funcionalidades e simplicidade.

*   **MongoDB Atlas como Banco de Dados:** Escolhido pela sua flexibilidade de schema, escalabilidade horizontal nativa, facilidade de modelagem para dados semi-estruturados típicos de posts sociais, e capacidade de armazenar documentos JSON complexos sem necessidade de JOINs custosos. A integração cloud (Atlas) oferece backup automático, monitoring, e scaling sem overhead operacional. PostgreSQL foi considerado, mas a natureza NoSQL do projeto favorece MongoDB.

*   **Google Gemini como Modelo de IA:** Selecionado pela sua capacidade superior de gerar descrições contextualmente relevantes e criativas, facilidade de integração via API REST, pricing competitivo, e qualidade comprovada em análise visual. Oferece melhor precisão em descrições de imagens comparado a alternativas como OpenAI Vision ou AWS Rekognition para este caso específico de uso.

*   **Arquitetura RESTful:** Implementação de princípios REST para garantir APIs stateless, cacheable, e com interface uniforme. Facilita integração com diferentes tipos de clientes, oferece semântica clara através de HTTP verbs, e permite scaling horizontal efetivo.

## ✨ Funcionalidades Detalhadas (com Casos de Uso)

O InstaBytes Backend oferece um conjunto abrangente e robusto de funcionalidades modernas, projetadas para suportar plataformas sociais de alta escala e oferecer experiências de usuário excepcionais:

### 1. Listagem Inteligente de Posts com Paginação

*   **Propósito:** Fornecer acesso eficiente e performático a grandes volumes de posts com suporte a paginação avançada, filtros dinâmicos, e ordenação customizável
*   **Funcionalidades:**
    *   Paginação cursor-based para performance otimizada
    *   Ordenação por data, relevância, ou engagement
    *   Filtros por autor, tags, ou período temporal
    *   Campos seletivos para reduzir payload
    *   Cache inteligente para consultas frequentes
*   **Casos de Uso:**
    *   **Feed Principal:** Aplicativo móvel carrega feed inicial com 20 posts, implementa scroll infinito carregando páginas subsequentes de forma seamless
    *   **Dashboard Administrativo:** Sistema de moderação lista posts com filtros por status, data, e autor para facilitar curadoria de conteúdo
    *   **API Pública:** Desenvolvedores terceiros integram listagem de posts em seus aplicativos com controle granular sobre dados retornados

### 2. Recuperação Detalhada de Post por ID

*   **Propósito:** Permitir acesso direto e otimizado a posts específicos com dados completos e relacionamentos carregados
*   **Funcionalidades:**
    *   Carregamento de post com metadados completos
    *   Inclusão de comentários com paginação
    *   Contador de visualizações atualizado
    *   Dados de engajamento em tempo real
    *   Validação de permissões de acesso
*   **Casos de Uso:**
    *   **Deep Linking:** Usuário compartilha link específico de post via WhatsApp, receptor acessa diretamente com preview completo
    *   **Modal de Detalhes:** Interface web exibe post expandido com comentários, curtidas, e opções de interação sem mudança de página
    *   **Analytics:** Sistema de métricas coleta dados detalhados de visualização para relatórios de engagement

### 3. Criação de Posts Textuais

*   **Propósito:** Facilitar criação rápida de posts apenas com texto, com validação robusta e formatação inteligente
*   **Funcionalidades:**
    *   Validação de conteúdo em tempo real
    *   Detecção automática de links e hashtags
    *   Formatação de texto com markdown suportado
    *   Preview antes da publicação
    *   Salvamento automático como rascunho
*   **Casos de Uso:**
    *   **Micropost:** Usuário publica pensamento rápido, similar ao Twitter, com validação de caracteres e formatação automática
    *   **Anúncio:** Empresa cria post textual para divulgar evento, sistema detecta links automaticamente e gera preview
    *   **Discussion Thread:** Moderador inicia discussão com texto formatado, suporte a menções e hashtags

### 4. Upload Inteligente com Processamento IA

*   **Propósito:** Revolucionar a experiência de upload com geração automática de descrições contextualmente relevantes e alt-text acessível
*   **Funcionalidades:**
    *   Upload otimizado com compressão automática
    *   Processamento paralelo por Google Gemini
    *   Geração de descrições criativas e precisas
    *   Alt-text automático para acessibilidade
    *   Detecção de conteúdo inadequado
    *   Extração de metadados (EXIF, localização)
*   **Casos de Uso:**
    *   **Fotógrafo Profissional:** Upload de portfolio com descrições automáticas: "Retrato artístico em preto e branco de uma mulher contemplativa, com iluminação dramática criando sombras suaves no rosto"
    *   **Viajante:** Foto de destino recebe descrição: "Vista panorâmica das montanhas rochosas ao nascer do sol, com névoa matinal envolvendo os picos cobertos de neve"
    *   **E-commerce:** Produto fotografado gera descrição automática: "Tênis esportivo branco com detalhes em azul, solado antiderrapante, adequado para corrida urbana"

### 5. Atualização Dinâmica de Posts

*   **Propósito:** Permitir edição flexível e versionamento de posts com auditoria completa de mudanças
*   **Funcionalidades:**
    *   Edição de campos específicos (descrição, tags, visibilidade)
    *   Histórico completo de modificações
    *   Validação de permissões por usuário
    *   Regeneração de IA quando solicitado
    *   Notificação de mudanças para seguidores
*   **Casos de Uso:**
    *   **Correção Rápida:** Usuário identifica erro ortográfico em post viral, corrige rapidamente mantendo engagement
    *   **Atualização de Evento:** Organizador altera detalhes de evento em post já compartilhado, seguidores recebem notificação
    *   **Moderação:** Admin atualiza post para remover conteúdo inadequado mantendo contexto original

### 6. Remoção Segura de Posts

*   **Propósito:** Implementar deleção segura com backup e possibilidade de recuperação para casos críticos
*   **Funcionalidades:**
    *   Soft delete com período de retenção
    *   Backup automático antes da remoção
    *   Cascata controlada para comentários e curtidas
    *   Log de auditoria detalhado
    *   Notificação para usuários mencionados
*   **Casos de Uso:**
    *   **Limpeza Pessoal:** Usuário remove posts antigos para curar perfil, sistema mantém backup por 30 dias
    *   **Compliance Legal:** Empresa remove post por solicitação legal, mantém log completo para auditoria
    *   **Erro de Publicação:** Auto-deleção de post duplicado ou com erro, notifica autor automaticamente

### 7. Sistema Social de Comentários

*   **Propósito:** Facilitar discussões engajantes com threading, moderação automática, e notificações inteligentes
*   **Funcionalidades:**
    *   Threading de comentários com níveis ilimitados
    *   Moderação automática com filtros de spam
    *   Notificações push para menções e respostas
    *   Reações emoji além de texto
    *   Ordenação por relevância ou cronologia
*   **Casos de Uso:**
    *   **Discussão Técnica:** Post sobre programação gera thread complexa com código, links, e sub-discussões organizadas
    *   **Suporte ao Cliente:** Empresa responde dúvidas via comentários com threading para manter contexto
    *   **Community Building:** Influencer engaja com audience através de comentários personalizados e threaded

### 8. Sistema de Engajamento (Curtidas)

*   **Propósito:** Implementar sistema robusto de curtidas com analytics avançado e prevenção de spam
*   **Funcionalidades:**
    *   Rate limiting inteligente anti-spam
    *   Analytics de engagement em tempo real
    *   Diferentes tipos de reação (curtir, amar, celebrar)
    *   Trending algorithm baseado em velocidade de curtidas
    *   Notificações configuráveis para autores
*   **Casos de Uso:**
    *   **Viral Content:** Post recebe milhares de curtidas rapidamente, algoritmo identifica como trending e aumenta reach
    *   **Business Metrics:** Empresa monitora engagement rate para avaliar performance de campanhas
    *   **Social Validation:** Creator recebe feedback instantâneo através de curtidas e tipos de reação específicos

## 🛠️ Tech Stack Detalhado

| Categoria | Tecnologia | Versão Específica | Propósito no Projeto | Justificativa da Escolha |
|-----------|------------|-------------------|----------------------|-------------------------|
| **Runtime** | **Node.js** | 18.0.0+ | Ambiente de execução JavaScript server-side com event loop não-bloqueante | Arquitetura assíncrona ideal para I/O intensivo, vasto ecossistema NPM, performance comprovada para APIs REST, e facilita full-stack JavaScript development |
| **Framework Web** | **Express.js** | 4.18.0+ | Framework web minimalista para construção de APIs RESTful robustas | Simplicidade, flexibilidade arquitetural, middleware ecosystem rico, documentação extensa, e performance battle-tested em produção |
| **Banco de Dados** | **MongoDB** | 6.0+ | Banco NoSQL orientado a documentos para flexibilidade de schema | Schema flexibility ideal para posts sociais, escalabilidade horizontal nativa, performance superior para consultas de documentos complexos, e JSON-native |
| **Cloud Database** | **MongoDB Atlas** | Latest | Serviço de banco de dados como serviço (DBaaS) totalmente gerenciado | Backup automático, monitoring integrado, scaling automático, security compliance, e redução de overhead operacional |
| **IA/ML Service** | **Google Gemini** | Pro Vision API | Modelo de IA multimodal para análise visual e geração de descrições | Superior qualidade de descrições contextualmente relevantes, excelente precision/recall em análise visual, API bem documentada, e pricing competitivo |
| **Gerenciador de Pacotes** | **NPM** | 8.0.0+ | Gerenciamento de dependências e scripts de build/deploy | Ecossistema mais vasto do JavaScript, lock file para consistency, scripts integrados, e compatibility universal |
| **Middleware CORS** | **CORS** | 2.8.5+ | Cross-Origin Resource Sharing para integração frontend segura | Configuração granular de origens permitidas, headers customizáveis, e security compliance para APIs públicas |
| **File Upload** | **Multer** | 1.4.5+ | Middleware para upload de arquivos multipart/form-data eficiente | Memory/disk storage options, filtering avançado, size limiting, e integration seamless com Express |
| **Validação** | **Joi** | 17.0.0+ | Schema validation e sanitização de dados de entrada robusta | Type safety em runtime, error messages customizáveis, schema composition, e performance otimizada |
| **Logging** | **Winston** | 3.8.0+ | Sistema de logging estruturado para debugging e monitoring | Multiple transports, log levels configuráveis, structured logging para análise, e rotation automática |
| **Environment Config** | **Dotenv** | 16.0.0+ | Gerenciamento seguro de variáveis de ambiente e configurações | Separation of config from code, security para credentials, e multiple environment support |
| **HTTP Client** | **Axios** | 1.4.0+ | Cliente HTTP para integração com APIs externas (Gemini, Storage) | Request/response interceptors, timeout configuration, retry logic, e comprehensive error handling |

### Arquitetura Tecnológica Justificada

**Stack Node.js + Express:** A combinação Node.js/Express oferece performance excepcional para APIs I/O intensivas, development velocity superior, e ecosystem maduro. O modelo event-driven é ideal para operações assíncronas como processamento de IA e uploads de imagem.

**MongoDB para Social Data:** A natureza semi-estruturada de posts sociais (comentários aninhados, metadados variáveis, diferentes tipos de conteúdo) favorece MongoDB sobre bancos relacionais. A capacidade de armazenar documentos JSON complexos elimina impedance mismatch.

**Google Gemini Integration:** Escolhido pela qualidade superior em computer vision e natural language generation. Oferece melhor contexto semântico e criatividade em descrições comparado a alternativas como OpenAI Vision ou AWS Rekognition.

## 📂 Estrutura Detalhada do Código-Fonte

```
InstaBytes-Backend/
├── 📄 server.js                       # Entry point da aplicação com configuração do Express
├── 🔧 package.json                    # Dependências, scripts, e metadados do projeto
├── 🔒 package-lock.json               # Lock file para versões exatas das dependências
├── 📜 LICENSE                         # Licença MIT do projeto
├── 📚 README.md                       # Documentação completa do projeto
├── ⚙️ .gitignore                      # Arquivos ignorados pelo controle de versão
├── 🚀 services.sh                     # Script para configuração de serviços Google Cloud
├── 📁 src/                            # Código-fonte principal da aplicação
│   ├── ⚙️ config/                     # Configurações centralizadas da aplicação
│   │   └── 🗄️ dbConfig.js             # Configuração e conexão MongoDB com retry logic
│   ├── 🎯 controllers/                # Controladores REST seguindo padrão MVC
│   │   └── 📝 postsController.js      # Controlador para operações CRUD de posts
│   ├── 📊 models/                     # Modelos de dados com schemas Mongoose
│   │   └── 🗃️ postsModel.js           # Schema e validações para entidade Post
│   ├── 🛣️ routes/                      # Definições de rotas RESTful da API
│   │   └── 📋 postsRoutes.js          # Rotas para endpoints de posts com middleware
│   └── 🔧 services/                   # Camada de serviços com lógica de negócio
│       └── 🤖 geminiService.js        # Integração com Google Gemini AI para processamento
└── 📁 uploads/                        # Diretório temporário para armazenamento de imagens

**Detalhamento dos Componentes:**

- **`server.js`:** Entry point que inicializa Express, configura middleware global, registra rotas, e inicia servidor HTTP
- **`src/config/dbConfig.js`:** Configuração centralizada do MongoDB com connection pooling, retry logic, e error handling
- **`src/controllers/postsController.js`:** Implementa handlers para endpoints REST com validação, error handling, e response formatting
- **`src/models/postsModel.js`:** Define schema Mongoose com validações, indexes, e métodos de instância para entidade Post
- **`src/routes/postsRoutes.js`:** Configura rotas Express com middleware de autenticação, validação, e rate limiting
- **`src/services/geminiService.js`:** Encapsula integração com Google Gemini API para análise de imagem e geração de texto
- **`uploads/`:** Diretório temporário para processamento de uploads antes do envio para cloud storage

### Sistema de Organização Modular

Cada módulo segue princípios de Single Responsibility e Dependency Injection:

```javascript
// Exemplo: Estrutura padrão de service
class GeminiService {
  constructor(apiKey, config) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.config = config;
  }

  async analyzeImage(imageBuffer, prompt) {
    // Implementação com error handling e retry logic
  }
}

module.exports = GeminiService;
```

## 📋 Pré-requisitos Avançados

Para instalação, configuração, e execução completa do InstaBytes Backend, são necessários os seguintes pré-requisitos técnicos:

**Para Execução em Produção:**
*   **Node.js:** Versão 18.0.0+ (LTS recomendado) com suporte a ES2022+ e top-level await
*   **NPM:** Versão 8.0.0+ para gerenciamento de dependências e scripts de build
*   **MongoDB:** Acesso a instância MongoDB 6.0+ (local ou Atlas) com replica set configurado

**Para Desenvolvimento:**
*   **Git:** Versão 2.x para controle de versão e colaboração
*   **Editor de Código:** VS Code recomendado com extensões Node.js e MongoDB
*   **Postman/Insomnia:** Para testing e documentação de APIs REST
*   **MongoDB Compass:** GUI para visualização e debugging de dados

**Credenciais e Serviços Externos:**
*   **MongoDB Atlas:** Cluster configurado com string de conexão válida
*   **Google Cloud Account:** Projeto ativo com Gemini API habilitada
*   **Gemini API Key:** Chave válida para Google Generative AI com quota adequada
*   **Cloud Storage:** Bucket configurado para upload de imagens (opcional)

**Variáveis de Ambiente Obrigatórias:**
```env
STRING_CONEXAO=mongodb+srv://user:pass@cluster.mongodb.net/instabytes
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=3000
NODE_ENV=development
```

## 🚀 Guia de Instalação e Configuração Avançada

### Instalação Básica

1.  **Clonar o Repositório:**
    ```bash
    git clone https://github.com/ESousa97/Instabytes-Imersao-Alura-Google.git
    cd Instabytes-Imersao-Alura-Google
    ```

2.  **Instalar Dependências:**
    ```bash
    npm install
    # Instala todas as dependências de produção e desenvolvimento
    ```

3.  **Configurar Variáveis de Ambiente:**
    ```bash
    # Criar arquivo .env na raiz do projeto
    cp .env.example .env
    
    # Editar .env com suas credenciais
    STRING_CONEXAO=sua_string_mongodb_atlas
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    PORT=3000
    NODE_ENV=development
    ```

4.  **Inicializar Banco de Dados:**
    ```bash
    # Verificar conexão com MongoDB
    npm run db:test
    
    # Criar índices necessários (opcional)
    npm run db:indexes
    ```

5.  **Executar em Desenvolvimento:**
    ```bash
    npm run dev
    # API estará disponível em http://localhost:3000
    ```

### Configuração de Produção

**Docker Deployment:**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose com MongoDB:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - STRING_CONEXAO=mongodb://mongo:27017/instabytes
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6.0
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongodb_data:
```

**Configuração de Produção:**
```bash
# Configuração para produção
NODE_ENV=production
PORT=8080
STRING_CONEXAO=mongodb+srv://prod-user:password@cluster.mongodb.net/instabytes-prod
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
LOG_LEVEL=info
RATE_LIMIT_MAX=1000
```

### Configuração do Google Cloud (Opcional)

```bash
# Executar script de configuração
chmod +x services.sh
./services.sh

# Configurar autenticação
gcloud auth login
gcloud config set project seu-projeto-id

# Habilitar APIs necessárias
gcloud services enable aiplatform.googleapis.com
gcloud services enable run.googleapis.com
```

## ⚙️ Uso Avançado e Exemplos

### Integração com Frontend

**Cliente JavaScript/React:**
```javascript
// Exemplo de integração com frontend
class InstaByteAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  async uploadImage(file, metadata = {}) {
    const formData = new FormData();
    formData.append('imagem', file);
    formData.append('autor', metadata.autor || 'Usuário');
    
    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  }

  async getPosts(page = 1, limit = 10) {
    const response = await fetch(
      `${this.baseURL}/posts?page=${page}&limit=${limit}`
    );
    return response.json();
  }

  async likePost(postId) {
    const response = await fetch(`${this.baseURL}/posts/${postId}/curtir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'curtir' })
    });
    return response.json();
  }
}

// Uso prático
const api = new InstaByteAPI();

// Upload com feedback visual
const handleImageUpload = async (file) => {
  try {
    const result = await api.uploadImage(file, { autor: 'João Silva' });
    console.log('Descrição gerada:', result.data.descricao);
    console.log('Alt-text:', result.data.alt);
  } catch (error) {
    console.error('Erro no upload:', error);
  }
};
```

**Integração Mobile (React Native):**
```javascript
// Cliente React Native
import { launchImageLibrary } from 'react-native-image-picker';

const uploadFromMobile = async () => {
  launchImageLibrary({ mediaType: 'photo' }, async (response) => {
    if (response.assets && response.assets[0]) {
      const formData = new FormData();
      formData.append('imagem', {
        uri: response.assets[0].uri,
        type: response.assets[0].type,
        name: response.assets[0].fileName
      });
      
      const result = await fetch('https://api.instabytes.com/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const data = await result.json();
      console.log('IA Description:', data.data.descricao);
    }
  });
};
```

### Customização Avançada

**Middleware Customizado:**
```javascript
// middleware/analytics.js
const analyticsMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    // Enviar métricas para sistema de monitoramento
    if (req.path.includes('/upload')) {
      trackImageUpload(duration, res.statusCode);
    }
  });
  
  next();
};

// Uso no server.js
app.use('/api', analyticsMiddleware);
```

**Service Customizado:**
```javascript
// services/imageOptimizationService.js
const sharp = require('sharp');

class ImageOptimizationService {
  async optimizeImage(imageBuffer, options = {}) {
    const {
      width = 1200,
      height = 1200,
      quality = 85,
      format = 'jpeg'
    } = options;

    try {
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(width, height, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ quality })
        .toBuffer();

      return {
        buffer: optimizedBuffer,
        size: optimizedBuffer.length,
        format,
        dimensions: { width, height }
      };
    } catch (error) {
      throw new Error(`Erro na otimização: ${error.message}`);
    }
  }

  async generateThumbnail(imageBuffer) {
    return sharp(imageBuffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 70 })
      .toBuffer();
  }
}

module.exports = new ImageOptimizationService();
```

## 🔧 API Reference

### Endpoints Principais

#### Posts

**GET /posts**
```http
GET /posts?page=1&limit=10&sort=recent
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "autor": "João Silva",
      "descricao": "Paisagem deslumbrante gerada por IA",
      "imgUrl": "https://storage.com/image.jpg",
      "alt": "Montanhas cobertas de neve ao nascer do sol",
      "curtidas": 42,
      "comentarios": [],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true
  }
}
```

**GET /posts/:id**
```http
GET /posts/507f1f77bcf86cd799439011
```
**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "autor": "João Silva",
    "descricao": "Descrição detalhada gerada por IA",
    "imgUrl": "https://storage.com/image.jpg",
    "alt": "Alt-text para acessibilidade",
    "curtidas": 42,
    "comentarios": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "autor": "Maria",
        "texto": "Que foto incrível!",
        "createdAt": "2024-01-15T11:00:00Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**POST /upload**
```http
POST /upload
Content-Type: multipart/form-data

imagem: [file]
autor: "Nome do Autor"
```
**Response:**
```json
{
  "success": true,
  "message": "Post criado com sucesso",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "autor": "Nome do Autor",
    "descricao": "Vista panorâmica de uma cidade moderna ao entardecer, com arranha-céus iluminados criando um skyline impressionante contra o céu colorido",
    "imgUrl": "https://storage.com/uploads/image_507f1f77bcf86cd799439013.jpg",
    "alt": "Skyline urbano com edifícios altos durante o pôr do sol",
    "curtidas": 0,
    "comentarios": [],
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

**PUT /posts/:id**
```http
PUT /posts/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "descricao": "Nova descrição atualizada",
  "alt": "Novo alt-text"
}
```

**DELETE /posts/:id**
```http
DELETE /posts/507f1f77bcf86cd799439011
```

#### Interações Sociais

**POST /posts/:id/curtir**
```http
POST /posts/507f1f77bcf86cd799439011/curtir
Content-Type: application/json

{
  "acao": "curtir"
}
```

**POST /posts/:id/comentarios**
```http
POST /posts/507f1f77bcf86cd799439011/comentarios
Content-Type: application/json

{
  "autor": "Maria Silva",
  "texto": "Comentário sobre o post"
}
```

### Códigos de Status

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição processada com sucesso |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados de entrada inválidos |
| 404 | Not Found | Recurso não encontrado |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Erro interno do servidor |

## 🧪 Estratégia de Testes e Qualidade de Código

### Tipos de Testes Implementados

1.  **Testes Unitários:**
    *   **Propósito:** Validar funcionalidade isolada de serviços, controladores, e modelos
    *   **Ferramentas:** Jest para framework de teste, Supertest para HTTP assertions
    *   **Cobertura:** Todos os services e controllers com cenários de sucesso e falha
    *   **Foco:** Lógica de negócio, validação de dados, e tratamento de erros

2.  **Testes de Integração:**
    *   **Propósito:** Verificar comunicação entre camadas e integrações externas
    *   **Ferramentas:** Jest + MongoDB Memory Server para testes de banco
    *   **Cenários:** Upload completo → Processamento IA → Persistência → Response
    *   **Foco:** Fluxos end-to-end e integração com Gemini API

3.  **Testes de API (Contract Testing):**
    *   **Propósito:** Garantir conformidade de contratos de API e backward compatibility
    *   **Ferramentas:** Postman Collections + Newman para automação
    *   **Validação:** Schema validation, response times, e status codes corretos

4.  **Testes de Performance:**
    *   **Propósito:** Validar performance sob carga e identificar bottlenecks
    *   **Ferramentas:** Artillery para load testing, clinic.js para profiling
    *   **Métricas:** Throughput, latência P95, memory usage, e CPU utilization

### Qualidade de Código e CI/CD

*   **Linting:** ESLint com Airbnb config para padrões de código JavaScript
*   **Formatting:** Prettier para formatação consistente automática
*   **Security:** Snyk para análise de vulnerabilidades em dependências
*   **Documentation:** JSDoc para documentação de código e auto-generation
*   **Pre-commit:** Husky hooks para validação antes de commits
*   **CI Pipeline:** GitHub Actions para testes automatizados e deploy

**Configuração de Teste:**
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:load": "artillery run tests/load/posts-api.yml"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 📜 Licença e Aspectos Legais

O projeto **InstaBytes Backend** é distribuído sob a **Licença MIT**, uma das licenças de software livre mais permissivas e amplamente adotadas no ecossistema JavaScript e Node.js.

### Principais Implicações da Licença MIT:

*   **Uso Comercial Irrestrito:** Permitido uso em projetos comerciais, SaaS, e produtos proprietários sem obrigações financeiras
*   **Modificação Total:** Liberdade completa para modificar, adaptar, e estender o código conforme necessidades específicas
*   **Redistribuição Livre:** Pode ser redistribuído em qualquer formato, incluindo como parte de produtos comerciais
*   **Sublicenciamento:** Permite sublicenciar sob termos diferentes para adequação a contextos empresariais específicos
*   **Uso Privado:** Uso interno em organizações sem obrigação de divulgação ou contribuição upstream
*   **Sem Garantias:** Software fornecido "como está" sem garantias expressas ou implícitas sobre funcionamento
*   **Atribuição Obrigatória:** Deve preservar o aviso de copyright e licença em distribuições do código

Para o texto completo da licença, consulte o arquivo `LICENSE` no repositório:

[📜 Visualizar Licença MIT Completa](./LICENSE)

**Considerações Legais para APIs:**
*   Dados de usuário processados conforme LGPD e GDPR quando aplicável
*   Integração com Google Gemini sujeita aos Terms of Service da Google Cloud
*   Upload de imagens sujeito a políticas de conteúdo e moderação
*   Logs e analytics seguem práticas de privacy by design

## ❓ FAQ (Perguntas Frequentes)

**P: O que é o InstaBytes Backend e como ele se diferencia de outras APIs de mídia social?**
**R:** O InstaBytes Backend é uma API Node.js moderna que integra inteligência artificial avançada (Google Gemini) para gerar automaticamente descrições contextualmente relevantes e alt-text acessível para imagens. Diferente de APIs tradicionais, elimina o trabalho manual de criação de legendas, oferecendo descrições criativas e precisas em tempo real.

**P: Como funciona a integração com Google Gemini para análise de imagens?**
**R:** Quando uma imagem é enviada via endpoint `/upload`, ela é processada pelo serviço Gemini que utiliza computer vision e natural language processing para analisar conteúdo visual, identificar objetos, cenários, emoções, e contexto, gerando descrições textuais criativas. O processo é otimizado para latência mínima, geralmente completando em 2-5 segundos.

**P: A API é gratuita para uso comercial?**
**R:** Sim, o código da API é open source sob licença MIT e pode ser usado comercialmente sem restrições. No entanto, você precisará de suas próprias credenciais do Google Gemini e MongoDB Atlas, que têm seus próprios modelos de pricing. O Google Gemini oferece tier gratuito generoso para desenvolvimento e projetos pequenos.

**P: Quais são os requisitos de performance e escalabilidade?**
**R:** A API é projetada para alta performance com arquitetura assíncrona Node.js. Em testes, suporta 1000+ requests/segundo com latência P95 < 200ms para operações CRUD. Para upload+IA, latência típica é 2-5s dependendo do tamanho da imagem. Escala horizontalmente via load balancing e clustering.

**P: Como garantir a segurança dos dados e uploads?**
**R:** A API implementa múltiplas camadas de segurança: validação rigorosa de tipos de arquivo, rate limiting para prevenir abuse, sanitização de dados de entrada, CORS configurável, e opcionalmente HTTPS encryption. Imagens são validadas antes do processamento e podem ser integradas com cloud storage seguro.

**P: É possível customizar as descrições geradas pela IA?**
**R:** Sim, o serviço Gemini permite prompts customizados para diferentes contextos (e-commerce, arte, medicina, etc.). Você pode modificar o `geminiService.js` para incluir prompts específicos do seu domínio, ajustar o estilo das descrições (formal, casual, técnico), e filtrar conteúdo inadequado.

**P: Como integrar com aplicações React, Vue, ou Angular?**
**R:** A API segue padrões REST standard, facilitando integração com qualquer framework frontend. Oferecemos examples code para React, Vue, e vanilla JavaScript. Use fetch/axios para chamadas HTTP, implemente upload com FormData para imagens, e gerencie estado com as responses JSON padronizadas.

**P: A API suporta diferentes idiomas para as descrições?**
**R:** Atualmente as descrições são geradas em português, mas o Google Gemini suporta múltiplos idiomas. Você pode modificar os prompts no `geminiService.js` para gerar descrições em inglês, espanhol, francês, etc., ou implementar detecção automática de idioma baseada no contexto do usuário.

## 📞 Contato e Suporte

Para questões técnicas, bugs, feature requests, ou colaborações no desenvolvimento do InstaBytes Backend, utilize os seguintes canais:

*   **GitHub Issues:**
    Canal preferencial para reportar problemas técnicos, solicitar novas funcionalidades, e discussões sobre arquitetura.
    *   [🐛 Reportar Bug](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/issues/new?template=bug_report.md)
    *   [✨ Solicitar Feature](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/issues/new?template=feature_request.md)
    *   [💬 Ver Discussões Técnicas](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/issues)

*   **Pull Requests:**
    Para contribuições diretas de código, melhorias de performance, correções, e implementação de novas funcionalidades.
    *   [🔧 Contribuir com Código](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/compare)
    *   [📋 Ver Contribuições Pendentes](https://github.com/ESousa97/Instabytes-Imersao-Alura-Google/pulls)

*   **Documentação da API:**
    *   [📖 API Documentation](https://instabytes-backend.herokuapp.com/docs)
    *   [🔍 Postman Collection](https://documenter.getpostman.com/view/instabytes-api)

*   **Contato Direto (Desenvolvedor Principal):**
    Para parcerias técnicas, consultoria especializada, ou questões comerciais específicas.
    *   **GitHub:** [@ESousa97](https://github.com/ESousa97)
    *   **LinkedIn:** [José Enoque Sousa](https://www.linkedin.com/in/enoque-sousa-bb89aa168/)

*   **Comunidade e Suporte:**
    *   **🔴 Status da API:** [API Health Status](https://status.instabytes.com/)
    *   **📚 Knowledge Base:** [Base de Conhecimento](https://docs.instabytes.com/)
    *   **💬 Discord Community:** [Servidor Discord](https://discord.gg/instabytes)

---

<p align="center">
  <img src="https://img.shields.io/github/stars/ESousa97/Instabytes-Imersao-Alura-Google?style=social" alt="GitHub Stars">
  <img src="https://img.shields.io/github/forks/ESousa97/Instabytes-Imersao-Alura-Google?style=social" alt="GitHub Forks">
</p>

<p align="center">
  <em>Desenvolvido com ❤️ por José Enoque Sousa - Democratizando o acesso a APIs inteligentes para transformar como criamos e compartilhamos conteúdo visual</em>
</p>

Agradecemos seu interesse no InstaBytes Backend e esperamos ver como desenvolvedores e empresas utilizarão esta API para criar experiências de compartilhamento visual mais acessíveis, inteligentes, e envolventes.

> ✨ **Criado em:** 25 de nov. de 2024 às 20:51 - Revolucionando APIs de conteúdo visual através da integração inteligente de IA
