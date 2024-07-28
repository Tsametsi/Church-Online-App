document.addEventListener('DOMContentLoaded', () => {
    // Assuming the user's email is stored in a variable or from a login session
    const userEmail = localStorage.getItem('userEmail'); // or replace with your method of retrieving user email

    fetch(`/api/orders/${userEmail}`)
        .then(response => response.json())
        .then(orders => {
            const ordersBody = document.getElementById('orders-body');
            ordersBody.innerHTML = orders.map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${new Date(order.order_date).toLocaleString()}</td>
                    <td>ZAR ${order.total_price.toFixed(2)}</td>
                    <td>${order.status}</td>
                    <td>${order.shipping_address}</td>
                </tr>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });
});
