// Word_of_the_day.js

document.addEventListener('DOMContentLoaded', function() {
    loadDailyScripture();
    loadPostedScriptures();

    // Open modal to post scripture
    var postLink = document.getElementById('postLink');
    var modal = document.getElementById('postModal');
    var closeBtn = document.getElementsByClassName('close')[0];

    postLink.onclick = function() {
        modal.style.display = 'block';
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Handle scripture form submission
    var scriptureForm = document.getElementById('scriptureForm');

    scriptureForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var scriptureText = document.getElementById('scriptureText').value.trim();
        var username = document.getElementById('username').value.trim();

        if (scriptureText === '' || username === '') {
            alert('Please enter both username and scripture.');
            return;
        }

        // Save scripture (for demo purposes, using localStorage)
        saveScripture(scriptureText, username);

        // Clear form
        scriptureForm.reset();

        // Close modal
        modal.style.display = 'none';

        // Reload posted scriptures
        loadPostedScriptures();
    });

    // Function to save scripture
    function saveScripture(scriptureText, username) {
        // Get existing scriptures from localStorage or initialize an empty array
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];

        // Add new scripture to the array
        var newScripture = {
            scripture_text: scriptureText,
            username: username,
            date: new Date().toLocaleString(),
            likes: 0,
            comments: []
        };
        scriptures.push(newScripture);

        // Save updated scriptures back to localStorage
        localStorage.setItem('scriptures', JSON.stringify(scriptures));
    }

    // Function to load daily scripture
    function loadDailyScripture() {
        var today = new Date().toLocaleDateString();
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];
        var todaysScripture = scriptures.find(function(scripture) {
            return scripture.date === today;
        });

        var dailyScriptureDiv = document.getElementById('dailyScripture');
        if (todaysScripture) {
            dailyScriptureDiv.innerHTML = "<p>" + todaysScripture.scripture_text + "</p>";
        } else {
            dailyScriptureDiv.innerHTML = "Believe in the power of your voice and the depth of your insights. Your words have the potential to touch hearts, ignite faith, and bring hope. Trust in the wisdom you've gained through your journey and share it with courage and compassion. Your sincerity and authenticity will resonate with those who are listening, bringing light and understanding into their lives. Embrace this opportunity to inspire and uplift others in your religious community. You have something unique and valuable to offer. Shine brightly, and let your faith guide you as you share your profound message.";
        }
    }

    // Function to load posted scriptures
    function loadPostedScriptures() {
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];
        scriptures.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        var postScriptureDiv = document.getElementById('postScripture');
        postScriptureDiv.innerHTML = ''; // Clear previous content

        scriptures.forEach(function(scripture, index) {
            var postItem = document.createElement('div');
            postItem.classList.add('post-item');

            var content = "<p>" + scripture.scripture_text + "</p>";
            content += "<div class='post-info'>Posted by " + scripture.username + " on " + scripture.date + "</div>";
            content += "<div class='like-comment'><button class='like-button' data-index='" + index + "'>Like (" + scripture.likes + ")</button>";
            content += "<button class='comment-button' data-index='" + index + "'>Comment</button>";
            content += "<button class='delete-button' data-index='" + index + "'>Delete</button></div>"; // Add delete button
            content += "<div class='comment-section' id='comments-" + index + "' style='display:none;'>";
            content += "<input type='text' class='comment-input' placeholder='Add a comment...' data-index='" + index + "'>";
            content += "<div class='comment-list' id='comment-list-" + index + "'></div></div>";

            postItem.innerHTML = content;
            postScriptureDiv.appendChild(postItem);

            // Add event listener to like button
            var likeBtn = postItem.querySelector('.like-button');
            likeBtn.addEventListener('click', function() {
                likeScripture(index);
            });

            // Add event listener to comment button
            var commentBtn = postItem.querySelector('.comment-button');
            commentBtn.addEventListener('click', function() {
                toggleCommentSection(index);
            });

            // Add event listener to delete button
            var deleteBtn = postItem.querySelector('.delete-button');
            deleteBtn.addEventListener('click', function() {
                deleteScripture(index);
            });

            // Add event listener to comment input
            var commentInput = postItem.querySelector('.comment-input');
            commentInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    addComment(index, commentInput.value);
                    commentInput.value = ''; // Clear input after submitting
                }
            });
        });
    }

    // Function to toggle comment section visibility
    function toggleCommentSection(index) {
        var commentSection = document.getElementById('comments-' + index);
        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
        loadComments(index);
    }

    // Function to like a scripture
    function likeScripture(index) {
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];
        scriptures[index].likes++;
        localStorage.setItem('scriptures', JSON.stringify(scriptures));
        loadPostedScriptures(); // Reload to show updated likes
    }

    // Function to add a comment
    function addComment(index, comment) {
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];
        scriptures[index].comments.push(comment);
        localStorage.setItem('scriptures', JSON.stringify(scriptures));
        loadPostedScriptures(); // Reload to show updated comments
    }

    // Function to load comments
    function loadComments(index) {
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];
        var commentList = document.getElementById('comment-list-' + index);
        commentList.innerHTML = ''; // Clear previous comments

        scriptures[index].comments.forEach(function(comment) {
            var commentItem = document.createElement('div');
            commentItem.classList.add('comment');
            commentItem.textContent = comment;
            commentList.appendChild(commentItem);
        });
    }

    // Function to delete scripture
    function deleteScripture(index) {
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];
        scriptures.splice(index, 1); // Remove the scripture at the specified index
        localStorage.setItem('scriptures', JSON.stringify(scriptures)); // Save updated list
        loadPostedScriptures(); // Reload posted scriptures
    }
});

// Word_of_the_day.js

document.addEventListener('DOMContentLoaded', function () {
    const topicsList = document.getElementById('topicsList');
    const postModal = document.getElementById('postModal');
    const closeModal = document.querySelector('.modal .close');

    // Function to fetch and display topics
    function loadTopics() {
        fetch('/api/topics')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                topicsList.innerHTML = data.map(topic => 
                    `<button class="topic-button" data-id="${topic.id}">${topic.name}</button>`
                ).join('');
                addTopicClickEvent();
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to add click events to topic buttons
    function addTopicClickEvent() {
        const buttons = document.querySelectorAll('.topic-button');
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                const topicId = this.getAttribute('data-id');
                loadVerses(topicId);
            });
        });
    }

    // Function to fetch and display verses based on selected topic
    function loadVerses(topicId) {
        fetch(`/api/verses?topicId=${topicId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const versesContainer = document.getElementById('postScripture');
                versesContainer.innerHTML = data.map(verse =>
                    `<div class="verse">
                        <h3>${verse.title}</h3>
                        <p>${verse.text}</p>
                    </div>`
                ).join('');
            })
            .catch(error => console.error('Error:', error));
    }

    // Close modal functionality
    closeModal.addEventListener('click', function () {
        postModal.style.display = 'none';
    });

    // Initial load of topics
    loadTopics();
});

// Word_of_the_day.js

document.addEventListener('DOMContentLoaded', function () {
    const topicsList = document.getElementById('topicsList');
    const postModal = document.getElementById('postModal');
    const closeModal = document.querySelector('.modal .close');

    // Function to fetch and display topics
    function loadTopics() {
        fetch('/api/topics')  // Adjust URL as necessary
            .then(response => response.json())
            .then(data => {
                topicsList.innerHTML = data.map(topic => 
                    `<button class="topic-button" data-id="${topic.id}">${topic.name}</button>`
                ).join('');
                addTopicClickEvent();
            });
    }

    // Function to add click events to topic buttons
    function addTopicClickEvent() {
        const buttons = document.querySelectorAll('.topic-button');
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                const topicId = this.getAttribute('data-id');
                loadVerses(topicId);
            });
        });
    }

    // Function to fetch and display verses based on selected topic
    function loadVerses(topicId) {
        fetch(`/api/verses?topicId=${topicId}`)  // Adjust URL as necessary
            .then(response => response.json())
            .then(data => {
                const versesContainer = document.getElementById('postScripture');
                versesContainer.innerHTML = data.map(verse =>
                    `<div class="verse">
                        <h3>${verse.title}</h3>
                        <p>${verse.text}</p>
                    </div>`
                ).join('');
            });
    }

    // Close modal functionality
    closeModal.addEventListener('click', function () {
        postModal.style.display = 'none';
    });

    // Initial load of topics
    loadTopics();
});
document.addEventListener('DOMContentLoaded', () => {
    const shareButtons = {
        facebook: document.querySelector('.share-button.facebook'),
        twitter: document.querySelector('.share-button.twitter'),
        email: document.querySelector('.share-button.email')
    };

    // Function to update share buttons
    function updateShareButtons(scripture) {
        const scriptureUrl = encodeURIComponent(window.location.href);
        const scriptureText = encodeURIComponent(scripture);

        shareButtons.facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${scriptureUrl}`;
        shareButtons.twitter.href = `https://twitter.com/intent/tweet?url=${scriptureUrl}&text=${scriptureText}`;
        shareButtons.email.href = `mailto:?subject=Check out this scripture&body=${scriptureText}%20${scriptureUrl}`;
    }

    // Example of setting scripture and updating share buttons
    function setScripture(scripture) {
        document.getElementById('dailyScripture').innerText = scripture;
        updateShareButtons(scripture);
    }

    // Simulate setting a scripture for demonstration
    const exampleScripture = "For God so loved the world that he gave his one and only Son...";
    setScripture(exampleScripture);

    // Add event listener to modal form for posting scriptures
    document.getElementById('scriptureForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const scriptureText = document.getElementById('scriptureText').value;
        setScripture(scriptureText);
        document.getElementById('postModal').style.display = 'none'; // Close the modal
    });

    // Add event listener to close modal
    document.querySelector('.modal .close').addEventListener('click', () => {
        document.getElementById('postModal').style.display = 'none';
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const bibleForm = document.getElementById('bibleSearchForm');
    const bibleResult = document.getElementById('bibleResult');

    bibleForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const reference = document.getElementById('bibleReference').value;
        try {
            const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}`);
            const data = await response.json();
            if (data && data.text) {
                bibleResult.innerHTML = `
                    <h3>${data.reference}</h3>
                    <p>${data.text}</p>
                `;
            } else {
                bibleResult.innerHTML = '<p>No results found. Please check the reference and try again.</p>';
            }
        } catch (error) {
            bibleResult.innerHTML = '<p>Error fetching the Bible verse. Please try again later.</p>';
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const bibleModal = document.getElementById('bibleModal');
    const openBibleButton = document.getElementById('bibleLink');
    const closeBibleButton = document.querySelector('#bibleModal .close');
    const bibleContent = document.getElementById('bibleContent');
    const loadChapterButton = document.getElementById('loadChapter');
    const bibleBookSelect = document.getElementById('bibleBookSelect');
    const bibleChapterInput = document.getElementById('bibleChapter');
    const bibleVerseInput = document.getElementById('bibleVerse');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    // Open Bible modal
    openBibleButton.addEventListener('click', () => {
        bibleModal.style.display = 'block';
    });

    // Close Bible modal
    closeBibleButton.addEventListener('click', () => {
        bibleModal.style.display = 'none';
        bibleContent.innerHTML = ''; // Clear content
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === bibleModal) {
            bibleModal.style.display = 'none';
            bibleContent.innerHTML = ''; // Clear content
        }
    });

    // Load selected chapter and verse
    loadChapterButton.addEventListener('click', async () => {
        const book = bibleBookSelect.value;
        const chapter = bibleChapterInput.value;
        const verse = bibleVerseInput.value;

        if (book && chapter) {
            try {
                const response = await fetch(`https://bible-api.com/${book}%20${chapter}:${verse}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data = await response.json();
                bibleContent.innerHTML = `<p>${data.text}</p>`;
            } catch (error) {
                bibleContent.innerHTML = `<p>Error fetching Bible content: ${error.message}</p>`;
            }
        }
    });

    // Navigation buttons (not functional in this example, but can be implemented if needed)
    prevPageButton.addEventListener('click', () => {
        // Implement page navigation if applicable
    });

    nextPageButton.addEventListener('click', () => {
        // Implement page navigation if applicable
    });
});
