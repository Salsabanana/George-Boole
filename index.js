document.getElementById("biographie-racourci").addEventListener("click", function(element) {
  element.preventDefault();
  document.getElementById("biographie").scrollIntoView({behavior : "smooth"})
});

document.getElementById("boutonhautpage").addEventListener("click", function(element) {
  element.preventDefault();
  document.getElementsByTagName("body")[0].scrollIntoView({behavior : "smooth"})
});

