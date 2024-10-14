document.getElementById('donateBtn').addEventListener('click', function() {
    showForm('donateForm');
});

document.getElementById('signupBtn').addEventListener('click', function() {
    showForm('signupForm');
});

// Handle category selection for donations
document.getElementById('submitCategory').addEventListener('click', async function() {
    const categoryId = document.getElementById('donationCategory').value;

    if (!categoryId) {
        alert('Please select a category');
        return;
    }

    const response = await fetch(`/api/organizations/${categoryId}`);

    if (response.ok) {
        const organizations = await response.json();
        const orgGrid = document.getElementById('orgGrid');
        orgGrid.innerHTML = ''; // Clear the existing grid

        organizations.forEach(org => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.innerHTML = `
                <h4>${org.name}</h4>
                <p>Email: ${org.email}</p>
                <p>Phone: ${org.phone}</p>
                <p>Address: ${org.address}</p>
                <p>Description: ${org.description}</p>
            `;
            orgGrid.appendChild(gridItem);
        });

        fadeInItems(orgGrid);
        document.getElementById('organizationGrid').style.display = 'block';
    } else {
        alert('Error fetching organizations.');
    }
});

// Handle organization sign-up
document.getElementById('submitSignup').addEventListener('click', async function() {
    const name = document.getElementById('orgName').value;
    const email = document.getElementById('orgEmail').value;
    const phone = document.getElementById('orgPhone').value;
    const contactPerson = document.getElementById('orgContactPerson').value;
    const orgNumber = document.getElementById('orgNumber').value;
    const address = document.getElementById('orgAddress').value;
    const description = document.getElementById('orgDescription').value;
    const helpCategoryId = document.getElementById('helpCategory').value;

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, contactPerson, orgNumber, address, description, helpCategoryId })
    });

    if (response.ok) {
        alert('Organization signed up successfully!');
        document.getElementById('signupForm').reset();
        document.getElementById('popup').style.display = 'block';
    } else {
        alert('Error signing up organization.');
    }
});

// Show donor registration form
document.getElementById('donorRegBtn').addEventListener('click', function() {
    showForm('donorRegistrationForm');
});

// Handle donor registration
document.getElementById('submitDonorReg').addEventListener('click', async function() {
    const name = document.getElementById('donorNameReg').value;
    const email = document.getElementById('donorEmailReg').value;
    const phone = document.getElementById('donorPhoneReg').value;
    const address = document.getElementById('donorAddressReg').value;
    const donorType = document.getElementById('donorType').value;
    const helpCategoryId = document.getElementById('donorHelpCategory').value;

    const response = await fetch('/api/registerDonor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, address, donorType, helpCategoryId })
    });

    if (response.ok) {
        alert('Thank you! We\'ll be in contact with you soon 😊😊');
        document.getElementById('donorRegistrationForm').reset();
        document.getElementById('popup').style.display = 'block';
    } else {
        alert('Error registering donor.');
    }
});

// Show donor category selection form
document.getElementById('donorCategoryBtn').addEventListener('click', function() {
    showForm('donorCategoryForm');
});

// Show the specified form with transition
function showForm(formId) {
    const forms = ['donateForm', 'signupForm', 'donorRegistrationForm', 'donorCategoryForm'];
    forms.forEach(form => {
        const formElement = document.getElementById(form);
        if (form === formId) {
            formElement.style.display = 'block';
            formElement.classList.add('fade-in');
        } else {
            formElement.classList.remove('fade-in');
            formElement.style.display = 'none';
        }
    });
}

// Handle donor category selection
document.getElementById('submitDonorCategory').addEventListener('click', async function() {
    const categoryId = document.getElementById('donorHelpCategorySelect').value;

    if (!categoryId) {
        alert('Please select a category');
        return;
    }

    const response = await fetch(`/api/donors/${categoryId}`);

    if (response.ok) {
        const donors = await response.json();
        const donorGrid = document.getElementById('donorGrid');
        donorGrid.innerHTML = ''; // Clear existing donors

        donors.forEach(donor => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.innerHTML = `
                <h4>${donor.name}</h4>
                <p>Email: ${donor.email}</p>
                <p>Phone: ${donor.phone}</p>
                <p>Address: ${donor.address}</p>
                <p>Type: ${donor.donor_type}</p>
            `;
            donorGrid.appendChild(gridItem);
        });

        fadeInItems(donorGrid);
        document.getElementById('donorGridContainer').style.display = 'block'; // Show donor grid
    } else {
        alert('Error fetching donors.');
    }
});

// Fade-in function for grid items
function fadeInItems(container) {
    const gridItems = container.querySelectorAll('.grid-item');
    gridItems.forEach((item, index) => {
        item.style.opacity = 0; // Start invisible
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s`; // Staggered delay
        item.style.opacity = 1; // Fade in
    });
}

// Close popup
document.getElementById('closePopup').onclick = function() {
    document.getElementById('popup').style.display = 'none';
};

// Ensure donor list is only shown under "I'm looking for a donor"
function showDonorGrid() {
    document.getElementById('donorGridContainer').style.display = 'none'; // Hide by default
    document.getElementById('donorCategoryBtn').addEventListener('click', function() {
        showForm('donorCategoryForm');
        document.getElementById('donorGridContainer').style.display = 'block'; // Show only when in this section
    });
}
document.getElementById('volunteerRegistrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch('/submit_volunteer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            // Show thank you message
            document.getElementById('thankYouMessage').style.display = 'block';
            this.reset(); // Reset the form after submission
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
// Example data for donees by continent
const doneesByContinent = {
    Africa: 1200,
    Asia: 800,
    Europe: 600,
    NorthAmerica: 400,
    SouthAmerica: 200,
    Australia: 100,
};

// Function to display donees by continent
function displayDoneesByContinent() {
    const continentsContainer = document.querySelector('.continents');
    continentsContainer.innerHTML = ''; // Clear existing content

    for (const [continent, count] of Object.entries(doneesByContinent)) {
        const continentItem = document.createElement('div');
        continentItem.classList.add('continent-item');
        continentItem.innerHTML = `
            <h3>${continent}</h3>
            <p>${count} Donees</p>
        `;
        continentsContainer.appendChild(continentItem);
    }
}

// Call the function to display donees by continent when the page loads
window.onload = displayDoneesByContinent;
document.addEventListener('DOMContentLoaded', () => {
    const ratingStars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('ratingValue');
    
    // Handle star rating selection
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            ratingStars.forEach(s => s.classList.remove('selected'));
            star.classList.add('selected');
            ratingValue.value = star.getAttribute('data-value');
        });
    });

    // Handle form submission
    document.getElementById('reviewForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent page reload

        const reviewerName = document.getElementById('reviewerName').value;
        const reviewText = document.getElementById('reviewText').value;
        const rating = ratingValue.value;

        const response = await fetch('/api/donation_reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reviewerName, reviewText, rating })
        });

        if (response.ok) {
            const reviewHTML = `
                <div class="review">
                    <strong>${reviewerName} (${rating} stars)</strong>
                    <p>${reviewText}</p>
                </div>
            `;
            document.getElementById('reviewsList').insertAdjacentHTML('beforeend', reviewHTML);
            
            // Clear the form
            this.reset();
            ratingValue.value = 0;
            ratingStars.forEach(star => star.classList.remove('selected'));
        } else {
            alert('Error submitting review. Please try again later.');
        }
    });
});
 // Star rating functionality
 document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        const ratingValue = this.getAttribute('data-value');
        document.getElementById('ratingValue').value = ratingValue;

        document.querySelectorAll('.star').forEach(s => {
            s.classList.remove('selected');
        });

        for (let i = 0; i < ratingValue; i++) {
            document.querySelectorAll('.star')[i].classList.add('selected');
        }
    });
});

// Review submission
document.getElementById('reviewForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload

    const reviewerName = document.getElementById('reviewerName').value;
    const ratingValue = document.getElementById('ratingValue').value;
    const reviewText = document.getElementById('reviewText').value;

    fetch('/submit_review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: reviewerName,
            rating: ratingValue,
            review: reviewText
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Clear the form
        document.getElementById('reviewForm').reset();
        document.getElementById('ratingValue').value = 0;

        // Append new review to the review list
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
        reviewDiv.innerHTML = `
            <strong>${data.name} (${data.rating} stars)</strong>
            <p>${data.review}</p>
        `;
        document.getElementById('reviewsList').appendChild(reviewDiv);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
// Fetch reviews from the server
function fetchReviews() {
    fetch('/get_reviews')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(reviews => {
            const reviewsList = document.getElementById('reviewsList');
            reviewsList.innerHTML = ''; // Clear existing reviews

            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('review');
                reviewDiv.innerHTML = `
                    <strong>${review.username} (${review.rating} stars)</strong>
                    <p>${review.review}</p>
                `;
                reviewsList.appendChild(reviewDiv);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Call fetchReviews when the page loads
document.addEventListener('DOMContentLoaded', fetchReviews);
