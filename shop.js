function addToCart(productName, price, size) {
    const cartItems = document.getElementById('cart-items');
    const listItem = document.createElement('li');
    
    listItem.textContent = `${productName} (${size}) - ZAR ${price.toFixed(2)}`;

    // Create a cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.marginLeft = '10px';
    
    // Add an event listener to the cancel button
    cancelButton.addEventListener('click', function() {
        removeFromCart(listItem, price);
    });
    
    listItem.appendChild(cancelButton);
    cartItems.appendChild(listItem);

    updateTotalPrice(price);
}

function updateTotalPrice(price) {
    const totalPriceElement = document.getElementById('total-price');
    const currentTotal = parseFloat(totalPriceElement.textContent);
    const newTotal = currentTotal + price;
    totalPriceElement.textContent = newTotal.toFixed(2);
    document.getElementById('paypal-amount').value = newTotal.toFixed(2);
    document.getElementById('alipay-amount').value = newTotal.toFixed(2);
}

// shop.js

// Function to filter products based on search input
function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchInput)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Add event listener to the search button
document.getElementById('search-button').addEventListener('click', filterProducts);

// Optional: Add event listener to the search input to filter as user types
document.getElementById('search-input').addEventListener('input', filterProducts);



function removeFromCart(listItem, price) {
    const cartItems = document.getElementById('cart-items');
    cartItems.removeChild(listItem);

    const totalPriceElement = document.getElementById('total-price');
    const currentTotal = parseFloat(totalPriceElement.textContent);
    const newTotal = currentTotal - price;
    totalPriceElement.textContent = newTotal.toFixed(2);
    document.getElementById('paypal-amount').value = newTotal.toFixed(2);
    document.getElementById('alipay-amount').value = newTotal.toFixed(2);
}
function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}

function showPopup(imageSrc) {
    document.getElementById('popup-image').src = imageSrc;
    document.getElementById('image-popup').style.display = 'flex';
}

document.querySelectorAll('.product-image').forEach(img => {
    img.addEventListener('click', (e) => showPopup(e.target.src));
});