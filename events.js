// Modal handling
const modal = document.getElementById('upload-event');
const createEventBtn = document.getElementById('create-event-btn');
const closeModal = document.querySelector('.modal .close');

createEventBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/events')
        .then(response => response.json())
        .then(events => {
            const eventsContainer = document.getElementById('events-container');
            const trendingEventsContainer = document.getElementById('trending-events-container');

            events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerHTML = `
                    <h2>${event.title}</h2>
                    <p>${event.description}</p>
                    <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleString()}</p>
                    ${event.virtual_url ? `<p><strong>Virtual URL:</strong> <a href="${event.virtual_url}" target="_blank">${event.virtual_url}</a></p>` : ''}
                    ${event.ticket_url ? `<p><strong>Buy Tickets:</strong> <a href="${event.ticket_url}" target="_blank">Purchase</a></p>` : ''}
                    ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}" style="width:100%; max-width:300px; margin-top: 10px;" />` : ''}
                    <input type="email" id="email-${event.id}" placeholder="Enter your email to get notified">
                    <button onclick="notifyMe(${event.id})">Notify Me</button>
                `;

                // Append to the appropriate container
                if (event.trending) {
                    trendingEventsContainer.appendChild(eventDiv);
                } else {
                    eventsContainer.appendChild(eventDiv);
                }
            });
        })
        .catch(error => console.error('Error fetching events:', error));
});

document.getElementById('event-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    const fileInput = document.getElementById('image');
    
    // Check if a file was selected
    if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]); // Append the file to the FormData
    }

    fetch('/api/events/upload', {
        method: 'POST',
        body: formData, // Use FormData for the request body
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Event successfully uploaded!');
            document.getElementById('event-form').reset(); // Reset the form
            location.reload(); // Refresh the page to show the new event
        } else {
            alert('Failed to upload event.');
        }
    })
    .catch(error => console.error('Error uploading event:', error));
});

function notifyMe(eventId) {
    const email = document.getElementById(`email-${eventId}`).value;
    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    fetch(`/api/events/${eventId}/notify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('You will be notified at the time of the event.');
        } else {
            alert('Failed to set up notification.');
        }
    })
    .catch(error => console.error('Error notifying:', error));
}
