HACHI - offline Iraqi Arabic <-> English translator

START HERE: Windows = double-click Start-Hachi-Windows.bat. Mac/Linux = run Start-Hachi-Mac-Linux.command. Your browser opens Hachi. Do NOT open index.html by double-clicking it.
For a phone, use option A below.

HOW TO RUN (needs a web address, because browsers only allow offline storage on https:// or localhost)
 A) Easiest for phones: drag this whole folder onto Netlify Drop (app.netlify.com/drop) or upload it to GitHub Pages. Open the https link, tap "Download and enable offline", then Add to Home Screen.
 B) On a computer: in this folder run   python3 -m http.server 8000   and open http://localhost:8000

FIRST RUN: needs internet once. It downloads the translation runtime (~20 MB) and the NLLB-200 model (~1 GB, from huggingface.co). After that, no internet is needed.

Model: Xenova/nllb-200-distilled-600M (Meta NLLB-200, language code acm_Arab = Iraqi/Mesopotamian Arabic), run in the browser with Transformers.js 3.5.1.
Verified phrases come from data.js (hand-written list) and override the model for exact matches. Edit data.js to add more.
