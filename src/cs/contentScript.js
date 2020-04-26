var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    port.postMessage(event.data.text);
  }
}, false);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
	if (request.message === "wu982") {
	    // display success message
	    var successNotification = "<div style='position:absolute; top: 10px; left: 10px; height: 100px; width: auto; background-color:green;'><p>Word has been stored</p></div>"
	    $('body').append(successNotification);
	} else {
    var successNotification = "<div style='position:absolute; top: 10px; left: 10px; height: 100px; width: auto; background-color:red;'><p>Didn't work out</p></div>"
    $('body').append(successNotification);
  }
    });


// 
// var contentScript = """
// <wordlyTag>
//   <wordlyWrapper>
//     <wordlyNotification>
//       Successfully Added
//     </wordlyNotification>
//   </wordlyWrapper>
// </wordlyTag>
// """
//
// document.documentElement.appendChild(contentScript)
