console.log("ADMIN-AUTH LOADED");

const admin = JSON.parse(localStorage.getItem("user"));

if (!admin) {
    alert("Please login first");
    window.location.href = "login.html";
}

if (admin.role !== "ADMIN") {
    alert("Access denied");
    window.location.href = "index.html";
}
