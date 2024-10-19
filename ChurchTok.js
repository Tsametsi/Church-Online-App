const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');
const captionDisplay = document.getElementById('caption');
const usernameDisplay = document.getElementById('username');
const likeCountDisplay = document.getElementById('likeCount');
const commentsList = document.getElementById('commentsList');
const commentInput = document.getElementById('commentInput');
const videoFileInput = document.getElementById('videoFile');
const captionInput = document.getElementById('captionInput');

let videos = [];

// Load videos from the server
function loadVideos() {
    fetch('http://localhost:3000/videos')
        .then(response => response.json())
        .then(data => {
            videos = data;
            displayVideos();
        });
}

// Display videos in a TikTok-like format
function displayVideos() {
    videoContainer.innerHTML = ''; // Clear previous videos
    videos.forEach((video, index) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';

        const videoElement = document.createElement('video');
        videoElement.src = video.video_url;
        videoElement.controls = true;
        videoElement.autoplay = false; // Prevent autoplay for thumbnails

        const caption = document.createElement('p');
        caption.innerText = video.caption;

        const username = document.createElement('p');
        username.innerText = `Posted by: ${video.user_id}`; // Adjust as needed

        videoCard.appendChild(videoElement);
        videoCard.appendChild(caption);
        videoCard.appendChild(username);
        videoContainer.appendChild(videoCard);

        // Click event to load the video into the main player
        videoCard.addEventListener('click', () => {
            loadVideo(index);
        });
    });
}

// Load the selected video into the main player
function loadVideo(index) {
    const selectedVideo = videos[index];
    if (selectedVideo) {
        videoPlayer.src = selectedVideo.video_url;
        captionDisplay.innerText = selectedVideo.caption;
        usernameDisplay.innerText = `Posted by: ${selectedVideo.user_id}`;
        likeCountDisplay.innerText = selectedVideo.likeCount || 0;
        loadComments(selectedVideo.id);
    }
}

// Load comments for the current video
function loadComments(videoId) {
    fetch(`http://localhost:3000/comments/${videoId}`)
        .then(response => response.json())
        .then(data => {
            commentsList.innerHTML = '';
            data.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.innerText = `${comment.username}: ${comment.comment_text}`;
                commentsList.appendChild(commentDiv);
            });
        });
}

// Handle video upload
document.getElementById('uploadBtn').addEventListener('click', () => {
    const videoFile = videoFileInput.files[0];
    const caption = captionInput.value;
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('userId', 1); // Replace with actual user ID
    formData.append('caption', caption);

    fetch('http://localhost:3000/upload/video', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadVideos(); // Reload videos after upload
        // Clear input fields
        videoFileInput.value = '';
        captionInput.value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to upload video. Please try again.');
    });
});

// Video recording setup
let mediaRecorder;
let recordedChunks = [];

document.getElementById('startRecordingBtn').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    recordingPlayer.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        recordingPlayer.src = url;
        document.getElementById('saveRecordingBtn').disabled = false;

        // Reset for the next recording
        recordedChunks = [];
    };

    mediaRecorder.start();
    document.getElementById('startRecordingBtn').disabled = true;
    document.getElementById('stopRecordingBtn').disabled = false;
});

document.getElementById('stopRecordingBtn').addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('startRecordingBtn').disabled = false;
    document.getElementById('stopRecordingBtn').disabled = true;
});

document.getElementById('saveRecordingBtn').addEventListener('click', () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', blob, 'recorded_video.webm');
    formData.append('userId', 1); // Replace with actual user ID
    formData.append('caption', captionInput.value);

    fetch('http://localhost:3000/upload/video', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadVideos(); // Reload videos after saving
        // Clear input fields
        captionInput.value = '';
        recordedChunks = []; // Clear recorded chunks
        recordingPlayer.srcObject = null; // Stop the video stream
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save recording. Please try again.');
    });
});

// Load initial videos
loadVideos();
