// Initialize Socket.io
const socket = io();

// Assuming you have an array of users in your application
const users = ["Alice", "Bob", "Charlie", "Jazz", "James", "Zoe"]; // Example user list

// Elements
const messageBox = document.getElementById('message-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const userList = document.getElementById('user-list');
const createGroupButton = document.getElementById('create-group-button');
const groupModal = document.getElementById('group-modal');
const closeModal = document.querySelector('.close');
const groupNameInput = document.getElementById('group-name-input');
const groupDescriptionInput = document.getElementById('group-description-input');
const addMembersList = document.getElementById('add-members-list');
const addMemberButton = document.getElementById('add-member-button');
const createGroupSubmit = document.getElementById('create-group-submit');

// Display messages in the chat
socket.on('message', (message) => {
    const msgElement = document.createElement('div');
    msgElement.textContent = message;
    messageBox.appendChild(msgElement);
});

// Send message
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        socket.emit('sendMessage', message); // Emit the message to the server
        messageInput.value = ''; // Clear input after sending
    }
});

// User connection and disconnection handling
socket.on('userConnected', (username) => {
    const userElement = document.createElement('li');
    userElement.textContent = username;
    userList.appendChild(userElement);
});

socket.on('userDisconnected', (username) => {
    const userItems = userList.getElementsByTagName('li');
    for (let i = 0; i < userItems.length; i++) {
        if (userItems[i].textContent === username) {
            userList.removeChild(userItems[i]);
            break;
        }
    }
});

// Open the group creation modal
createGroupButton.addEventListener('click', () => {
    groupModal.style.display = 'block';
    populateUsers(); // Populate users in the modal
});

// Close modal when clicking on <span> (x)
closeModal.addEventListener('click', () => {
    groupModal.style.display = 'none';
});

// Populate user list in the modal for adding members
function populateUsers() {
    addMembersList.innerHTML = ''; // Clear previous list
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" class="member-checkbox" value="${user}">${user}`;
        addMembersList.appendChild(li);
    });
}

// Add selected members from the modal
addMemberButton.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.member-checkbox:checked');
    const selectedMembers = Array.from(checkboxes).map(cb => cb.value);
    console.log("Selected Members:", selectedMembers); // For debugging
});

// Create group when the button is clicked
createGroupSubmit.addEventListener('click', () => {
    const name = groupNameInput.value;
    const description = groupDescriptionInput.value;

    const checkboxes = document.querySelectorAll('.member-checkbox:checked');
    const selectedMembers = Array.from(checkboxes).map(cb => cb.value);

    // Create the group object
    const newGroup = {
        name: name,
        description: description,
        members: selectedMembers,
        creator: 'CurrentUsername' // Replace with actual logic to get the current user's username
    };

    // Send the request to the server
    fetch('/api/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroup)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Group created successfully:', data);
        alert('Group created successfully!');
        groupModal.style.display = 'none'; // Close the modal
        groupNameInput.value = ''; // Clear input
        groupDescriptionInput.value = ''; // Clear input
    })
    .catch(error => {
        console.error('Error creating group:', error);
        alert('Error creating group: ' + error.message);
    });
});

// Close the modal when clicking anywhere outside of it
window.onclick = function(event) {
    if (event.target === groupModal) {
        groupModal.style.display = 'none';
    }
};

// Handle user connection and disconnection events
socket.on('connect', () => {
    const username = prompt('Enter your name:');
    socket.emit('join', username); // Send username to the server
});

// You can add additional Socket.io listeners here to handle incoming group data
