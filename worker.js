// Runs the neural model off the main thread so typing never lags.
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1";
env.allowLocalModels = false;
env.useBrowserCache = true;
const MODEL = "Xenova/nllb-200-distilled-600M";
let tr = null;
self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === "load") {
    try {
      env.remoteHost = m.host || "https://huggingface.co/";
      tr = await pipeline("translation", MODEL, { dtype: "q8", device: "wasm", progress_callback: p => postMessage({ type: "progress", p }) });
      postMessage({ type: "ready" });
    } catch (err) { postMessage({ type: "error", message: String((err && err.message) || err) }); }
  } else if (m.type === "translate") {
    try {
      const out = await tr(m.text, { src_lang: m.src, tgt_lang: m.tgt, max_new_tokens: m.max, num_beams: m.beams || 1 });
      postMessage({ type: "result", id: m.id, text: out[0].translation_text });
    } catch (err) { postMessage({ type: "result", id: m.id, error: String((err && err.message) || err) }); }
  }
};
