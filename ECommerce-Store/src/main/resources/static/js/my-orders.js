console.log("MY ORDERS JS LOADED");

const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "login.html";

let allOrders = [];
let page = 1;
const pageSize = 10;


// ---------- LOAD ORDERS ----------
async function loadOrders(){

  const tbody = document.getElementById("myOrders");
  tbody.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

  try{

    const res = await fetch(
      `http://localhost:8080/api/orders/user/${user.id}`
    );

    allOrders = await res.json();
    render();
  }
  catch(e){
    tbody.innerHTML = `<tr><td colspan="4">⚠ Unable to load</td></tr>`;
  }
}



// ---------- RENDER ----------
function render(){

  const tbody = document.getElementById("myOrders");
  const pageInfo = document.getElementById("pageInfo");

  if(allOrders.length === 0){
    tbody.innerHTML = `<tr><td colspan="4">No orders yet</td></tr>`;
    pageInfo.innerText = "";
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
    return;
  }

  const totalPages = Math.ceil(allOrders.length / pageSize);

  const start = (page-1) * pageSize;
  const current = allOrders.slice(start, start + pageSize);

  tbody.innerHTML = "";

  current.forEach(o => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${o.orderId}</td>

      <td>₹${o.totalAmount}</td>

      <td>
        <span class="badge ${o.status.toLowerCase()}">
          ${o.status}
        </span>
      </td>

      <td>${(o.createdAt||"").replace("T"," ").substring(0,19)}</td>
    `;

    tbody.appendChild(tr);
  });


  pageInfo.innerHTML =
    `<span style="color:white;font-weight:700">
      Page ${page} / ${totalPages}
     </span>`;


  document.getElementById("prevBtn").style.display =
    (page === 1 ? "none" : "inline-block");

  document.getElementById("nextBtn").style.display =
    (page === totalPages ? "none" : "inline-block");
}



// ---------- PAGINATION ----------
function nextPage(){
  const totalPages = Math.ceil(allOrders.length / pageSize);
  if(page < totalPages){
    page++;
    render();
  }
}

function prevPage(){
  if(page > 1){
    page--;
    render();
  }
}


document.addEventListener("DOMContentLoaded", loadOrders);
