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

let cart = [];
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
