# Briefing de Design — Landing Page de Portfólio

**Referência analisada:** https://xperiun.com/
**Público-alvo:** empreendedores, 25–40 anos
**Sensação desejada:** premium e confiável

> Premissa: cores e tipografia abaixo foram extraídas via inspeção computada de estilos (`getComputedStyle`) na página de referência, não estimativa visual. A seção de animação é inferência qualificada a partir do padrão visual observado (vídeo em loop no hero, fade-ins), não medição direta de easing/duration.

---

## 1. Direção Criativa

A referência usa um "dark mode editorial": fundo quase preto com leve tom azulado, tipografia fina (peso 300) que remete a relatório executivo, e um único acento cromático (gradiente violeta-elétrico) que aparece só em pontos de decisão — nunca de forma decorativa.

Para empreendedores 25-40 que buscam premium + confiável, a leitura é "não estou gritando por atenção, estou entregando autoridade": pouco enfeite, muito espaço negativo, cor usada como pontuação e não como fundo.

---

## 2. Paleta

| Cor | HEX | Papel |
|---|---|---|
| Fundo principal | `#00000A` | Quase preto, tom azulado |
| Texto principal | `#F5F5FF` | Branco levemente lavanda (nunca branco puro — mais premium, menos clínico) |
| Texto secundário | `#F5F5FF` a 75% opacidade | Corpo de texto, hierarquia reduzida |
| Destaque (gradiente) | `#4B00FF` → `#6464FF` → `#C8C8FF` | CTA principal, hover, elementos de decisão |
| Apoio | `#9696FF` | Links secundários, ícones, bordas ativas |
| Fundo alternado *(sugestão adicional)* | `#12121C` | Fundo de cards/seções alternadas — cria profundidade entre seções sem quebrar o mood (não está na referência original) |

---

## 3. Tipografia

- **Título:** Poppins, peso 300 (Light) — escolha real do site de referência. Peso leve em títulos grandes sinaliza "confiança calma" em vez de "venda agressiva" (fontes bold gritam startup/promoção; light sugere que a marca não precisa se impor).
- **Corpo:** Poppins, peso 400 — mesma família, variação só de peso. Evita o clichê de misturar geométrica + serifada; a decisão de design está na variação de peso e tamanho, não na quantidade de fontes.

**Ressalva:** Poppins é uma fonte muito comum (usada por metade dos SaaS brasileiros) — funciona, mas não é diferenciadora. Se "premium" pesar mais que "familiar", considerar **General Sans** ou **Söhne** no título, mantendo a mesma lógica de peso leve.

---

## 4. Ritmo e Espaçamento

Respirado. Padding de seção observado em ~64px topo / 40px lateral e base. Botões com padding 12px/24px e border-radius de 1920px (pill total). A sensação é "cada elemento tem sala pra respirar" — pressa e aperto visual comunicam ansiedade; espaço comunica controle.

---

## 5. Estrutura de Seções

1. **Hero** — headline + vídeo/imagem de fundo sutil + CTA + prova social rápida em texto pequeno
2. **Problema/Diferencial** — contraste "abordagem comum vs. sua abordagem"
3. **Método/Princípios** — blocos numerados 01–04, um por diferencial seu
4. **Portfólio/Cases** — projetos organizados por categoria/competência
5. **Prova social** — depoimentos (vídeo se houver, texto caso contrário)
6. **Logos de quem confiou** — clientes/empresas
7. **Oferta principal** — o que você vende, com preço/CTA central
8. **Oferta de entrada** *(se houver)* — algo menor, "porta de entrada"
9. **FAQ**
10. **CTA final de fechamento**

---

## 6. Direção de Animação

Sutil, não marcante:
- Fade-in + leve translate-y (8–16px) nos blocos ao entrar no viewport, sem bounce ou easing exagerado
- Hover em CTA desliza a posição do gradiente (não pisca)
- Vídeo de fundo no hero em loop mudo, baixo contraste, quase textura
- Sem parallax agressivo ou scroll-jacking (contradiria o "confiável")
- Único ponto de "assinatura": micro-interação no gradiente do CTA principal ao hover; resto praticamente estático

---

## 7. Tratamento de Imagem/Foto

Decorrente da paleta escura com acento violeta: fotos "cruas" (sem tratamento) vão quebrar o mood assim que aparecerem, porque a maioria das fotos de perfil/projeto tem fundo claro e cores neutras.

Recomendação técnica:
- **Overlay:** gradiente sutil de `#00000A` a 20-30% de opacidade sobre qualquer foto, pra integrar ao fundo escuro
- **Tratamento de cor:** dessaturação leve (~15-20%) ou duotone usando `#00000A` (sombras) e `#9696FF` (realces), em vez de foto colorida padrão
- **Evitar:** fotos com fundo branco puro sem tratamento — isso cria um "buraco" de luz que quebra a hierarquia visual respirada da seção 4

---

## 8. Contraste e Acessibilidade (validado)

Calculei a razão de contraste (WCAG) dos pares de cor da paleta:

| Par | Contraste | Resultado |
|---|---|---|
| Texto principal `#F5F5FF` sobre fundo `#00000A` | 19,3:1 | Aprovado (AAA) |
| Texto secundário `#F5F5FF` a 75% sobre fundo `#00000A` | ~10,6:1 | Aprovado (AAA) |
| Apoio `#9696FF` sobre fundo `#00000A` | ~8,1:1 | Aprovado (AAA) |
| Texto do CTA `#00000A` sobre a ponta clara do gradiente `#C8C8FF` | ~13,1:1 | Aprovado (AAA) |
| Texto do CTA `#00000A` sobre a ponta escura do gradiente `#4B00FF` | **~2,7:1** | **Reprovado** (mínimo exigido: 3:1 para texto grande, 4,5:1 para texto normal) |

**Achado real:** se o texto do botão ficar posicionado sobre a extremidade escura do gradiente (`#4B00FF`), a legibilidade falha no padrão WCAG AA. Duas soluções possíveis: (a) inverter a direção do gradiente pra garantir que o texto sempre recaia sobre a metade clara, ou (b) trocar a cor do texto do botão pra `#F5F5FF` nessa metade — o que exigiria um gradiente de texto acompanhando o de fundo, tecnicamente mais complexo. A opção (a) é mais simples e resolve sem custo de desenvolvimento adicional.

---

## 9. Responsivo / Breakpoints

Não medido na referência (site não foi testado em mobile durante a análise); recomendação baseada nos valores já definidos na seção 4:

- **Desktop (>1024px):** espaçamento conforme seção 4 (64px topo / 40px lateral)
- **Tablet (768–1024px):** reduzir para ~48px topo / 32px lateral
- **Mobile (<768px):** reduzir para ~32px topo / 20px lateral; espaçamento "respirado" em desktop pode virar scroll excessivo em mobile se não for escalado
- **Tipografia:** títulos com peso 300 tendem a ficar finos demais em telas pequenas — considerar subir o peso pra 400 abaixo de 768px, mantendo a hierarquia sem perder legibilidade
- **Botão CTA:** manter padding proporcional (não reduzir abaixo de ~10px/20px, sob risco de área de toque insuficiente em mobile)

