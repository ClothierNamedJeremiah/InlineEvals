var checkboxes = document.getElementsByTagName("input");
// checkboxes[0].addEventListener('change',function() {console.log("HELP")});
console.log(checkboxes.length)
var i;
for (i = 0;  i < checkboxes.length; i++) {
  console.log(checkboxes[i]);
  checkboxes[i].addEventListener('change', function(i) {
    console.log("i: ",i)
    if (this.checked) {
      // Checkbox is checked
      console.log("Checked");
    } else {
      // Checkbox is not checked..
      console.log("Not Checked");
    }
  });
}
