const form = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const attachmentInput = document.getElementById('attachment-input');
const chatMessages = document.getElementById('chat-messages');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', 'User'); // Assuming a default username
    formData.append('message', messageInput.value);
    if (attachmentInput.files[0]) {
        formData.append('attachment', attachmentInput.files[0]);
    }

    try {
        const response = await fetch('/api/chat/send', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        messageInput.value = '';
        attachmentInput.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

// Function to fetch and display chat messages
async function fetchMessages() {
    try {
        const response = await fetch('/api/chat/messages');
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const messages = await response.json();
        displayMessages(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function displayMessages(messages) {
    chatMessages.innerHTML = ''; // Clear previous messages
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${message.username}:</strong> ${message.message}`;
        if (message.attachment) {
            const attachmentLink = document.createElement('a');
            attachmentLink.href = message.attachment;
            attachmentLink.textContent = 'Attachment';
            messageElement.appendChild(attachmentLink);
        }
        chatMessages.appendChild(messageElement);
    });
}

// Fetch messages periodically
fetchMessages();
setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds (adjust as needed)
