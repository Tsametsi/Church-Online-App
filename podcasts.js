document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/api/podcasts')
        .then(response => response.json())
        .then(data => {
            const episodeList = document.getElementById('episodeList');
            data.forEach(episode => {
                const episodeDiv = document.createElement('div');
                episodeDiv.className = 'episode';
                episodeDiv.innerHTML = `
                    <h3>${episode.title}</h3>
                    <p>${episode.description}</p>
                    <iframe width="560" height="315" src="${episode.youtube_link.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe>
                    <a href="${episode.youtube_link}" target="_blank">Watch on YouTube</a>
                `;
                episodeList.appendChild(episodeDiv);
            });
        })
        .catch(error => console.error('Error fetching podcasts:', error));
});
