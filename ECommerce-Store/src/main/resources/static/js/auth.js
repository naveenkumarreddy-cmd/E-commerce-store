
document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("user");
    window.location.href = "login.html";
});




document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Registration failed");
        }
        return res.json();
    })
    .then(data => {
        document.getElementById("success").innerText = "Registration successful. Please login.";
        document.getElementById("error").innerText = "";

        setTimeout(() => window.location.href = "login.html", 1200);
    })
    .catch(err => {
        document.getElementById("error").innerText = "User already exists OR Server error";
        document.getElementById("success").innerText = "";
    });
});
