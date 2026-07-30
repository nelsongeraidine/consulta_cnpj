# PRD — Consulta de CNPJ

Data de Atualização: 30-07-2026_Versão 1.00

## Problema

Consultar dados cadastrais de uma empresa na Receita Federal normalmente
exige abrir o site oficial, digitar o CNPJ formatado manualmente, e ler um
resultado com layout fixo que nem sempre mostra todos os campos disponíveis
(sócios, inscrições estaduais, atividades secundárias etc.). Este projeto
resolve isso com uma interface única, rápida, que mostra tudo que a API
retorna — inclusive campos que a API venha a adicionar no futuro — sem
exigir nenhum cadastro ou chave de API.

## Objetivo

Uma SPA (single page) onde o usuário digita um CNPJ e recebe, na mesma tela:

1. Um resumo curado dos dados mais úteis (razão social, situação cadastral,
   CNAE, endereço, contato).
2. Todos os demais campos retornados pela API, organizados automaticamente
   — sem que o time precise atualizar o código toda vez que a API adicionar
   um campo novo.

## Usuário-alvo

Qualquer pessoa que precise checar rapidamente a situação de uma empresa
(razão social, se está ativa, endereço, sócios) a partir do CNPJ — uso
pessoal ou interno, sem necessidade de histórico, login ou múltiplos
usuários.

## Escopo

### Dentro do escopo (v1 — implementado)

- Campo de CNPJ com máscara automática (`00.000.000/0000-00`) enquanto o
  usuário digita.
- Botão "Consultar" habilitado só com os 14 dígitos completos; também
  dispara com Enter.
- Busca em `GET https://publica.cnpj.ws/cnpj/{cnpj}` (API pública, sem
  autenticação, sem chave, sem backend próprio).
- Estados de UI: carregando (skeleton), erro (com mensagens específicas para
  429/limite de taxa, 404/não encontrado, outros erros HTTP e falha de
  rede), vazio (antes da primeira busca), e resultado.
- Card de resumo com: CNPJ, razão social, nome fantasia, situação cadastral
  (com destaque visual se ativa/inativa), CNAE principal, cidade/UF,
  endereço, CEP, telefone, e-mail, quantidade de inscrições estaduais.
- Formatação automática por tipo/nome de campo, aplicada a qualquer campo
  presente no JSON (não só aos do resumo):
  - Qualquer campo com "cnpj" no nome e 14 dígitos → `00.000.000/0000-00`.
  - Qualquer campo com "cep" no nome e 8 dígitos → `00000-000`.
  - Qualquer campo com "capital" no nome → moeda BRL.
  - Strings em formato de data ISO (`AAAA-MM-DD...`) → `DD/MM/AAAA`.
  - Booleanos → "Sim"/"Não" com badge colorido.
  - Valores nulos/vazios → "—".
- Renderização recursiva de qualquer estrutura: objetos aninhados,
  arrays de valores simples (chips), arrays de objetos (cards numerados,
  ex. "Sócios #1", "Sócios #2").
- Contador "X / Y campos preenchidos" (conta todos os campos folha do JSON
  retornado, recursivamente).
- Botão "Copiar JSON" (copia o JSON completo formatado para a área de
  transferência).
- Botão "Ver JSON bruto" (mostra/esconde o JSON completo em `<pre>`).
- Botão de alternância de tema (canto superior direito): troca entre a
  paleta atual (violeta/lavanda, baseada em `DESIGN.md`) e a paleta clássica
  (slate + teal, usada antes do redesign). A escolha persiste em
  `localStorage`. Ambas são temas escuros — a troca é só de paleta de cor,
  não estrutura, tipografia ou espaçamento.

### Fora do escopo (por decisão, não por esquecimento)

- Sem histórico de buscas, favoritos, ou persistência entre sessões (a
  única exceção é a escolha de tema, que persiste em `localStorage`).
- Sem autenticação, contas de usuário, ou multi-tenant.
- Sem backend/proxy próprio — o front-end chama a API pública diretamente.
- Sem modo claro — as duas paletas disponíveis são escuras; a interface
  nunca usa fundo claro, como identidade visual fixa.
- Sem internacionalização — textos e formatos (moeda, data) são pt-BR.
- Sem testes automatizados definidos ainda (ver "Próximos passos").

## Requisitos não-funcionais

- **Zero configuração** para rodar: `npm install && npm run dev`, sem
  `.env`, sem chaves.
- **Resiliente a mudanças de shape da API**: se `publica.cnpj.ws` adicionar
  um campo novo amanhã, ele deve aparecer automaticamente na seção "Todos os
  dados retornados" sem precisar de deploy — só entra no card de resumo
  curado se alguém decidir adicionar ali explicitamente.
- **Sem dependências de UI pesadas**: ícones são SVG inline, sem lib de
  ícones; sem lib de componentes.

## Limites conhecidos

- A API pública `cnpj.ws` tem limite de taxa (a UI já trata o erro 429 com
  mensagem específica, mas não há retry automático nem fila).
- Chamadas à API não funcionam dentro do preview de Artifact do Claude (CSP
  do sandbox bloqueia fetch para domínios externos) — por isso existe uma
  réplica separada com dado de exemplo só para essa visualização (ver
  `CLAUDE.md`).

## Próximos passos (não implementados, ideias em aberto)

- Testes automatizados (unitários para os helpers de formatação, pelo menos).
- Deploy contínuo via Vercel a partir do repositório Git.
- Eventual cache local (localStorage) do último CNPJ consultado, se o uso
  real mostrar que isso ajuda.
