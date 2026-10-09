// ===============================
// BUYER LOGIN
// ===============================


async function buyerLogin() {
    let username = document.getElementById("buyerUsername").value.trim();
    let password = document.getElementById("buyerPassword").value.trim();

    if (username === "" || password === "") {
        alert("Please enter Username and Password.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (response.ok && result.message === "Login successful") {
            localStorage.setItem("dhejaUserId", result.userId);
            localStorage.setItem("dhejaUsername", result.username);
            localStorage.setItem("dhejaUserRole", result.role);

            alert("Login Successful!");
            window.location.href = "home.html";
        } else {
            alert(result.message || "Invalid username or password.");
        }

    } catch (error) {
        alert("Unable to connect to the server.");
        console.error("Login error:", error);
    }
}


// ===============================
// USER REGISTRATION
// ===============================

async function registerUser() {

    let username = document.getElementById("registerUsername").value.trim();
    let password = document.getElementById("registerPassword").value.trim();

    if (username === "" || password === "") {
        alert("Please enter Username and Password.");
        return;
    }

    try {

        const response = await fetch("http://localhost:8080/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.text();

        if (result === "Registration successful") {
            alert("Registration successful!");
            window.location.href = "login.html";
        } else {
            alert(result);
        }

    } catch (error) {
        alert("Unable to connect to the server.");
        console.error(error);
    }
}


// ===============================
// LOAD PRODUCTS FROM BACKEND
// ===============================

async function loadProducts() {

    try {

        const response = await fetch("http://localhost:8080/api/products");

        const products = await response.json();

        const productGrid = document.getElementById("productGrid");

        productGrid.innerHTML = "";

        products.forEach(product => {

            const productCard = document.createElement("div");

            productCard.className = "product-card";

            productCard.innerHTML = `
                <img src="${product.image.replace('images/', './images/')}" alt="${product.name}">

                <div class="product-info">

                    <p class="product-category">Product</p>

                    <h3>${product.name}</h3>

                    <div class="rating">★★★★★</div>

                    <div class="product-bottom">

                        <strong>₹${product.price}</strong>

                        <button onclick="addProductToCart('${product.name}', ${product.price})">
                            Add to Cart
                        </button>

                    </div>

                </div>
            `;

            productGrid.appendChild(productCard);

        });

    } catch (error) {

        console.error("Error loading products:", error);

        alert("Product loading error. Check the browser console.");

    }
}


if (document.getElementById("productGrid")) {
    loadProducts();
}


// ===============================
// CART
// ===============================

// Get existing cart from browser storage
function getCart() {

    const cart = localStorage.getItem("dhejaCart");

    return cart ? JSON.parse(cart) : [];
}


// Save cart to browser storage
function saveCart(cart) {

    localStorage.setItem("dhejaCart", JSON.stringify(cart));

}


 // Add product to cart
function addProductToCart(name, price, quantity = 1, image = null) {

    let cart = getCart();

    // Find the image for each product
    const productImages = {
        "Cotton T-Shirt": "images/T-shirt.jpg",
        "Casual Shoes": "images/shoes.jpg",
        "Travel Bag": "images/travel-bag.jpg",
        "Wireless Headphones": "images/headphones.jpg"
    };

    const productImage = image || productImages[name] || "";

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {

        existingProduct.quantity += quantity;

        // Add an image if the existing cart item has none
        if (!existingProduct.image) {
            existingProduct.image = productImage;
        }

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: quantity,
            image: productImage
        });

    }

    saveCart(cart);

    alert(`${name} added to cart!`);

}



// Display cart
function displayCart() {

    const cartContainer = document.getElementById("cartContainer");

    if (!cartContainer) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart.</p>

                <button onclick="location.href='products.html'">
                    Continue Shopping
                </button>
            </div>
        `;

        return;
    }

    let total = 0;

    let cartHTML = `
        <div class="cart-items">
    `;

    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        cartHTML += `
            <div class="cart-item">

                <div class="cart-item-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>

                <div class="cart-item-info">

                    <h3>${item.name}</h3>

                    <p>Price: ₹${item.price}</p>

                </div>

                <div class="cart-quantity">

                    <button onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>

                <div class="cart-subtotal">

                    ₹${subtotal}

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})">

                    Remove

                </button>

            </div>
        `;

    });

    cartHTML += `
        </div>

        <div class="cart-summary">

            <h2>Cart Summary</h2>

            <p>
                Total:
                <strong>₹${total}</strong>
            </p>

            <button
                class="checkout-btn"
                onclick="checkout()">

                Proceed to Checkout

            </button>

        </div>
    `;

    cartContainer.innerHTML = cartHTML;
}


// Change quantity
function changeQuantity(index, change) {

    let cart = getCart();

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart(cart);

    displayCart();

}


// Remove product
function removeFromCart(index) {

    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    displayCart();

}


// Checkout
function checkout() {

    const cart = getCart();

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    window.location.href = "checkout.html";

}


// Load cart when cart.html opens
if (document.getElementById("cartContainer")) {

    displayCart();

}
// ===============================
// CHECKOUT
// ===============================

function displayCheckout() {

    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");

    if (!checkoutItems || !checkoutTotal) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>

            <button onclick="location.href='products.html'">
                Continue Shopping
            </button>
        `;

        checkoutTotal.textContent = "₹0";

        return;
    }


    let total = 0;

    let itemsHTML = "";


    cart.forEach(item => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        itemsHTML += `
            <div class="checkout-item">

                <div>
                    <div class="checkout-item-name">
                        ${item.name}
                    </div>

                    <div class="checkout-item-details">
                        ₹${item.price} × ${item.quantity}
                    </div>
                </div>

                <strong>
                    ₹${subtotal}
                </strong>

            </div>
        `;

    });


    checkoutItems.innerHTML = itemsHTML;

    checkoutTotal.textContent = `₹${total}`;

}


// ===============================
// PLACE ORDER
// ===============================




async function placeOrder() {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Get the logged-in buyer's ID.
    const userId = localStorage.getItem("dhejaUserId");

    if (!userId) {
        alert("Please log in before placing an order.");
        window.location.href = "login.html";
        return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    if (!fullName || !phone || !address || !city || !pincode) {
        alert("Please fill in all delivery details.");
        return;
    }

    const selectedPayment = document.querySelector(
        'input[name="payment"]:checked'
    );

    const paymentMethod = selectedPayment
        ? selectedPayment.value
        : "cod";

    const total = cart.reduce(
        (sum, item) =>
            sum + Number(item.price) * Number(item.quantity),
        0
    );

    const orderId = "DM" + Date.now();

    const newOrder = {
        orderId: orderId,
        fullName: fullName,
        phone: phone,
        address: address,
        city: city,
        pincode: pincode,
        paymentMethod: paymentMethod,
        total: total,
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }))
    };

    // Prepare the order for the Java backend.
    const databaseOrder = {
        orderNumber: orderId,
        customerName: fullName,
        customerEmail: "",
        customerPhone: phone,
        deliveryAddress: address + ", " + city + " - " + pincode,
        totalAmount: total,
        status: "PLACED",

        // Link this order to the logged-in buyer.
        user: {
            id: Number(userId)
        },

        items: cart.map(item => ({
            productName: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            image: item.image || ""
        }))
    };

    try {
        const response = await fetch(
            "http://localhost:8080/api/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(databaseOrder)
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Backend error:", errorMessage);

            throw new Error(
                "The server could not save the order."
            );
        }

        const savedOrder = await response.json();

        newOrder.databaseId = savedOrder.id;

        const existingOrders =
            JSON.parse(localStorage.getItem("dhejaOrders")) || [];

        existingOrders.push(newOrder);

        localStorage.setItem(
            "dhejaOrders",
            JSON.stringify(existingOrders)
        );

        localStorage.setItem(
            "dhejaLastOrder",
            JSON.stringify(newOrder)
        );

        // Clear the cart after the backend saves the order.
        localStorage.removeItem("dhejaCart");

        window.location.href = "order-confirmation.html";

    } catch (error) {
        console.error("Order error:", error);

        alert(
            "Could not save your order to the database. " +
            "Please check the backend and try again."
        );
    }
}


// Load checkout page
if (document.getElementById("checkoutItems")) {

    displayCheckout();

}
// ===============================
// ORDER CONFIRMATION
// ===============================

function displayOrderConfirmation() {

    const orderIdElement =
        document.getElementById("orderId");

    const paymentElement =
        document.getElementById("paymentMethod");

    const totalElement =
        document.getElementById("orderTotal");


    if (
        !orderIdElement ||
        !paymentElement ||
        !totalElement
    ) {
        return;
    }


    const savedOrder =
        localStorage.getItem("dhejaLastOrder");


    if (!savedOrder) {

        orderIdElement.textContent = "Not available";
        paymentElement.textContent = "Not available";
        totalElement.textContent = "₹0";

        return;

    }


    const order =
        JSON.parse(savedOrder);


    orderIdElement.textContent =
        order.orderId;

    paymentElement.textContent =
        order.paymentMethod === "cod"
            ? "Cash on Delivery"
            : "Online Payment";

    totalElement.textContent =
        `₹${order.total}`;

}


if (
    document.getElementById("orderId")
) {

    displayOrderConfirmation();

}
// ===============================
// MY ORDERS
// ===============================

async function displayMyOrders() {
    const ordersContainer = document.getElementById("ordersContainer");

    if (!ordersContainer) {
        return;
    }

    // Get the logged-in buyer's ID.
    const userId = localStorage.getItem("dhejaUserId");

    if (!userId) {
        alert("Please log in to view your orders.");
        window.location.href = "login.html";
        return;
    }

    ordersContainer.innerHTML = "<p>Loading your orders...</p>";

    try {
        // Fetch orders belonging to this buyer.
        const response = await fetch(
            `http://localhost:8080/api/orders?userId=${encodeURIComponent(userId)}`
        );

        if (!response.ok) {
            throw new Error("Could not load orders from the backend.");
        }

        const databaseOrders = await response.json();

        // Convert backend fields to the names used by this page.
        const orders = databaseOrders.map(order => ({
            orderId: order.orderNumber || order.id,
            fullName: order.customerName || "Customer",
            total: order.totalAmount || 0,
            address: order.deliveryAddress || "Not provided",
            items: (order.items || []).map(item => ({
                name: item.productName,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }))
        }));

        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-orders">
                    <h2>No orders yet</h2>
                    <p>You have not placed any orders yet.</p>
                    <button onclick="location.href='products.html'">
                        Start Shopping
                    </button>
                </div>
            `;
            return;
        }

        let ordersHTML = "";

        orders.slice().reverse().forEach(order => {
            let productsHTML = "";

            if (order.items.length > 0) {
                order.items.forEach(item => {
                    productsHTML += `
                        <div class="ordered-product">
                            <img
                                src="${item.image || ''}"
                                alt="${item.name || 'Product'}"
                                class="ordered-product-image"
                            >
                            <div>
                                <h3>${item.name || 'Product'}</h3>
                                <p>Price: ₹${item.price}</p>
                                <p>Quantity: ${item.quantity}</p>
                                <p>Subtotal: ₹${Number(item.price) * Number(item.quantity)}</p>
                            </div>
                        </div>
                    `;
                });
            } else {
                productsHTML = `
                    <p>Product details are unavailable for this older order.</p>
                `;
            }

            ordersHTML += `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <h2>Order ID: ${order.orderId}</h2>
                            <p>Order placed successfully</p>
                        </div>
                        <span class="order-status">Confirmed</span>
                    </div>

                    <div class="order-details">
                        <p><strong>Customer:</strong> ${order.fullName}</p>
                        <p><strong>Total Amount:</strong> ₹${order.total}</p>
                        <p><strong>Delivery Address:</strong> ${order.address}</p>
                    </div>

                    <h3>Products Ordered</h3>
                    <div class="ordered-products">
                        ${productsHTML}
                    </div>
                </div>
            `;
        });

        ordersContainer.innerHTML = ordersHTML;

    } catch (error) {
        console.error("Error loading orders:", error);

        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <h2>Unable to load orders</h2>
                <p>Please make sure the Java backend is running.</p>
                <button onclick="displayMyOrders()">Try Again</button>
            </div>
        `;
    }
}

if (document.getElementById("ordersContainer")) {
    displayMyOrders();
}
