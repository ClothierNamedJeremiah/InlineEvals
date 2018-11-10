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
	if (text != "-") {
		var value = parseFloat(text);
		if (value < 2.5) {
			td.setAttribute("id","poor_quality");
		} else if (value < 3.5) {
			td.setAttribute("id","average");
		} else {
			td.setAttribute("id","good_quality");
		}
	} else {
		td.setAttribute("id","nah"); // TODO: N/A style?
	}
  cell.append(td)
}

function add_table_cells(number, prof){
    var tbl = document.getElementsByClassName("datadisplaytable")[0]; // table reference
    var i; // row index
        for (i = 0; i < tbl.rows.length; i++) {
        var row = tbl.rows[i].getElementsByClassName("dddefault");
            try{
            var teacher = row[7].textContent
                if(teacher == "tba"){
                    create_table_cell(tbl.rows[i],"-")
                     create_table_cell(tbl.rows[i],"-")
                     create_table_cell(tbl.rows[i],"-")
                }
                else if (row.length > 0) {
                    create_table_cell(tbl.rows[i],"1.0")
                    create_table_cell(tbl.rows[i],"2.0")
                    create_table_cell(tbl.rows[i],"3.0")
                }
            }
            catch(err) {
                continue;
            }
        // If the length is greater than 0, we're looking at an actual table row we can append to

    }
}

function add_table_headers() {
  var tbl = document.getElementsByClassName("datadisplaytable")[0]; // table reference
  var i; // row index

  for (i = 0; i < tbl.rows.length; i++) {
    var row = tbl.rows[i].getElementsByClassName("dddead");
      try{
        var x = row[1].textContent;

        if (x == "Grading Options:") { // Non-breakable space is char 160
            create_table_header(tbl.rows[i+2],"Clarity");
            create_table_header(tbl.rows[i+2],"Amount Learned");
            create_table_header(tbl.rows[i+2],"Instructor Rating");
            create_table_header(tbl.rows[i+2],"Course Quality");
            

          }
      }
      catch(err) {
          continue;
      }
  }
}

function open_file(callback) {
		const url = chrome.runtime.getURL("data/data.txt");
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
	 	xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if (typeof callback == "function") {
					callback.apply(xhr)
				}
			}
		};
		xhr.send();
}

function read_file(){
	var prof_dict = {};
	var file_text = this.responseText;
	var lines = file_text.split("\n");
	var i;
	for (i = 0; i < lines.length-1; i++) {
    //console.log(lines[i])
    var aLine = lines[i].split(",")
    // console.log(aLine)
    prof_dict[aLine[3]] = aLine

  }
  //console.log(prof_dict)
}

open_file(read_file)
add_table_headers()
add_table_cells()
