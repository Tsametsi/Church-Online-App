document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = products.map(product => `
                <div class="product">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error fetching products:', error));
});

let totalPrice = 0;

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    totalPrice = 0;

    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.name} - $${item.price} x ${item.quantity}
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(listItem);
        totalPrice += item.price * item.quantity;
    });

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
        updateCart();
    }
}

function checkout() {
    const totalAmount = totalPrice.toFixed(2); // Format total amount correctly
    const paypalForm = document.getElementById('paypal-form');
    const amountField = document.getElementById('paypal-amount');
    
    amountField.value = totalAmount; // Set the amount in the form
    paypalForm.submit(); // Submit the form to PayPal
}
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = products.map(product => `
                <div class="product">
                    <h2>${product.name}</h2>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <p>${product.description}</p>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});

// Cart management
function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    cartItems.innerHTML = cart.map(item => `
        <li>${item.name} - $${item.price.toFixed(2)}</li>
    `).join('');
    
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
    totalPriceElement.textContent = totalPrice.toFixed(2);
    
    document.getElementById('paypal-amount').value = totalPrice.toFixed(2);
}
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = products.map(product => `
                <div class="product">
                    <h2>${product.name}</h2>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <p>${product.description}</p>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});

// Cart management
let cart = [];

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    cartItems.innerHTML = cart.map(item => `
        <li>
            ${item.name} - $${item.price.toFixed(2)}
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </li>
    `).join('');
    
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
    totalPriceElement.textContent = totalPrice.toFixed(2);
    
    document.getElementById('paypal-amount').value = totalPrice.toFixed(2);
}
// shop.js

document.addEventListener('DOMContentLoaded', function () {
    const productsContainer = document.getElementById('products');

    // Function to render products
    function renderProducts() {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            // Product image
            const img = document.createElement('img');
            img.src = product.image_url; // Set the image source from image_url
            img.alt = product.name; // Set the image alt text
            productElement.appendChild(img);

            // Product name
            const productName = document.createElement('p');
            productName.textContent = product.name;
            productElement.appendChild(productName);

            // Product price
            const productPrice = document.createElement('p');
            productPrice.textContent = `$${product.price.toFixed(2)}`;
            productElement.appendChild(productPrice);

            // Add to cart button
            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Add to Cart';
            addToCartButton.addEventListener('click', function () {
                addToCart(product);
            });
            productElement.appendChild(addToCartButton);

            // Append product element to products container
            productsContainer.appendChild(productElement);
        });
    }

    // Function to add product to cart (sample function, adjust as needed)
    function addToCart(product) {
        // Logic to add product to cart (not implemented here)
        console.log(`Added ${product.name} to cart.`);
    }

    // Initial render of products
    renderProducts();
});
