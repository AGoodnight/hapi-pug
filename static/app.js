var xhttp = new XMLHttpRequest();

xhttp.addEventListener("load",onComplete);

function triggerSwap(){
  xhttp.open('GET','/image');
  xhttp.send(null);
}

function onComplete(){
  $("#image-element").attr("src", xhttp.responseText);
}
