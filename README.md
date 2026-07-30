# Consulta de CNPJ

Aplicação web para consultar dados públicos de CNPJ direto na base da
Receita Federal, sem cadastro, sem chave de API e sem backend próprio.
Digite o CNPJ, veja um resumo curado (razão social, situação cadastral,
endereço, contato) e explore **todos** os campos retornados pela API numa
seção que se organiza sozinha — inclusive campos novos que a API venha a
adicionar no futuro, sem precisar de deploy.

## Funcionalidades

- Máscara automática de CNPJ (`00.000.000/0000-00`) enquanto digita.
- Card de resumo: razão social, nome fantasia, situação cadastral (com
  destaque visual se ativa/inativa), CNAE, endereço, CEP, telefone, e-mail,
  inscrições estaduais.
- Formatação automática por tipo/nome de campo — CNPJ, CEP, datas, moeda
  (capital social) e booleanos são reconhecidos e formatados sozinhos, em
  qualquer campo do JSON, não só nos do resumo.
- Renderização recursiva de qualquer estrutura: objetos aninhados, listas
  de valores simples, listas de objetos (sócios, inscrições estaduais...).
- Contador de campos preenchidos, botão de copiar o JSON completo e opção
  de ver o JSON bruto.
- Alternância entre duas paletas de tema (persistida no navegador).

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
- Sem backend — consome `https://publica.cnpj.ws/cnpj/{cnpj}`
  ([publica.cnpj.ws](https://publica.cnpj.ws), API pública e gratuita)
  diretamente do navegador

## Documentação do projeto

- [CLAUDE.md](./CLAUDE.md) — arquitetura, convenções e regras de
  desenvolvimento do projeto.
- [PRD.md](./PRD.md) — escopo, requisitos e decisões de produto.
