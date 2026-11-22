/**
 * Lightweight App Lab–compatible runtime for local/offline use.
 * Implements the APIs used by code.js (replaces the heavy applab-api.js bundle).
 */
(function (global) {
  "use strict";

  var STORAGE_PREFIX = "sharkTank_";
  var handlers = {};
  var delegationRoot = null;

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
      (tagIsButton(el) || el.tagName === "IMG" || el.tagName === "BUTTON")
    ) {
      el.style.cursor = "pointer";
    }
    return true;
  };

  function tagIsButton(el) {
    return el.tagName === "BUTTON" || el.getAttribute("role") === "button";
  }

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
    } else if (
      id === "finderNotice" ||
      id === "makerNotice" ||
      el.classList.contains("st-finder-notice") ||
      el.classList.contains("st-maker-notice")
    ) {
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
      el.style.display = el.tagName === "BUTTON" ? "block" : "";
    }
    if (getComputedStyle(el).display === "none") {
      el.style.display = el.tagName === "LABEL" ? "block" : "block";
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

  function ensureDemoData() {
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

  global.readRecords = function (table, filters, callback) {
    ensureDemoData();
    setTimeout(function () {
      var rows = loadTable(table).filter(function (r) {
        return matchFilters(r, filters);
      });
      callback(rows);
    }, 0);
  };

  global.createRecord = function (table, record, callback) {
    var rows = loadTable(table);
    record.id = record.id || "r" + Date.now();
    rows.push(record);
    saveTable(table, rows);
    setTimeout(function () {
      callback(record);
    }, 0);
  };

  global.updateRecord = function (table, record, callback) {
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
  };

  function bootUi() {
    ensureDemoData();
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

    if (global.location && global.location.protocol === "file:") {
      console.warn(
        "[Shark Tank] Open via RUN.bat → http://localhost:8080/ for reliable button clicks."
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootUi);
  } else {
    bootUi();
  }

  global.__sharkTankRuntime = true;
})(window);