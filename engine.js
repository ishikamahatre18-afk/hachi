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
    lines(PHRASES).forEach(l => { const [c, e, a, t] = l.split("|"); ents.push(mk("p", c, e, a, t)); });
    lines(WORDS).forEach(l => { const [e, a, t] = l.split("|"); ents.push(mk("w", "", e, a, t)); });
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
      for (let n = Math.min(6, tokens.length - i); n >= 1; n--) {
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
  function joinParts(parts, dir) {
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
      if (s > (res.get(e)?.sim || 0)) res.set(e, { entry: e, sim: s });
    });
    return [...res.values()].filter(r => r.sim >= 0.55).sort((a, b) => b.sim - a.sim).slice(0, limit || 3);
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
      const score = p.fix[fk] * 10 + (dir === "ar2en" && p.q === q ? 1 : 0);
      if (!best || score > best.score) best = { p, m, score };
    });
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
    if (sim.length && sim[0].sim >= 0.82) {
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
    R.parts = parts; R.similar = sim.filter(s => s.sim < 0.82);
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

  return { build, translate, suggest, findEn, phrases, stats, hasArabic, normEn, normAr, normTr, clean, toArDigits };
})();
if (typeof module !== "undefined") module.exports = Engine;
