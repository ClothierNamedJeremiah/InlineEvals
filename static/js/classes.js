// GLOBAL VARIABLES
var HEADERS = ["Course Quality","Quality of Instruction","Course Organization","Effective use of Time","Instructor Availability","Grading Clarity","Amount Learned"]  // Header's for Questions
var COLUMNS_DISPLAYED; // number of addtional columns being displayed
var PREFS; // User's preferences for which questions they want displayed

// opens vals.txt
function open_file_map(callback) {
		const url = chrome.runtime.getURL("vals.txt");
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

// Read's vals.txt and creates a dictionary {Key: CSV/filename.csv}
function read_file_map(){
  file_map = new Map();
	var file_text = this.responseText;
	var lines = file_text.split("\n");
	var i;
	for (i = 0; i < lines.length-1; i++) {
        var line = lines[i].split("@")
        var key = line[0]
        var file_name = line[1]
        file_map.set(key,file_name);
  }
  // Post condition: File_Map is defined
  open_data_file(read_data_map,file_map);
}

// opens CSV/file_name
function open_data_file(callback,file_map) {
  var subjects = document.getElementById('subj_id');
  var current = subjects.options[subjects.selectedIndex].value;
  var file_name = file_map.get(current)
  file_name = "CSV/" + file_name
  console.log("Trying to open:",file_name)
	const url = chrome.runtime.getURL(file_name);
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

// Read's the file from function 'open_data_file' and creates a dictionary
// of professors
function read_data_map(){
  prof_dict = {}
	var file_text = this.responseText;
	var lines = file_text.split("\n");
	var i;
	for (i = 0; i < lines.length-1; i++) {
        var line = lines[i].split(",")
        var line_data = lines[i].split(',');
        prof_dict[line_data[1] + line_data[3].toLowerCase()] = line_data;
  }
  add_table_cells(prof_dict)
}

function create_table_header(cell, header_title) {
  var td = document.createElement('td');
  td.setAttribute("class","dddead")
  td.appendChild(document.createTextNode(header_title));
  cell.append(td)
}

function create_table_cell(cell, text){
  // Create Table Element
  var td = document.createElement('td');
  td.setAttribute("class","dddefault");
  td.appendChild(document.createTextNode(text))

  // COLOR FOR CSS Here
	if (text != String.fromCharCode(45)) {
		var value = parseFloat(text);
		if (value < 3.0) {
			td.setAttribute("id","poor_quality");
		} else if (value < 4) {
			td.setAttribute("id","average");
		} else {
			td.setAttribute("id","good_quality");
		}
	} else {
		td.setAttribute("id","nah"); // TODO: N/A style?
	}
  cell.append(td)
}

function add_table_cells(prof_dict){
	console.log("Prof Dict:",prof_dict);
  var tbl = document.getElementsByClassName("datadisplaytable")[0]; // table reference
  var i; // row index
  var curClass = ""
  for (i = 0; i < tbl.rows.length; i++) {
    var course_number;
    var prof_last_name;
      // Extract the Course Number from the webpage
      // For example, is the class_header has " ACTG 211   Intro Accounting I" we want to extract 211
      var class_header = tbl.rows[i].getElementsByClassName("dddead"); // List of td.dddead elements
      if ((class_header.length > 0)
        && (typeof(class_header[0]) != "undefined")
        && (class_header[0].hasAttribute("colspan"))
        && (class_header[0].colSpan == 6)) {
          course_number = class_header[0].textContent.trim().split(" ")[1];
      }

      // Extract the Instructor's name from the webpage
      var class_table_row = tbl.rows[i].getElementsByClassName("dddefault");
      if ((class_table_row.length > 0)
        && (typeof(class_table_row[7]) != "undefined")
        && (class_table_row[7].hasAttribute("width"))
        && (class_table_row[7].width == 110)) {
          prof_last_name = class_table_row[7].textContent.trim().split(" ")[0]
      }

      if (typeof(course_number) != "undefined" && typeof(prof_last_name) != "undefined" && tbl.rows[i].cells.length == 9){
        // TODO: It's probably best to not hardcode length == 9 to determine where to append cells
        if (prof_last_name == "tba" || prof_last_name == "STAFF") {
          // console.log(tbl.rows[i].cells.length,tbl.rows[i]);
          var j;
          for (j = 0; j < COLUMNS_DISPLAYED; j++) {
             create_table_cell(tbl.rows[i],"-")
          }
        } else {
          var j;
          var key = course_number+ prof_last_name.toLowerCase();
          // Check if we have data on a professor for a specific course & populate the cells
          if (key in prof_dict) {
            for (j = 0; j < PREFS.length; j++) {
              if (PREFS[j] == "1") {
                create_table_cell(tbl.rows[i], prof_dict[key][j+5]);
              }
            }
          } else { // No Data on that professor
            for (j = 0; j < COLUMNS_DISPLAYED; j++) {
               create_table_cell(tbl.rows[i],"-")
            }
          }
        }
      } else {
        continue;
      }
    }
}

function add_table_headers() {
  // if a preference's key doesn't exist then initialize it to a default value
  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    // Initialize Preferences if not already done
    if (allKeys.indexOf("preferences") <= -1) {
      chrome.storage.sync.set({'preferences':"1,1,0,0,0,1,1"}, function() {
              console.log('Question preferences intialized to default values');
            });
    }
    // Use Preferences to build table headers
    chrome.storage.sync.get('preferences', function(result) {
      var i;
      var preferences = result["preferences"].split(',');
      PREFS = preferences;
      var tbl = document.getElementsByClassName("datadisplaytable")[0] // table reference
      for (i = 0; i < tbl.rows.length; i++) {
        var row = tbl.rows[i].getElementsByClassName("dddead");
        if ((row.length > 0)
          && (typeof(row[1]) != "undefined")
          && (row[1].textContent == "Grading Options:")) {
            // Append new columns (table_headers) based on the user's preferences
            var j;
            var columns_counter = 0;
            for (j = 0; j < HEADERS.length; j++) {
              if (preferences[j] == '1') {
                columns_counter += 1;
                create_table_header(tbl.rows[i+2],HEADERS[j]);
              }
            }
            COLUMNS_DISPLAYED = columns_counter;
        }
      }
    });
  });
}

function main() {
  add_table_headers();
  open_file_map(read_file_map);
}

main();
