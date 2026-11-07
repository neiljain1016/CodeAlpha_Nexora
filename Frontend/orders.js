
const ORDERS_API = "http://localhost:5000/api/orders/my-orders";

const ordersList = document.getElementById("ordersList");
const orderCount = document.getElementById("orderCount");

// Check login and fetch customer orders
async function fetchMyOrders() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login to view your orders.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(ORDERS_API, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const orders = await response.json();

        if (!response.ok) {
            throw new Error(orders.message || "Unable to load orders");
        }

        displayOrders(orders);

    } catch (error) {
        console.error(error);

        ordersList.innerHTML = `
            <div class="empty-orders">
                <h3>Unable to load orders</h3>
                <p>${error.message}</p>
            </div>
        `;

        orderCount.textContent = "";
    }
}

// Display all customer orders
function displayOrders(orders) {
    ordersList.innerHTML = "";

    orderCount.textContent = `${orders.length} order(s) found`;

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders">
                <h2>No Orders Yet!</h2>
                <p>Your shopping journey starts here.</p>
                <a href="index.html" class="shop-button">
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement("div");
        orderCard.className = "order-card";

        const formattedDate = new Date(order.createdAt)
            .toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });

        const productsHTML = order.items.map(item => {
            const image =
                item.product && item.product.image
                    ? item.product.image
                    : "https://placehold.co/100x100?text=Product";

            return `
                <div class="order-product">
                    <img
                        src="${image}"
                        alt="${item.name}"
                        onerror="this.src='https://placehold.co/100x100?text=Product'"
                    >

                    <div class="order-product-info">
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                    </div>

                    <div class="order-product-price">
                        ₹${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `;
        }).join("");

        orderCard.innerHTML = `
            <div class="order-top">
                <div>
                    <h3>Order #${order._id}</h3>
                    <p class="order-date">Placed on ${formattedDate}</p>
                </div>

                <span class="order-status">
                    ${order.status}
                </span>
            </div>

            <div class="order-products">
                ${productsHTML}
            </div>

            <div class="order-bottom">
                <div class="shipping-info">
                    <strong>Delivery Address</strong>
                    <p>${order.shippingAddress}</p>
                </div>

                <div class="order-total">
                    <p>Total Amount</p>
                    <h3>₹${order.totalAmount.toFixed(2)}</h3>
                </div>
            </div>
        `;

        ordersList.appendChild(orderCard);
    });
}

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("You have been logged out!");

    window.location.href = "login.html";
}

// Load orders when page opens
fetchMyOrders();
