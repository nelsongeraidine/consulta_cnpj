# CLAUDE.md

Data de Atualização: 30-07-2026_Versão 1.00

## Visão geral

SPA em React que consulta CNPJ na API pública `publica.cnpj.ws` e mostra o
resultado com um resumo curado e uma seção que exibe **qualquer** campo
retornado pela API, de forma recursiva e automática, sem precisar de deploy
novo quando a API adiciona campos.

## Arquitetura em uma página

Tudo vive em `src/App.jsx` (sem roteamento, sem estado global):
- Helpers de formatação (`maskCNPJ`, `formatCNPJValue`, `formatCEP`,
  `formatDateValue`, `formatCurrencyBRL`) — decidem o formato pelo **nome
  da chave** via regex, nunca por lista fixa de campos conhecidos.
- `DynamicObject`/`DynamicValue` — renderizador recursivo que desenha
  qualquer objeto/array retornado pela API.
- `buildSummary` — único trecho com conhecimento do shape específico da
  API `cnpj.ws`; é aqui que se ajusta se a API mudar nomes de campo.
- `App` — estado, fetch, e o tema (toggle violeta/clássico via
  `data-theme` + variáveis CSS em `src/index.css`, persistido em
  `localStorage`).
- Stack: Vite + React 19 + Tailwind CSS v3 (config clássica, não v4).
- Não há mock de dados dentro de `src/` — dado de exemplo para testar em
  Artifact fica fora do projeto real.

## Escopo do projeto

Ver @PRD.md para o que está dentro/fora do escopo, requisitos não-
funcionais e limites conhecidos. Nunca implementar algo listado como "fora
do escopo" em @PRD.md sem antes confirmar com o usuário (ver regra 5).

## Regras de comportamento

1. Antes de qualquer mudança não-trivial (que toque mais de um arquivo ou
   mude comportamento existente), proponha um plano antes de executar.
2. Nunca adicione bibliotecas externas, CDNs ou pacotes sem consultar
   antes.
3. Comentários em português. Comentários explicam o "porquê" do código,
   não o "o quê".
4. Antes de criar arquivo novo além de `src/App.jsx`, `src/index.css` e
   `src/main.jsx`, justifique por que ele precisa existir.
5. Se uma feature pedida conflitar com @PRD.md, avise antes de implementar.
6. Toda atualização do projeto deve ficar documentada com data e versão,
   no formato: `Data de Atualização: DD-MM-YYYY_Versão X.XX`.

## Convenções de código

- Funções em camelCase (`formatCEP`); componentes React em PascalCase
  (`SummaryField`).
- Projeto é `.jsx` puro, sem TypeScript.
- Cor sempre via `tailwind.config.js` + variáveis CSS (`--c-*-rgb`), nunca
  hex direto no JSX — é o que faz o toggle de tema funcionar.
- Formatação de valores sempre por regex no nome da chave (ver
  `formatLeaf`), nunca por lista fixa de campos.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção em dist/
```
