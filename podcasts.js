async function fetchPodcasts() {
    try {
        const response = await fetch('/api/podcasts');
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return; // Stop execution if response is not okay
        }
        const podcasts = await response.json();
        console.log('Fetched podcasts:', podcasts); // Log the fetched podcasts

        const episodeGrid = document.getElementById('episodeGrid');
        const episodeSelection = document.getElementById('episodeSelection');
        episodeGrid.innerHTML = ''; // Clear existing content
        episodeSelection.innerHTML = ''; // Clear existing content

        podcasts.forEach(podcast => {
            const userHasLiked = podcast.user_has_liked; // Get this from your user session if possible

            const badge = podcast.like_count > 10000 ? '<span class="badge">Trending</span>' : '';
            const unlikeButton = userHasLiked ? `<button onclick="unlikePodcast(${podcast.id})">Unlike</button>` : '';

            const episode = document.createElement('div');
            episode.classList.add('episode');
            episode.innerHTML = `
                ${badge}
                <h3>${podcast.title}</h3>
                <p>${podcast.description}</p>
                ${podcast.youtube_link ? `<iframe width="560" height="315" src="${convertToEmbedUrl(podcast.youtube_link)}" allowfullscreen></iframe>` : ''}
                ${podcast.audio_file ? `<audio controls><source src="${podcast.audio_file}" type="audio/mpeg">Your browser does not support the audio element.</audio>` : ''}
                <br>
                ${podcast.video_file ? `<video width="320" height="240" controls><source src="${podcast.video_file}" type="video/mp4">Your browser does not support the video element.</video>` : ''}
                <a href="${podcast.youtube_link}" target="_blank">Watch on YouTube</a>
                <br>
                <button onclick="likePodcast(${podcast.id})">Like <span id="like-count-${podcast.id}">${podcast.like_count}</span></button>
                ${unlikeButton}
                <button onclick="deletePodcast(${podcast.id})">Delete</button>
                
                <button id="toggle-comments-${podcast.id}" onclick="toggleComments(${podcast.id})">Show Comments</button>
                <div id="comments-container-${podcast.id}" class="comments-container" style="display: none;">
                    <div class="comments">
                        <h4>Comments:</h4>
                        <div id="comments-${podcast.id}" class="comments-list"></div>
                        <input type="text" id="comment-input-${podcast.id}" placeholder="Add a comment" />
                        <button onclick="postComment(${podcast.id})">Comment</button>
                    </div>
                </div>
            `;

            episodeGrid.appendChild(episode);
            fetchComments(podcast.id); // Fetch comments for each podcast

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
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return; // Stop execution if response is not okay
        }
        const groups = await response.json();
        console.log('Fetched groups:', groups); // Log the fetched groups

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

// Post a comment
async function postComment(podcastId) {
    const commentInput = document.getElementById(`comment-input-${podcastId}`);
    const commentText = commentInput.value.trim();
    if (!commentText) {
        alert('Comment cannot be empty.');
        return; // Stop if the comment is empty
    }

    try {
        const response = await fetch(`/api/podcasts/${podcastId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: 1, // Replace with actual user ID
                comment_text: commentText
            })
        });

        const result = await response.json();
        if (result.success) {
            commentInput.value = ''; // Clear the input
            fetchComments(podcastId); // Refresh comments
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error posting comment:', error);
        alert('Error posting comment');
    }
}
// Fetch comments for a podcast
async function fetchComments(podcastId) {
    try {
        const response = await fetch(`/api/podcasts/${podcastId}/comments`);
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return; // Stop execution if response is not okay
        }
        const comments = await response.json();
        const commentsDiv = document.getElementById(`comments-${podcastId}`);
        commentsDiv.innerHTML = ''; // Clear existing comments

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `<strong>${comment.username}</strong>: ${comment.comment_text}`;
            commentsDiv.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
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
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
// Toggle visibility of sections
document.getElementById('toggleUpload').addEventListener('click', () => {
    const uploadSection = document.getElementById('uploadSection');
    const linkSection = document.getElementById('linkSection');
    const groupSection = document.getElementById('groupSection');

    uploadSection.style.display = uploadSection.style.display === 'none' ? 'block' : 'none';
    linkSection.style.display = 'none'; // Hide other sections
    groupSection.style.display = 'none';
});

document.getElementById('toggleLink').addEventListener('click', () => {
    const uploadSection = document.getElementById('uploadSection');
    const linkSection = document.getElementById('linkSection');
    const groupSection = document.getElementById('groupSection');

    linkSection.style.display = linkSection.style.display === 'none' ? 'block' : 'none';
    uploadSection.style.display = 'none'; // Hide other sections
    groupSection.style.display = 'none';
});

document.getElementById('toggleGroups').addEventListener('click', () => {
    const uploadSection = document.getElementById('uploadSection');
    const linkSection = document.getElementById('linkSection');
    const groupSection = document.getElementById('groupSection');

    groupSection.style.display = groupSection.style.display === 'none' ? 'block' : 'none';
    uploadSection.style.display = 'none'; // Hide other sections
    linkSection.style.display = 'none';
});
function toggleComments(podcastId) {
    const commentsContainer = document.getElementById(`comments-container-${podcastId}`);
    const isVisible = commentsContainer.style.display === 'block';
    
    commentsContainer.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        commentsContainer.scrollTop = 0; // Scroll to the top when opened
    }
}
// Add this function to handle the search functionality
function searchPodcasts() {
    const searchTerm = document.querySelector('.search-bar').value.toLowerCase(); // Get the search term
    const episodes = document.querySelectorAll('.episode'); // Select all podcast episodes

    episodes.forEach(episode => {
        const title = episode.querySelector('h3').innerText.toLowerCase(); // Get the title of the podcast
        const description = episode.querySelector('p').innerText.toLowerCase(); // Get the description of the podcast

        // Check if the title or description includes the search term
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            episode.style.display = 'block'; // Show the episode
        } else {
            episode.style.display = 'none'; // Hide the episode
        }
    });
}

// Add event listener to the search bar
document.querySelector('.search-bar').addEventListener('input', searchPodcasts);

// Initialize the application
fetchPodcasts();
fetchGroups();
