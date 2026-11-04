/* Hachi app: built-in offline translator first, optional AI add-on second. */
(() => {
  const $ = s => document.querySelector(s), esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ls = { get(k) { try { return localStorage.getItem("hachi3." + k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem("hachi3." + k, v); } catch (e) { } }, del(k) { try { localStorage.removeItem("hachi3." + k); } catch (e) { } } };
  const jget = (k, d) => { try { return JSON.parse(ls.get(k)) || d; } catch (e) { return d; } };
  const S = { dir: "en2ar", ai: null, aiReady: false, loading: false, job: 0, shown: "", flavour: ls.get("flavour") !== "0", worker: null, pend: new Map(), seq: 0, cache: new Map(), words: jget("words", []), fixes: jget("fixes", {}), srcText: "" };
  Engine.corrections = S.fixes; Engine.build(S.words);
  const inp = $("#inp"), out = $("#out");
  $("#flavour").checked = S.flavour;
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;

  /* ---------- Iraqi touch for AI output (formal Arabic -> everyday Iraqi) ---------- */
  const B = "(^|[\\s،.؟!:\"«»()])", A = "(?=$|[\\s،.؟!:\"«»()])";
  const MAP = [["لا يوجد", "ماكو"], ["لا توجد", "ماكو"], ["يوجد", "اكو"], ["توجد", "اكو"], ["لماذا", "ليش"], ["ماذا", "شنو"], ["كيف", "شلون"], ["أين", "وين"], ["اين", "وين"], ["متى", "شوكت"], ["كم", "شكد"], ["الآن", "هسه"], ["الان", "هسه"], ["غدا", "باچر"], ["غداً", "باچر"], ["جدا", "كلش"], ["جداً", "كلش"], ["كثيرا", "هواية"], ["كثيراً", "هواية"], ["قليلا", "شوية"], ["قليلاً", "شوية"], ["أنا", "آني"], ["انا", "آني"], ["نحن", "احنا"], ["أنتم", "انتو"], ["انتم", "انتو"], ["أنت", "إنت"], ["انت", "إنت"], ["ليس", "مو"], ["هذه", "هاي"], ["الماء", "الماي"], ["ماء", "ماي"], ["الأرز", "التمن"], ["أرز", "تمن"], ["الحافلة", "الباص"], ["حافلة", "باص"], ["المال", "الفلوس"], ["نقود", "فلوس"], ["الأطفال", "الجهال"]].map(([a, b]) => [new RegExp(B + a + A, "g"), "$1" + b]);
  const iraqify = s => MAP.reduce((t, [r, b]) => t.replace(r, b), s);

  /* ---------- small UI helpers ---------- */
  let tT; const toast = m => { $("#toastBox").innerHTML = `<div class="toast" role="status">${esc(m)}</div>`; clearTimeout(tT); tT = setTimeout(() => $("#toastBox").innerHTML = "", 3500); };
  const sheet = html => { $("#layer").innerHTML = `<div class="scrim" id="scr"><div class="sheet" role="dialog">${html}</div></div>`; $("#scr").onclick = e => { if (e.target.id === "scr") closeSheet(); }; };
  const closeSheet = () => $("#layer").innerHTML = "";
  function setDir(d) {
    S.dir = d; const en = d === "en2ar";
    $("#lA").textContent = en ? "English" : "العراقي"; $("#lB").textContent = en ? "العراقي" : "English";
    $("#lA").className = "lang on" + (en ? "" : " ar"); $("#lB").className = "lang" + (en ? " ar" : ""); $("#flv").hidden = !en;
    inp.placeholder = en ? "Type or speak English" : "اكتب بالعراقي أو بالحروف اللاتينية";
    const ex = en ? ["Where is the bathroom?", "I want to eat rice", "We will go to the hotel tomorrow", "She is learning English", "How much is this?", "Do you accept cards?"] : ["شلونك؟", "هو يروح للسوگ", "اريد ماي", "ween il-7ammaam", "بيش هذا؟"];
    $("#ex").innerHTML = ex.map(x => `<button class="chip ${/[؀-ۿ]/.test(x) ? "ar" : ""}" data-fill="${esc(x)}">${esc(x)}</button>`).join("");
  }
  function show(text, tag, kind, busy) {
    S.shown = text;
    out.textContent = text || "Translation appears here."; out.className = "out" + (S.dir === "en2ar" ? " ar" : "") + (text ? "" : " ph") + (busy ? " busy" : "");
    const t = $("#tag"); t.hidden = !tag; t.textContent = tag || ""; t.className = "tag " + (kind || "");
  }
  function status(kind, text) { $("#status").className = "chip " + (kind || ""); $("#stTxt").textContent = text; }
  const baseStatus = () => status("ready", S.aiReady ? "Offline · AI ready" : "Offline · ready");

  /* ---------- translate ---------- */
  const split = t => t.split(/(?<=[.!?؟؛\n])\s+/).map(s => s.trim()).filter(Boolean);
  async function run() {
    const text = inp.value.trim(); $("#clr").hidden = !inp.value; inp.classList.toggle("ar", Engine.hasArabic(inp.value));
    $("#tips").hidden = !!text; S.srcText = text;
    if (!text) { S.job++; show("", ""); $("#note").innerHTML = ""; return; }
    const ar = Engine.hasArabic(text); let dir = ar ? "ar2en" : "en2ar";
    if (!ar && S.dir === "ar2en") { const t = Engine.translate(text, "ar2en"); if (t && ["exact", "pattern", "close", "yours", "clause"].includes(t.conf)) dir = "ar2en"; }
    if (dir !== S.dir) setDir(dir);
    const my = ++S.job, segs = split(text), outs = [], kinds = [], unk = [], latin = dir === "ar2en" && !ar;
    for (let i = 0; i < segs.length; i++) {
      if (my !== S.job) return;
      const seg = segs[i], r = Engine.translate(seg, dir);
      const good = r && (r.conf === "exact" || r.conf === "yours" || ((r.conf === "pattern" || r.conf === "clause" || r.conf === "close") && !r.unknown.length));
      let t, kind;
      if (good) { t = r.out; kind = r.conf; }
      else if (S.aiReady && !latin) {
        const key = dir + "|" + seg; t = S.cache.get(key);
        if (t == null) {
          show(outs.join(" "), "Translating…", "ok", true); S.busyT = Date.now();
          const x = await neural(seg, dir); S.busyT = 0; if (my !== S.job) return;
          if (x.error === "timeout") return failSlow("One sentence took more than 90 seconds on this phone.");
          if (x.error) { t = r && r.out ? r.out : seg; kind = r && r.out ? r.conf : "none"; }
          else { t = x.text; S.cache.set(key, t); if (S.cache.size > 300) S.cache.delete(S.cache.keys().next().value); kind = "ai"; }
        } else kind = "ai";
        if (kind === "ai" && dir === "en2ar" && S.flavour) t = iraqify(t);
      } else if (r && r.out) { t = r.out; kind = r.conf; if (r.unknown) unk.push(...r.unknown); }
      else { t = seg; kind = "none"; unk.push(...Engine.normEn(seg).split(" ").filter(Boolean)); }
      outs.push(t); kinds.push(kind);
    }
    const has = k => kinds.includes(k);
    let tag, cls = "ok";
    if (has("none")) { tag = "Partly translated"; cls = "warn"; } else if (has("words")) { tag = "Rough · check it"; cls = "warn"; } else if (has("ai")) tag = "AI · offline";
    else if (has("yours")) tag = "Your correction"; else if (has("pattern") || has("clause") || has("close")) tag = "Grammar rules"; else tag = "Verified phrase";
    show(outs.join(" "), tag, cls);
    const u = [...new Set(unk)].slice(0, 8);
    $("#note").innerHTML = u.length ? `<div class="note"><span>Not in the offline dictionary. Tap a word to teach it${S.aiReady ? "" : ", or add the AI in the menu for full sentences"}.</span><div class="chips">${u.map(w => `<button class="chip" data-teach="${esc(w)}">${esc(w)}</button>`).join("")}</div></div>`
      : (has("words") && !S.aiReady ? `<div class="note info"><span>Built word by word, so it may sound stiff. Adding the AI (menu) improves long sentences.</span></div>` : "");
  }
  let dT; const later = () => { clearTimeout(dT); dT = setTimeout(run, 300); };

  /* ---------- AI add-on (optional) ---------- */
  const files = {}, HOSTS = ["https://huggingface.co/", "https://hf-mirror.com/"]; let hostTry = 0;
  const NLLB = { en: "eng_Latn", ar: "acm_Arab" };
  const hostOrder = () => { const l = ls.get("host"); return l ? [l, ...HOSTS.filter(h => h !== l)] : HOSTS; };
  function card(title, text, btn, no) { $("#setup").hidden = false; $("#suT").textContent = title; $("#suP").textContent = text; $("#dl").textContent = btn || ""; $("#dl").hidden = !btn; $("#dlNo").hidden = !no; $("#dl").disabled = false; }
  function startWorker() {
    if (S.worker) return S.worker;
    const w = S.worker = new Worker("worker.js", { type: "module" });
    w.onerror = () => failSlow("The AI engine stopped. This usually means the phone ran out of memory.");
    w.onmessage = e => {
      const m = e.data;
      if (m.type === "progress") {
        const p = m.p || {}; if (p.status === "progress" && p.file) files[p.file] = { l: p.loaded, t: p.total };
        let l = 0, t = 0; Object.values(files).forEach(f => { l += f.l || 0; t += f.t || 0; });
        const pct = t ? Math.min(99, Math.round(100 * l / t)) : 0;
        $("#barI").style.width = pct + "%"; status("", `Downloading ${pct}%`); $("#suP").textContent = `${(l / 1e6).toFixed(0)} of ${(t / 1e6).toFixed(0)} MB. Keep this page open. Hachi still works while you wait.`;
      } else if (m.type === "ready") {
        S.loading = false; ls.set("ai", S.ai); ls.set("host", hostOrder()[hostTry]); hostTry = 0; $("#bar").hidden = true; status("", "Testing AI…"); S.aiReady = true;
        const t0 = Date.now(); neural("Hello.", "en2ar", 150000).then(r => {
          if (r.error) return failSlow(r.error === "timeout" ? "The AI loaded but didn't answer in time." : "The AI loaded but failed on its first sentence: " + String(r.error).slice(0, 220));
          $("#setup").hidden = true; baseStatus(); toast(`AI ready (first test ${Math.round((Date.now() - t0) / 1000)}s). Works offline.`); run();
        });
      } else if (m.type === "error") {
        S.worker = null; S.loading = false;
        if (navigator.onLine !== false && hostTry + 1 < hostOrder().length) { hostTry++; Object.keys(files).forEach(k => delete files[k]); toast("Main host unreachable. Trying a mirror…"); startAI(S.ai, true); return; }
        hostTry = 0; $("#bar").hidden = true; baseStatus();
        card(navigator.onLine === false ? "Connect to the internet once" : "The AI download failed", (navigator.onLine === false ? "The first download needs internet." : "Check your connection and free storage. (" + String(m.message).slice(0, 90) + ")") + " The built-in translator keeps working.", "Try again", true);
      } else if (m.type === "result") { const f = S.pend.get(m.id); if (f) { S.pend.delete(m.id); f(m); } }
    };
    return w;
  }
  function startAI(mode, retry) {
    if (S.loading) return; S.ai = mode; S.loading = true; S.aiReady = false;
    card(mode === "best" ? "Adding AI (best quality)" : "Adding AI (fast)", "Starting…", "", false); $("#bar").hidden = false; $("#barI").style.width = "0%"; status("", "Starting…");
    try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }
    startWorker().postMessage({ type: "load", host: hostOrder()[hostTry], mode: mode === "best" ? "nllb" : "opus" });
  }
  function neural(text, dir, limit) {
    return new Promise(res => {
      const id = ++S.seq; let done = false;
      const t = setTimeout(() => { if (!done) { done = true; S.pend.delete(id); res({ error: "timeout" }); } }, limit || 90000);
      S.pend.set(id, r => { if (!done) { done = true; clearTimeout(t); res(r); } });
      S.worker.postMessage({ type: "translate", id, text, src: dir === "en2ar" ? NLLB.en : NLLB.ar, tgt: dir === "en2ar" ? NLLB.ar : NLLB.en, max: Math.min(256, 24 + text.length * 2), beams: 1 });
    });
  }
  function failSlow(why) {
    S.aiReady = false; S.loading = false; S.job++; if (S.worker) { try { S.worker.terminate(); } catch (e) { } S.worker = null; } baseStatus(); $("#bar").hidden = true;
    card("The AI couldn't run on this phone", why + " The built-in translator still works. " + (S.ai === "best" ? "You can try the Fast AI instead." : ""), S.ai === "best" ? "Try Fast AI" : "", true);
    S.dlTarget = S.ai === "best" ? "fast" : null;
    ls.del("ai"); run();
  }
  setInterval(() => { if (S.busyT) { const t = $("#tag"); t.hidden = false; t.textContent = `Translating… ${Math.round((Date.now() - S.busyT) / 1000)}s`; } }, 1000);
  async function removeAI() {
    try { for (const k of await caches.keys()) if (k.includes("transformers")) await caches.delete(k); } catch (e) { }
    if (S.worker) { try { S.worker.terminate(); } catch (e) { } S.worker = null; } S.aiReady = false; S.loading = false; ls.del("ai"); S.cache.clear(); baseStatus(); $("#setup").hidden = true; toast("AI add-on removed."); run();
  }

  /* ---------- speech ---------- */
  function speak(text, lang) {
    if (!("speechSynthesis" in window) || !text) return toast("Audio isn't available in this browser.");
    const vs = speechSynthesis.getVoices(), want = lang === "ar" ? ["ar-iq", "ar-sa", "ar"] : ["en-us", "en-gb", "en"];
    let v = null; for (const c of want) { v = vs.find(x => (x.lang || "").replace("_", "-").toLowerCase().startsWith(c)); if (v) break; }
    const u = new SpeechSynthesisUtterance(lang === "ar" ? text.replace(/گ/g, "ق").replace(/چ/g, "ج").replace(/پ/g, "ب") : text);
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = lang === "ar" ? "ar-SA" : "en-US";
    if (lang === "ar" && !v && vs.length) toast("No Arabic voice on this phone. Add one in text-to-speech settings.");
    u.rate = .92; speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
  let rec = null;
  function listen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return toast("Voice input isn't supported in this browser.");
    if (rec) { rec.stop(); return; }
    const r = rec = new SR(); r.lang = S.dir === "en2ar" ? "en-US" : "ar-IQ"; r.interimResults = true; $("#mic").classList.add("live");
    r.onresult = e => { let t = ""; for (const x of e.results) t += x[0].transcript; inp.value = t; run(); };
    r.onerror = e => toast({ "not-allowed": "Microphone is blocked. Allow it in the browser.", "network": "Voice recognition needs internet on this phone. Typing works offline." }[e.error] || "Voice input stopped.");
    r.onend = () => { $("#mic").classList.remove("live"); rec = null; };
    try { r.start(); } catch (e) { rec = null; $("#mic").classList.remove("live"); }
  }

  /* ---------- sheets: fix, teach, menu, diagnostics ---------- */
  function openFix() {
    if (!S.srcText) return toast("Translate something first.");
    const key = Engine.normKey(S.srcText, S.dir), has = !!S.fixes[key], ar = S.dir === "en2ar";
    sheet(`<h3>Fix this translation</h3><p>Type the better ${ar ? "Iraqi" : "English"} for <b>${esc(S.srcText)}</b>. Hachi will use it first from now on. It stays on this phone.</p>
      <div class="f"><label for="fx">Better translation</label><textarea id="fx" class="${ar ? "ar" : ""}" dir="${ar ? "rtl" : "ltr"}">${esc(S.shown)}</textarea></div>
      <div class="row"><button class="btn pri" id="fxS">Save</button>${has ? '<button class="btn" id="fxD">Remove my fix</button>' : ""}<button class="btn" id="fxC">Cancel</button></div>`);
    $("#fxC").onclick = closeSheet;
    $("#fxS").onclick = () => { const v = $("#fx").value.trim(); if (!v) return; S.fixes[key] = v; ls.set("fixes", JSON.stringify(S.fixes)); Engine.corrections = S.fixes; closeSheet(); toast("Saved. I'll use your version."); run(); };
    if (has) $("#fxD").onclick = () => { delete S.fixes[key]; ls.set("fixes", JSON.stringify(S.fixes)); closeSheet(); run(); };
  }
  function openTeach(word) {
    const isAr = Engine.hasArabic(word), en = S.dir === "en2ar";
    sheet(`<h3>Teach Hachi a word</h3><p>Saved on this phone and used right away, offline.</p>
      <div class="f"><label for="te">English</label><input id="te" type="text" value="${esc(en ? word : "")}" autocomplete="off"></div>
      <div class="f"><label for="ta">Iraqi Arabic</label><input id="ta" type="text" dir="rtl" value="${esc(isAr ? word : "")}" autocomplete="off"></div>
      <div class="f"><label for="tt">Latin spelling (optional)</label><input id="tt" type="text" value="${esc(!en && !isAr ? word : "")}" autocomplete="off"></div>
      <div class="row"><button class="btn pri" id="tS">Save word</button><button class="btn" id="tC">Cancel</button></div>`);
    $("#tC").onclick = closeSheet;
    $("#tS").onclick = () => { const e = $("#te").value.trim(), a = $("#ta").value.trim(), t = $("#tt").value.trim(); if (!e || !(a || t)) return toast("Add the English and the Iraqi word."); S.words.unshift({ id: "u" + Date.now(), en: e, ar: a, tr: t }); ls.set("words", JSON.stringify(S.words)); Engine.build(S.words); closeSheet(); toast("Learned it."); run(); };
    setTimeout(() => $(en ? "#ta" : "#te").focus(), 60);
  }
  async function diagText() {
    const L = []; const yes = b => b ? "yes" : "NO";
    L.push("Secure page (https/localhost): " + yes(window.isSecureContext));
    let sw = "not supported"; if ("serviceWorker" in navigator) { const r = await navigator.serviceWorker.getRegistration().catch(() => null); sw = r ? (r.active ? "active" : "waiting") + (navigator.serviceWorker.controller ? ", controlling this page" : ", NOT controlling this page yet") : "not registered"; }
    L.push("Offline engine (service worker): " + sw);
    L.push("Opened as installed app: " + yes(matchMedia("(display-mode: standalone)").matches || navigator.standalone));
    L.push("Install offered by browser: " + yes(!!S.installEvt));
    try { L.push("Storage protected from clean-up: " + yes(await navigator.storage.persisted())); const e = await navigator.storage.estimate(); L.push(`Storage used: ${(e.usage / 1e6).toFixed(0)} MB of ${(e.quota / 1e6).toFixed(0)} MB`); } catch (e) { L.push("Storage info: unavailable"); }
    let n = 0; try { for (const k of await caches.keys()) if (k.includes("transformers")) n += (await (await caches.open(k)).keys()).length; } catch (e) { }
    L.push(`AI add-on: ${S.aiReady ? S.ai + " (ready)" : S.loading ? "downloading" : "not installed"}; model files saved: ${n}`);
    const st = Engine.stats(); L.push(`Built-in dictionary: ${st.phrases} phrases, ${st.words} words, ${st.patterns} patterns + verb grammar`);
    L.push(`Your fixes: ${Object.keys(S.fixes).length}, your words: ${S.words.length}`);
    L.push("Browser: " + navigator.userAgent.replace(/\s*\(.*?\)\s*/g, " ").slice(0, 90));
    return L.join("\n");
  }
  async function openDiag() {
    sheet(`<h3>Diagnostics</h3><p>If something doesn't work, send me a screenshot of this.</p><pre class="diag" id="dg">Checking…</pre><div class="row"><button class="btn" id="dgC">Copy</button><button class="btn pri" id="dgX">Close</button></div>`);
    const t = await diagText(); $("#dg").textContent = t; $("#dgX").onclick = closeSheet; $("#dgC").onclick = () => { try { navigator.clipboard.writeText(t).then(() => toast("Copied")); } catch (e) { toast("Couldn't copy"); } };
  }
  function openMenu() {
    const ai = S.aiReady ? `AI add-on installed (${S.ai === "best" ? "best quality" : "fast"}).` : "No AI add-on. The built-in translator works fully offline without it.";
    sheet(`<h3>Hachi</h3><p>Built-in English → Iraqi translator: verified phrases, grammar rules for verbs and tenses, and a word dictionary. Works offline with no download. It is strongest on everyday travel, food, shopping, health and work sentences.</p>
      <h4>Optional AI add-on</h4><p>${ai} The AI handles longer or unusual sentences but needs a one-time download and a phone with enough memory.</p>
      <div class="row"><button class="btn" id="mF">Add Fast AI (~170 MB)</button><button class="btn" id="mB">Add Best AI (~1 GB)</button>${S.ai || S.aiReady ? '<button class="btn" id="mR">Remove AI</button>' : ""}</div>
      <h4>Improve it</h4><p>Use Fix under any translation to correct it. Your corrections are used first and stay on this phone.</p>
      <div class="row"><button class="btn" id="mE">Copy my corrections</button></div>
      <h4>Help</h4><div class="row">${S.installEvt ? '<button class="btn pri" id="mI">Install app</button>' : ""}<button class="btn" id="mD">Diagnostics</button><button class="btn" id="mX">Close</button></div>
      ${S.installEvt ? "" : '<p>To install: Chrome menu ⋮ → Install app (or Add to Home screen). On iPhone: Share → Add to Home Screen.</p>'}
      <p>Machine and rule-based translation can be wrong, especially with dialect and slang. Check anything important with a native speaker.</p>`);
    $("#mX").onclick = closeSheet; $("#mD").onclick = openDiag;
    $("#mF").onclick = () => { closeSheet(); startAI("fast"); }; $("#mB").onclick = () => { closeSheet(); startAI("best"); };
    if ($("#mR")) $("#mR").onclick = () => { closeSheet(); removeAI(); };
    if ($("#mI")) $("#mI").onclick = installApp;
    $("#mE").onclick = () => { const t = JSON.stringify({ fixes: S.fixes, words: S.words }, null, 1); try { navigator.clipboard.writeText(t).then(() => toast("Copied. Paste it into a message to share it.")); } catch (e) { toast("Couldn't copy"); } };
  }
  function installApp() { if (S.installEvt) { S.installEvt.prompt(); S.installEvt.userChoice.finally(() => { S.installEvt = null; $("#installBtn").hidden = true; }); } closeSheet(); }

  /* ---------- events ---------- */
  inp.addEventListener("input", later);
  inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); clearTimeout(dT); run(); } });
  document.addEventListener("click", e => {
    const f = e.target.closest("[data-fill]"); if (f) { inp.value = f.dataset.fill; run(); return; }
    const t = e.target.closest("[data-teach]"); if (t) openTeach(t.dataset.teach);
  });
  $("#clr").onclick = () => { inp.value = ""; run(); inp.focus(); };
  $("#swap").onclick = () => { const t = S.shown; setDir(S.dir === "en2ar" ? "ar2en" : "en2ar"); if (t) inp.value = t; run(); };
  $("#flavour").onchange = e => { S.flavour = e.target.checked; ls.set("flavour", S.flavour ? "1" : "0"); S.cache.size && run(); };
  $("#play").onclick = () => speak(S.shown, S.dir === "en2ar" ? "ar" : "en");
  $("#copy").onclick = () => { if (!S.shown) return; try { navigator.clipboard.writeText(S.shown).then(() => toast("Copied"), () => toast("Couldn't copy")); } catch (e) { toast("Couldn't copy"); } };
  $("#show").onclick = () => { if (!S.shown) return; $("#layer").innerHTML = `<div class="show ${S.dir === "en2ar" ? "ar" : ""}" id="shw"><div>${esc(S.shown)}</div></div>`; $("#shw").onclick = closeSheet; };
  $("#fix").onclick = openFix; $("#mic").onclick = listen; $("#menu").onclick = openMenu; $("#status").onclick = openMenu;
  $("#dl").onclick = () => { const m = S.dlTarget || S.ai || "fast"; S.dlTarget = null; startAI(m); }; $("#dlNo").onclick = () => { $("#setup").hidden = true; };
  $("#installBtn").onclick = installApp;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); S.installEvt = e; $("#installBtn").hidden = false; });
  window.addEventListener("appinstalled", () => { $("#installBtn").hidden = true; S.installEvt = null; try { navigator.storage.persist(); } catch (e) { } toast("Installed. Open Hachi from your home screen."); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
  window.addEventListener("offline", () => toast("You're offline. Hachi still works."));
  window.addEventListener("online", () => baseStatus());

  /* ---------- boot ---------- */
  setDir("en2ar"); baseStatus(); show("", "");
  (async () => {
    if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
      try { await navigator.serviceWorker.register("sw.js"); } catch (e) { }
      if (!navigator.serviceWorker.controller) await Promise.race([new Promise(r => navigator.serviceWorker.addEventListener("controllerchange", r, { once: true })), new Promise(r => setTimeout(r, 3000))]);
    }
    const saved = ls.get("ai");
    if (saved) {
      let ok = false; try { ok = await caches.has("transformers-cache") && (await (await caches.open("transformers-cache")).keys()).length > 3; } catch (e) { }
      if (ok) startAI(saved); else { ls.del("ai"); toast("Your browser cleared the AI add-on. The built-in translator still works."); }
    }
  })();
  window.__S = S;
})();
