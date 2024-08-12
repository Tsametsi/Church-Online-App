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
