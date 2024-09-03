document.addEventListener('DOMContentLoaded', () => {
    const channels = document.querySelectorAll('.channel');
    const player = document.getElementById('video-player');
    let currentIndex = 0;

    function updatePlayer() {
        const url = channels[currentIndex].getAttribute('data-url');
        player.src = url;
    }

    function prevChannel() {
        if (currentIndex > 0) {
            currentIndex--;
            updatePlayer();
        }
    }

    function nextChannel() {
        if (currentIndex < channels.length - 1) {
            currentIndex++;
            updatePlayer();
        }
    }

    // Initialize player with the first channel
    updatePlayer();

    // Attach event listeners to buttons
    document.querySelector('.nav-btn:nth-child(1)').addEventListener('click', prevChannel);
    document.querySelector('.nav-btn:nth-child(2)').addEventListener('click', nextChannel);

    // Add click event to channels to update player
    channels.forEach((channel, index) => {
        channel.addEventListener('click', () => {
            currentIndex = index;
            updatePlayer();
        });
    });
});
