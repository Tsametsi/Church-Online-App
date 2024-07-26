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

    // Function to save scripture (for demo purposes, using localStorage)
    function saveScripture(scriptureText, username) {
        // Get existing scriptures from localStorage or initialize an empty array
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];

        // Add new scripture to the array
        var newScripture = {
            scripture_text: scriptureText,
            username: username,
            date: new Date().toLocaleString()
        };
        scriptures.push(newScripture);

        // Save updated scriptures back to localStorage
        localStorage.setItem('scriptures', JSON.stringify(scriptures));
    }

    // Function to load daily scripture
    function loadDailyScripture() {
        // Get today's date in string format
        var today = new Date().toLocaleDateString();

        // Get scriptures from localStorage or initialize an empty array
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];

        // Find scripture for today, if exists
        var todaysScripture = scriptures.find(function(scripture) {
            return scripture.date === today;
        });

        // Display daily scripture
        var dailyScriptureDiv = document.getElementById('dailyScripture');
        if (todaysScripture) {
            dailyScriptureDiv.innerHTML = "<p>" + todaysScripture.scripture_text + "</p>";
        } else {
            dailyScriptureDiv.innerHTML = "Believe in the power of your voice and the depth of your insights. Your words have the potential to touch hearts, ignite faith, and bring hope. Trust in the wisdom you've gained through your journey and share it with courage and compassion. Your sincerity and authenticity will resonate with those who are listening, bringing light and understanding into their lives. Embrace this opportunity to inspire and uplift others in your religious community. You have something unique and valuable to offer. Shine brightly, and let your faith guide you as you share your profound message.";
        }
    }

    // Function to load posted scriptures
    function loadPostedScriptures() {
        // Get posted scriptures from localStorage or initialize an empty array
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];

        // Sort scriptures by date (most recent first)
        scriptures.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        // Display posted scriptures
        var postScriptureDiv = document.getElementById('postScripture');
        postScriptureDiv.innerHTML = ''; // Clear previous content

        scriptures.forEach(function(scripture) {
            var postItem = document.createElement('div');
            postItem.classList.add('post-item');

            var content = "<p>" + scripture.scripture_text + "</p>";
            content += "<div class='post-info'>Posted by " + scripture.username + " on " + scripture.date + "</div>";
            content += "<button class='delete-btn' data-id='" + scriptures.indexOf(scripture) + "'>Delete</button>";

            postItem.innerHTML = content;
            postScriptureDiv.appendChild(postItem);

            // Add event listener to delete button
            var deleteBtn = postItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                deleteScripture(scriptures.indexOf(scripture));
            });
        });
    }

    // Function to delete a scripture
    function deleteScripture(index) {
        // Get scriptures from localStorage
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];

        // Remove the scripture at the specified index
        scriptures.splice(index, 1);

        // Save updated scriptures back to localStorage
        localStorage.setItem('scriptures', JSON.stringify(scriptures));

        // Reload posted scriptures
        loadPostedScriptures();
    }
});
