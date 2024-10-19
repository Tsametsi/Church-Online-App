document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();

    const createEventBtn = document.getElementById('create-event-btn');
    const modal = document.getElementById('upload-event');
    const closeModal = modal.querySelector('.close');
    const mediaInput = document.getElementById('media');
    const mediaPreview = document.getElementById('media-preview');

    createEventBtn.onclick = () => {
        modal.style.display = 'block';
    };

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    mediaInput.addEventListener('change', handleMediaPreview);

    function handleMediaPreview(event) {
        const files = event.target.files;
        mediaPreview.innerHTML = ''; // Clear existing previews

        for (let i = 0; i < files.length && i < 10; i++) { // Limit to 10 files
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                const mediaElement = document.createElement('div');
                mediaElement.style.display = 'inline-block';
                mediaElement.style.margin = '5px';

                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    img.style.width = '100px'; // Thumbnail size
                    img.onclick = () => openFullView([e.target.result], 0); // Open full view on click
                    mediaElement.appendChild(img);
                } else if (file.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = e.target.result;
                    video.controls = true;
                    video.style.width = '100px'; // Thumbnail size
                    video.onclick = () => openFullView([e.target.result], 0); // Open full view on click
                    mediaElement.appendChild(video);
                }

                mediaPreview.appendChild(mediaElement);
            };

            reader.readAsDataURL(file);
        }
    }

    // Function to fetch and display events
    function fetchEvents() {
        fetch('/events')
            .then(response => response.json())
            .then(events => {
                const eventsContainer = document.getElementById('events-container');
                eventsContainer.innerHTML = '';

                events.forEach(event => {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('event-card');
                    const eventDate = new Date(event.event_date);
                    const now = new Date();
                    const timeDiff = eventDate - now;

                    // Determine if the event is live
                    const isLive = timeDiff <= 0;

                    eventDiv.innerHTML = `
                        <h3>${event.title}</h3>
                        <p>${event.description}</p>
                        <p>Date: ${eventDate.toLocaleString()}</p>
                        <p class="${isLive ? 'live-status' : ''}">${isLive ? 'Currently Live' : 'Countdown: ' + formatTime(timeDiff)}</p>
                        <div class="media-display">
                            ${event.media.map((mediaItem, index) => {
                                const isVideo = mediaItem.url.endsWith('.mp4');
                                return isVideo
                                    ? `<video src="${mediaItem.url}" controls style="width:100px; cursor:pointer;" onclick="openFullView(${JSON.stringify(event.media.map(m => m.url))}, ${index})"></video>`
                                    : `<img src="${mediaItem.url}" alt="Event Media" class="thumbnail" style="width:100px; cursor:pointer;" onclick="openFullView(${JSON.stringify(event.media.map(m => m.url))}, ${index})">`;
                            }).join('')}
                        </div>
                        ${event.virtual_url ? `<p><a href="#" onclick="openVirtualEvent('${event.virtual_url}'); return false;">Join Virtual Event</a></p>` : ''}
                        ${event.ticket_url ? `<p><a href="${event.ticket_url}" target="_blank">Buy Tickets</a></p>` : ''}
                        <div>
                            <input type="email" id="notify-email-${event.id}" placeholder="Enter your email to get notified" />
                            <button onclick="notifyMe(${event.id})">Notify Me</button>
                        </div>
                        <div>
                            <button onclick="reactToEvent(${event.id}, 'like')">Like</button>
                            <button onclick="reactToEvent(${event.id}, 'dislike')">Dislike</button>
                            <p>Likes: <span id="like-count-${event.id}">${event.likeCount}</span></p>
                            <p>Dislikes: <span id="dislike-count-${event.id}">${event.dislikeCount}</span></p>
                        </div>
                        <div>
                            <input type="text" id="comment-input-${event.id}" placeholder="Add a comment" />
                            <button onclick="addComment(${event.id})">Comment</button>
                            <button onclick="toggleComments(${event.id})">Show Comments</button>
                            <div id="comments-${event.id}" style="display:none; overflow-y: scroll; height: 100px;">
                                <!-- Comments will be injected here -->
                            </div>
                        </div>
                    `;
                    
                    eventsContainer.appendChild(eventDiv);

                    // Load initial comments
                    loadComments(event.id);

                    // Update countdown every second if the event is not live
                    if (!isLive) {
                        setInterval(() => {
                            const updatedDiff = eventDate - new Date();
                            const countdownText = updatedDiff > 0 ? formatTime(updatedDiff) : 'Event has started!';
                            eventDiv.querySelector('.live-status').innerText = countdownText;
                        }, 1000);
                    }
                });
            })
            .catch(err => console.error('Error fetching events:', err));
    }

    // Function to notify user for a specific event
    window.notifyMe = function(eventId) {
        const emailInput = document.getElementById(`notify-email-${eventId}`);
        const email = emailInput.value;

        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }

        fetch(`/api/events/${eventId}/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => console.error('Error setting notification:', err));
    };

    // Function to handle liking/disliking an event
    window.reactToEvent = function(eventId, reaction) {
        const loggedInUserId = 1; // Replace with actual logged-in user ID from your session
        fetch(`/api/events/${eventId}/reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: loggedInUserId, reaction })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            updateReactionCounts(eventId, reaction);
        })
        .catch(err => console.error('Error reacting to event:', err));
    };

    // Function to update like/dislike counts
    function updateReactionCounts(eventId, reaction) {
        const likeCountElement = document.getElementById(`like-count-${eventId}`);
        const dislikeCountElement = document.getElementById(`dislike-count-${eventId}`);

        if (reaction === 'like') {
            likeCountElement.innerText = parseInt(likeCountElement.innerText) + 1;
        } else {
            dislikeCountElement.innerText = parseInt(dislikeCountElement.innerText) + 1;
        }
    }

    // Function to add a comment
    window.addComment = function(eventId) {
        const input = document.getElementById(`comment-input-${eventId}`);
        const comment = input.value;
        const loggedInUserId = 1; // Replace with actual logged-in user ID from your session

        if (!comment) {
            alert('Please enter a comment.');
            return;
        }

        fetch(`/api/events/${eventId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: loggedInUserId, comment })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            input.value = ''; // Clear the input
            loadComments(eventId); // Reload comments after adding
        })
        .catch(err => console.error('Error adding comment:', err));
    };

    // Function to load comments for an event
    window.loadComments = function(eventId) {
        fetch(`/api/events/${eventId}/comments`)
        .then(response => response.json())
        .then(data => {
            const commentsDiv = document.getElementById(`comments-${eventId}`);
            commentsDiv.innerHTML = data.comments.map(comment => `<p>${comment.username}: ${comment.comment}</p>`).join('');
        })
        .catch(err => console.error('Error loading comments:', err));
    };

    // Function to toggle comment visibility
    window.toggleComments = function(eventId) {
        const commentsDiv = document.getElementById(`comments-${eventId}`);
        if (commentsDiv.style.display === 'none') {
            commentsDiv.style.display = 'block';
            loadComments(eventId); // Load comments when showing
        } else {
            commentsDiv.style.display = 'none';
        }
    };

    // Format time into days, hours, minutes, seconds
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const days = Math.floor(totalSeconds / 86400);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // Function to open full view modal
    window.openFullView = function(mediaUrls, index) {
        const fullViewModal = document.getElementById('full-view-modal');
        const fullViewImage = document.getElementById('full-view-image');
        const fullViewVideo = document.getElementById('full-view-video');
        const dotsContainer = document.getElementById('dots-container');

        let currentIndex = index;

        function showMedia(index) {
            const item = mediaUrls[index];
            if (item.endsWith('.mp4')) {
                fullViewVideo.src = item;
                fullViewVideo.style.display = 'block';
                fullViewImage.style.display = 'none';
            } else {
                fullViewImage.src = item;
                fullViewImage.style.display = 'block';
                fullViewVideo.style.display = 'none';
            }
            updateDots(index);
        }

        function updateDots(index) {
            dotsContainer.innerHTML = '';
            mediaUrls.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.className = 'dot' + (i === index ? ' active' : '');
                dot.onclick = () => {
                    currentIndex = i;
                    showMedia(currentIndex);
                };
                dotsContainer.appendChild(dot);
            });
        }

        fullViewModal.style.display = 'block';
        showMedia(currentIndex);

        document.getElementById('close-full-view').onclick = () => {
            fullViewModal.style.display = 'none';
            fullViewVideo.pause();
        };

        fullViewModal.onclick = (event) => {
            if (event.target === fullViewModal) {
                fullViewModal.style.display = 'none';
                fullViewVideo.pause();
            }
        };

        // Navigation with arrows
        document.onkeydown = (event) => {
            if (event.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % mediaUrls.length;
                showMedia(currentIndex);
            } else if (event.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + mediaUrls.length) % mediaUrls.length;
                showMedia(currentIndex);
            }
        };
    };

    // Function to open virtual event in a modal
    window.openVirtualEvent = function(url) {
        const virtualEventModal = document.getElementById('virtual-event-modal');
        const virtualEventFrame = document.getElementById('virtual-event-frame');
        
        virtualEventFrame.src = url;
        virtualEventModal.style.display = 'block';
    };
});
