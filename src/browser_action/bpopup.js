var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var form = document.getElementById('loginform').onsubmit = function(event) {makeLogin(event)}
var clickMessage = document.getElementById('message-button').onclick = function(event) {reloadForm(event)}

function reloadForm(event, callback) {
  event.preventDefault()
  document.getElementById("loginform").classList.remove('hdn');
  document.getElementById("message").classList.add('hdn');
}

function makeLogin(event, callback) {
  event.preventDefault();
  document.getElementById("loader").classList.remove('hdn')
  var user = document.getElementById("email-address").value;
  var pass = document.getElementById("password").value;
  var data = {'user': user, 'password': pass}

  document.getElementById("message").classList.remove('hdn')
  document.getElementById("loader").classList.add('hdn')
  document.getElementById("loginform").classList.add('hdn')

  chrome.runtime.sendMessage({action: "login", data: data}, function(response) {

  })
};
