document.addEventListener('DOMContentLoaded', function () {
    fetchVideos();

    document.getElementById('uploadForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const videoFile = document.getElementById('videoFile').files[0];

        uploadVideo(title, description, videoFile);
    });
});

function fetchVideos() {
    fetch('http://localhost:3000/api/inspirational-videos')
        .then(response => response.json())
        .then(data => {
            const videoList = document.getElementById('videoList');
            videoList.innerHTML = '';
            data.forEach(video => {
                const videoDiv = document.createElement('div');
                videoDiv.className = 'video';
                videoDiv.innerHTML = `
                    <h3>${video.title} <span class="likes">(${video.likes} likes)</span></h3>
                    <p>${video.description}</p>
                    <video width="560" height="315" controls>
                        <source src="${video.video_url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <button class="like-btn" data-id="${video.id}">Like</button>
                    <button class="delete-btn" data-id="${video.id}">Delete</button>
                    <div class="comments">
                        <h4>Comments</h4>
                        ${video.comments.map(comment => `
                            <div class="comment">
                                <span>${comment.username}: ${comment.text}</span>
                                <button class="delete-comment-btn" data-id="${comment.id}">Delete</button>
                            </div>
                        `).join('')}
                        <input type="text" class="comment-text" placeholder="Add a comment">
                        <button class="comment-btn" data-id="${video.id}">Comment</button>
                    </div>
                `;
                videoList.appendChild(videoDiv);
            });

            addEventListeners();
        })
        .catch(error => console.error('Error fetching inspirational videos:', error));
}

function addEventListeners() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function () {
            const videoId = this.getAttribute('data-id');
            likeVideo(videoId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const videoId = this.getAttribute('data-id');
            deleteVideo(videoId);
        });
    });

    document.querySelectorAll('.comment-btn').forEach(button => {
        button.addEventListener('click', function () {
            const videoId = this.getAttribute('data-id');
            const commentText = this.previousElementSibling.value;
            addComment(videoId, commentText);
        });
    });

    document.querySelectorAll('.delete-comment-btn').forEach(button => {
        button.addEventListener('click', function () {
            const commentId = this.getAttribute('data-id');
            deleteComment(commentId);
        });
    });
}

function uploadVideo(title, description, videoFile) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoFile', videoFile);

    fetch('http://localhost:3000/api/inspirational-videos', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchVideos();
        }
    })
    .catch(error => console.error('Error uploading video:', error));
}

function likeVideo(videoId) {
    fetch(`http://localhost:3000/api/inspirational-videos/${videoId}/like`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchVideos();
        }
    })
    .catch(error => console.error('Error liking the video:', error));
}

function deleteVideo(videoId) {
    fetch(`http://localhost:3000/api/inspirational-videos/${videoId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchVideos();
        }
    })
    .catch(error => console.error('Error deleting the video:', error));
}

function addComment(videoId, commentText) {
    const commentData = {
        text: commentText,
        username: 'YourUsername' // Replace this with the actual logged-in username
    };

    fetch(`http://localhost:3000/api/inspirational-videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchVideos();
        }
    })
    .catch(error => console.error('Error adding comment:', error));
}

function deleteComment(commentId) {
    fetch(`http://localhost:3000/api/inspirational-videos/comments/${commentId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchVideos();
        }
    })
    .catch(error => console.error('Error deleting comment:', error));
}
