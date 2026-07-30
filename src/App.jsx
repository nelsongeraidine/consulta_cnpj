import React, { useState, useMemo, useCallback } from "react";

// ───────────────────────── Ícones (SVG próprios, sem lib externa) ─────────────────────────
const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);
const IconCopy = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);
const IconCode = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M8 4L2 12l6 8M16 4l6 8-6 8" />
  </svg>
);
const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const IconAlert = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M12 2L2 20h20L12 2z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);
const IconMoon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
  </svg>
);
const IconFilePdf = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

// ───────────────────────── Helpers de formatação ─────────────────────────
function onlyDigits(s) {
  return (s || "").replace(/\D/g, "");
}

function maskCNPJ(raw) {
  const d = onlyDigits(raw).slice(0, 14);
  let out = d;
  if (d.length > 2) out = d.slice(0, 2) + "." + d.slice(2);
  if (d.length > 5) out = out.slice(0, 6) + "." + out.slice(6);
  if (d.length > 8) out = out.slice(0, 10) + "/" + out.slice(10);
  if (d.length > 12) out = out.slice(0, 15) + "-" + out.slice(15);
  return out;
}

function formatCNPJValue(v) {
  const d = onlyDigits(String(v));
  if (d.length !== 14) return String(v);
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function formatCEP(v) {
  const d = onlyDigits(String(v));
  if (d.length !== 8) return String(v);
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function isISODateString(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}([ T].*)?$/.test(v);
}

function formatDateValue(v) {
  const datePart = v.slice(0, 10);
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return v;
  return `${d}/${m}/${y}`;
}

function isCapitalKey(key) {
  return /capital/i.test(key);
}

function formatCurrencyBRL(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function labelize(key) {
  return String(key)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Formata um valor folha (não-objeto, não-array) de acordo com o nome da chave e o tipo
function formatLeaf(key, value) {
  if (value === null || value === undefined || value === "") {
    return { text: "—", muted: true };
  }
  if (typeof value === "boolean") {
    return { text: value ? "Sim" : "Não", badge: value ? "ok" : "off" };
  }
  if (typeof value === "number" && isCapitalKey(key)) {
    return { text: formatCurrencyBRL(value) };
  }
  if (typeof value === "string") {
    const k = key.toLowerCase();
    if (k.includes("cnpj") && onlyDigits(value).length === 14) {
      return { text: formatCNPJValue(value), mono: true };
    }
    if (k.includes("cep") && onlyDigits(value).length === 8) {
      return { text: formatCEP(value), mono: true };
    }
    if (isCapitalKey(key)) {
      return { text: formatCurrencyBRL(value) };
    }
    if (isISODateString(value)) {
      return { text: formatDateValue(value) };
    }
    return { text: value };
  }
  return { text: String(value) };
}

// Conta campos-folha preenchidos vs total, percorrendo objetos e arrays recursivamente
function countLeaves(node) {
  if (node === null || node === undefined) return { filled: 0, total: 1 };
  if (Array.isArray(node)) {
    return node.reduce(
      (acc, item) => {
        const r = countLeaves(item);
        return { filled: acc.filled + r.filled, total: acc.total + r.total };
      },
      { filled: 0, total: 0 }
    );
  }
  if (typeof node === "object") {
    return Object.values(node).reduce(
      (acc, v) => {
        const r = countLeaves(v);
        return { filled: acc.filled + r.filled, total: acc.total + r.total };
      },
      { filled: 0, total: 0 }
    );
  }
  const filled = node !== "" ? 1 : 0;
  return { filled, total: 1 };
}

// ───────────────────────── Renderizador dinâmico e recursivo ─────────────────────────
function DynamicValue({ k, value, depth = 0 }) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-lavender/35 italic text-sm">Nenhum registro</span>;
    }
    const allPrimitive = value.every((v) => v === null || typeof v !== "object");
    if (allPrimitive) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {value.map((v, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-surface border border-support/20 text-xs font-mono text-violet-light"
            >
              {formatLeaf(k, v).text}
            </span>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-support/15 bg-surface/60 p-3"
          >
            <div className="text-[10px] uppercase tracking-wider text-support/80 font-mono mb-2">
              {labelize(k)} #{i + 1}
            </div>
            <DynamicObject obj={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (value !== null && typeof value === "object") {
    return (
      <div className="rounded-xl border border-support/15 bg-surface/50 p-3">
        <DynamicObject obj={value} depth={depth + 1} />
      </div>
    );
  }

  const f = formatLeaf(k, value);
  if (f.badge) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          f.badge === "ok"
            ? "bg-violet-mid/15 text-violet-light border border-violet-mid/40"
            : "bg-surface text-lavender/45 border border-support/15"
        }`}
      >
        {f.text}
      </span>
    );
  }
  return (
    <span
      className={`text-sm break-words ${f.muted ? "text-lavender/35 italic" : "text-lavender/90"} ${
        f.mono ? "font-mono" : ""
      }`}
    >
      {f.text}
    </span>
  );
}

function DynamicObject({ obj, depth = 0 }) {
  const entries = Object.entries(obj || {});
  if (entries.length === 0) {
    return <span className="text-lavender/35 italic text-sm">Objeto vazio</span>;
  }
  return (
    <dl className="grid gap-x-4 gap-y-2" style={{ gridTemplateColumns: "minmax(140px, auto) 1fr" }}>
      {entries.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="text-xs font-mono text-lavender/55 pt-0.5 self-start">{labelize(k)}</dt>
          <dd className="min-w-0">
            <DynamicValue k={k} value={v} depth={depth} />
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

// ───────────────────────── Card de resumo curado ─────────────────────────
function SummaryField({ label, value, mono }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-lavender/45 font-mono mb-0.5">
        {label}
      </div>
      <div className={`text-sm text-lavender break-words ${mono ? "font-mono" : ""}`}>
        {value || <span className="text-lavender/30 italic">—</span>}
      </div>
    </div>
  );
}

function buildSummary(data) {
  const est = data?.estabelecimento || {};
  const cnpjRaw = est.cnpj || data?.cnpj || data?.cnpj_raiz;
  const cidade = est.cidade?.nome;
  const uf = est.estado?.sigla;
  const ddd1 = est.ddd1;
  const tel1 = est.telefone1;
  const telefone = ddd1 && tel1 ? `(${ddd1}) ${tel1}` : tel1 || null;
  const endereco = [est.tipo_logradouro, est.logradouro, est.numero]
    .filter(Boolean)
    .join(" ");
  const inscricoes = est.inscricoes_estaduais || data?.inscricoes_estaduais || [];
  const situacao = est.situacao_cadastral || data?.situacao_cadastral;

  return {
    cnpj: cnpjRaw ? formatCNPJValue(cnpjRaw) : null,
    razaoSocial: data?.razao_social,
    fantasia: est.nome_fantasia || data?.nome_fantasia,
    situacao,
    cnae: est.atividade_principal?.descricao,
    endereco: endereco || null,
    cidadeUf: cidade && uf ? `${cidade}/${uf}` : cidade || uf || null,
    cep: est.cep ? formatCEP(est.cep) : null,
    telefone,
    email: est.email,
    qtdInscricoes: Array.isArray(inscricoes) ? inscricoes.length : 0,
  };
}

// ───────────────────────── App principal ─────────────────────────
const THEME_KEY = "consulta-cnpj-theme";

export default function App() {
  const [cnpjInput, setCnpjInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "violet";
    return localStorage.getItem(THEME_KEY) === "classic" ? "classic" : "violet";
  });

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "violet" ? "classic" : "violet";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const digits = onlyDigits(cnpjInput);
  const isValidLength = digits.length === 14;

  const stats = useMemo(() => (data ? countLeaves(data) : null), [data]);
  const summary = useMemo(() => (data ? buildSummary(data) : null), [data]);

  const handleInput = (e) => setCnpjInput(maskCNPJ(e.target.value));

  const handleConsultar = useCallback(async () => {
    if (!isValidLength) {
      setError("Informe um CNPJ completo (14 dígitos).");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    setShowRaw(false);
    try {
      const res = await fetch(`https://publica.cnpj.ws/cnpj/${digits}`);
      if (res.status === 429) {
        throw new Error("Limite da API pública atingido (3 consultas por minuto). Aguarde um instante e tente novamente.");
      }
      if (res.status === 404) {
        throw new Error("CNPJ não encontrado na base da Receita Federal.");
      }
      if (!res.ok) {
        throw new Error(`A API retornou um erro (HTTP ${res.status}).`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Não foi possível conectar à API pública. Verifique sua conexão ou tente novamente."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }, [digits, isValidLength]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConsultar();
  };

  const handleCopy = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleClear = () => {
    setCnpjInput("");
    setData(null);
    setError(null);
    setShowRaw(false);
    setCopied(false);
  };

  // Exporta via diálogo de impressão nativo do navegador (o usuário escolhe
  // "Salvar como PDF" ali) — sem biblioteca externa, o CSS @media print em
  // index.css cuida de esconder a UI de busca e ajustar as cores pro papel.
  const handleExportPdf = () => {
    if (!data) return;
    window.print();
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-ink text-lavender font-sans transition-colors duration-300">
      <div className="max-w-4xl xl:max-w-5xl mx-auto px-5 sm:px-10 py-8 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-2 print:hidden">
            <div className="flex items-center gap-2 text-support text-xs font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-support animate-pulse" />
              Receita Federal · Dados Públicos
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-support/15 hover:bg-support/10 text-xs font-medium text-lavender/70 transition shrink-0"
              aria-label={theme === "violet" ? "Mudar para o tema clássico" : "Mudar para o tema atual"}
              title={theme === "violet" ? "Mudar para o tema clássico" : "Mudar para o tema atual"}
            >
              <IconMoon className="w-3.5 h-3.5" />
              {theme === "violet" ? "Clássico" : "Atual"}
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal sm:font-light tracking-tight text-lavender text-balance">
            Consulta de CNPJ
          </h1>
          <p className="text-lavender/70 text-sm mt-1.5">
            Fonte: publica.cnpj.ws — API pública, sem autenticação.
          </p>
        </div>

        {/* Barra de busca */}
        <div className="rounded-2xl border border-support/15 bg-surface p-3 sm:p-4 mb-6 print:hidden">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-lavender/40" />
              <input
                value={cnpjInput}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="00.000.000/0000-00"
                inputMode="numeric"
                className="w-full bg-ink border border-support/25 rounded-full pl-9 pr-3 py-2.5 text-sm font-mono placeholder-lavender/30 focus:outline-none focus:ring-2 focus:ring-violet-mid/40 focus:border-violet-mid/60 transition"
              />
            </div>
            <button
              onClick={handleConsultar}
              disabled={loading || !isValidLength}
              className="btn-cta px-6 py-2.5 rounded-full font-semibold text-sm disabled:bg-surface disabled:text-lavender/30 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-ink/40 border-t-ink rounded-full animate-spin" />
                  Consultando…
                </>
              ) : (
                "Consultar"
              )}
            </button>
            {(cnpjInput || data || error) && (
              <button
                onClick={handleClear}
                title="Limpar busca e resultado"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-ink border border-support/25 hover:bg-support/10 text-sm font-medium text-lavender/70 transition"
              >
                <IconTrash className="w-3.5 h-3.5" />
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 flex items-start gap-2.5">
            <IconAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-24 rounded-2xl bg-surface/70 border border-support/10" />
            <div className="h-40 rounded-2xl bg-surface/70 border border-support/10" />
          </div>
        )}

        {/* Resultado */}
        {data && !loading && (
          <div className="space-y-4 animate-rise-in">
            {/* Card resumo */}
            <div className="rounded-2xl border border-support/15 bg-surface p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-medium text-lavender leading-tight text-balance">
                    {summary.razaoSocial || "Razão social não informada"}
                  </h2>
                  {summary.fantasia && (
                    <p className="text-sm text-lavender/60 mt-0.5">{summary.fantasia}</p>
                  )}
                </div>
                {summary.situacao && (
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      /ativ/i.test(summary.situacao)
                        ? "bg-violet-mid/15 text-violet-light border border-violet-mid/40"
                        : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {summary.situacao}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-support/15">
                <SummaryField label="CNPJ" value={summary.cnpj} mono />
                <SummaryField label="CNAE" value={summary.cnae} />
                <SummaryField label="Cidade/UF" value={summary.cidadeUf} />
                <SummaryField label="Endereço" value={summary.endereco} />
                <SummaryField label="CEP" value={summary.cep} mono />
                <SummaryField label="Telefone" value={summary.telefone} mono />
                <SummaryField label="E-mail" value={summary.email} />
                <SummaryField
                  label="Inscrições estaduais"
                  value={summary.qtdInscricoes > 0 ? `${summary.qtdInscricoes} registro(s)` : null}
                />
              </div>
            </div>

            {/* Barra de ações / contador */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-support/15 bg-surface px-4 py-3 print:hidden">
              <div className="text-xs font-mono text-lavender/60">
                <span className="text-support font-semibold">{stats.filled}</span>
                <span> / {stats.total} campos preenchidos</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-support/15 hover:bg-support/10 text-xs font-medium transition"
                >
                  {copied ? (
                    <IconCheck className="w-3.5 h-3.5 text-support" />
                  ) : (
                    <IconCopy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Copiado!" : "Copiar JSON"}
                </button>
                <button
                  onClick={() => setShowRaw((s) => !s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-support/15 hover:bg-support/10 text-xs font-medium transition"
                >
                  <IconCode className="w-3.5 h-3.5" />
                  {showRaw ? "Ocultar JSON" : "Ver JSON bruto"}
                </button>
                <button
                  onClick={handleExportPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-support/15 hover:bg-support/10 text-xs font-medium transition"
                >
                  <IconFilePdf className="w-3.5 h-3.5" />
                  Exportar PDF
                </button>
              </div>
            </div>

            {/* JSON bruto */}
            {showRaw && (
              <pre className="rounded-2xl border border-support/15 bg-ink p-4 text-xs font-mono text-violet-light overflow-x-auto max-h-96 overflow-y-auto print:hidden">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}

            {/* Seção dinâmica: todos os campos */}
            <div className="rounded-2xl border border-support/15 bg-surface p-6">
              <h3 className="text-xs uppercase tracking-widest text-lavender/45 font-mono mb-4">
                Todos os dados retornados
              </h3>
              <DynamicObject obj={data} />
            </div>
          </div>
        )}

        {/* Estado vazio inicial */}
        {!data && !loading && !error && (
          <div className="text-center py-16 text-lavender/30">
            <IconSearch className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Informe um CNPJ para começar a consulta.</p>
          </div>
        )}
      </div>
    </div>
  );
}
