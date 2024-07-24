// JavaScript for Chat Application

document.addEventListener('DOMContentLoaded', function() {
    // Socket.IO client-side initialization
    const socket = io();

    // Elements from the DOM
    const messageBox = document.getElementById('message-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const userList = document.getElementById('user-list');
    const groupList = document.getElementById('group-list');
    const createGroupButton = document.getElementById('create-group-button');
    const groupModal = document.getElementById('group-modal');
    const groupNameInput = document.getElementById('group-name-input');
    const addMemberButton = document.getElementById('add-member-button');
    const addMembersList = document.getElementById('add-members-list');
    const createGroupSubmitButton = document.getElementById('create-group-submit');

    // Event listener to open group modal
    createGroupButton.addEventListener('click', function() {
        groupModal.style.display = 'block';
        // Clear previous input values
        groupNameInput.value = '';
        addMembersList.innerHTML = ''; // Clear previous member list
        // Fetch users to populate add members list
        fetchUsers()
            .then(users => {
                // Display users in add members list
                users.forEach(user => {
                    const li = document.createElement('li');
                    li.textContent = user.username;
                    li.setAttribute('data-username', user.username);
                    li.addEventListener('click', function() {
                        this.classList.toggle('selected');
                    });
                    addMembersList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    });

    // Event listener to close group modal
    document.getElementsByClassName('close')[0].addEventListener('click', function() {
        groupModal.style.display = 'none';
    });

    // Event listener to add member to group
    addMemberButton.addEventListener('click', function() {
        const selectedUsers = Array.from(addMembersList.querySelectorAll('.selected'))
                                 .map(li => li.getAttribute('data-username'));
        selectedUsers.forEach(username => {
            // Do something with selected users (e.g., add to a list to be sent with group creation)
            console.log('Selected user:', username);
        });
    });

    // Event listener to create group
    createGroupSubmitButton.addEventListener('click', function() {
        const groupName = groupNameInput.value.trim();
        if (groupName === '') {
            alert('Please enter a group name.');
            return;
        }
        const selectedUsers = Array.from(addMembersList.querySelectorAll('.selected'))
                                 .map(li => li.getAttribute('data-username'));
        // Implement logic to create a group with selectedUsers
        console.log('Group Name:', groupName);
        console.log('Selected Users:', selectedUsers);
        groupModal.style.display = 'none';
    });

    // Function to fetch users from the server (replace with actual API call)
    function fetchUsers() {
        return fetch('/api/users')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch users.');
                    }
                    return response.json();
                })
                .then(users => users)
                .catch(error => {
                    console.error('Error fetching users:', error);
                    throw error;
                });
    }

    // Function to display created groups (replace with actual API call)
    function displayGroups() {
        fetch('/api/groups') // Replace with actual endpoint to fetch user's groups
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch groups.');
                }
                return response.json();
            })
            .then(groups => {
                groupList.innerHTML = ''; // Clear previous groups
                groups.forEach(group => {
                    const li = document.createElement('li');
                    li.textContent = group.name;
                    li.setAttribute('data-group-id', group.id);
                    li.addEventListener('click', function() {
                        // Handle click on group (e.g., join, leave, delete)
                        const groupId = this.getAttribute('data-group-id');
                        console.log('Clicked Group ID:', groupId);
                        // Implement logic to join/leave/delete group
                    });
                    groupList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }

    // Initialize on page load
    displayGroups(); // Display user's groups on load

    // Socket.IO events (replace with actual Socket.IO events as needed)
    socket.on('connect', function() {
        console.log('Connected to Socket.IO');
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from Socket.IO');
    });

    socket.on('new_message', function(data) {
        console.log('New message received:', data);
        // Handle incoming message (e.g., display in messageBox)
    });

    // Function to send message (replace with actual logic)
    sendButton.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message === '') {
            return;
        }
        const recipient = ''; // Implement recipient logic
        const attachment = null; // Implement attachment logic
        const data = {
            username: '', // Implement username logic
            recipient: recipient,
            message: message,
            attachment: attachment
        };
        socket.emit('send_message', data);
        messageInput.value = ''; // Clear message input after sending
    });

});
