// Fetch categories on page load
window.onload = async function() {
    await loadCategories();
};

// Function to load categories
async function loadCategories() {
    const response = await fetch('/api/categories'); // Assuming you have an endpoint for categories
    if (response.ok) {
        const categories = await response.json();
        const orgCategorySelect = document.getElementById('organizationCategory');
        const donorCategorySelect = document.getElementById('donorCategory');

        categories.forEach(category => {
            const optionOrg = document.createElement('option');
            optionOrg.value = category.id;
            optionOrg.textContent = category.name;
            orgCategorySelect.appendChild(optionOrg);

            const optionDonor = document.createElement('option');
            optionDonor.value = category.id;
            optionDonor.textContent = category.name;
            donorCategorySelect.appendChild(optionDonor);
        });
    }
}

// Handle organization category selection
document.getElementById('submitOrganizationCategory').addEventListener('click', async function() {
    const categoryId = document.getElementById('organizationCategory').value;

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
    } else {
        alert('Error fetching organizations.');
    }
});

// Handle donor category selection
document.getElementById('submitDonorCategory').addEventListener('click', async function() {
    const categoryId = document.getElementById('donorCategory').value;

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
    } else {
        alert('Error fetching donors.');
    }
});
