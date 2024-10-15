let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

// Optional: Automatically change slides every 5 seconds
setInterval(function() {
    plusSlides(1);
}, 5000);
    // Get the JWT token and username from localStorage
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // Display the welcome message if the user is logged in
    if (username && token) {
        const welcomeMessage = document.getElementById('welcome-message');
        welcomeMessage.innerHTML = `<h2>Welcome, ${username}!</h2>`;

        // Optionally, verify the token with the server
        fetch('/api/verifyToken', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status !== 200) {
                // Token is invalid or expired, redirect to login
                localStorage.clear(); // Clear the local storage
                window.location.href = 'Login.html';
            }
        })
        .catch(error => {
            console.error('Error verifying token:', error);
            // In case of error, redirect to login
            localStorage.clear();
            window.location.href = 'Login.html';
        });
    } else {
        // Redirect to login page if no token is found
        window.location.href = 'Login.html';
    }
