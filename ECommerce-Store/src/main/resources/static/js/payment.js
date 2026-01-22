const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}



if (!localStorage.getItem("userId")) {
  window.location.href = "login.html";
}



function pay() {
  const orderId = localStorage.getItem("orderId");
  const method = document.getElementById("method").value;

  fetch(`http://localhost:8080/api/payments/${orderId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentMethod: method })
  })
  .then(res => res.json())
  .then(() => {
    window.location.href = "success.html";
  });
}
