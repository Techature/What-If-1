/**
 * Option C — hybrid runtime picker (local vs cloud-backed data).
 * Default: runtime.js + localStorage (http://localhost:8080/)
 * Cloud:   runtime-cloud.js + optional API (http://localhost:8080/?cloud=1)
 */
(function () {
  var params = new URLSearchParams(window.location.search);
  var useCloud =
    params.get("cloud") === "1" ||
    params.get("runtime") === "cloud" ||
    window.localStorage.getItem("sharkTank_runtime") === "cloud";
  var src = useCloud ? "runtime-cloud.js" : "runtime.js";
  document.write('<script src="' + src + '"><\/script>');
})();