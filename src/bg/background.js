chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "addToWordly",
    type: "normal",
    title: " --> Save to Wordly",
    contexts: ["selection"]
  });

  chrome.storage.local.get("signed_in", function(data) {
    if (data.signed_in === true) {
      chrome.browserAction.setPopup({
        popup: "src/browser_action/browser_action.html"
      });
    } else {
      chrome.browserAction.setPopup({
        popup: "src/browser_action/login_popup.html"
      });
    }
  });
});

//chrome.runtime.onMessage.addListener(function(message, callback) {
//  if (message == "runContentScript") {
//    chrome.tabs.executeScript({
//      file: "src/cs/contentScript.js"
//    });
  }
//});

function msgCallback(result) {
    console.log("executing message callback");
    let msg = result;
    if (typeof result === true) {
	msg = "success"}
    else {
	msg = "failed" }
    console.log("sending message to tab");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	var activeTab = tabs[0];
	chrome.tabs.sendMessage(activeTab.id, {"wu982": result})})}

function pushToLexicon(item, callback) {
 // var host = "https://wordsstorer.herokuapp.com/";
    var host = "http://127.0.0.1:8000/"; 
  var uri = "api/words/new";
  chrome.storage.sync.get(["wordstkn", "wordssid"], function(result) {
    var endpoint = host + uri + "/" + result.wordssid + "/" + item;
    $.ajax({
      type: "POST",
      url: endpoint,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", `Bearer ${result.wordstkn}`);
      },
      contentType: "application/x-www-form-urlencoded",
      success: function(response) {
        callback(true);
        return;
      },
      error: function(xhr, status, error) {
        callback(false);
        return;
      }
    });
  });
}

function getUserId(callback) {
    //  var host = "https://wordsstorer.herokuapp.com/";
    var host = "http://127.0.0.1:8000/";
  var uri = "api/userid/";
  var endpoint = host + uri;

  chrome.storage.sync.get(["wordstkn"], function(result) {
    $.ajax({
      type: "GET",
      url: endpoint,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", `Bearer ${result.wordstkn}`);
      },
      contentType: "application/x-www-form-urlencoded",
      success: function(response) {

        chrome.storage.sync.set(
          { wordssid: response.id, signed_in: true },
          function() {}
        );
        chrome.browserAction.setBadgeText({ text: "ON" });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#99cc99" });
        chrome.browserAction.setPopup({
          popup: "src/browser_action/browser_action.html"
        });
        // chrome.contextMenus.create({
        //   id: "addToLexicon",
        //   type: "normal",
        //   title: " --> Save to Wordly",
        //   contexts: ["all"]
        // });
        callback(true);
        return;
      },
      error: function(xhr, status, error) {
        chrome.browserAction.setBadgeText({ text: "OFF" });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#ff3333" });
        chrome.browserAction.setPopup({
          popup: "src/browser_action/login_popup.html"
        });
        callback(false);
        return;
      }
    });
  });
}

function makeLogin(user, pass, callback) {
    //  var host = "https://wordsstorer.herokuapp.com/";
    var host = "http://127.0.0.1:8000/";
  var uri = "api/token/";

  var endpoint = host + uri;

  $.post(endpoint, { username: user, password: pass }, function(res) {
    chrome.storage.sync.set({ wordstkn: res.access }, function(resp) {
      getUserId(function(result) {
        callback(true);
      });
    });
  }).error(function(err) {
    chrome.browserAction.setPopup({
      popup: "src/browser_action/login_popup.html"
    });
    callback(false);
  });
}




chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "login") {
    makeLogin(message.data.user, message.data.password, function(result) {
      return;
    });
  } else if (message === "goodbye") {
    chrome.runtime.Port.disconnect();
  }
});

chrome.contextMenus.onClicked.addListener(function(menuItemId, selectionText) {
  if (menuItemId.menuItemId == "addToWordly") {
    /// check no errors :)
    var arr = menuItemId.selectionText.split(" ");
    if (
      (menuItemId.selectionText !== "undefined" ||
        menuItemId.selectionText !== undefined) &&
      1 >= arr.length <= 3
    ) {
	pushToLexicon(menuItemId.selectionText, msgCallback)
    } else if (arr.length <= 3) {
      //check if it is a word.
      /// else error!
    }
  }
});

/// Add shortcut command support
// chrome.commands.onCommand.addListener(function(command,) {
//   if (command == "send-to-pushToLexicon") {
//     pushToLexicon()
//   }
// })

/// Add Omnibox support
chrome.omnibox.onInputEntered.addListener(function(text, disposition) {
  if (text.split(" ") >= 4) {
  } else {
    pushToLexicon(menuItemId.text);
  }
});
