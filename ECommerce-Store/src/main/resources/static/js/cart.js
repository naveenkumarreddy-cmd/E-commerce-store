console.log("CART PAGE LOADED");

const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "login.html";

const cartKey = "cart_" + user.id;
let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

const list = document.getElementById("cartItems");
const totalBox = document.getElementById("totalBox");
const orderBtn = document.getElementById("orderBtn");


// ---------- TOAST ----------
function toast(msg){
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"),1500);
}


// ---------- SAVE ----------
function save(){
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}


// ---------- UPDATE CART COUNT ----------
function updateCartCount(){
  const countEl = document.getElementById("cartCount");
  if(!countEl) return;

  countEl.innerText = cart.reduce((s,c)=> s + c.quantity,0);
}


// ---------- RENDER ----------
function render(){

  list.innerHTML = "";
  let total = 0;

  if(cart.length === 0){
    list.innerHTML = `<h3>Your cart is empty</h3>`;
    totalBox.innerHTML = "";
    orderBtn.disabled = true;
    updateCartCount();
    return;
  }

  orderBtn.disabled = false;

  cart.forEach((item,i)=>{

    const subtotal = item.price * item.quantity;
    total += subtotal;

    const img = (item.image && item.image !== 'undefined')
      ? item.image
      : "/images/default.png";

    list.innerHTML += `
      <div class="cart-card">

        <img class="cart-img" src="${img}">

        <div class="cart-info">
          <h3>${item.name}</h3>

          <p class="unit">₹${item.price}</p>

          <p class="qty-price">
            Qty: <b>${item.quantity}</b>
            &nbsp; | &nbsp;
            Subtotal:
            <span>₹${subtotal}</span>
          </p>
        </div>

        <div class="qty-box">

          <button class="qty minus" onclick="changeQty(${i},-1)">−</button>

          <span class="qty-value">${item.quantity}</span>

          <button class="qty plus" onclick="changeQty(${i},1)">+</button>

          <button class="trash" onclick="removeItem(${i})">🗑</button>

        </div>

      </div>
    `;
  });

  totalBox.innerHTML = `Total = ₹${total}`;
  updateCartCount();
}


render();


// ---------- CHANGE QTY ----------
function changeQty(i,d){

  cart[i].quantity += d;

  if(cart[i].quantity <= 0){
    toast("Item removed");
    cart.splice(i,1);
  }

  save();
  render();
}


// ---------- REMOVE ----------
function removeItem(i){
  cart.splice(i,1);
  save();
  render();
  toast("Item removed");
}


// ---------- PLACE ORDER ----------
async function placeOrder(){

  if(cart.length === 0){
    toast("Cart empty");
    return;
  }

  const req = {
    userId:user.id,
    items:cart.map(c=>({
      productId:c.productId,
      quantity:c.quantity
    }))
  };

  const res = await fetch("http://localhost:8080/api/orders",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(req)
  });

  if(!res.ok){
    toast("Order failed");
    return;
  }

  const data = await res.json();

  localStorage.setItem("orderId",data.orderId);
  localStorage.removeItem(cartKey);

  toast("Order placed!");
  setTimeout(()=> window.location.href="success.html",900);
}
