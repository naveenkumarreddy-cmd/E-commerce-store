console.log("ADD PRODUCT JS LOADED");

function toast(msg){
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 2200);
}

async function saveProduct(){

  const name = document.getElementById("name").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const price = Number(document.getElementById("price").value);
  const stock = Number(document.getElementById("stock").value);
  const file = document.getElementById("imageFile").files[0];

  if(!name || !file || price < 0 || stock < 0){
    toast("Please fill all fields including image");
    return;
  }

  const form = new FormData();
  form.append("name", name);
  form.append("description", desc);
  form.append("price", price);
  form.append("stock", stock);
  form.append("image", file);

  const res = await fetch("http://localhost:8080/api/products/upload",{
    method:"POST",
    body: form
  });

  if(!res.ok){
    toast("Upload failed");
    return;
  }

  toast("Product added successfully 🎉");
  setTimeout(()=> location.href="admin-products.html",1000);
}

