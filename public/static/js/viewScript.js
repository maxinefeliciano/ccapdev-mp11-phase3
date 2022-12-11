function dropdown() {
    document.getElementById("Dropdown").classList.toggle("show");
  }
  
  function filter() {
    var input, filter, ul, li, a, i;

    input = document.getElementById("Input");
    filter = input.value.toUpperCase();
    div = document.getElementById("Dropdown");
    a = div.getElementsByTagName("a");

    for (i = 0; i < a.length; i++) {
      txt = a[i].innerText || a[i].textContent;
      if (txt.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
}