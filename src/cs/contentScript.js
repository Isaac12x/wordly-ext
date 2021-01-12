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

var successfulPush = '<div class="left aligned floating ui label"><i class="candy cane icon"></i> Successfully added to Wordly</div>'
var errorPush = "<div class='left aligned floating ui label'><i class='pepper hot icon'></i> Couldn\'t send the word to wordly. </div>"

function insertUI (s) {
    /// grabs the element, finds the word/s and substitutes the word by the element
    /// <span style="background-color: #FFFF00">{s}</span>
    var doc = document.createElement("div");
    doc.setAttribute("class", "ui card");
    doc.setAttribute("data-html", s);
    return doc
}

function insertCSS(){
    var link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.7/dist/semantic.min.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
}
function insertJS() {
    var srp= document.createElement("script");
    srp.src = "https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.7/dist/semantic.min.js";
    document.getElementsByTagName("head")[0].appendChild(srp);
}


function insertJSAnimation(){
    var srp= document.createElement("script");
    srp.src = "https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js";
    document.getElementsByTagName("head")[0].appendChild(srp);
    
}



function addAnimation () {
    const container = document.getElementById('container');
    const checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', "circle")
    const checkPath = document.createElementNS('http://www.w3.org/2000/svg', "path")
    checkmark.setAttribute("class", "checkmark");
    checkmark.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    checkmark.setAttribute("width", "32");
    checkmark.setAttribute("height", "32");
    checkmark.setAttribute("viewBox", "0 0 32 32");

    circle.setAttribute("class", "circle");
    circle.setAttribute("cx", "16");
    circle.setAttribute("cy", "16");
    circle.setAttribute("r", "16");
    circle.setAttribute("fill", "#0c3");

    checkPath.setAttribute("class", "check");
    checkPath.setAttribute("d", "M9 16l5 5 9-9");
    checkPath.setAttribute("fill", "none");
    checkPath.setAttribute("stroke", "#fff");
    checkPath.setAttribute("stroke-width", "2.5");
    checkPath.setAttribute("stroke-linecap", "round");
    
    checkmark.appendChild(circle);
    checkmark.appendChild(checkPath);
    return checkmark;
}


function animate() {
   
    var checkTimeline = anime.timeline({ autoplay: true, direction: 'alternate', loop: false });
    checkTimeline
        .add({
            targets: '.checkmark',
            scale: [
                { value: [0, 1], duration: 600, easing: 'easeOutQuad' }
            ]
        })
        .add({
            targets: '.check',
            strokeDashoffset: {
                value: [anime.setDashoffset, 0],
                duration: 700,
                delay: 200,
                easing: 'easeOutQuart'
            },
                    translateX: {
                        value: [6, 0],
                        duration: 700,
                        delay: 200,
                        easing: 'easeOutQuart'
                    },
                    translateY: {
                        value: [-2, 0],
                        duration: 700,
                        delay: 200,
                        easing: 'easeOutQuart'
                    },
                    offset: 0
        });
    checkTimeline.finished.then(function () {
        $('.checkmark').css('display', 'none');
    })
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        var message = request['wu982'] === true ? successfulPush : errorPush;
        var parentNode = getSelectionParentElement()
//        console.log(parentNode)
        var currentChild = window.getSelection()
        //console.log(currentChild)
        var newChild = insertUI(message) // type Selection
        insertJSAnimation()
        try {
            parentNode.prepend(addAnimation()) //change to insertBeforeSelection
        } catch (err) {parentNode.insertBefore(addAnimation())}
        animate()
        
    })

function getSelectionParentElement() {
    /// from https://stackoverflow.com/questions/7215479/get-parent-element-of-a-selected-text
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    return parentEl;
}



