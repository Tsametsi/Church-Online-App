document.addEventListener('DOMContentLoaded', () => {
    // Fetch products from the server
    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = products.map(product => `
                <div class="product">
                    <img src="${product.image}" alt="${product.title}" class="product-image" onclick="openPopup('${product.image}')">
                    <h2>${product.title}</h2>
                    <p>Price: ZAR ${parseFloat(product.price).toFixed(2)}</p>
                    <p>Available Quantity: ${product.quantity}</p>
                    <p>Sizes: 
                        <select id="size-${product.id}">
                            ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                    </p>
                    <p>Quantity: <input type="number" id="quantity-${product.id}" value="1" min="1" max="${product.quantity}"></p>
                    <button onclick="addToCart(${product.id}, '${product.title}', ${parseFloat(product.price).toFixed(2)})">Add to Cart</button>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});

// Cart functionality
const cart = [];

function addToCart(productId, productTitle, productPrice) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);
    
    if (quantity > 0) {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        if (existingItemIndex > -1) {
            // If item exists, update the quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Otherwise, add new item
            cart.push({ id: productId, title: productTitle, price: productPrice, quantity });
        }
        
        // Update cart display
        updateCart();
        
        // Optional: Update the database with new cart item quantity (pseudo code)
        // fetch(`/api/update-cart`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ productId, quantity })
        // });
    } else {
        alert("Please select a valid quantity.");
    }
}

function removeFromCart(index) {
    // Remove the item at the specified index from the cart
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <li>
            ${item.title} (Size: <span id="size-${item.id}">${document.getElementById(`size-${item.id}`).value}</span>, Quantity: ${item.quantity}) - ZAR ${(item.price * item.quantity).toFixed(2)} 
            <button onclick="removeFromCart(${index})">Remove</button>
        </li>
    `).join('');

    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById('total-price').innerText = totalPrice.toFixed(2);
    document.getElementById('paypal-amount').value = totalPrice.toFixed(2);
    document.getElementById('alipay-amount').value = totalPrice.toFixed(2);
}

function openPopup(imageSrc) {
    const popup = document.getElementById('image-popup');
    const popupImage = document.getElementById('popup-image');
    popupImage.src = imageSrc;
    popup.style.display = 'flex';
}

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}
