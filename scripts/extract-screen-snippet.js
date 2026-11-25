/**
 * Writes design reference snippets for manual App Lab setup (IDs must match code.js).
 */
const fs = require("fs");
const h = fs.readFileSync("index.html", "utf8");
const start = h.indexOf('id="bothScreen1"');
if (start === -1) {
  console.error("bothScreen1 not in index.html");
  process.exit(1);
}
const screenStart = h.lastIndexOf('<div class="screen', start);
let depth = 0;
let i = screenStart;
for (; i < h.length; i++) {
  if (h.slice(i, i + 4) === "<div") depth++;
  if (h.slice(i, i + 6) === "</div>") {
    depth--;
    if (depth === 0) {
      i += 6;
      break;
    }
  }
}
const bothScreen = h.slice(screenStart, i);
fs.mkdirSync("codeorg-handoff", { recursive: true });
fs.writeFileSync(
  "codeorg-handoff/README.txt",
  [
    "Paste code.js and style.css in App Lab (see CODEORG_APPLY.md).",
    "Do not upload index.html — App Lab keeps design on their servers.",
    "bothScreen1-snippet.html is reference only (IDs for Design tab).",
  ].join("\n")
);
fs.copyFileSync("code.js", "codeorg-handoff/code.js");
fs.copyFileSync("style.css", "codeorg-handoff/style.css");
fs.writeFileSync("codeorg-handoff/bothScreen1-snippet.html", bothScreen);
console.log("Wrote codeorg-handoff/ (code.js, style.css, bothScreen1 reference)");