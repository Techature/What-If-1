/**
 * When you edit code.js locally:
 *   node sync-code.js
 *
 * The exported app loads code.js automatically (not lastAttempt in the browser).
 * Sync keeps applab-api.js in sync if you re-import the project in Code.org.
 */
const fs = require("fs");

const code = fs.readFileSync("code.js", "utf8").trim();
const apiPath = "applab/applab-api.js";
let api = fs.readFileSync(apiPath, "utf8");

const key = '"lastAttempt":"';
const start = api.indexOf(key);
if (start === -1) {
  console.error("lastAttempt field not found in applab/applab-api.js");
  process.exit(1);
}

const endMarker = '"},"fullWidth"';
const end = api.indexOf(endMarker, start);
if (end === -1) {
  console.error('Could not locate end of lastAttempt (expected "},\"fullWidth\")');
  process.exit(1);
}

const escaped = JSON.stringify(code).slice(1, -1);
api =
  api.slice(0, start + key.length) +
  escaped +
  api.slice(end);

fs.writeFileSync(apiPath, api);
console.log("Synced code.js → applab/applab-api.js (lastAttempt)");