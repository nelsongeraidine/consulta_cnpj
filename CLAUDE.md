# CLAUDE.md

Guia para trabalhar neste repositório com Claude Code.

## O que é

SPA em React que consulta dados de CNPJ na API pública `publica.cnpj.ws` e
renderiza o resultado: um card-resumo com os campos mais relevantes, e uma
seção que renderiza **qualquer** campo retornado pela API dinamicamente
(inclusive campos novos que a API venha a adicionar no futuro), sem precisar
tocar no código.

## Stack e comandos

- Vite + React 19, Tailwind CSS v3 (config clássica: `tailwind.config.js` +
  `postcss.config.js` + diretivas `@tailwind` em `src/index.css`).
- Sem backend, sem variáveis de ambiente, sem autenticação.
- `npm run dev` — servidor de desenvolvimento (http://localhost:5173)
- `npm run build` — build de produção em `dist/`
- `npm run preview` — serve o build de produção localmente
- `npm run lint` — oxlint

## Arquitetura (tudo em `src/App.jsx`)

O projeto é intencionalmente um arquivo único de componente — não há
roteamento, estado global, nem chamadas a múltiplos endpoints. Principais
blocos, de cima para baixo:

1. **Ícones** — SVGs inline, sem lib de ícones externa.
2. **Helpers de formatação** (`onlyDigits`, `maskCNPJ`, `formatCNPJValue`,
   `formatCEP`, `formatDateValue`, `formatCurrencyBRL`, `labelize`,
   `formatLeaf`) — formatam valores folha (não-objeto) com base no **nome da
   chave** e no **tipo do valor**. Ex.: qualquer chave contendo `cnpj` com 14
   dígitos vira `00.000.000/0000-00`; qualquer chave contendo `capital` vira
   moeda BRL; strings no formato `YYYY-MM-DD...` viram `DD/MM/AAAA`.
3. **`countLeaves`** — percorre o JSON recursivamente e conta quantos campos
   folha estão preenchidos vs. total, usado no contador "X / Y campos
   preenchidos".
4. **`DynamicObject` / `DynamicValue`** — o renderizador recursivo. Decide
   como desenhar qualquer valor: objeto vira `<dl>` aninhado, array de
   primitivos vira lista de chips, array de objetos vira cards numerados
   ("Sócios #1", "Sócios #2"...). Isso é o que torna a UI resiliente a
   mudanças no shape da API sem precisar de deploy.
5. **`buildSummary`** — extrai os ~10 campos mais úteis (razão social, CNAE,
   endereço, telefone etc.) para o card de resumo no topo. É a única função
   com conhecimento do shape específico da API `cnpj.ws`; se a API mudar
   nomes de campo, é aqui que se ajusta.
6. **`App`** — estado (`cnpjInput`, `data`, `loading`, `error`, `showRaw`,
   `copied`), fetch para `https://publica.cnpj.ws/cnpj/{14 dígitos}`, e o
   JSX da página.

## Convenções e decisões que importam

- **Não há mock de dados no projeto.** Uma versão anterior tinha
  `MOCK_DATA_EXAMPLE` e um botão "Carregar exemplo offline" — isso existia
  só para testar visualmente dentro do sandbox de artifact (que bloqueia
  fetch para domínios externos) e foi removido deliberadamente do projeto
  real a pedido do usuário. **Não reintroduzir.** Se precisar de uma prévia
  offline para testar em artifact, criar isso separadamente (ver seção
  "Preview em Artifact"), nunca dentro de `src/App.jsx`.
- **Tailwind v3, não v4** — escolhido deliberadamente para usar a config
  clássica (`tailwind.config.js`, `postcss.config.js`, `@tailwind base/
  components/utilities`), que é o que foi pedido. Não migrar para v4 sem
  alinhar antes (a sintaxe de config muda bastante: `@import "tailwindcss"`
  em vez de diretivas, tema via `@theme` em CSS).
- **Tema único (dark)** — a UI não tem alternância claro/escuro; é uma
  escolha deliberada de identidade visual (`bg-slate-950` fixo), não uma
  omissão.
- Toda formatação de valor folha é dirigida pelo **nome da chave** via regex
  simples (`/cnpj/`, `/cep/`, `/capital/i`), não por uma lista fixa de
  campos conhecidos — é assim que a formatação sobrevive a campos novos.

## Preview em Artifact

Para testar a interface dentro de um artifact do Claude (sem precisar rodar
`npm run dev`), existe uma réplica standalone em HTML/CSS/JS vanilla (sem
build, sem React) que reproduz a mesma lógica de `src/App.jsx`. Ela existe
porque o CSP de artifacts bloqueia fetch para domínios externos como
`publica.cnpj.ws`, então essa réplica inclui um botão de "carregar dado de
exemplo" só para demonstração visual — isso é exclusivo do artifact de
preview e não deve ser copiado de volta para `src/App.jsx`.

## O que evitar

- Não adicionar backend, autenticação ou variáveis de ambiente sem que o
  usuário peça — o projeto é propositalmente client-only.
- Não trocar a API pública por outra sem confirmar — `publica.cnpj.ws` é a
  fonte de dados definida no PRD.
- Não adicionar abstrações (roteamento, gerenciador de estado, componentiza-
  ção excessiva) para um projeto de uma única tela.
