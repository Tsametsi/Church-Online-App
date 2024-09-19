async function fetchDiscussions() {
    const response = await fetch('http://localhost:3000/api/discussions');
    const discussions = await response.json();
    const discussionsDiv = document.getElementById('discussions');
    discussionsDiv.innerHTML = discussions.map(d => `
        <div class="discussion">
            <h3>${d.title}</h3>
            <p>${d.content}</p>
            <p><em>Posted by: ${d.username}</em></p>
            <button onclick="toggleComments(${d.id})">💬 Comments</button>
            <div id="comments-${d.id}" class="comment-section"></div>
            <input type="text" id="comment-input-${d.id}" placeholder="Add a comment...">
            <button onclick="addComment(${d.id})">Submit Comment</button>
        </div>
    `).join('');
}

async function toggleComments(discussionId) {
    const commentsDiv = document.getElementById(`comments-${discussionId}`);
    if (commentsDiv.style.display === "block") {
        commentsDiv.style.display = "none";
    } else {
        commentsDiv.style.display = "block";
        await fetchComments(discussionId);
    }
}

async function fetchComments(discussionId) {
    const response = await fetch(`http://localhost:3000/api/discussions/${discussionId}/comments`);
    const comments = await response.json();
    const commentsDiv = document.getElementById(`comments-${discussionId}`);
    commentsDiv.innerHTML = comments.map(c => `
        <div class="comment">
            <p>${c.content} <em>Posted by: ${c.username}</em></p>
            <button onclick="likeComment(${c.id})">👍 Like</button>
            <button onclick="toggleReplies(${c.id})">💬 Reply</button>
            <div id="replies-${c.id}" class="reply-section"></div>
            <input type="text" id="reply-input-${c.id}" placeholder="Add a reply..." style="display:none;">
            <button onclick="addReply(${c.id})" style="display:none;">Submit Reply</button>
        </div>
    `).join('');
}

function toggleReplies(commentId) {
    const replySection = document.getElementById(`replies-${commentId}`);
    const replyInput = document.getElementById(`reply-input-${commentId}`);
    const replyButton = document.querySelector(`button[onclick="addReply(${commentId})"]`);

    if (replySection.style.display === "block") {
        replySection.style.display = "none";
        replyInput.style.display = "none";
        replyButton.style.display = "none";
    } else {
        replySection.style.display = "block";
        replyInput.style.display = "block";
        replyButton.style.display = "block";
        fetchReplies(commentId);
    }
}

async function fetchReplies(commentId) {
    const response = await fetch(`http://localhost:3000/api/comments/${commentId}/replies`);
    const replies = await response.json();
    const repliesDiv = document.getElementById(`replies-${commentId}`);
    repliesDiv.innerHTML = replies.map(r => `
        <div class="reply">
            <p>${r.content} <em>Posted by: ${r.username}</em></p>
        </div>
    `).join('');
}

async function addReply(commentId) {
    const content = document.getElementById(`reply-input-${commentId}`).value;

    if (!content) {
        alert('Please enter a reply.');
        return;
    }

    const username = getCurrentUsername();

    await fetch(`http://localhost:3000/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, username })
    });

    document.getElementById(`reply-input-${commentId}`).value = '';
    fetchReplies(commentId); // Refresh replies
}

async function addComment(discussionId) {
    const content = document.getElementById(`comment-input-${discussionId}`).value;

    if (!content) {
        alert('Please enter a comment.');
        return;
    }

    const username = getCurrentUsername();

    await fetch(`http://localhost:3000/api/discussions/${discussionId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, username })
    });

    document.getElementById(`comment-input-${discussionId}`).value = '';
    fetchComments(discussionId); // Refresh comments
}

// Submit new discussion
document.getElementById('submit').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
        alert('Please fill in both the title and content.');
        return;
    }

    const username = getCurrentUsername();

    await fetch('http://localhost:3000/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, username })
    });

    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    fetchDiscussions(); // Refresh discussions
});

// Function to get the current username from local storage
function getCurrentUsername() {
    return localStorage.getItem('username'); // Assumes you store username as 'username'
}

// Initial fetch
fetchDiscussions();
