const productCatalog = {
    "Cotton T-Shirt": {
        price: 499,
        image: "images/T-shirt.jpg",
        description: "A comfortable, everyday cotton T-shirt.",
        stock: 15
    },

    "Casual Shoes": {
        price: 999,
        image: "images/shoes.jpg",
        description: "Casual shoes designed for everyday use.",
        stock: 10
    },

    "Travel Bag": {
        price: 799,
        image: "images/travel-bag.jpg",
        description: "A practical bag for travel and daily use.",
        stock: 8
    },

    "Wireless Headphones": {
        price: 1499,
        image: "images/headphones.jpg",
        description: "Wireless headphones for everyday listening.",
        stock: 12
    }
};


const params = new URLSearchParams(window.location.search);

const selectedName = params.get("name") || "Cotton T-Shirt";

const product = productCatalog[selectedName];


const nameElement = document.getElementById("productName");

const imageElement = document.getElementById("productImage");

const priceElement = document.getElementById("productPrice");

const descriptionElement = document.getElementById("productDescription");

const stockElement = document.getElementById("stockInfo");

const quantityElement = document.getElementById("quantity");

const addButton = document.getElementById("addCartButton");

const messageElement = document.getElementById("message");


if (product) {

    nameElement.textContent = selectedName;

    priceElement.textContent = `₹${product.price}`;

    descriptionElement.textContent = product.description;

    stockElement.textContent =
        `Availability: ${product.stock} in stock`;

    quantityElement.max = product.stock;


    if (product.image) {

        imageElement.src = product.image;

        imageElement.style.display = "block";

    } else {

        imageElement.style.display = "none";

    }


    addButton.addEventListener("click", () => {

        const quantity = Number(quantityElement.value);


        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > product.stock
        ) {

            messageElement.textContent =
                "Please enter a valid quantity.";

            return;
        }


        if (typeof addProductToCart !== "function") {

            messageElement.textContent =
                "Cart functionality is not configured yet.";

            return;
        }


        addProductToCart(
            selectedName,
            product.price,
            quantity
        );

        messageElement.textContent =
            "Product added to cart.";

    });

} else {

    nameElement.textContent = "Product not found";

    descriptionElement.textContent =
        "Please return to the products page and select a product.";

    addButton.disabled = true;
}