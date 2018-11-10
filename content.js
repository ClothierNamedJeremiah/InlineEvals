function create_table_header(cell, title) {
  var td = document.createElement('td');
  td.setAttribute("class","dddhead")
  td.appendChild(document.createTextNode(title));
  cell.append(td)
}

function add_column(title) {
  var tbl = document.getElementsByClassName("datadisplaytable")[0]; // table reference
  var i; // row index

  for (i = 0; i < tbl.rows.length; i++) {
    var isHeader = tbl.rows[i].getElementsByClassName("dddead")
    // console.log(isHeader);
    if (isHeader) {
      create_table_header(tbl.rows[i+2],title)
      break;
      i += 3;
    }

  }
}

add_column("TEST 123")
