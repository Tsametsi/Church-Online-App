let activeInputId = null; // Variable to track the current active input field for emoji insertion

async function fetchDiscussions() {
    const response = await fetch('http://localhost:3000/api/discussions');
    const discussions = await response.json();
    const discussionsDiv = document.getElementById('discussions');
    discussionsDiv.innerHTML = discussions.map(d => `
        <div class="discussion">
            <h3>${d.title}</h3>
            <p>${d.content}</p>
            <p><em>Posted by: ${d.username}</em></p>
            <button onclick="toggleComments(${d.id}, '${d.username}')">💬 Comments</button>
            <div id="comments-${d.id}" class="comment-section"></div>
            <input type="text" id="comment-input-${d.id}" placeholder="Add a comment..." style="display: none;">
            <button id="comment-button-${d.id}" onclick="addComment(${d.id}, '${d.username}')" style="display: none;">Add Comment</button>
            <button id="emoji-button-${d.id}" onclick="toggleEmojiPicker('comment-input-${d.id}')">😀 Add Emoji</button>
            <button onclick="toggleCommentInput(${d.id})">Comment</button>
        </div>
    `).join('');
}

const gnewsApiKey = '1f6ba38c9c1c12128e2fff26d91c6547'; // Your GNews API key
const gnewsApiUrl = 'https://gnews.io/api/v4/top-headlines'; // GNews API endpoint

async function fetchTrendingTopics() {
    try {
        const response = await fetch(`${gnewsApiUrl}?token=${gnewsApiKey}&lang=en`);
        const data = await response.json();

        if (data.articles) {
            const topicsContainer = document.getElementById('topics-container');
            topicsContainer.innerHTML = data.articles.map(article => `
                <div class="topic" onclick="setDiscussionTitle('${article.title}')">
                    ${article.title}
                </div>
            `).join('');
        } else {
            console.error('No articles found:', data);
        }
    } catch (error) {
        console.error('Error fetching trending topics:', error);
    }
}

function setDiscussionTitle(title) {
    document.getElementById('discussion-title').value = title;
}

function toggleCommentInput(discussionId) {
    const commentInput = document.getElementById(`comment-input-${discussionId}`);
    const commentButton = document.getElementById(`comment-button-${discussionId}`);

    if (commentInput.style.display === "block") {
        commentInput.style.display = "none"; // Hide input
        commentButton.style.display = "none"; // Hide button
    } else {
        commentInput.style.display = "block"; // Show input
        commentButton.style.display = "block"; // Show button
        commentButton.innerText = "Add Comment"; // Change button text
        commentInput.focus(); // Focus on the input field
    }
}

async function toggleComments(discussionId, username) {
    const commentsDiv = document.getElementById(`comments-${discussionId}`);
    if (commentsDiv.style.display === "block") {
        commentsDiv.style.display = "none";
    } else {
        commentsDiv.style.display = "block";
        await fetchComments(discussionId, username);
    }
}

async function fetchComments(discussionId, username) {
    const response = await fetch(`http://localhost:3000/api/discussions/${discussionId}/comments`);
    const comments = await response.json();

    // Sort comments by newest first
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const commentsDiv = document.getElementById(`comments-${discussionId}`);
    commentsDiv.innerHTML = comments.map(c => `
        <div class="comment">
            <p>${c.content} <em>Posted by: ${username}</em></p>
            <button onclick="likeComment(${c.id})">👍 Like</button>
            <button onclick="toggleReplies(${c.id})">💬 Reply</button>
            <div id="replies-${c.id}" class="reply-section" style="display: none;"></div>
            <input type="text" id="reply-input-${c.id}" placeholder="Add a reply..." style="display: none;">
            <button onclick="addReply(${c.id}, '${username}')" style="display: none;">Submit Reply</button>
            <button id="emoji-button-reply-${c.id}" onclick="toggleEmojiPicker('reply-input-${c.id}')">😀 Add Emoji</button>
        </div>
    `).join('');

    // Fetch replies for each comment
    comments.forEach(comment => {
        fetchReplies(comment.id, username);
    });
}

async function fetchReplies(commentId, username) {
    const response = await fetch(`http://localhost:3000/api/comments/${commentId}/replies`);
    const replies = await response.json();

    const repliesDiv = document.getElementById(`replies-${commentId}`);
    repliesDiv.innerHTML = replies.map(r => `
        <div class="reply">
            <p>${r.content} <em>Posted by: ${username}</em></p>
        </div>
    `).join('');
}

function toggleReplies(commentId) {
    const repliesDiv = document.getElementById(`replies-${commentId}`);
    const replyInput = document.getElementById(`reply-input-${commentId}`);
    const submitButton = replyInput.nextElementSibling; // Get the next sibling which is the submit button

    if (repliesDiv.style.display === "block") {
        repliesDiv.style.display = "none";
        replyInput.style.display = "none"; // Hide the input
        submitButton.style.display = "none"; // Hide the submit button
    } else {
        repliesDiv.style.display = "block";
        replyInput.style.display = "block"; // Show the input
        submitButton.style.display = "block"; // Show the submit button
        replyInput.focus(); // Focus on the reply input when opened
    }
}

async function addComment(discussionId, username) {
    const content = document.getElementById(`comment-input-${discussionId}`).value;

    if (!content.trim()) {
        alert('Please enter a comment.');
        return;
    }

    await fetch(`http://localhost:3000/api/discussions/${discussionId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, username })
    });

    document.getElementById(`comment-input-${discussionId}`).value = '';
    fetchComments(discussionId, username);
}

async function addReply(commentId, username) {
    const content = document.getElementById(`reply-input-${commentId}`).value;

    if (!content.trim()) {
        alert('Please enter a reply.');
        return;
    }

    await fetch(`http://localhost:3000/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, username })
    });

    document.getElementById(`reply-input-${commentId}`).value = '';
    fetchReplies(commentId, username);
}
async function submitDiscussion() {
    const title = document.getElementById('discussion-title').value;
    const content = document.getElementById('discussion-content').value;
    const username = document.getElementById('discussion-username').value;
    const audioFile = document.getElementById('discussion-audio').files[0];

    if (!username.trim() || !title.trim() || !content.trim()) {
        alert('Please enter a username, title, and content for the discussion.');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('username', username);
    if (audioFile) {
        formData.append('audio', audioFile);
    }

    await fetch('http://localhost:3000/api/discussions', {
        method: 'POST',
        body: formData
    });

    // Clear input fields
    document.getElementById('discussion-username').value = '';
    document.getElementById('discussion-title').value = '';
    document.getElementById('discussion-content').value = '';
    document.getElementById('discussion-audio').value = ''; // Clear audio input

    // Refresh discussions
    fetchDiscussions();
}


const emojis = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊',
    '😎', '😍', '😘', '😗', '😙', '😚', '☺️', '😋', '😛', '😜',
    '😝', '🤤', '😒', '😓', '😔', '😕', '😖', '😣', '😞', '😟',
    '😤', '😢', '😭', '😱', '😨', '😰', '😥', '🤔', '🤐', '🤨'
];

const emojiPicker = document.getElementById('emoji-picker');

emojis.forEach(emoji => {
    const button = document.createElement('button');
    button.textContent = emoji;
    button.addEventListener('click', () => {
        if (activeInputId) {
            const inputField = document.getElementById(activeInputId);
            if (inputField) {
                inputField.value += emoji;
            }
        }
        emojiPicker.style.display = 'none';  // Hide emoji picker after emoji selection
    });
    emojiPicker.appendChild(button);
});

function toggleEmojiPicker(inputId) {
    activeInputId = inputId;
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    document.getElementById(inputId).focus();  // Focus on the text input when showing the picker
}

function toggleDiscussionInput() {
    const newDiscussionDiv = document.getElementById('new-discussion');
    newDiscussionDiv.style.display = newDiscussionDiv.style.display === 'none' ? 'block' : 'none';
}

let discussionsData = []; // Store the discussions fetched from the API

async function fetchDiscussions() {
    const response = await fetch('http://localhost:3000/api/discussions');
    discussionsData = await response.json(); // Store discussions in the variable
    renderDiscussions(discussionsData); // Render discussions
}
function renderDiscussions(discussions) {
    const discussionsDiv = document.getElementById('discussions');
    discussionsDiv.innerHTML = discussions.map(d => `
        <div class="discussion">
            <h3>${d.title}</h3>
            ${d.audio_path ? `<audio controls src="${d.audio_path}"></audio>` : ''}
            <p>${d.content}</p>
            <p><em>Posted by: ${d.username}</em></p>
            <button onclick="toggleComments(${d.id}, '${d.username}')">💬 Comments</button>
            <div id="comments-${d.id}" class="comment-section"></div>
            <input type="text" id="comment-input-${d.id}" placeholder="Add a comment..." style="display: none;">
            <button id="comment-button-${d.id}" onclick="addComment(${d.id}, '${d.username}')" style="display: none;">Add Comment</button>
            <button id="emoji-button-${d.id}" onclick="toggleEmojiPicker('comment-input-${d.id}')">😀 Add Emoji</button>
            <button onclick="toggleCommentInput(${d.id})">Comment</button>
        </div>
    `).join('');
}



function searchDiscussions() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredDiscussions = discussionsData.filter(d => 
        d.title.toLowerCase().includes(searchTerm) || 
        d.content.toLowerCase().includes(searchTerm) || 
        d.username.toLowerCase().includes(searchTerm)
    );
    renderDiscussions(filteredDiscussions); // Render filtered discussions
}

let mediaRecorder;
let audioChunks = [];

async function toggleRecording() {
    const startBtn = document.getElementById('start-recording');
    const stopBtn = document.getElementById('stop-recording');
    const recordedAudio = document.getElementById('recorded-audio');

    if (!mediaRecorder) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

            // Set the recorded audio to the audio element
            const audioURL = URL.createObjectURL(audioBlob);
            recordedAudio.src = audioURL;
            recordedAudio.style.display = 'block'; // Show the audio element
            audioChunks = []; // Clear the audio chunks for the next recording

            // Update the discussion audio input with the recorded file
            document.getElementById('discussion-audio').files = createFileList(audioFile);
        };
    }

    if (mediaRecorder.state === 'inactive') {
        mediaRecorder.start();
        startBtn.style.display = 'none'; // Hide start button
        stopBtn.style.display = 'inline'; // Show stop button
    } else {
        mediaRecorder.stop();
        startBtn.style.display = 'inline'; // Show start button
        stopBtn.style.display = 'none'; // Hide stop button
    }
}

// Helper function to create a FileList
function createFileList(file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
}


// Fetch discussions and trending topics on page load
fetchDiscussions();
fetchTrendingTopics();
