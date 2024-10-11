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
                <p>Description: ${org.description}</p>
            `;
            orgGrid.appendChild(gridItem);
        });

        // Fade in effect for grid items
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
    const description = document.getElementById('orgDescription').value;
    const helpCategoryId = document.getElementById('helpCategory').value;

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, contactPerson, orgNumber, description, helpCategoryId })
    });

    if (response.ok) {
        alert('Organization signed up successfully!');
        document.getElementById('signupForm').reset();
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
    const helpCategoryId = document.getElementById('donorHelpCategory').value;

    const response = await fetch('/api/registerDonor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, helpCategoryId })
    });

    if (response.ok) {
        alert('Donor registered successfully!');
        document.getElementById('donorRegistrationForm').reset();
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
                <p>Comment: ${donor.comment || 'N/A'}</p>
            `;
            donorGrid.appendChild(gridItem);
        });

        // Fade in effect for donor grid items
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
