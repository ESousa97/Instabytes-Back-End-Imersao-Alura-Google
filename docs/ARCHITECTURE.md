# Arquitetura

## Visão geral

API REST em Node.js + Express com persistência em MongoDB e integração opcional com Gemini AI para geração de descrição e texto alternativo de imagens.

## Camadas

- **Rotas**: [src/routes](../src/routes)
- **Controllers**: [src/controllers](../src/controllers)
- **Model**: [src/models](../src/models)
- **Serviços**: [src/services](../src/services)
- **Config**: [src/config](../src/config)

## Fluxo de upload

1. Upload recebe imagem
2. Cria post com status `processing`
3. Processa via Gemini (se configurado)
4. Atualiza post com URLs e descrição
