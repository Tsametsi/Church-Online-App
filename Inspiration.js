document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/api/inspirational-videos')
        .then(response => response.json())
        .then(data => {
            const videoList = document.getElementById('videoList');
            data.forEach(video => {
                const videoDiv = document.createElement('div');
                videoDiv.className = 'video';
                videoDiv.innerHTML = `
                    <h3>${video.title} <span class="likes">(${video.likes} likes)</span></h3>
                    <p>${video.description}</p>
                    <iframe width="560" height="315" src="${video.youtube_link}" frameborder="0" allowfullscreen></iframe>
                    <button class="like-btn" data-id="${video.id}">Like</button>
                `;
                videoList.appendChild(videoDiv);
            });

            // Add event listeners for like buttons
            const likeButtons = document.querySelectorAll('.like-btn');
            likeButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const videoId = this.getAttribute('data-id');
                    likeVideo(videoId);
                });
            });
        })
        .catch(error => console.error('Error fetching inspirational videos:', error));
});

// Function to like a video
function likeVideo(videoId) {
    fetch(`http://localhost:3000/api/inspirational-videos/${videoId}/like`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Refresh the video list to update likes
            window.location.reload();
        }
    })
    .catch(error => console.error('Error liking the video:', error));
}
