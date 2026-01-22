console.log("ADMIN PRODUCTS JS LOADED");

/* ---------- TOAST ---------- */
function toast(msg){
  const t = document.getElementById("toast");
  if(!t) return alert(msg);
  t.innerText = msg;
  t.className = "show";
  setTimeout(()=> t.className = "", 2600);
}

/* ---------- STOCK COLOR ---------- */
function refreshStockColor(id){
  const el = document.getElementById(`stock-${id}`);
  if(!el) return;
  const v = Number(el.value);

  el.classList.remove("stock-low","stock-mid","stock-high");

  if(v < 5) el.classList.add("stock-low");
  else if(v > 15) el.classList.add("stock-high");
  else el.classList.add("stock-mid");
}

/* ---------- LOAD PRODUCTS ---------- */
async function loadProducts(){

  const tbody = document.getElementById("products");
  tbody.innerHTML = "";

  try{
    let products = await fetch("http://localhost:8080/api/products")
      .then(r=>r.json());

    products = products.sort((a,b)=>a.id-b.id);

    products.forEach(p=>{

      let level =
        p.stock < 5  ? "stock-low"  :
        p.stock > 15 ? "stock-high" :
                       "stock-mid";

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>

        <td>
          <input type="number"
                 id="price-${p.id}"
                 value="${p.price}"
                 min="0"
                 style="width:90px">
        </td>

        <td>
          <input type="number"
                 id="stock-${p.id}"
                 value="${p.stock}"
                 min="0"
                 class="${level}"
                 oninput="refreshStockColor(${p.id})"
                 style="width:60px">
        </td>

        <td>
          <!-- INLINE ICONS -->
          <span class="icon save"
                title="Save"
                onclick="save(${p.id}, ${p.price}, ${p.stock})">
                💾
          </span>

          <span class="icon delete"
                title="Delete"
                onclick="deleteProduct(${p.id})">
                🗑
          </span>
        </td>
      `;

      tbody.appendChild(tr);
    });

  }catch(e){
    console.error(e);
    toast("❌ Failed to load products");
  }
}

/* ---------- SAVE PRODUCT ---------- */
async function save(id, oldPrice, oldStock){

  const newPrice = Number(document.getElementById(`price-${id}`).value);
  const newStock = Number(document.getElementById(`stock-${id}`).value);

  if(newPrice < 0 || newStock < 0){
    toast("❌ Values cannot be negative");
    return;
  }

  if(newPrice !== oldPrice){
    const ok = confirm(
      `⚠ Price change detected\n\nOld: ₹${oldPrice}\nNew: ₹${newPrice}\n\nAre you sure?`
    );
    if(!ok) return;
  }

  try{
    const product = await fetch(`http://localhost:8080/api/products/${id}`)
      .then(r=>r.json());

    product.price = newPrice;
    product.stock = newStock;

    const res = await fetch(`http://localhost:8080/api/products/${id}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(product)
    });

    if(!res.ok){
      toast("❌ Update failed");
      return;
    }

    toast("✅ Product updated successfully 🎉");
    loadProducts();

  }catch(e){
    toast("❌ Server error updating");
  }
}

/* ---------- DELETE PRODUCT ---------- */
async function deleteProduct(id){

  if(!confirm("Delete product permanently?")) return;

  try{
    const res = await fetch(`http://localhost:8080/api/products/${id}`,{
      method:"DELETE"
    });

    if(!res.ok){
      toast("❌ Delete failed");
      return;
    }

    toast("🗑 Product deleted");
    loadProducts();

  }catch(e){
    toast("❌ Server error deleting");
  }
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", loadProducts);
