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
                    eventDiv.classList.add('event');
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
                            ${event.media.map(mediaItem => {
                                return mediaItem.url.endsWith('.mp4')
                                    ? `<video src="${mediaItem.url}" controls style="width:100px;" onclick="openFullView(${JSON.stringify(event.media.map(m => m.url))}, ${event.media.indexOf(mediaItem)})"></video>`
                                    : `<img src="${mediaItem.url}" alt="Media" class="thumbnail" style="width:100px;" onclick="openFullView(${JSON.stringify(event.media.map(m => m.url))}, ${event.media.indexOf(mediaItem)})">`;
                            }).join('')}
                        </div>
                        ${event.virtual_url ? `<p><a href="${event.virtual_url}" target="_blank">Join Virtual Event</a></p>` : ''}
                        ${event.ticket_url ? `<p><a href="${event.ticket_url}" target="_blank">Buy Tickets</a></p>` : ''}
                    `;
                    
                    eventsContainer.appendChild(eventDiv);

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
            .catch(err => console.error(err));
    }

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
});
