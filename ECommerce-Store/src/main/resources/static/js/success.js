console.log("SUCCESS PAGE LOADED");

const orderId = localStorage.getItem("orderId");
const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("oid").innerText = orderId;

if (!orderId || !user) {
    alert("Invalid Access");
    window.location.href = "index.html";
}

async function payNow() {

    // STEP-1 — Create Razorpay Order from backend
    const res = await fetch(
        `http://localhost:8080/api/payments/create/${orderId}`,
        { method: "POST" }
    );

    const rzpOrder = await res.json();
    console.log("RAZORPAY ORDER =", rzpOrder);

    const options = {
        key: "rzp_test_RwDb3R2opICcNR",   // 🔴 your TEST key
        amount: rzpOrder.amount,
        currency: "INR",
        name: "My Ecommerce Store",
        description: "Order Payment",
        order_id: rzpOrder.id,

        prefill: {
            name: user.name,
            email: user.email
        },

        handler: async function (response) {

            console.log("PAYMENT SUCCESS =", response);

            // STEP-2 — Confirm Payment in backend
            const confirm = await fetch(
                `http://localhost:8080/api/payments/${orderId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpayOrderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        paymentMethod: "RAZORPAY"
                    })
                }
            );

            if (confirm.ok) {

                // clear cart only after payment
                localStorage.removeItem("cart");

                window.location.href = "thankyou.html";
            }
            else {
                alert("Payment Recorded Failed ❌");
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}
