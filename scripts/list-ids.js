const fs = require("fs");
const h = fs.readFileSync("index.html", "utf8");
const ids = [...new Set([...h.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))].sort();
console.log(ids.join("\n"));