// returns a list of indexes pertaining to the questions which are toggled
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

// Updates the toggled questions after submission
function update_toggled_questions(){
	var file_text = this.responseText;
	var lines = file_text.split("\n");
	var i;
  var preferences;
	for (i = 0; i < lines.length-1; i++) {
        if (lines[i][0] == '#') {
          continue;
        }
        preferences = lines[i].split(",")
  }

  var checkboxes = document.getElementsByName("box");
  for (i = 0; i < preferences.length; i++) {
    if (preferences[i] == 1) {
      checkboxes[i].setAttribute("checked","checked");
    }
  }
}

function update_questions(){
  preferences = list_toggled_questions();
  console.log("Questions Toggled:",preferences);
  // TODO: update text file
  // update_toggled_questions()

}
// Adds event listeners to checkboxes (events when 'checked' and 'unchecked')
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


function open_file(callback) {
		const url = chrome.runtime.getURL("preferences.csv");
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
	 	xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if (typeof callback == "function") {
					aDictionary = callback.apply(xhr)
				}
			}
		};
		xhr.send();
}

function main() {
  add_listeners();
  open_file(update_toggled_questions); // Read's the preferences.txt file and then updates the checkboxes accordingly
  // prefs = list_toggled_questions();
  // open_file(update_preferences(prefs));
}

main();
