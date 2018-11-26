// EventListener function for "Submit" Button
function list_toggled_questions() {
  var i;
  var cb = document.getElementsByName("box");
  preferences = [0,0,0,0,0,0,0]; // Flags for preferences.csv
  for (i = 0; i < cb.length; i++) {
    if (cb[i].hasAttribute("checked")) {
      preferences[i] = 1;
    }
  }
  result = preferences.join(",");
  // console.log(result)
  return result
}

// Adds event listeners to checkboxes (events when 'checked' and 'unchecked') & the "Submit" button
function add_listeners() {
  var checkboxes = document.getElementsByTagName("input");
  var i;
  for (i = 0;  i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {
      if (this.checked) {
        // Checkbox is checked
        // console.log("Checked");
        this.setAttribute("checked","checked");
      } else {
        // Checkbox is not checked..
        // console.log("Not Checked");
        this.removeAttribute("checked");
      }
    });
  }
  // Event Listener for submit button
  btn = document.getElementById("submit_button")
  btn.addEventListener("click",update_questions)
}

function update_questions(){
  preferences = list_toggled_questions();
  console.log("Questions Toggled:",preferences);

  chrome.storage.sync.set({'preferences':preferences}, function() {
          console.log('update_questions: Value is set to ' + preferences);
        });

  chrome.storage.sync.get('preferences', function(result) {
          console.log('update_questions: Value currently is ' + result["preferences"]);
        });
}

function main() {
  // if a preference's key doesn't exist then initialize it to a default value
  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    if (allKeys.indexOf("preferences") <= -1) {
      chrome.storage.sync.set({'preferences':"1,1,0,0,0,1,1"}, function() {
              console.log('Preferences Intialized to "1,1,0,0,0,1,1"');
            });
    }
  });

  add_listeners(); // Adds EventListeners to checkboxes and the submit button on popup.html

  // Update's popup.html to display the user's saved question preferences
  chrome.storage.sync.get('preferences', function(result) {
          preferences = result["preferences"].split(',');
          console.log("Preferences:",preferences);
          var cb = document.getElementsByName("box");
          for (i = 0; i < preferences.length; i++) {
            if (preferences[i] == 1) {
              cb[i].setAttribute("checked","checked");
            }
          }
        });
}

main();
