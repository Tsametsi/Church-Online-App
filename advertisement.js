document.addEventListener('DOMContentLoaded', () => {
    fetchAdvertisements();

    let currentIndex = 0;
    let slides = [];

    function fetchAdvertisements() {
        fetch('/advertisements')
            .then(response => response.json())
            .then(advertisements => {
                const slidesContainer = document.querySelector('.slides');
                const dotsContainer = document.getElementById('advertisement-dots');
                slides = advertisements;

                slides.forEach((ad, index) => {
                    const slideDiv = document.createElement('div');
                    slideDiv.className = 'slide';

                    if (ad.mediaUrl.endsWith('.mp4')) {
                        const video = document.createElement('video');
                        video.src = ad.mediaUrl;
                        video.controls = false; // Hide controls for autoplay
                        video.loop = false; // Do not loop the video
                        video.muted = true; // Mute for autoplay
                        slideDiv.appendChild(video);

                        // Event listener for when the video ends
                        video.addEventListener('ended', () => {
                            goToNextSlide();
                        });
                    } else {
                        const img = document.createElement('img');
                        img.src = ad.mediaUrl;
                        slideDiv.appendChild(img);
                    }

                    slidesContainer.appendChild(slideDiv);
                    createDot(index);
                });

                startSlideShow();
                playCurrentMedia(); // Play the first media
            })
            .catch(err => console.error(err));
    }

    function createDot(index) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.onclick = () => {
            currentIndex = index;
            updateSlide();
            playCurrentMedia();
        };
        document.getElementById('advertisement-dots').appendChild(dot);
    }

    function startSlideShow() {
        setInterval(() => {
            goToNextSlide();
        }, 12000); // Change slides every 12 seconds
    }

    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % slides.length; // Move to the next index
        updateSlide();
        playCurrentMedia();
    }

    function goToPreviousSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length; // Move to the previous index
        updateSlide();
        playCurrentMedia();
    }

    function playCurrentMedia() {
        const currentMedia = slides[currentIndex];
        const video = document.querySelectorAll('video')[currentIndex];

        // Pause all videos before playing the current one
        document.querySelectorAll('video').forEach(v => v.pause());

        if (currentMedia.mediaUrl.endsWith('.mp4')) {
            video.play(); // Play the current video
        }
    }

    function updateSlide() {
        const slidesContainer = document.querySelector('.slides');
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Event listeners for navigation buttons
    document.getElementById('prev-slide').onclick = goToPreviousSlide;
    document.getElementById('next-slide').onclick = goToNextSlide;
});
