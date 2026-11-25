const fs = require("fs");
const h = fs.readFileSync("index.html", "utf8");
const ids = [...h.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const screenRe = /class="screen[^"]*"[^>]*\bid="([^"]+)"/g;
const screens = [];
let m;
while ((m = screenRe.exec(h))) screens.push(m[1]);
const uniqueScreens = [...new Set(screens)].sort();
const required = [
  "screen1",
  "screen2",
  "bothScreen1",
  "makerScreen1",
  "finderScreen1",
  "screen5",
  "bothButton",
  "nextStepBtn",
  "image7",
  "image8",
  "makerImage",
  "finderImage",
];
console.log("Screens in export:", uniqueScreens.join(", "));
console.log("");
for (const id of required) {
  console.log(id + ":", ids.includes(id) ? "OK" : "MISSING");
}