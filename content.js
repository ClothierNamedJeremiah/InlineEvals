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
    var row = tbl.rows[i].getElementsByClassName("dddead");
    var cell = row[0];
    try {
      cell.colspan
    } catch(err) {
      create_table_header(tbl.rows[i],title);
      break;
    }

  }
}

add_column("TEST 123")
