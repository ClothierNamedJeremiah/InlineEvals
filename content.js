function create_table_header(cell, title) {
  var td = document.createElement('td');
  td.setAttribute("class","dddead")
  td.setAttribute("width", 100)
  td.appendChild(document.createTextNode(title));
  cell.append(td)
}

function add_headers() {
  var tbl = document.getElementsByClassName("datadisplaytable")[0]; // table reference
  var i; // row index

  for (i = 0; i < tbl.rows.length; i++) {
    var row = tbl.rows[i].getElementsByClassName("dddead");
    console.log(row)
      try{
        var x = row[1].textContent;
        console.log(x)

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

add_headers()
