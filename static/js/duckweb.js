// GLOBAL VARIABLES
var HEADERS = ["Course Quality","Quality of Instruction","Course Organization","Effective use of Time","Instructor Availability","Grading Clarity","Amount Learned"]  // Header's for Questions
var COLUMNS_DISPLAYED; // number of addtional columns being displayed
var PREFS; // User's preferences for which questions they want displayed
var ROW_INDEX = 0;

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
        var key = line[1].split(".")[0] // Key is subject name
        var file_name = line[1]
        file_map.set(key,file_name);
  }
  // Post condition: File_Map is defined
  open_data_file(read_data_map,file_map);
}

// opens CSV/file_name
function open_data_file(callback,file_map) {
  var subject = document.getElementsByClassName("datadisplaytable")[0]["rows"][ROW_INDEX].textContent.trim(); // 'query' to get subject header names from datadisplaytable
	console.log("Subject:",subject)
	var file_name = file_map.get(subject)
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
  add_table_cells(prof_dict) // TODO: edit this function
}

function add_table_cells(prof_dict) {
  tbl = document.getElementsByClassName("datadisplaytable")[0];
  rows = tbl["rows"];
  for (i = 0; ROW_INDEX < rows.length; ROW_INDEX++) {
		var course_number;
		var prof_last_name;
    // Case: A new subject is encountered and we need to open a new file
		// If a new subject is encountered then open a new file and exit the current function
    if (rows[ROW_INDEX].getElementsByClassName("ddtitle").length == 1) {
			if (i == 0) {
				i = 1 // we do not want to open the first file twice, this is a flag to avoid such cases
			} else {
				// Problem this solves: needing to open the file multiple times
				// Ideally we are slowly progressing towards the 'finish line' of the datadisplay table
				console.log(file_map)
				open_data_file(read_data_map,file_map);
				return null;
			}

    }
		var table_row = tbl.rows[ROW_INDEX].getElementsByClassName("dddefault");

		// Populate Discussion Sections with 'N/A' attribute
		if ((table_row.length > 0) && (table_row[2].textContent.trim() == "")) {
			var j;
			for (j = 0; j < COLUMNS_DISPLAYED; j++) {
				 create_table_cell(tbl.rows[ROW_INDEX],"-");
			}
		} else {
			if (typeof(table_row[table_row.length-3]) != "undefined") {
				prof_last_name = table_row[table_row.length-3].textContent.trim().split(" ")[1]
				course_number = table_row[3].textContent.trim().split(" ")[0]
				if (typeof(prof_last_name) == "undefined") {
					prof_last_name = "none"
				}
				var key = course_number + prof_last_name.toLowerCase();
				var j;
				if (key in prof_dict) {
					for (j = 0; j < PREFS.length; j++) {
						if (PREFS[j] == "1") {
							create_table_cell(tbl.rows[ROW_INDEX], prof_dict[key][j+5]);
						}
					}
				} else { // No Data on that professor
					for (j = 0; j < COLUMNS_DISPLAYED; j++) {
						 create_table_cell(tbl.rows[ROW_INDEX],"-")
					}
				}
			}
		}
  }
}

function test_get_subject(){
  var i;
  tbl = document.getElementsByClassName("datadisplaytable")[0];
  rows = tbl["rows"];
  for (i = 0; i < rows.length; i++) {
    columns = rows[i].getElementsByTagName("td");
    console.log(columns.length,columns);
  }
}


function create_table_header(cell, header_title) {
  var th = document.createElement('th');
  th.setAttribute("class","ddheader")
  th.setAttribute("scope","col");
  th.appendChild(document.createTextNode(header_title));
  cell.append(th)
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
        var row = tbl.rows[i].getElementsByClassName("ddtitle");
        if (row.length == 1) {
          var j;
          var columns_counter = 0;
          for (j = 0; j < HEADERS.length; j++) {
            if (preferences[j] == '1') {
              columns_counter += 1;
              create_table_header(tbl.rows[i+2],HEADERS[j]);
            }
          }
          row[0].colSpan += columns_counter; // Extend Subject's CSS to accomidate for the new columns
          COLUMNS_DISPLAYED = columns_counter;
        }
      } // end of for loop
    });
  });
}

function main() {
  add_table_headers();
	open_file_map(read_file_map);
}

main();
