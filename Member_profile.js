document.addEventListener('DOMContentLoaded', () => {
    const profileSection = document.getElementById('member-profile');
    const profileDetails = document.getElementById('profile-details');
    const closeProfileButton = document.getElementById('close-profile');
    const searchBar = document.getElementById('search-bar');
    const executiveList = document.getElementById('executive-list');

    // Fetch profiles from the server
    const fetchProfiles = async () => {
        try {
            const response = await fetch('/api/profiles');
            const profiles = await response.json();
            return profiles;
        } catch (error) {
            console.error('Error fetching profiles:', error);
            return [];
        }
    };

    // Display profiles on the page
    const displayProfiles = async () => {
        const profiles = await fetchProfiles();
        executiveList.innerHTML = profiles.map(profile => `
            <div class="executive-card" data-member-id="${profile.id}">
                <img src="path/to/image.jpg" alt="${profile.name}"> <!-- Update with actual image path if available -->
                <div class="executive-info">
                    <h2>${profile.name}</h2>
                    <p>${profile.description}</p>
                </div>
            </div>
        `).join('');

        const executiveCards = document.querySelectorAll('.executive-card');

        executiveCards.forEach(card => {
            card.addEventListener('click', () => {
                const memberId = card.getAttribute('data-member-id');
                const profile = profiles.find(p => p.id == memberId);
                if (profile) {
                    profileDetails.innerHTML = `
                        <h2>${profile.name}</h2>
                        <p><strong>Description:</strong> ${profile.description}</p>
                        <p><strong>History:</strong> ${profile.history}</p>
                    `;
                    profileSection.classList.remove('hidden');
                }
            });
        });
    };

    closeProfileButton.addEventListener('click', () => {
        profileSection.classList.add('hidden');
    });

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        const executiveCards = document.querySelectorAll('.executive-card');
        executiveCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            if (name.includes(query) || description.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Initial display of profiles
    displayProfiles();
});
