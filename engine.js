/* Hachi translation engine: pure JS, no network. Phrase lookup -> sentence patterns -> fuzzy match -> word-by-word. */
const Engine = (() => {
  const AR = /[؀-ۿ]/;
  const hasArabic = s => AR.test(s || "");
  const AR_DIG = "٠١٢٣٤٥٦٧٨٩";
  const toArDigits = s => s.replace(/[0-9]/g, d => AR_DIG[+d]);

  /* ---------- normalisers ---------- */
  function normEn(s) {
    s = String(s).toLowerCase().replace(/[’‘`´]/g, "'");
    s = s.replace(/\bdont\b/g, "do not").replace(/\bdoesnt\b/g, "does not").replace(/\bcant\b/g, "can not").replace(/\bwont\b/g, "will not")
      .replace(/\bisnt\b/g, "is not").replace(/\bim\b/g, "i am").replace(/\bive\b/g, "i have").replace(/\byoure\b/g, "you are")
      .replace(/\b(what|where|who|how|that|there)s\b/g, "$1 is").replace(/\bu\b/g, "you").replace(/\b(pls|plz)\b/g, "please")
      .replace(/\bthanks\b/g, "thank you").replace(/\bwanna\b/g, "want to").replace(/\bthank you so much\b/g, "thank you very much");
    s = s.replace(/\bwon't\b/g, "will not").replace(/\bcan't\b/g, "can not").replace(/\bcannot\b/g, "can not")
      .replace(/n't\b/g, " not").replace(/\bi'm\b/g, "i am").replace(/\b(you|we|they)'re\b/g, "$1 are")
      .replace(/\b(he|she|it|that|there|what|who|where|here|how)'s\b/g, "$1 is").replace(/\blet's\b/g, "let us")
      .replace(/\bi'll\b/g, "i will").replace(/\bi've\b/g, "i have").replace(/\bi'd\b/g, "i would")
      .replace(/\b(you|we|they)'ll\b/g, "$1 will").replace(/'/g, "");
    return s.replace(/[^a-z0-9*\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  function normAr(s) {
    return String(s).replace(/[ً-ٰٟـ]/g, "")
      .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
      .replace(/گ/g, "ك").replace(/چ/g, "ج").replace(/پ/g, "ب").replace(/ڤ/g, "ف").replace(/ق/g, "ك")
      .replace(/[٠-٩]/g, d => AR_DIG.indexOf(d))
      .replace(/[؟?!.,،؛;:"'()«»\-_]/g, " ").replace(/\s+/g, " ").trim();
  }
  function normTr(s) {
    s = String(s).toLowerCase().replace(/[’‘`´']/g, "");
    s = s.replace(/\b(il|in|is|it|ij|ish|ir|iz|id|ith)[-\s]/g, "");
    s = s.replace(/[^a-z0-9*\s]/g, " ").replace(/\s+/g, " ").trim();
    return s.split(" ").map(t => {
      if (/^\d+$/.test(t)) return t;
      t = t.replace(/kh/g, "x").replace(/sh/g, "S").replace(/gh/g, "G").replace(/ch/g, "C").replace(/th/g, "T").replace(/dh/g, "D")
        .replace(/3/g, "E").replace(/7/g, "H").replace(/5/g, "x").replace(/2/g, "").replace(/9/g, "s").replace(/6/g, "t").replace(/8/g, "G")
        .replace(/q/g, "g").replace(/y/g, "i").replace(/w/g, "u").replace(/e/g, "i").replace(/o/g, "u");
      return t.replace(/(.)\1+/g, "$1");
    }).filter(Boolean).join(" ");
  }
  const skel = s => s.replace(/[aiu]/g, "");

  /* ---------- database ---------- */
  let DB = null;
  const clean = s => s.replace(/\s*\([^)]*\)/g, "").trim();

  function mk(kind, cat, en, ar, tr) {
    let verb = false;
    if (en.startsWith("v:")) { verb = true; en = en.slice(2); }
    return { kind, cat, verb, en: en.split("/"), ar: ar.split("/"), tr: (tr || "").split("/") };
  }
  const lines = t => t.split("\n").map(l => l.trim()).filter(Boolean);

  function build(custom) {
    const ents = [];
    (custom || []).forEach(c => ents.push({ kind: "c", cat: "mine", verb: false, en: [c.en], ar: [c.ar], tr: [c.tr || ""], id: c.id }));
    const EP = typeof EXTRA_PHRASES !== "undefined" ? EXTRA_PHRASES : "", EW = typeof EXTRA_WORDS !== "undefined" ? EXTRA_WORDS : "";
    lines(PHRASES + "\n" + EP).forEach(l => { const [c, e, a, t] = l.split("|"); ents.push(mk("p", c, e, a, t)); });
    lines(WORDS + "\n" + EW).forEach(l => { const [e, a, t] = l.split("|"); ents.push(mk("w", "", e, a, t)); });
    const idx = { en: new Map(), ar: new Map(), trL: new Map(), trS: new Map() };
    const add = (m, k, e) => { if (!k) return; let a = m.get(k); if (!a) m.set(k, a = []); if (!a.includes(e)) a.push(e); };
    const fz = { en: [], ar: [], tr: [] };
    ents.forEach((e, i) => {
      e.id = e.id || "e" + i;
      e.en.forEach(v => { const k = normEn(v); add(idx.en, k, e); if (e.kind !== "w") fz.en.push([k, e]); });
      e.ar.forEach(v => { const k = normAr(v); add(idx.ar, k, e); if (e.kind !== "w") fz.ar.push([k, e]); });
      e.tr.forEach(v => { const k = normTr(v); if (!k) return; add(idx.trL, k, e); const s = skel(k); if (s.replace(/\s/g, "").length >= 3) add(idx.trS, s, e); if (e.kind !== "w") fz.tr.push([k, e]); });
    });
    const pats = lines(PATTERNS).map(l => {
      let [en, ar, tr] = l.split("|");
      const enOnly = en.startsWith(">"); if (enOnly) en = en.slice(1);
      const p = { enOnly, en, ar, tr, q: /[؟?]\s*$/.test(ar) };
      const rx = s => new RegExp("^" + s.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "(.+)") + "$");
      p.kEn = normEn(en); p.kAr = normAr(ar); p.kTr = normTr(tr);
      p.rEn = rx(p.kEn); p.rAr = rx(p.kAr); p.rTr = rx(p.kTr);
      p.fix = { en: p.kEn.length, ar: p.kAr.length, tr: p.kTr.length };
      return p;
    });
    const replies = new Map();
    lines(REPLIES).forEach(l => {
      const [q, rs] = l.split("=>");
      const qe = (idx.en.get(normEn(q)) || [])[0];
      if (!qe) return;
      const list = rs.split(";").map(r => (idx.en.get(normEn(r)) || [])[0]).filter(Boolean);
      if (list.length) replies.set(qe.id, list);
    });
    DB = { ents, idx, fz, pats, replies };
    buildVerbs(); buildRev();
    return DB;
  }

  /* ---------- helpers ---------- */
  function lookup(key, mode) {
    const I = DB.idx;
    if (mode === "en") return I.en.get(key);
    if (mode === "ar") return I.ar.get(key);
    let r = I.trL.get(key);
    if (r) return r;
    const s = skel(key);
    return s.replace(/\s/g, "").length >= 3 ? I.trS.get(s) : undefined;
  }
  const normFor = (s, mode) => mode === "en" ? normEn(s) : mode === "ar" ? normAr(s) : normTr(s);
  const tokensOf = k => k.split(" ").filter(Boolean);
  const DROP = new Set(["a", "an", "is", "are", "am", "to", "of", "do", "does", "be"]);

  function mkPart(ents, src, dir) {
    const e = ents[0];
    const p = { src, known: true, entry: e, verb: e.verb };
    if (dir === "en2ar") { p.out = e.ar[0]; p.tr = e.tr[0] || ""; p.alts = ents.slice(1).map(x => x.ar[0]); }
    else { p.out = clean(e.en[0]); p.tr = ""; p.alts = ents.slice(1).map(x => clean(x.en[0])); }
    return p;
  }

  function translit(t) {
    const map = { b: "ب", c: "ك", d: "د", f: "ف", g: "گ", h: "ه", j: "ج", k: "ك", l: "ل", m: "م", n: "ن", p: "ب", q: "ق", r: "ر", s: "س", t: "ت", v: "ف", w: "و", x: "كس", z: "ز" };
    const di = { sh: "ش", ch: "چ", th: "ث", kh: "خ", gh: "غ", ph: "ف", ck: "ك", oo: "و", ou: "و", ee: "ي", ea: "ي", ie: "ي", ai: "اي", ay: "اي", ei: "اي", aa: "ا", ll: "ل", ss: "س", tt: "ت", nn: "ن", mm: "م", rr: "ر", dd: "د" };
    const V = "aeiouy"; let out = "", i = 0;
    while (i < t.length) {
      const two = t.slice(i, i + 2);
      if (di[two]) { out += di[two]; i += 2; continue; }
      const c = t[i], prev = t[i - 1], next = t[i + 1];
      if (i === 0 && V.includes(c)) { out += c === "y" ? "ي" : "ا"; i++; continue; }
      if (c === "a") out += "ا";
      else if (c === "e") { if (next !== undefined) out += "ي"; }
      else if (c === "i" || c === "y") out += "ي";
      else if (c === "o" || c === "u") out += "و";
      else if (c === "h") { if (!(prev && V.includes(prev) && (next === undefined || !V.includes(next)))) out += "ه"; }
      else if (c === "c" && next && "eiy".includes(next)) out += "س";
      else if (c === "g" && next && "eiy".includes(next)) out += "ج";
      else out += map[c] || c;
      i++;
    }
    return out;
  }

  /* translate a run of normalised tokens word by word */
  function chunk(tokens, mode, dir, caps) {
    const parts = []; let i = 0, the = false;
    while (i < tokens.length) {
      let found = null, len = 0;
      const pv = parts[parts.length - 1], afterPron = mode === "ar" && pv && pv.entry && PRON_EN.has(pv.entry.en[0]) && REV.has(tokens[i]);
      for (let n = afterPron ? 1 : Math.min(6, tokens.length - i); n >= 1; n--) {
        let ents = lookup(tokens.slice(i, i + n).join(" "), mode);
        if (ents && n === 1 && ents.length > 1) ents = ents.slice().sort((a, b) => (a.kind === "p") - (b.kind === "p"));
        if (ents) { found = ents; len = n; break; }
      }
      if (found) {
        const p = mkPart(found, tokens.slice(i, i + len).join(" "), dir);
        if (the) { p.the = true; the = false; }
        parts.push(p); i += len; continue;
      }
      const t = tokens[i];
      if (/^\d+$/.test(t)) { parts.push({ src: t, out: dir === "en2ar" ? toArDigits(t) : t, tr: t, known: true, num: true }); i++; continue; }
      if (mode === "en") {
        if (t === "the") { the = true; i++; continue; }
        if (t === "at" && /^\d+$/.test(tokens[i + 1] || "")) { parts.push({ src: t, out: "الساعة", tr: "is-saa3a", known: true }); i++; continue; }
        if (caps && caps.has(t) && /^[a-z]{2,}$/.test(t)) { parts.push({ src: t, out: translit(t), tr: t[0].toUpperCase() + t.slice(1), known: true, name: true }); i++; continue; }
        if (DROP.has(t)) { i++; continue; }
        let base = null;
        if (/ies$/.test(t) && lookup(t.slice(0, -3) + "y", "en")) base = t.slice(0, -3) + "y";
        else if (/es$/.test(t) && lookup(t.slice(0, -2), "en")) base = t.slice(0, -2);
        else if (/s$/.test(t) && lookup(t.slice(0, -1), "en")) base = t.slice(0, -1);
        if (base) { const p = mkPart(lookup(base, "en"), t, dir); p.plural = true; if (the) { p.the = true; the = false; } parts.push(p); i++; continue; }
      } else {
        if (mode === "ar") {
          if (t.length > 3 && t.startsWith("ال") && lookup(t.slice(2), "ar")) { const p = mkPart(lookup(t.slice(2), "ar"), t, dir); p.the = true; parts.push(p); i++; continue; }
          if (t.length > 3 && t.startsWith("و") && lookup(t.slice(1), "ar")) {
            parts.push({ src: "و", out: "and", tr: "", known: true, conj: true });
            parts.push(mkPart(lookup(t.slice(1), "ar"), t.slice(1), dir)); i++; continue;
          }
          if (t.length > 4 && t.startsWith("لل") && lookup(t.slice(2), "ar")) {
            const b = mkPart(lookup(t.slice(2), "ar"), t, dir); b.the = true; b.out = "to " + b.out; b.the = false; b.out = "to the " + clean(lookup(t.slice(2), "ar")[0].en[0]); parts.push(b); i++; continue;
          }
          if (t.length > 3 && t.startsWith("ل") && lookup(t.slice(1), "ar")) {
            const b = mkPart(lookup(t.slice(1), "ar"), t, dir); b.out = "to " + b.out; parts.push(b); i++; continue;
          }
          const rv = REV.get(t), nrv = t === "دا" ? REV.get(tokens[i + 1]) : null, prev = parts[parts.length - 1];
          const choose = list => { const pp = prev && prev.entry && PRON_EN.has(prev.entry.en[0]) ? PERSON[prev.entry.en[0]] : null; return (pp && list.find(x => x.person === pp || (pp === "2m" && x.person === "2f"))) || list[0]; };
          if (nrv) { parts.push(verbPart(t + " " + tokens[i + 1], choose(nrv.filter(x => x.tense === "pres")) || nrv[0], prev, true)); i += 2; continue; }
          if (rv) { parts.push(verbPart(t, choose(rv), prev, false)); i++; continue; }
          const suf = { "ي": "my", "ك": "your", "ه": "his" }[t.slice(-1)];
          if (suf && t.length > 3 && lookup(t.slice(0, -1), "ar")) { const p = mkPart(lookup(t.slice(0, -1), "ar"), t, dir); p.out = suf + " " + p.out; parts.push(p); i++; continue; }
        }
      }
      parts.push({ src: t, out: t, tr: t, known: false });
      i++;
    }
    return parts;
  }

  const PRON = new Set(["i", "you", "he", "she", "we", "they", "you all"]);
  const isModal = p => p.entry && /^(can|will|must)/.test(p.entry.en[0]);
  const isNeg = p => p.entry && /^(do not|not|can not)/.test(p.entry.en[0]);
  const isPron = p => p.entry && PRON.has(p.entry.en[0]);
  const ADJ = new Set("new old big small large good bad cheap expensive hot cold beautiful pretty clean dirty fast slow easy difficult hard tall short happy sad busy tired sick ready full empty red blue green yellow white black brown grey gray pink".split(" "));
  const NOFEM = new Set(["red", "blue", "green", "yellow", "white", "black", "brown", "grey", "gray", "pink", "happy", "sad", "busy", "tired", "sick", "ready", "full", "empty"]);
  function adjOrder(parts) {
    const a = parts.slice();
    for (let i = 0; i < a.length - 1; i++) {
      const p = a[i], n = a[i + 1];
      if (p.known && n.known && p.entry && n.entry && ADJ.has(p.src) && !ADJ.has(n.src) && n.entry.kind === "w" && !n.verb && !n.num && !/^(i|you|he|she|we|they|this|that|here|there)$/.test(n.src)) {
        let adj = Object.assign({}, p), noun = Object.assign({}, n);
        if (/ة$/.test(noun.out) && !NOFEM.has(p.src)) adj.out = /ي$/.test(adj.out) ? adj.out + "ة" : adj.out + "ة";
        if (n.the || p.the) { noun.the = true; if (!adj.out.startsWith("ال")) adj.out = "ال" + adj.out; adj.the = false; }
        a[i] = noun; a[i + 1] = adj; i++;
      }
    }
    return a;
  }
  function joinParts(parts, dir) {
    if (dir === "en2ar") parts = adjOrder(parts);
    if (dir === "ar2en") {
      const outs = parts.map(p => (p.the && !p.num ? "the " : "") + p.out);
      parts.forEach((p, i) => {
        if (!(p.verb || isModal(p))) return;
        const prev = parts[i - 1];
        if (prev && (prev.verb || isModal(prev))) { if (prev.verb && p.verb) outs[i] = "to " + outs[i]; }
        else if (!prev || !(isPron(prev) || isNeg(prev))) outs[i] = "I " + outs[i];
      });
      return { out: outs.join(" "), tr: "" };
    }
    const outs = [], trs = [];
    parts.forEach(p => {
      let o = p.out, t = p.tr || "";
      if (p.the && !p.num) {
        if (dir === "en2ar") { if (!o.startsWith("ال")) o = "ال" + o; t = t ? "il-" + t : t; }
        else o = "the " + o;
      }
      outs.push(o); trs.push(t);
    });
    return { out: outs.join(" "), tr: trs.join(" ").replace(/\s+/g, " ").trim() };
  }

  function polish(s, dir, q) {
    if (dir === "ar2en") {
      s = s.replace(/\bi\b/g, "I").replace(/\s+/g, " ").trim();
      if (s) s = s[0].toUpperCase() + s.slice(1);
      if (q && !/[?]$/.test(s)) s += "?";
    } else if (q && !/[؟?]$/.test(s)) s += "؟";
    return s;
  }

  /* fuzzy phrase match via character bigram dice */
  function bigrams(s) { const m = new Map(); for (let i = 0; i < s.length - 1; i++) { const b = s.slice(i, i + 2); m.set(b, (m.get(b) || 0) + 1); } return m; }
  function dice(a, b) {
    if (a === b) return 1; if (a.length < 2 || b.length < 2) return 0;
    const A = bigrams(a), B = bigrams(b); let inter = 0;
    A.forEach((c, k) => { if (B.has(k)) inter += Math.min(c, B.get(k)); });
    return (2 * inter) / (a.length + b.length - 2);
  }
  function similar(key, mode, limit) {
    const res = new Map();
    DB.fz[mode].forEach(([k, e]) => {
      const s = dice(key, k);
      if (s > (res.get(e)?.sim || 0)) res.set(e, { entry: e, sim: s, key: k });
    });
    return [...res.values()].filter(r => r.sim >= 0.55).sort((a, b) => b.sim - a.sim).slice(0, limit || 3);
  }

  /* ---------- verbs and simple clause grammar (English -> Iraqi) ---------- */
  let VB = {}, VFORM = new Map();
  const IRR = { went: "go", gone: "go", came: "come", saw: "see", seen: "see", said: "say", slept: "sleep", bought: "buy", gave: "give", given: "give", did: "do", done: "do", made: "do", sold: "sell", took: "take", taken: "take", ate: "eat", eaten: "eat", drank: "drink", drunk: "drink", found: "find", forgot: "forget", left: "leave", sat: "sit", wrote: "write", written: "write", paid: "pay", knew: "know", known: "know", understood: "understand", spoke: "speak", thought: "think", sent: "send", brought: "bring", heard: "hear", met: "meet", began: "start" };
  const ALIAS = { talk: "speak", make: "do", begin: "start", reserve: "book", purchase: "buy", depart: "leave" };
  function buildVerbs() {
    VB = {}; VFORM = new Map();
    lines(typeof VERBS !== "undefined" ? VERBS : "").forEach(l => {
      const [lem, p1, past] = l.split("|"); let pf = null;
      if (past) { const a = past.split(","); pf = a.length === 5 ? a : [past + "ت", past, past + "ت", past + "نا", past + "وا"]; }
      VB[lem] = { p1, past: pf };
    });
    const add = (w, lemma, form) => { if (!VFORM.has(w)) VFORM.set(w, { lemma, form }); };
    const bases = Object.keys(VB).map(l => [l, l]).concat(Object.entries(ALIAS).filter(([, l]) => VB[l]).map(([a, l]) => [a, l]));
    bases.forEach(([b, l]) => {
      const cons = !/[aeiou]$/.test(b) ? b + b[b.length - 1] : b;
      add(b, l, "base");
      add(/(s|sh|ch|x|o)$/.test(b) ? b + "es" : /[^aeiou]y$/.test(b) ? b.slice(0, -1) + "ies" : b + "s", l, "s");
      [b + "ing", b.replace(/e$/, "") + "ing", cons + "ing"].forEach(w => add(w, l, "ing"));
      [b + "ed", b + "d", b.replace(/y$/, "i") + "ed", cons + "ed"].forEach(w => add(w, l, "ed"));
    });
    Object.entries(IRR).forEach(([w, l]) => { if (VB[l]) { VFORM.delete(w); VFORM.set(w, { lemma: l, form: "ed" }); } });
  }
  let REV = new Map();
  const PRON_EN = new Set(["i", "you", "he", "she", "we", "they"]);
  const PEN = { "1": "I", "2m": "you", "2f": "you", "3m": "he", "3f": "she", "1p": "we", "3p": "they" };
  function enForm(l, form) {
    if (form === "ed") { for (const w in IRR) if (IRR[w] === l && !/^(gone|seen|given|done|taken|eaten|drunk|written|known)$/.test(w)) return w; return /e$/.test(l) ? l + "d" : /[^aeiou]y$/.test(l) ? l.slice(0, -1) + "ied" : l === "stop" ? "stopped" : l + "ed"; }
    if (form === "ing") return /[^e]e$/.test(l) ? l.slice(0, -1) + "ing" : l === "stop" ? "stopping" : l === "sit" ? "sitting" : l + "ing";
    if (form === "s") return l === "go" ? "goes" : l === "do" ? "does" : /(s|sh|ch|x|o)$/.test(l) ? l + "es" : /[^aeiou]y$/.test(l) ? l.slice(0, -1) + "ies" : l + "s";
    return l;
  }
  function buildRev() {
    REV = new Map();
    const P = ["1", "2m", "2f", "3m", "3f", "1p", "3p"], put = (f, o) => { const k = normAr(f); if (!REV.has(k)) REV.set(k, []); REV.get(k).push(o); };
    Object.entries(VB).forEach(([l, v]) => {
      P.forEach(p => put(presForm(v.p1, p), { lemma: l, person: p, tense: "pres" }));
      if (v.past) P.forEach(p => put(pastForm(v, p), { lemma: l, person: p, tense: "past" }));
    });
  }
  function verbPart(src, pick, prev, prog) {
    const pp = prev && prev.entry && PRON_EN.has(prev.entry.en[0]);
    const neg = prev && prev.entry && prev.entry.en[0] === "do not", third = pick.person[0] === "3" && pick.person !== "3p";
    let v;
    if (prog) v = ({ "1": "am", "3m": "is", "3f": "is" }[pick.person] || "are") + " " + enForm(pick.lemma, "ing");
    else if (neg) { prev.out = pick.tense === "past" ? "did not" : third ? "does not" : "do not"; v = pick.lemma; }
    else v = pick.tense === "past" ? enForm(pick.lemma, "ed") : enForm(pick.lemma, third ? "s" : "base");
    return { src, out: (pp || neg ? "" : PEN[pick.person] + " ") + v, tr: "", known: true };
  }
  const PERSON = { i: "1", you: "2m", he: "3m", she: "3f", it: "3m", we: "1p", they: "3p" };
  const PRON_AR = { i: "آني", you: "إنت", he: "هو", she: "هي", we: "احنا", they: "هم" };
  function presForm(p1, person) {
    if (person === "1") return p1;
    const lead = p1[0] === "آ" ? "ا" : "", stem = p1.slice(1);
    const pre = { "2m": "ت", "2f": "ت", "3m": "ي", "3f": "ت", "1p": "ن", "3p": "ي" }[person];
    let b = pre + lead + stem;
    if (person === "2f" || person === "3p") {
      const suf = person === "2f" ? "ين" : "ون", last = b.slice(-1);
      b = "يىا".includes(last) ? b.slice(0, -1) + suf : b + suf;
    }
    return b;
  }
  function pastForm(v, person) {
    const k = { "1": 0, "2m": 0, "2f": 0, "3m": 1, "3f": 2, "1p": 3, "3p": 4 }[person];
    if (v.past) return v.past[k];
    return { "1": "كنت", "2m": "كنت", "2f": "كنتِ", "3m": "كان", "3f": "كانت", "1p": "كنا", "3p": "كانوا" }[person] + " " + presForm(v.p1, person);
  }
  const canForm = person => presForm("اگدر", person);
  const MOTION = new Set(["go", "come", "return", "walk", "travel", "arrive"]);
  function clause(tokens, caps) {
    let i = 0, q = false, subj = null, aux = null, neg = false;
    const A = { do: "do", does: "do", did: "did", will: "will", can: "can", could: "can", are: "be", is: "be", am: "be" };
    if (A[tokens[0]] && PERSON[tokens[1]]) { q = true; aux = A[tokens[0]]; subj = tokens[1]; i = 2; }
    else if (PERSON[tokens[0]]) {
      subj = tokens[0]; i = 1; const t = tokens[i];
      if (A[t] && t !== "could") { aux = A[t]; i++; }
      else if (t === "could") { aux = "can"; i++; }
      else if (t === "going" && tokens[i + 1] === "to" && VFORM.get(tokens[i + 2])) { aux = "will"; i += 2; }
      else if ((t === "have" || t === "has") && tokens[i + 1] === "to") { aux = "must"; i += 2; }
      else if (t === "must") { aux = "must"; i++; }
    } else return null;
    if (tokens[i] === "not") { neg = true; i++; }
    if (/^(have|has|had)$/.test(tokens[i]) && tokens[i + 1] !== "to" && !aux) {
      const past = tokens[i] === "had", suf = { "1": "ي", "2m": "ك", "2f": "ج", "3m": "ه", "3f": "ها", "1p": "نا", "3p": "هم" }[PERSON[subj]];
      const rest = tokens.slice(i + 1), parts = rest.length ? chunk(rest, "en", "en2ar", caps) : [];
      const core = (past ? "كان " : "") + (neg ? "ماعند" : "عند") + suf;
      return { out: (core + " " + joinParts(parts, "en2ar").out).trim(), parts: [{ src: tokens[i], out: core, known: true }].concat(parts), unknown: parts.filter(p => !p.known).map(p => p.src) };
    }
    const info = VFORM.get(tokens[i]); if (!info) return null;
    if (aux === "be" && info.form !== "ing") return null;
    if (["will", "can", "do", "did", "must"].includes(aux) && info.form !== "base") return null;
    if (!aux && info.form === "ing") return null;
    i++;
    let lemma = info.lemma, v = VB[lemma], person = PERSON[subj];
    let tense = aux === "be" ? "prog" : aux === "will" ? "fut" : aux === "can" ? "can" : aux === "must" ? "must" : aux === "did" ? "past" : aux === "do" ? "pres" : info.form === "ed" ? "past" : "pres";
    let rest = tokens.slice(i), v2 = null;
    if (rest[0] === "to" && VFORM.get(rest[1]) && VFORM.get(rest[1]).form === "base" && (lemma === "want" || lemma === "need")) { v2 = VB[VFORM.get(rest[1]).lemma]; rest = rest.slice(2); if (lemma === "need") { tense = "must"; v = v2; v2 = null; } }
    let vp;
    if (tense === "pres") vp = presForm(v.p1, person);
    else if (tense === "prog") vp = "دا " + presForm(v.p1, person);
    else if (tense === "fut") vp = "راح " + presForm(v.p1, person);
    else if (tense === "can") vp = canForm(person) + " " + presForm(v.p1, person);
    else if (tense === "must") vp = "لازم " + presForm(v.p1, person);
    else vp = pastForm(v, person);
    if (v2) vp += " " + presForm(v2.p1, person);
    if (neg) vp = "ما " + vp;
    let restOut = "", parts = [];
    if (rest.length) {
      let lead = "";
      if (MOTION.has(lemma) && rest[0] === "to") { rest = rest.slice(1); lead = "ل"; }
      if (MOTION.has(lemma) && rest[0] === "home") { parts = []; restOut = "للبيت"; rest = rest.slice(1); lead = ""; }
      if (rest.length) {
        parts = chunk(rest, "en", "en2ar", caps);
        restOut = joinParts(parts, "en2ar").out;
        if (lead) restOut = restOut.startsWith("ال") ? "لل" + restOut.slice(2) : "ل" + restOut;
      }
    }
    const pron = !q && subj !== "it" ? PRON_AR[subj] + " " : "";
    const out = (pron + vp + (restOut ? " " + restOut : "")).trim() + (q ? "؟" : "");
    return { out, parts: [{ src: tokens.slice(0, tokens.length - rest.length).join(" "), out: (pron + vp).trim(), known: true }].concat(parts), unknown: parts.filter(p => !p.known).map(p => p.src) };
  }

  /* ---------- main entry ---------- */
  function translate(text, dir) {
    if (!DB) build([]);
    text = String(text || "").trim();
    if (!text) return null;
    const arabic = hasArabic(text);
    if (arabic) dir = "ar2en";
    const mode = dir === "en2ar" ? "en" : arabic ? "ar" : "tr";
    const q = /[?؟]\s*$/.test(text);
    const key = normFor(text, mode);
    const caps = new Set(text.split(/\s+/).filter(w => /^[A-Z][a-z]+/.test(w)).map(w => w.toLowerCase().replace(/[^a-z]/g, "")));
    const R = { input: text, dir, mode, q, parts: [], unknown: [], alts: [], conf: "none", score: 0, matched: null, replies: [], similar: [], out: "", tr: "", note: "" };
    if (!key) return null;
    const speaker = e => ({ out: dir === "en2ar" ? e.ar[0] : e.en[0], tr: dir === "en2ar" ? (e.tr[0] || "") : "" });
    const altsOf = (ents, e) => {
      const list = [];
      if (dir === "en2ar") { e.ar.slice(1).forEach(a => list.push(a)); ents.slice(1).forEach(x => list.push(x.ar[0])); }
      else { e.en.slice(1).forEach(a => list.push(a)); ents.slice(1).forEach(x => list.push(clean(x.en[0]))); }
      return [...new Set(list)].filter(x => x !== (dir === "en2ar" ? e.ar[0] : e.en[0]));
    };

    // 0. the user's own corrections win over everything
    const fix = Engine.corrections[dir + "|" + key];
    if (fix) { Object.assign(R, { out: fix, conf: "yours", score: 1 }); return R; }

    // 1. exact phrase or word
    const exact = lookup(key, mode);
    if (exact) {
      const e = exact[0], s = speaker(e);
      Object.assign(R, s, { conf: "exact", score: 1, matched: e, alts: altsOf(exact, e) });
      if (dir === "ar2en" && e.kind !== "c") R.out = polish(e.kind === "w" ? (e.verb ? "to " : "") + clean(e.en[0]) : e.en[0], dir, false);
      R.parts = [mkPart(exact, key, dir)];
      R.replies = DB.replies.get(e.id) || [];
      return R;
    }

    // 1b. polite "please" at the start or end of a request
    const pl = { en: [/^please /, / please$/, "law samaHt", "لو سمحت"], ar: [/^لو سمحت /, / لو سمحت$/], tr: [/^law samaHt /i, / law samaHt$/i] }[mode];
    const pm = pl && (key.match(pl[0]) || key.match(pl[1]));
    if (pm && key.split(" ").length > 2) {
      const rest = key.replace(pl[0], "").replace(pl[1], "").trim();
      const inner = translate(rest, dir);
      if (inner && inner.conf !== "none") {
        if (dir === "en2ar") { inner.out = inner.out.replace(/[؟?]$/, "") + " لو سمحت"; inner.tr = (inner.tr || "").replace(/\?$/, "") + " law samaHt"; }
        else inner.out = inner.out.replace(/[?.]$/, "") + ", please";
        inner.input = text; inner.alts = [];
        return inner;
      }
    }

    // 2. sentence patterns
    const rk = { en: "rEn", ar: "rAr", tr: "rTr" }[mode], fk = { en: "en", ar: "ar", tr: "tr" }[mode];
    let best = null;
    DB.pats.forEach(p => {
      if (dir === "ar2en" && p.enOnly) return;
      const m = key.match(p[rk]);
      if (!m) return;
      if (dir === "ar2en" && p.en === "i am *" && (REV.has(m[1].split(" ")[0]) || m[1].split(" ")[0] === "دا")) return;
      const score = p.fix[fk] * 10 + (dir === "ar2en" && p.q === q ? 1 : 0);
      if (!best || score > best.score) best = { p, m, score };
    });
    const cl = mode === "en" ? clause(tokensOf(key), caps) : null;
    if (cl && (!best || /^i am/.test(best.p.en))) {
      Object.assign(R, { out: cl.out, parts: cl.parts, unknown: cl.unknown, conf: "clause", score: cl.unknown.length ? 0.6 : 0.85 });
      if (cl.unknown.length) R.note = "unknown";
      return R;
    }
    if (best) {
      const inner = chunk(tokensOf(best.m[1]), mode, dir, caps);
      const j = joinParts(inner, dir);
      let innerOut = j.out;
      if (dir === "ar2en") {
        innerOut = innerOut.replace(/^I /, "");
        if (inner[0] && inner[0].verb && /^i (don't )?want/.test(best.p.en)) innerOut = "to " + innerOut;
      }
      let out, tr = "";
      if (dir === "en2ar") { out = best.p.ar.replace("*", innerOut); tr = best.p.tr.replace("*", j.tr); }
      else { out = best.p.en.replace("*", innerOut); if (best.p.q) out = polish(out, dir, true); else out = polish(out, dir, q); }
      const unknown = inner.filter(p => !p.known).map(p => p.src);
      Object.assign(R, { out, tr, parts: inner, unknown, conf: "pattern", score: unknown.length ? 0.6 : 0.88 });
      if (unknown.length) R.note = "unknown";
      return R;
    }

    // 3. close phrase (typo tolerant)
    const sim = key.length >= 5 ? similar(key, mode, 4) : [];
    if (sim.length && sim[0].sim >= 0.88 && sim[0].key.split(" ").length === key.split(" ").length) {
      const e = sim[0].entry, s = speaker(e);
      Object.assign(R, s, { conf: "close", score: sim[0].sim, matched: e, alts: [], note: "close" });
      R.replies = DB.replies.get(e.id) || [];
      R.closeSrc = mode === "en" ? e.en[0] : mode === "ar" ? e.ar[0] : (e.tr[0] || e.ar[0]);
      R.parts = [mkPart([e], key, dir)];
      return R;
    }

    // 4. word by word
    const parts = chunk(tokensOf(key), mode, dir, caps);
    const known = parts.filter(p => p.known).length;
    if (!parts.length) return R;
    const j = joinParts(parts, dir);
    let out = j.out, tr = j.tr;
    if (parts.length === 1 && parts[0].verb && dir === "ar2en") out = "to " + out;
    R.unknown = parts.filter(p => !p.known).map(p => p.src);
    R.parts = parts; R.similar = sim.filter(s => s.sim < 0.88);
    if (known === 0) { R.conf = "none"; R.out = ""; R.score = 0; return R; }
    R.out = polish(out, dir, q); R.tr = tr; R.conf = "words";
    R.score = Math.max(0.2, 0.7 * known / parts.length);
    if (R.unknown.length) R.note = "unknown";
    return R;
  }

  /* typeahead: phrases beginning with / containing what has been typed */
  function suggest(text, dir, limit) {
    if (!DB) build([]);
    text = String(text || "").trim();
    if (text.length < 2) return [];
    const arabic = hasArabic(text);
    if (arabic) dir = "ar2en";
    const mode = dir === "en2ar" ? "en" : arabic ? "ar" : "tr";
    const key = normFor(text, mode);
    if (key.length < 2) return [];
    const starts = [], incl = [], seen = new Set();
    DB.fz[mode].forEach(([k, e]) => {
      if (seen.has(e) || k === key) return;
      if (k.startsWith(key)) { starts.push(e); seen.add(e); }
      else if (key.length >= 3 && k.includes(" " + key)) { incl.push(e); seen.add(e); }
    });
    return starts.concat(incl).slice(0, limit || 4);
  }

  function findEn(text) { if (!DB) build([]); return (DB.idx.en.get(normEn(text)) || [])[0] || null; }
  function phrases() { if (!DB) build([]); return DB.ents.filter(e => e.kind === "p"); }
  function stats() { if (!DB) build([]); return { phrases: DB.ents.filter(e => e.kind === "p").length, words: DB.ents.filter(e => e.kind === "w").length, patterns: DB.pats.length }; }

  return { corrections: {}, normKey: (t, dir) => dir + "|" + (dir === "en2ar" ? normEn(t) : normAr(t)), build, translate, suggest, findEn, phrases, stats, hasArabic, normEn, normAr, normTr, clean, toArDigits };
})();
if (typeof module !== "undefined") module.exports = Engine;
