let cart = [];

function addToCart(name, price) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const paypalAmount = document.getElementById('paypal-amount');
    const alipayAmount = document.getElementById('alipay-amount');
    
    cartItems.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} (x${item.quantity}) - ZAR ${item.price * item.quantity}
            <button onclick="removeFromCart('${item.name}')">Remove</button>`;
        cartItems.appendChild(li);
        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.innerText = totalPrice.toFixed(2);
    paypalAmount.value = totalPrice.toFixed(2);
    alipayAmount.value = totalPrice.toFixed(2);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
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
