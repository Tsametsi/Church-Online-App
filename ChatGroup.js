// Channel.js

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

// Fetch existing messages when the page loads
async function fetchMessages() {
    try {
        const response = await fetch('http://localhost:5000/api/messages');
        const messages = await response.json();
        messages.forEach((message) => {
            addMessageToChat(message.text);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Function to add message to chat
function addMessageToChat(messageText) {
    const messageElement = document.createElement('div');
    messageElement.textContent = messageText;
    messageElement.classList.add('chat-message');
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
}

// Send a new message
document.getElementById('send-btn').addEventListener('click', async function() {
    const messageText = chatInput.value.trim();
    if (messageText) {
        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: messageText }),
            });
            const newMessage = await response.json();
            addMessageToChat(newMessage.text);
            chatInput.value = ''; // Clear the input field
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
});

// Fetch messages on page load
fetchMessages();
