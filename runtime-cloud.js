/**
 * Cloud runtime — same UI APIs as runtime.js; Finders data via Supabase when configured.
 * Pair with index.html → runtime-loader.js and http://localhost:8080/?cloud=1
 * Setup: SUPABASE_SETUP.md + config.js
 */
(function (global) {
  "use strict";

  var STORAGE_PREFIX = "sharkTank_";
  var handlers = {};
  var delegationRoot = null;

  function supabaseReady() {
    return !!(
      global.SHARK_TANK_SUPABASE_URL &&
      global.SHARK_TANK_SUPABASE_ANON_KEY
    );
  }

  function supabaseHeaders() {
    var key = global.SHARK_TANK_SUPABASE_ANON_KEY;
    return {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };
  }

  function appTableToDb(table) {
    if (table === "Finders") {
      return "finders";
    }
    return String(table).toLowerCase();
  }

  function rowToAppRecord(row) {
    return {
      id: row.id,
      Name: row.name,
      Image: row.image,
      Kind: row.kind,
      Address: row.address,
      Status: row.status || "",
    };
  }

  function appRecordToRow(record) {
    return {
      id: record.id,
      name: record.Name,
      image: record.Image,
      kind: record.Kind,
      address: record.Address,
      status: record.Status || "",
    };
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function handlerForTarget(el, eventType) {
    while (el && el !== delegationRoot) {
      if (el.id) {
        var key = el.id + ":" + eventType;
        if (handlers[key]) {
          return handlers[key];
        }
      }
      el = el.parentElement;
    }
    return null;
  }

  function installEventDelegation() {
    if (delegationRoot) {
      return true;
    }
    delegationRoot = document.getElementById("divApplab");
    if (!delegationRoot) {
      return false;
    }

    delegationRoot.addEventListener(
      "click",
      function (e) {
        var fn = handlerForTarget(e.target, "click");
        if (fn) {
          fn(e);
        }
      },
      true
    );

    function fireChangeHandlers(e) {
      var fn = handlerForTarget(e.target, "change");
      if (fn) {
        fn(e);
      }
    }

    delegationRoot.addEventListener("input", fireChangeHandlers, true);
    delegationRoot.addEventListener("change", fireChangeHandlers, true);
    return true;
  }

  global.onEvent = function (id, eventType, callback) {
    handlers[id + ":" + eventType] = callback;

    if (!installEventDelegation()) {
      document.addEventListener("DOMContentLoaded", installEventDelegation);
    }

    var el = byId(id);
    if (
      el &&
      (el.tagName === "BUTTON" || el.tagName === "IMG" || el.getAttribute("role") === "button")
    ) {
      el.style.cursor = "pointer";
    }
    return true;
  };

  global.getText = function (id) {
    var el = byId(id);
    if (!el) return "";
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      return el.value || "";
    }
    return el.textContent || "";
  };

  global.setText = function (id, text) {
    var el = byId(id);
    if (!el) return;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.value = text;
    } else if (el.classList && el.classList.contains("textArea")) {
      el.style.whiteSpace = "pre-line";
      el.textContent = text;
    } else {
      el.textContent = text;
    }
  };

  global.setScreen = function (screenId) {
    var screens = document.querySelectorAll("#divApplab .screen");
    screens.forEach(function (screen) {
      if (screen.id === screenId) {
        screen.style.display = "block";
        screen.style.zIndex = "2";
      } else {
        screen.style.display = "none";
        screen.style.zIndex = "0";
      }
    });
  };

  global.showElement = function (id) {
    var el = byId(id);
    if (!el) return;
    el.classList.remove("design-mode-hidden");
    el.style.visibility = "visible";
    el.style.display = "";
    if (el.style.display === "none") {
      el.style.display = "block";
    }
    if (getComputedStyle(el).display === "none") {
      el.style.display = "block";
    }
  };

  global.hideElement = function (id) {
    var el = byId(id);
    if (!el) return;
    el.classList.add("design-mode-hidden");
    el.style.display = "none";
  };

  global.setProperty = function (id, prop, value) {
    var el = byId(id);
    if (!el || !el.style) return;
    var css = String(prop).replace(/([A-Z])/g, "-$1").toLowerCase();
    el.style.setProperty(css, value);
  };

  global.setImageURL = function (id, url) {
    var el = byId(id);
    if (el && el.tagName === "IMG") {
      el.src = url;
    }
  };

  function loadTable(table) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + table);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveTable(table, rows) {
    localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(rows));
  }

  function ensureDemoDataLocal() {
    var rows = loadTable("Finders");
    if (rows.length > 0) return;
    saveTable("Finders", [
      {
        id: "demo1",
        Name: "Alex",
        Image: "assets/Screenshot-2026-11-19-095606.png",
        Kind: "Upcycled lamp",
        Address: "12 Green St",
        Status: "",
      },
    ]);
  }

  function matchFilters(record, filters) {
    if (!filters || typeof filters !== "object") return true;
    for (var key in filters) {
      if (filters.hasOwnProperty(key) && record[key] != filters[key]) {
        return false;
      }
    }
    return true;
  }

  function readRecordsLocal(table, filters, callback) {
    ensureDemoDataLocal();
    var rows = loadTable(table).filter(function (r) {
      return matchFilters(r, filters);
    });
    callback(rows);
  }

  global.readRecords = function (table, filters, callback) {
    if (!supabaseReady()) {
      setTimeout(function () {
        readRecordsLocal(table, filters, callback);
      }, 0);
      return;
    }
    var url =
      global.SHARK_TANK_SUPABASE_URL.replace(/\/$/, "") +
      "/rest/v1/" +
      appTableToDb(table) +
      "?select=*";
    fetch(url, { method: "GET", headers: supabaseHeaders() })
      .then(function (res) {
        if (!res.ok) throw new Error("Supabase read failed");
        return res.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows)) rows = [];
        var mapped = rows.map(rowToAppRecord);
        callback(
          mapped.filter(function (r) {
            return matchFilters(r, filters);
          })
        );
      })
      .catch(function () {
        console.warn("[Shark Tank] Supabase read failed — using local fallback.");
        readRecordsLocal(table, filters, callback);
      });
  };

  global.createRecord = function (table, record, callback) {
    record.id = record.id || "r" + Date.now();
    if (!supabaseReady()) {
      var rows = loadTable(table);
      rows.push(record);
      saveTable(table, rows);
      setTimeout(function () {
        callback(record);
      }, 0);
      return;
    }
    var url =
      global.SHARK_TANK_SUPABASE_URL.replace(/\/$/, "") +
      "/rest/v1/" +
      appTableToDb(table);
    fetch(url, {
      method: "POST",
      headers: supabaseHeaders(),
      body: JSON.stringify(appRecordToRow(record)),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Supabase create failed");
        return res.json();
      })
      .then(function (saved) {
        var row = Array.isArray(saved) ? saved[0] : saved;
        callback(row ? rowToAppRecord(row) : record);
      })
      .catch(function () {
        console.warn("[Shark Tank] Supabase create failed — using local fallback.");
        var rows = loadTable(table);
        rows.push(record);
        saveTable(table, rows);
        callback(record);
      });
  };

  global.updateRecord = function (table, record, callback) {
    if (!supabaseReady()) {
      var rows = loadTable(table);
      var idx = -1;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id === record.id || rows[i] === record) {
          idx = i;
          break;
        }
      }
      if (idx === -1 && record.Name) {
        for (var j = 0; j < rows.length; j++) {
          if (rows[j].Name === record.Name) {
            idx = j;
            break;
          }
        }
      }
      if (idx >= 0) {
        rows[idx] = Object.assign({}, rows[idx], record);
        saveTable(table, rows);
      }
      setTimeout(function () {
        callback(record, true);
      }, 0);
      return;
    }
    var id = record.id;
    if (!id) {
      setTimeout(function () {
        callback(record, false);
      }, 0);
      return;
    }
    var url =
      global.SHARK_TANK_SUPABASE_URL.replace(/\/$/, "") +
      "/rest/v1/" +
      appTableToDb(table) +
      "?id=eq." +
      encodeURIComponent(id);
    fetch(url, {
      method: "PATCH",
      headers: supabaseHeaders(),
      body: JSON.stringify(appRecordToRow(record)),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Supabase update failed");
        return res.json();
      })
      .then(function (updated) {
        var row = Array.isArray(updated) ? updated[0] : updated;
        callback(row ? rowToAppRecord(row) : record, true);
      })
      .catch(function () {
        console.warn("[Shark Tank] Supabase update failed — using local fallback.");
        var rows = loadTable(table);
        var idx = -1;
        for (var k = 0; k < rows.length; k++) {
          if (rows[k].id === record.id) {
            idx = k;
            break;
          }
        }
        if (idx >= 0) {
          rows[idx] = Object.assign({}, rows[idx], record);
          saveTable(table, rows);
        }
        callback(record, true);
      });
  };

  function bootUi() {
    if (!supabaseReady()) {
      ensureDemoDataLocal();
    }
    var screens = document.querySelectorAll("#divApplab .screen");
    var anyVisible = false;
    screens.forEach(function (s) {
      if (s.style.display === "block") anyVisible = true;
    });
    if (!anyVisible && screens[0]) {
      global.setScreen(screens[0].id);
    }
    var hero = document.getElementById("screen1Hero");
    if (hero) hero.style.pointerEvents = "none";
    document.querySelectorAll("#screen1 #naem, #screen1 #button1").forEach(function (el) {
      el.style.pointerEvents = "auto";
      el.style.zIndex = "20";
    });

    var nameInput = document.getElementById("naem");
    if (nameInput) {
      nameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var go = handlers["button1:click"];
          if (go) {
            e.preventDefault();
            go(e);
          }
        }
      });
    }

    if (supabaseReady()) {
      console.info("[Shark Tank] Cloud runtime — Supabase connected.");
    } else if (/[?&]cloud(?:=1)?/.test(location.search)) {
      console.info(
        "[Shark Tank] Cloud mode: add SHARK_TANK_SUPABASE_URL + ANON_KEY in config.js (see SUPABASE_SETUP.md)"
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootUi);
  } else {
    bootUi();
  }

  global.__sharkTankRuntime = "cloud";
})(window);