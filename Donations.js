document.getElementById('donateBtn').addEventListener('click', function() {
    document.getElementById('donateForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('organizationGrid').style.display = 'none';
});

document.getElementById('signupBtn').addEventListener('click', function() {
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('donateForm').style.display = 'none';
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
document.getElementById('donateBtn').onclick = function() {
    document.getElementById('donateForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('organizationGrid').style.display = 'none';
};

document.getElementById('signupBtn').onclick = function() {
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('donateForm').style.display = 'none';
    document.getElementById('organizationGrid').style.display = 'none';
};

document.getElementById('submitCategory').onclick = function() {
    // Show organizations (mockup for demonstration)
    document.getElementById('organizationGrid').style.display = 'block';
    // Trigger the popup as a placeholder for further action
    document.getElementById('popup').style.display = 'flex';
};

document.getElementById('closePopup').onclick = function() {
    document.getElementById('popup').style.display = 'none';
};
