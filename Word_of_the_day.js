document.addEventListener('DOMContentLoaded', function() {
    loadDailyScripture();

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

        if (scriptureText === '') {
            alert('Please enter a scripture.');
            return;
        }

        // Save scripture (for demo purposes, using localStorage)
        saveScripture(scriptureText);

        // Clear form
        scriptureForm.reset();

        // Close modal
        modal.style.display = 'none';

        // Reload daily scripture
        loadDailyScripture();
    });

    // Function to save scripture (for demo purposes, using localStorage)
    function saveScripture(scriptureText) {
        // Get existing scriptures from localStorage or initialize an empty array
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];

        // Add new scripture to the array
        var newScripture = {
            scripture_text: scriptureText,
            date: new Date().toLocaleDateString()
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
            dailyScriptureDiv.innerHTML = "No scripture found for today.";
        }
    }
});
