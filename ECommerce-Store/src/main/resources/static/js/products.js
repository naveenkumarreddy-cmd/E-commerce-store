console.log("PRODUCTS.JS FILE LOADED");

// ---- USER CHECK ----
const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "login.html";

document.getElementById("uname").innerText = user.name;

const cartKey = "cart_" + user.id;


// ---- CART HELPERS ----
function getCart() {
  return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  const cart = getCart();
  document.getElementById("cartCount").innerText =
      cart.reduce((sum, item) => sum + item.quantity, 0);
}


// ---- LOAD PRODUCTS ----
document.addEventListener("DOMContentLoaded", async () => {

  const res = await fetch("http://localhost:8080/api/products");
  const products = await res.json();

  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {

    const name = p.productName || p.name || "Product";

   
	// ---------- SAFE IMAGE ----------
	let img = p.imageUrl || p.image || p.img || p.photo;

	// default fallback
	if (!img) img = "/images/default.png";

	// If backend already sent /images/... DO NOT prefix
	if (!img.startsWith("/") && !img.startsWith("http")) {
	  img = "/images/" + img;
	}

	// cache-buster
	img = `${img}?v=${Date.now()}`;


    list.innerHTML += `
      <div class="card">
        <img src="${img}">
        <h3>${name}</h3>
        <p class="price">₹${p.price}</p>

        <button onclick="addToCart(${p.id},
          '${name.replace(/'/g,"\\'")}', ${p.price}, '${img}')">
          Add to Cart
        </button>
      </div>
    `;
  });

});


// ---- ADD TO CART ----
function addToCart(id, name, price, image) {

  let cart = getCart();

  const item = cart.find(c => c.productId === id);

  if (item) item.quantity++;
  else cart.push({ productId:id, name, price, image, quantity:1 });

  saveCart(cart);

  toast("Added to cart 🛒");
}


// ---- TOAST ----
function toast(msg){
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");

  setTimeout(()=> t.classList.remove("show"), 2000);
}


// ---- LOGOUT ----
function logout(){
  localStorage.clear();
  location.href = "login.html";
}

updateCartCount();
