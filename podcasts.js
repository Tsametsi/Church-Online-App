async function fetchPodcasts() {
    try {
        const response = await fetch('/api/podcasts');
        const podcasts = await response.json();

        const episodeGrid = document.getElementById('episodeGrid');
        const episodeSelection = document.getElementById('episodeSelection');
        episodeGrid.innerHTML = ''; // Clear existing content
        episodeSelection.innerHTML = ''; // Clear existing content

        podcasts.forEach(podcast => {
            // Assume you have a way to check if the user has liked this podcast
            const userHasLiked = podcast.user_has_liked; // This should be fetched or defined based on your logic

            const badge = podcast.like_count > 10000 ? '<span class="badge">Trending</span>' : '';
            const unlikeButton = userHasLiked ? `<button onclick="unlikePodcast(${podcast.id})">Unlike</button>` : '';

            // Populate episode list for display
            const episode = document.createElement('div');
            episode.classList.add('episode');
            episode.innerHTML = `
                ${badge}
                <h3>${podcast.title}</h3>
                <p>${podcast.description}</p>
                ${podcast.youtube_link ? `<iframe width="560" height="315" src="${podcast.youtube_link.replace('watch?v=', 'embed/')}" allowfullscreen></iframe>` : ''}
                ${podcast.audio_file ? `<audio controls>
                    <source src="${podcast.audio_file}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>` : ''}
                <br>
                ${podcast.video_file ? `<video width="320" height="240" controls>
                    <source src="${podcast.video_file}" type="video/mp4">
                    Your browser does not support the video element.
                </video>` : ''}
                <a href="${podcast.youtube_link}" target="_blank">Watch on YouTube</a>
                <br>
                <button onclick="likePodcast(${podcast.id})">Like <span id="like-count-${podcast.id}">${podcast.like_count}</span></button>
                ${unlikeButton}
                <button onclick="deletePodcast(${podcast.id})">Delete</button>
            `;

            episodeGrid.appendChild(episode);

            // Populate episode selection for grouping
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `episode-${podcast.id}`;
            checkbox.name = 'episode';
            checkbox.value = podcast.id;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = podcast.title;

            episodeSelection.appendChild(checkbox);
            episodeSelection.appendChild(label);
            episodeSelection.appendChild(document.createElement('br'));
        });
    } catch (error) {
        console.error('Error fetching podcasts:', error);
    }
}

// Fetch groups and display them
async function fetchGroups() {
    try {
        const response = await fetch('/api/groups');
        const groups = await response.json();

        const existingGroups = document.getElementById('existingGroups');
        existingGroups.innerHTML = ''; // Clear existing content

        groups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('group');
            groupDiv.innerHTML = `
                <h3>${group.group_name}</h3>
                <ul>
                    ${group.episodes.map(episode => `<li>${episode.title}</li>`).join('')}
                </ul>
            `;
            existingGroups.appendChild(groupDiv);
        });
    } catch (error) {
        console.error('Error fetching groups:', error);
    }
}

// Like a podcast
async function likePodcast(podcastId) {
    try {
        const response = await fetch(`/api/podcasts/${podcastId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: 1 }) // Replace with actual user ID
        });

        const result = await response.json();
        if (result.success) {
            // Update the like count on the page
            document.getElementById(`like-count-${podcastId}`).textContent = result.new_like_count;
        } else {
            alert(result.message); // Show message if user has already liked
        }
    } catch (error) {
        console.error('Error liking podcast:', error);
        alert('Error liking podcast');
    }
}


// Delete a podcast
async function deletePodcast(podcastId) {
    if (confirm('Are you sure you want to delete this podcast?')) {
        try {
            const response = await fetch(`/api/podcasts/${podcastId}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                fetchPodcasts(); // Refresh the podcast list
            } else {
                alert('Error deleting podcast');
            }
        } catch (error) {
            console.error('Error deleting podcast:', error);
            alert('Error deleting podcast');
        }
    }
}

// Form submissions
document.getElementById('uploadPodcast').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/api/podcasts/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result.message);
        fetchPodcasts(); // Refresh the podcast list
        e.target.reset(); // Reset the form
    } catch (error) {
        console.error('Error uploading podcast:', error);
        alert('Error uploading podcast');
    }
};
document.getElementById('addPodcastLink').onsubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const youtubeLink = formData.get('youtube_link');
    
    // Convert YouTube link to embed format
    const embedUrl = convertToEmbedUrl(youtubeLink);
    if (!embedUrl) {
        alert('Invalid YouTube URL. Please check and try again.');
        return; // Stop if the URL is invalid
    }

    // Replace the youtube_link in formData with the embed URL
    formData.set('youtube_link', embedUrl);

    try {
        const response = await fetch('/api/podcasts/link', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData.entries())),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        alert(result.message);
        fetchPodcasts(); // Refresh the podcast list
        e.target.reset(); // Reset the form
    } catch (error) {
        console.error('Error adding podcast link:', error);
        alert('Error adding podcast link');
    }
};

// Function to convert YouTube URL to embed format
function convertToEmbedUrl(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    } else {
        return null; // Return null for invalid URLs
    }
};


document.getElementById('groupForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/api/groups', {
            method: 'POST',
            body: JSON.stringify({
                groupName: formData.get('groupName'),
                episodes: Array.from(formData.getAll('episode'))
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        alert(result.message);
        fetchGroups(); // Refresh the group list
        e.target.reset(); // Reset the form
    } catch (error) {
        console.error('Error creating group:', error);
        alert('Error creating group');
    }
};

document.getElementById('toggleUpload').onclick = () => {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('linkSection').style.display = 'none';
    document.getElementById('groupSection').style.display = 'none';
    fetchPodcasts(); // Fetch and display podcasts
};

document.getElementById('toggleLink').onclick = () => {
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('linkSection').style.display = 'block';
    document.getElementById('groupSection').style.display = 'none';
};

document.getElementById('toggleGroups').onclick = () => {
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('linkSection').style.display = 'none';
    document.getElementById('groupSection').style.display = 'block';
    fetchGroups(); // Fetch and display groups
};

// Initialize the podcast and group data
fetchPodcasts(); // Initial fetch for podcasts
fetchGroups(); // Initial fetch for groups

// Search functionality
document.querySelector('.search-bar').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const episodes = document.querySelectorAll('#episodeGrid .episode');

    episodes.forEach(episode => {
        const title = episode.querySelector('h3').textContent.toLowerCase();
        const description = episode.querySelector('p').textContent.toLowerCase();
        if (title.includes(query) || description.includes(query)) {
            episode.style.display = 'block';
        } else {
            episode.style.display = 'none';
        }
    });
});
async function fetchPodcasts() {
    try {
        const response = await fetch('/api/podcasts');
        const podcasts = await response.json();

        // Sort podcasts by like_count in descending order
        podcasts.sort((a, b) => b.like_count - a.like_count);

        const episodeGrid = document.getElementById('episodeGrid');
        const episodeSelection = document.getElementById('episodeSelection');
        episodeGrid.innerHTML = ''; // Clear existing content
        episodeSelection.innerHTML = ''; // Clear existing content

        podcasts.forEach(podcast => {
            const episode = document.createElement('div');
            episode.classList.add('episode');
            // Add badge for episodes with more than 10,000 likes
            const badge = podcast.like_count > 10000 ? '<span class="badge">Trending</span>' : '';
            episode.innerHTML = `
                ${badge}
                <h3>${podcast.title}</h3>
                <p>${podcast.description}</p>
                ${podcast.youtube_link ? `<iframe width="560" height="315" src="${podcast.youtube_link.replace('watch?v=', 'embed/')}" allowfullscreen></iframe>` : ''}
                ${podcast.audio_file ? `<audio controls>
                    <source src="${podcast.audio_file}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>` : ''}
                <br>
                ${podcast.video_file ? `<video width="320" height="240" controls>
                    <source src="${podcast.video_file}" type="video/mp4">
                    Your browser does not support the video element.
                </video>` : ''}
                <a href="${podcast.youtube_link}" target="_blank">Watch on YouTube</a>
                <br>
                <button onclick="likePodcast(${podcast.id})">Like <span id="like-count-${podcast.id}">${podcast.like_count}</span></button>
                <button onclick="deletePodcast(${podcast.id})">Delete</button>
            `;
            episodeGrid.appendChild(episode);

            // Populate episode selection for grouping
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `episode-${podcast.id}`;
            checkbox.name = 'episode';
            checkbox.value = podcast.id;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = podcast.title;

            episodeSelection.appendChild(checkbox);
            episodeSelection.appendChild(label);
            episodeSelection.appendChild(document.createElement('br'));
        });
    } catch (error) {
        console.error('Error fetching podcasts:', error);
    }
}
async function unlikePodcast(podcastId) {
    try {
        const response = await fetch(`/api/podcasts/${podcastId}/unlike`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: 1 }) // Replace with actual user ID
        });

        const result = await response.json();
        if (result.success) {
            // Update the like count on the page
            document.getElementById(`like-count-${podcastId}`).textContent = result.new_like_count;
        } else {
            alert(result.message); // Show message if user hasn't liked
        }
    } catch (error) {
        console.error('Error unliking podcast:', error);
        alert('Error unliking podcast');
    }
}
async function unlikePodcast(podcastId) {
    try {
        const response = await fetch(`/api/podcasts/${podcastId}/unlike`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: 1 }) // Replace with actual user ID
        });

        const result = await response.json();
        if (result.success) {
            // Update the like count on the page
            document.getElementById(`like-count-${podcastId}`).textContent = result.new_like_count;
        } else {
            alert(result.message); // Show message if user hasn't liked
        }
    } catch (error) {
        console.error('Error unliking podcast:', error);
        alert('Error unliking podcast');
    }
}
