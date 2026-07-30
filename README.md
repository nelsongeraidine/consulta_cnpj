# Consulta de CNPJ

Aplicação React (Vite + Tailwind CSS) para consultar dados públicos de CNPJ na
Receita Federal via [publica.cnpj.ws](https://publica.cnpj.ws), com formatação
automática dos dados e visualização recursiva de qualquer campo retornado pela
API.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

## Build de produção

```bash
npm run build
npm run preview
```

## Stack

- [Vite](https://vite.dev/) + React 19
- [Tailwind CSS](https://tailwindcss.com/) v3
- Sem backend — consome `https://publica.cnpj.ws/cnpj/{cnpj}` diretamente do navegador

Veja [CLAUDE.md](./CLAUDE.md) para detalhes de arquitetura e [PRD.md](./PRD.md)
para os requisitos do produto.
