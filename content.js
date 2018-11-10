function create_table_header(cell, header_title) {
  console.log("Creating Table Header")
  console.log(cell)
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
	if (text != "N/A") {
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
        // If the length is greater than 0, we're looking at an actual table row we can append to
        if (row.length > 0) {
          create_table_cell(tbl.rows[i],"1.0")
          create_table_cell(tbl.rows[i],"2.0")
          create_table_cell(tbl.rows[i],"3.0")
        }
    }
}

function add_table_headers() {
  var tbl = document.getElementsByClassName("datadisplaytable")[0]; // table reference
  var i; // row index

  for (i = 0; i < tbl.rows.length; i++) {
    var row = tbl.rows[i].getElementsByClassName("dddead");
    console.log(row)
      try{
        var x = row[1].textContent;
        //console.log(x)

        if (x == "Grading Options:") { // Non-breakable space is char 160
            create_table_header(tbl.rows[i+2],"Clarity");
            create_table_header(tbl.rows[i+2],"Learned");
            create_table_header(tbl.rows[i+2],"Quality");

          }
      }
      catch(err) {
          continue;
      }
  }
}

add_table_headers()
add_table_cells()
