// Runs the neural model off the main thread so typing never lags.
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1";
env.allowLocalModels = false;
env.useBrowserCache = true;
const NLLB = "Xenova/nllb-200-distilled-600M";
let mode = "nllb", nllb = null, en2ar = null, ar2en = null;
self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === "load") {
    try {
      env.remoteHost = m.host || "https://huggingface.co/";
      mode = m.mode || "nllb";
      const o = { dtype: "q8", device: "wasm", progress_callback: p => postMessage({ type: "progress", p }) };
      if (mode === "nllb") nllb = await pipeline("translation", NLLB, o);
      else { en2ar = await pipeline("translation", "Xenova/opus-mt-en-ar", o); ar2en = await pipeline("translation", "Xenova/opus-mt-ar-en", o); }
      postMessage({ type: "ready" });
    } catch (err) { postMessage({ type: "error", message: String((err && err.message) || err) }); }
  } else if (m.type === "translate") {
    try {
      let out;
      if (mode === "nllb") out = await nllb(m.text, { src_lang: m.src, tgt_lang: m.tgt, max_new_tokens: m.max, num_beams: 1 });
      else out = await (m.src === "eng_Latn" ? en2ar : ar2en)(m.text, { max_new_tokens: m.max });
      postMessage({ type: "result", id: m.id, text: out[0].translation_text });
    } catch (err) { postMessage({ type: "result", id: m.id, error: String((err && err.message) || err) }); }
  }
};
