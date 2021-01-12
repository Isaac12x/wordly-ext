// const host = "https://wordly.mammbo.com/"
const host = "http://127.0.0.1:8000/";


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
//  }
//});

function msgCallback(result) {
    let msg = result === true ? "success" : "failed";
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	      var activeTab = tabs[0];
	      chrome.tabs.sendMessage(activeTab.id, {"wu982": result, });
    });
}

function pushToLexicon(item, callback) {
  var uri = "api/words/new/";
    chrome.storage.sync.get(["wordstkn", "wordssid"], function(result) {
        var originurl = chrome.tabs.query({active: true, currentWindow: true}, function(tab){
            try{
            var endpoint = host + uri +  result.wordssid + "/" +  item + "/";
            $.ajax({
                 type: "POST",
                 url: endpoint,
                 beforeSend: function(xhr) {
                     xhr.setRequestHeader("Authorization", `Bearer ${result.wordstkn}`);
                 },
                 data: {
                     "url": tab[0].url ? tab[0] : "n"
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
             })
            }catch (err) {
                
            var endpoint = host+uri+"?qid=" + result.wordssid + "&itm=" + item + "&pu=" + tab[0].url;
            $.ajax({
                type: "GET",
                url: endpoint,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", `Bearer ${result.wordstkn}`);
                },
                success: function(response) {
                    callback(true);
                    return;
                },
                error: function(xhr, status, error) {
                    callback(false);
                    return;
                }
            });

            }
        })
  });
}


function getUserId(callback) {
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
    var arr = menuItemId.selectionText.split(" ");
    if (
      (menuItemId.selectionText !== "undefined" ||
        menuItemId.selectionText !== undefined) 
    ) {        
	      pushToLexicon(menuItemId.selectionText, msgCallback);
     }
  }
});

/// Add shortcut support
// chrome.commands.onCommand.addListener(function(command, selectionText) {
//   if (command == "send-to-pushToLexicon" && (selectionText != "" || selectionText != undefined) {
//     pushToLexicon()
//   }
// })

/// Adds Omnibox support
chrome.omnibox.onInputEntered.addListener(function(text, disposition, callback) {
    var check = checkWordBeforeSending(text);
    if (check === true) {
        var result = pushToLexicon(text, callback);
    }
    /// Add callback response to show on the chrome search bar.
    /// show result on the chrome bar.
});


function checkWordBeforeSending(text) {
  if (text.split(" ") >= 4) {
      return -1;
  } else {
      return true;
  }
}

function checkLength(words) {
    if (text.length >= 200) {
       const text_atoms = text.split(" ");
       // while () {
       //     text_atoms.pop()
   }
}
