
const API_URL = "http://localhost:5000/api/products";

let products = [];
let cart = [];

const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const productModal = document.getElementById("productModal");
const detailImage = document.getElementById("detailImage");
const detailName = document.getElementById("detailName");
const detailPrice = document.getElementById("detailPrice");
const detailDescription = document.getElementById("detailDescription");
const detailCategory = document.getElementById("detailCategory");
const detailStock = document.getElementById("detailStock");
const detailAddButton = document.getElementById("detailAddButton");

// Fetch products from MongoDB
async function fetchProducts() {
    try {
        productContainer.innerHTML = "<p>Loading products...</p>";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch products");
        }

        products = await response.json();
        displayProducts(products);

    } catch (error) {
        console.error("Error:", error);
        productContainer.innerHTML =
            "<p>Could not load products. Please check your backend.</p>";
    }
}

// Display products
function displayProducts(productList) {
    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    productList.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}"
                 onerror="this.src='https://placehold.co/600x400?text=Product'">

            <h3>${product.name}</h3>
            <p>${product.description || ""}</p>
            <h4>₹${product.price}</h4>
            <p>Category: ${product.category}</p>
            <p>Stock: ${product.stock}</p>

            <button class="view-details-btn" data-id="${product._id}">
                View Details
            </button>

            <button class="add-to-cart-btn" data-id="${product._id}">
                Add to Cart
            </button>
        `;

        productContainer.appendChild(card);
    });
}

// Handle product buttons
productContainer.addEventListener("click", function(event) {
    const detailsButton = event.target.closest(".view-details-btn");
    const cartButton = event.target.closest(".add-to-cart-btn");

    if (detailsButton) {
        openProductDetails(detailsButton.dataset.id);
    }

    if (cartButton) {
        addToCart(cartButton.dataset.id);
    }
});

// Open product details modal
function openProductDetails(productId) {
    const product = products.find(item => item._id === productId);

    if (!product) return;

    detailImage.src = product.image;
    detailImage.onerror = function() {
        this.src = "https://placehold.co/600x400?text=Product";
    };

    detailName.textContent = product.name;
    detailPrice.textContent = "₹" + product.price;
    detailDescription.textContent = product.description || "";
    detailCategory.textContent = "Category: " + product.category;
    detailStock.textContent = "Available Stock: " + product.stock;

    detailAddButton.dataset.id = product._id;

    productModal.classList.add("active");
}

// Close product details modal
function closeProductDetails() {
    productModal.classList.remove("active");
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(item => item._id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item._id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert("Sorry, maximum available stock reached.");
            return;
        }
    } else {
        if (product.stock < 1) {
            alert("This product is out of stock.");
            return;
        }

        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Add to cart from product details modal
detailAddButton.addEventListener("click", function() {
    addToCart(this.dataset.id);
});

// Update cart display
function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <span>
                ${item.name} - ₹${item.price} × ${item.quantity}
            </span>

            <button class="remove-from-cart" data-id="${item._id}">
                Remove
            </button>
        `;

        cartItems.appendChild(div);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toFixed(2);
}

// Remove product from cart
cartItems.addEventListener("click", function(event) {
    const button = event.target.closest(".remove-from-cart");

    if (!button) return;

    cart = cart.filter(item => item._id !== button.dataset.id);

    updateCart();
});

// Search products
searchInput.addEventListener("input", function() {
    const searchText = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText)
    );

    displayProducts(filteredProducts);
});

// Show or hide cart
function toggleCart() {
    document.getElementById("cartSection").classList.toggle("active");
}

// Checkout placeholder

async function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login before placing an order.");
        window.location.href = "login.html";
        return;
    }

    const shippingAddress = prompt(
        "Enter your complete shipping address:"
    );

    if (!shippingAddress || !shippingAddress.trim()) {
        alert("Please enter a valid shipping address.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cart.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                shippingAddress: shippingAddress.trim()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Order placement failed");
        }

        alert("Order placed successfully! Your Order ID: " + data.order._id);

        cart = [];
        updateCart();

        await fetchProducts();

    } catch (error) {
        alert(error.message);
    }
}


// Load products when website opens
fetchProducts();

// Check whether a user is logged in

// Check whether a user is logged in
const loginLink = document.getElementById("loginLink");
const ordersLink = document.getElementById("ordersLink");

const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

if (savedUser && savedToken) {
    const user = JSON.parse(savedUser);

    if (loginLink) {
        loginLink.textContent = `Hi, ${user.name} | Logout`;
        loginLink.href = "#";

        loginLink.addEventListener("click", function(event) {
            event.preventDefault();

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("You have been logged out!");
            window.location.reload();
        });
    }

    if (ordersLink) {
        ordersLink.style.display = "inline-block";
    }

} else {
    if (ordersLink) {
        ordersLink.style.display = "none";
    }
}
