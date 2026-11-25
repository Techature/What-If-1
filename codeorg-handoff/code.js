var userName = "";
var finderNoticeText = "";
var FINDER_NOTIF_KEY = "sharkTank_FinderNotifs";

function loadFinderNotifications() {
  try {
    var raw = localStorage.getItem(FINDER_NOTIF_KEY);
    var list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveFinderNotifications(list) {
  localStorage.setItem(FINDER_NOTIF_KEY, JSON.stringify(list));
}

function pushFinderNotification(targetName, message) {
  var list = loadFinderNotifications();
  list.push({
    forUser: targetName,
    message: message,
    read: false,
    ts: Date.now(),
  });
  saveFinderNotifications(list);
}

function latestUnreadFinderMessage(name) {
  var unread = loadFinderNotifications().filter(function (n) {
    return n.forUser === name && !n.read;
  });
  if (unread.length === 0) {
    return "";
  }
  return unread[unread.length - 1].message;
}

function markFinderNotificationsRead(name) {
  var list = loadFinderNotifications();
  var changed = false;
  list.forEach(function (n) {
    if (n.forUser === name && !n.read) {
      n.read = true;
      changed = true;
    }
  });
  if (changed) {
    saveFinderNotifications(list);
  }
}

function setFinderBellBadge(show) {
  var bell = document.getElementById("finderBell");
  if (!bell) {
    return;
  }
  if (show) {
    bell.classList.add("has-unread");
  } else {
    bell.classList.remove("has-unread");
  }
}

function syncFinderInboxFromStorage() {
  var msg = latestUnreadFinderMessage(userName);
  if (msg) {
    presentFinderNotification(msg);
  } else {
    finderNoticeText = "";
    setFinderBellBadge(false);
    hideElement("finderNotice");
    showElement("finderBell");
  }
}
var makerNoticeText = "";
var DEFAULT_ITEM_IMG = "assets/Screenshot-2026-11-19-095606.png";

var MAKER_IMG_TOP = 88;
var MAKER_TOOLBAR_TOP = 382;
var MAKER_META_RESERVE = 54;

function fitMakerItemImage(url, done) {
  var probe = new Image();
  probe.onload = function () {
    done(probe.naturalHeight > probe.naturalWidth);
  };
  probe.onerror = function () {
    done(false);
  };
  probe.src = url;
}

function applyMakerImageLayout(portrait) {
  var el = document.getElementById("image4");
  var maxHeight =
    MAKER_TOOLBAR_TOP - MAKER_IMG_TOP - MAKER_META_RESERVE - 10;
  var height = portrait ? Math.min(210, maxHeight) : 112;
  if (!el) {
    return { height: height, metaTop: MAKER_IMG_TOP + height + 8 };
  }
  el.classList.remove("st-item-portrait", "st-item-landscape");
  el.classList.add(portrait ? "st-item-portrait" : "st-item-landscape");
  setProperty("image4", "height", height + "px");
  setProperty("image4", "top", MAKER_IMG_TOP + "px");
  return { height: height, metaTop: MAKER_IMG_TOP + height + 8 };
}

function presentMakerNotification(message) {
  makerNoticeText = message;
  setText("makerNotice", message);
  hideElement("makerNotice");
  showElement("makerBell");
  var bell = document.getElementById("makerBell");
  if (bell) {
    bell.classList.add("has-unread");
  }
  hideElement("label7");
}

onEvent("makerBell", "click", function () {
  var panel = document.getElementById("makerNotice");
  if (!panel) {
    return;
  }
  var message =
    makerNoticeText !== ""
      ? makerNoticeText
      : "No new notifications yet.";
  if (panel.classList.contains("design-mode-hidden")) {
    setText("makerNotice", message);
    showElement("makerNotice");
    var bell = document.getElementById("makerBell");
    if (bell && makerNoticeText !== "") {
      bell.classList.remove("has-unread");
    }
  } else {
    hideElement("makerNotice");
  }
});

function setMakerOrderView(records, orderNumber) {
  var record = records[orderNumber];
  if (!record) {
    return;
  }
  showElement("image4");
  var img = (record.Image && String(record.Image).trim()) || DEFAULT_ITEM_IMG;
  setImageURL("image4", img);
  fitMakerItemImage(img, function (portrait) {
    var layout = applyMakerImageLayout(portrait);
    setText("label5", "Name: " + record.Name + "\nImage:");
    setText(
      "makerMeta",
      "Kind: " + record.Kind + "\nAddress: " + record.Address
    );
    showElement("makerMeta");
    setProperty("makerMeta", "top", layout.metaTop + "px");
  });
}

function presentFinderNotification(message) {
  finderNoticeText = message;
  setText("finderNotice", message);
  hideElement("finderNotice");
  showElement("finderBell");
  setFinderBellBadge(true);
  hideElement("ring1");
  hideElement("label6");
}

onEvent("finderBell", "click", function () {
  var panel = document.getElementById("finderNotice");
  if (!panel) {
    return;
  }
  var message =
    finderNoticeText !== ""
      ? finderNoticeText
      : "No new notifications yet.";
  if (panel.classList.contains("design-mode-hidden")) {
    setText("finderNotice", message);
    showElement("finderNotice");
    if (
      finderNoticeText !== "" &&
      message !== "No new notifications yet."
    ) {
      markFinderNotificationsRead(userName);
      setFinderBellBadge(false);
    }
  } else {
    hideElement("finderNotice");
  }
});

function setRoleHighlight(selectedRole) {
  var makerOn = selectedRole === "Maker";
  var finderOn = selectedRole === "Finder";
  var bothOn = selectedRole === "Both";
  setProperty(
    "makerImage",
    "border-color",
    makerOn ? "#2563eb" : "#bfdbfe"
  );
  setProperty(
    "finderImage",
    "border-color",
    finderOn ? "#0d9488" : "#99f6e4"
  );
  setProperty(
    "makerCard",
    "border-color",
    makerOn ? "#2563eb" : "rgba(255,255,255,0)"
  );
  setProperty(
    "finderCard",
    "border-color",
    finderOn ? "#0d9488" : "rgba(255,255,255,0)"
  );
  setProperty(
    "bothButton",
    "border-color",
    bothOn ? "#2563eb" : "#bfdbfe"
  );
  setProperty(
    "bothButton",
    "background-color",
    bothOn ? "#eff6ff" : "#ffffff"
  );
}

function clearRoleSelectionHighlight() {
  setRoleHighlight("");
}

onEvent("button1", "click", function() {
  userName = getText("naem");
  if (userName.trim() != "") {
    hideElement("errorText");
    setScreen("screen2");
    setText("roleTitle", "Hello, " + userName + "!\nChoose your role!");
    role = "";
    clearRoleSelectionHighlight();
    hideElement("nextStepBtn");
    setText("choiceText", "Reuse with purpose — pick how you'll participate.");
  } else {
    showElement("errorText");
    setText("errorText", "Please enter your name.");
  }
});
var role = "";
var makerOrderNumber = 0;
var profileIconStore = {};
var UNDO_ICON_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1e5a9e" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>'
  );

function rememberProfileIcons() {
  ["image2", "image3"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && !profileIconStore[id]) {
      profileIconStore[id] = {
        src: el.getAttribute("src"),
        canon: el.getAttribute("data-canonical-image-url"),
        color: el.getAttribute("data-icon-color"),
      };
    }
  });
}

function applyBothProfileIcons(useUndo) {
  rememberProfileIcons();
  ["image2", "image3"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) {
      return;
    }
    if (useUndo) {
      el.setAttribute("data-canonical-image-url", "icon://fa-undo");
      el.setAttribute("data-image-type", "icon");
      el.setAttribute("data-icon-color", "#1e5a9e");
      el.classList.add("st-both-undo");
      setImageURL(id, UNDO_ICON_SRC);
      el.style.cursor = "pointer";
      el.style.objectFit = "contain";
      el.style.backgroundColor = "#ffffff";
      el.style.padding = "8px";
      el.style.boxSizing = "border-box";
    } else if (profileIconStore[id]) {
      el.classList.remove("st-both-undo");
      el.style.objectFit = "cover";
      el.style.backgroundColor = "";
      el.style.padding = "";
      el.style.boxSizing = "";
      el.setAttribute(
        "data-canonical-image-url",
        profileIconStore[id].canon || ""
      );
      el.setAttribute("data-icon-color", profileIconStore[id].color || "");
      setImageURL(id, profileIconStore[id].src);
    }
  });
}

function openBothHome() {
  setScreen("bothScreen1");
  setText("label9", "Choose Maker or Finder");
  hideElement("nextStepBtn");
}

function enterMakerDashboard() {
  setScreen("makerScreen1");
  hideElement("label7");
  hideElement("makerNotice");
  makerNoticeText = "";
  showElement("makerBell");
  applyBothProfileIcons(role === "Both");
  makerOrderNumber = 0;
  readRecords("Finders", {}, function (records) {
    setMakerOrderView(records, makerOrderNumber);
  });
}

function enterFinderDashboard() {
  setScreen("finderScreen1");
  hideElement("button2");
  hideElement("label6");
  hideElement("ring1");
  hideElement("finderNotice");
  showElement("finderBell");
  applyBothProfileIcons(role === "Both");
  syncFinderInboxFromStorage();
}

setText("roleTitle", ("Hello," + getText("naem")) + "!\nChoose your role!");
hideElement("nextStepBtn");

onEvent("makerImage", "click", function() {
  role = "Maker";
  setText("choiceText", "Great choice — you'll remake items sustainably.");
  setRoleHighlight("Maker");
  showElement("nextStepBtn");
});

onEvent("finderImage", "click", function() {
  role = "Finder";
  setText("choiceText", "Great choice — you'll share items for reuse.");
  setRoleHighlight("Finder");
  showElement("nextStepBtn");
});

onEvent("bothButton", "click", function() {
  role = "Both";
  setRoleHighlight("Both");
  setText(
    "choiceText",
    "You're both roles — next, pick Maker or Finder."
  );
  showElement("nextStepBtn");
});

onEvent("nextStepBtn", "click", function() {
  if (role != "") {
    if (role == "Maker") {
      enterMakerDashboard();
    } else if (role == "Finder") {
      enterFinderDashboard();
    } else if (role == "Both") {
      openBothHome();
    }
  } else {
    setText("choiceText", "Please choose Maker, Finder, or Both.");
    setScreen("screen2");
  }
});

onEvent("image7", "click", function () {
  if (role == "Both") {
    enterMakerDashboard();
  }
});

onEvent("image8", "click", function () {
  if (role == "Both") {
    enterFinderDashboard();
  }
});

onEvent("image3", "click", function () {
  if (role == "Both") {
    openBothHome();
  }
});

onEvent("image2", "click", function () {
  if (role == "Both") {
    openBothHome();
  }
});

onEvent("image5", "click", function () {
  readRecords("Finders", {}, function (records) {
    var x = records.length;
    if (makerOrderNumber > 0) {
      makerOrderNumber = makerOrderNumber - 1;
    } else {
      makerOrderNumber = 0;
    }
    setMakerOrderView(records, makerOrderNumber);
  });
});

onEvent("image6", "click", function () {
  readRecords("Finders", {}, function (records) {
    var x = records.length;
    if (makerOrderNumber < x - 1) {
      makerOrderNumber = makerOrderNumber + 1;
    } else {
      makerOrderNumber = 0;
    }
    setMakerOrderView(records, makerOrderNumber);
  });
});

onEvent("sent", "click", function () {
  readRecords("Finders", {}, function (records) {
    var smth = records[makerOrderNumber];
    if (!smth) {
      return;
    }
    smth.Status = "Sent";
    updateRecord("Finders", smth, function (record, success) {
      var kind = smth.Kind || "item";
      pushFinderNotification(
        smth.Name,
        "Your " + kind + " is ready for pickup!"
      );
      presentMakerNotification("Sent! The finder has been notified.");
    });
  });
});

onEvent("text_input1", "change", function () {
  checkFinderForm();
});
onEvent("text_input2", "change", function () {
  checkFinderForm();
});
onEvent("text_input3", "change", function () {
  checkFinderForm();
});
onEvent("button2", "click", function () {
  var finderDetails = {};
  finderDetails.Name = userName;
  finderDetails.Image = getText("text_input1");
  finderDetails.Kind = getText("text_input2");
  finderDetails.Address = getText("text_input3");
  createRecord("Finders", finderDetails, function (record) {
    var courierMsg = "Submitted! Courier your item at Bengaluru.";
    pushFinderNotification(userName, courierMsg);
    presentFinderNotification(courierMsg);
  });
});

function checkFinderForm() {
  if (
    getText("text_input1").trim() != "" &&
    getText("text_input2").trim() != "" &&
    getText("text_input3").trim() != ""
  ) {
    showElement("button2");
  }
}