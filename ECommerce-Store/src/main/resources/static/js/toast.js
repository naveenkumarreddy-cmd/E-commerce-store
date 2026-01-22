function showToast(msg){

  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";

  setTimeout(() => t.style.display = "none", 2500);
}
