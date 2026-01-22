console.log("LOGIN.JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const err = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    err.innerText = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      err.innerText = "Enter email & password";
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();   // <-- IMPORTANT
      let data = null;

      try { data = JSON.parse(text); } catch {}

      if (!res.ok) {

        let msg = "Invalid email or password";

        if (text.toLowerCase().includes("not") &&
            text.toLowerCase().includes("found")) {
          msg = "User not found";
        }
        else if (text.toLowerCase().includes("password")) {
          msg = "Incorrect password";
        }

        err.innerText = msg;
        return;
      }

      const user = data;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN")
        location.href = "admin-dashboard.html";
      else
        location.href = "index.html";

    } catch (ex) {
      console.error(ex);
      err.innerText = "Server error — try again";
    }
  });

});
