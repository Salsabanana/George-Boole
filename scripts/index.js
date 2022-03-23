document.getElementById("biographie-racourci").addEventListener("click", function(element) {
  element.preventDefault();
  document.getElementById("ancre-biographie").scrollIntoView({behavior : "smooth"})
});

document.getElementById("boutonhautpage").addEventListener("click", function(element) {
  element.preventDefault();
  document.getElementsByTagName("body")[0].scrollIntoView({behavior : "smooth"})
});

document.getElementById("travaux-racourci").addEventListener("click", function(element) {
  element.preventDefault();
  document.getElementById("ancre-travaux").scrollIntoView({behavior : "smooth"})
});

document.getElementById("alg-bool-racourci").addEventListener("click", function(element) {
  element.preventDefault();
  document.getElementById("ancre-alg-bool").scrollIntoView({behavior : "smooth"})
});

document.getElementById("applications-racourci").addEventListener("click", function(element) {
  element.preventDefault();
  document.getElementById("ancre-applications").scrollIntoView({behavior : "smooth"})
});
