/**
 * Paste this ENTIRE file into App Lab → Code for project:
 * https://studio.code.org/projects/applab/32465489-8f17-4bb5-8e1b-8c845b1539aa/edit
 *
 * Matches YOUR Design IDs (not the local export).
 * Uses only App Lab APIs (no document).
 */
var userName = "";
var finderNoticeText = "";
var FINDER_NOTIF_KEY = "sharkTank_FinderNotifs";

var PROFILE_MAKER_ID = "image7";
var PROFILE_FINDER_ID = "image2";
var BOTH_PICK_MAKER = "both_maker";
var BOTH_PICK_FINDER = "both_finder";

function loadFinderNotifications() {
  var raw = getKeyValue(FINDER_NOTIF_KEY);
  if (!raw) {
    return [];
  }
  try {
    var list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveFinderNotifications(list) {
  setKeyValue(FINDER_NOTIF_KEY, JSON.stringify(list));
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

var makerNoticeText = "";
var DEFAULT_ITEM_IMG = "";

function applyMakerImageLayout(portrait) {
  var height = portrait ? 180 : 112;
  // App Lab: images allow height in setProperty, not position (top/left).
  setProperty("image4", "height", height + "px");
  return height;
}

function presentMakerNotification(message) {
  makerNoticeText = message;
  setText("label7", message);
  showElement("label7");
}

function setMakerOrderView(records, orderNumber) {
  var record = records[orderNumber];
  if (!record) {
    return;
  }
  showElement("image4");
  var img = (record.Image && String(record.Image).trim()) || DEFAULT_ITEM_IMG;
  if (img) {
    setImageURL("image4", img);
  }
  var portrait = false;
  applyMakerImageLayout(portrait);
  setText(
    "label5",
    "Name: " +
      record.Name +
      "\nImage:\n\n\n\n\n\n\n\n\n\n\n\nKind: " +
      record.Kind +
      "\nAddress: " +
      record.Address
  );
}

function presentFinderNotification(message) {
  finderNoticeText = message;
  setText("label6", message);
  showElement("label6");
  hideElement("ring1");
}

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
    "bothButton",
    "border-color",
    bothOn ? "#2563eb" : "#bfdbfe"
  );
  setProperty(
    "bothButton",
    "background-color",
    rgb(26, 188, 156)
  );
}

function clearRoleSelectionHighlight() {
  setRoleHighlight("");
}

onEvent("button1", "click", function () {
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
  if (!profileIconStore[PROFILE_MAKER_ID]) {
    profileIconStore[PROFILE_MAKER_ID] = getImageURL(PROFILE_MAKER_ID);
  }
  if (!profileIconStore[PROFILE_FINDER_ID]) {
    profileIconStore[PROFILE_FINDER_ID] = getImageURL(PROFILE_FINDER_ID);
  }
}

function applyBothProfileIcons(useUndo) {
  rememberProfileIcons();
  if (useUndo) {
    setImageURL(PROFILE_MAKER_ID, UNDO_ICON_SRC);
    setImageURL(PROFILE_FINDER_ID, UNDO_ICON_SRC);
    setProperty(PROFILE_MAKER_ID, "border-color", "#1e5a9e");
    setProperty(PROFILE_FINDER_ID, "border-color", "#1e5a9e");
  } else {
    if (profileIconStore[PROFILE_MAKER_ID]) {
      setImageURL(PROFILE_MAKER_ID, profileIconStore[PROFILE_MAKER_ID]);
    }
    if (profileIconStore[PROFILE_FINDER_ID]) {
      setImageURL(PROFILE_FINDER_ID, profileIconStore[PROFILE_FINDER_ID]);
    }
  }
}

function openBothHome() {
  setScreen("bothScreen1");
  setText("label9", "Choose Maker or Finder");
  hideElement("nextStepBtn");
}

function enterMakerDashboard() {
  setScreen("makerScreen1");
  hideElement("label7");
  makerNoticeText = "";
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
  applyBothProfileIcons(role === "Both");
  var msg = latestUnreadFinderMessage(userName);
  if (msg) {
    presentFinderNotification(msg);
  }
}

setText("roleTitle", "Hello, " + getText("naem") + "!\nChoose your role!");
hideElement("nextStepBtn");

onEvent("makerImage", "click", function () {
  role = "Maker";
  setText("choiceText", "Great choice — you'll remake items sustainably.");
  setRoleHighlight("Maker");
  showElement("nextStepBtn");
});

onEvent("finderImage", "click", function () {
  role = "Finder";
  setText("choiceText", "Great choice — you'll share items for reuse.");
  setRoleHighlight("Finder");
  showElement("nextStepBtn");
});

onEvent("bothButton", "click", function () {
  role = "Both";
  setRoleHighlight("Both");
  setText("choiceText", "You're both roles — next, pick Maker or Finder.");
  showElement("nextStepBtn");
});

onEvent("nextStepBtn", "click", function () {
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

onEvent(BOTH_PICK_MAKER, "click", function () {
  if (role == "Both") {
    enterMakerDashboard();
  }
});

onEvent(BOTH_PICK_FINDER, "click", function () {
  if (role == "Both") {
    enterFinderDashboard();
  }
});

onEvent(PROFILE_MAKER_ID, "click", function () {
  if (role == "Both") {
    openBothHome();
  }
});

onEvent(PROFILE_FINDER_ID, "click", function () {
  if (role == "Both") {
    openBothHome();
  }
});

onEvent("image5", "click", function () {
  readRecords("Finders", {}, function (records) {
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
