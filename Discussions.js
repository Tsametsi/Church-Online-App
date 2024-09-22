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

async function fetchTrendingTopics() {
    const response = await fetch('YOUR_API_URL_FOR_TRENDING_TOPICS'); // Replace with your API URL
    const topics = await response.json();

    const topicsContainer = document.getElementById('topics-container');
    topicsContainer.innerHTML = topics.map(topic => `
        <div class="topic" onclick="setDiscussionTitle('${topic}')">${topic}</div>
    `).join('');
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

    if (!username.trim() || !title.trim() || !content.trim()) {
        alert('Please enter a username, title, and content for the discussion.');
        return;
    }

    await fetch('http://localhost:3000/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, username })
    });

    // Clear input fields
    document.getElementById('discussion-username').value = '';
    document.getElementById('discussion-title').value = '';
    document.getElementById('discussion-content').value = '';

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

// Fetch discussions and trending topics on page load
fetchDiscussions();
fetchTrendingTopics();
