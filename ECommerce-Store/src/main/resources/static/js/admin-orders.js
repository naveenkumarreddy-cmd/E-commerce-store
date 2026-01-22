console.log("ADMIN ORDERS JS LOADED");

let allOrders = [];
let filteredOrders = [];
let page = 1;
const pageSize = 10;


// ================== LOAD ORDERS ==================
async function loadOrders(){

  const tbody = document.getElementById("orders");
  tbody.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

  try{
    const res = await fetch("http://localhost:8080/api/orders");
    if(!res.ok) throw new Error("HTTP "+res.status);

    allOrders = await res.json();
    filteredOrders = [...allOrders];   // 🔥 keep a clean copy

    page = 1;
    render();
  }
  catch(err){
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="5">⚠ Unable to load orders</td></tr>`;
  }
}



// ================== RENDER TABLE ==================
function render() {

  const tbody = document.getElementById("orders");
  const pageInfo = document.getElementById("pageInfo");

  if (!allOrders || allOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No orders found</td></tr>`;
    pageInfo.innerText = "Page 1 / 1";
    return;
  }

  const totalPages = Math.ceil(allOrders.length / pageSize);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const current = allOrders.slice(start, end);

  tbody.innerHTML = "";

  current.forEach(o => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${o.orderId}</td>
      <td>${o.userEmail || "N/A"}</td>
      <td>₹${o.totalAmount}</td>
      <td><span class="badge ${o.status.toLowerCase()}">${o.status}</span></td>
      <td>${(o.createdAt || "").replace("T"," ").substring(0,19)}</td>
    `;

    tbody.appendChild(tr);
  });

  // ⭐ NEW: SHOW CURRENT PAGE OUT OF TOTAL
  pageInfo.innerText = `Page ${page} / ${totalPages}`;

  updateButtons(totalPages);
}



// ================== SEARCH ==================
function searchOrders(value){

  value = value.toLowerCase();

  filteredOrders = allOrders.filter(o =>
    (o.orderId+"").includes(value) ||
    (o.userEmail||"").toLowerCase().includes(value)
  );

  page = 1;
  render();
}



// 🔥 hook search box
document.getElementById("search")
  .addEventListener("keyup", e => searchOrders(e.target.value));



// ================== PAGINATION ==================
function nextPage(){
  if(page * pageSize < filteredOrders.length){
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


function updateButtons(totalPages){

  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");

  // If only one page → hide both buttons
  if(totalPages <= 1){
    prev.style.display = "none";
    next.style.display = "none";
    return;
  }

  // Otherwise show both buttons
  prev.style.display = "inline-block";
  next.style.display = "inline-block";

  // Hide Prev on first page
  prev.style.visibility = (page === 1)
      ? "hidden"
      : "visible";

  // Hide Next on last page
  next.style.visibility = (page === totalPages)
      ? "hidden"
      : "visible";
}





// ================== INIT ==================
document.addEventListener("DOMContentLoaded", loadOrders);
