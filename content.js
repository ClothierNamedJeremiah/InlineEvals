

function create_table_header(cell, header_title) {
  var td = document.createElement('td');
  td.setAttribute("class","dddead")
  td.appendChild(document.createTextNode(header_title));
  cell.append(td)
}

function create_graph_hyperlink(cell, header_title) {
//    var td = document.createElement('td');
//    td.setAttribute("class","dddead")
//    td.appendChild(document.createTextNode(header_title));
//    cell.append(td)
    
    
    
    
    var leftDiv = document.createElement("div"); //Create left div
    leftDiv.id = "left"; //Assign div id
    leftDiv.setAttribute("class","dddead")
    a = document.createElement('a');
  
   a.href =  'https://parsabagheri.com/images/test.png'; // Insted of calling setAttribute
    a.innerHTML = header_title // <a>INNER_TEXT</a>
    leftDiv.appendChild(a); // Append the link to the div
    cell.append(leftDiv); // And append the div to the document body
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
    var tbl = document.getElementsByClassName("datadisplaytable")[0]; // table reference
    var i; // row index
    var curClass = ""
    console.log(prof_dict)
        for (i = 0; i < tbl.rows.length; i++) {
            var row = tbl.rows[i].getElementsByClassName("dddefault");
            var rowClass = tbl.rows[i].getElementsByClassName("dddead");
           //console.log(rowClass)
            //console.log(rowClass.length)
            try{
                if(rowClass[0].textContent.includes("CIS")){
                    curClass = rowClass[0].textContent.slice(6,9)
                    create_graph_hyperlink(rowClass[0], "Other Terms Taught")
                    
                }
                  
            }
            catch{
            try{
            var teacher = row[7].textContent
                if(teacher == "tba"){
                    create_table_cell(tbl.rows[i],"-")
                     create_table_cell(tbl.rows[i],"-")
                     create_table_cell(tbl.rows[i],"-")
                     create_table_cell(tbl.rows[i],"-")
                }
                else if (row.length > 0) {
                    
                    teacherList = teacher.split(" ")
                    // console.log(teacherList)
                    //console.log(curClass)
                    var theKey = curClass + teacherList[0]
                    console.log(prof_dict[theKey])
                    listOfScores = prof_dict[theKey]
                    try{
                    create_table_cell(tbl.rows[i], listOfScores[5] )
                    create_table_cell(tbl.rows[i],listOfScores[6])
                    create_table_cell(tbl.rows[i],listOfScores[7])
                    create_table_cell(tbl.rows[i],listOfScores[8])
                    }
                    catch(err){
                        create_table_cell(tbl.rows[i],"-")
                        create_table_cell(tbl.rows[i],"-")
                        create_table_cell(tbl.rows[i],"-")
                        create_table_cell(tbl.rows[i],"-")
                    }
                }
            }
            catch(err) {
                continue;
            }
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
		const url = chrome.runtime.getURL("CIS.csv");
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

function read_file(){
    var prof_dict = {};
	var file_text = this.responseText;
	var lines = file_text.split("\n");
	var i;
	for (i = 0; i < lines.length-1; i++) {
        // console.log(lines[i])
        var aLine = lines[i].split(",")
        // console.log(aLine)
        if(aLine[3] == "Freeman Hennessy"){
        prof_dict[aLine[1] + "Freeman"] = aLine
        }
        else{
        prof_dict[aLine[1] + aLine[3]] = aLine
        }

  }
  add_table_cells(prof_dict)
  //add_table_cells()

}

function main(){
  add_table_headers()
  open_file(read_file)
}

main()
