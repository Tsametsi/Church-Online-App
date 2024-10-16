$(document).ready(function() {
    const userId = 1; // Replace with the actual user ID, possibly from session or authentication
    const socket = io.connect('http://localhost:3000'); // Adjust the URL as needed

    // Fetch pastors on page load
    $.get('/api/pastors', function(pastors) {
        pastors.forEach(pastor => {
            $('#pastorSelect').append(new Option(pastor.username, pastor.id));
        });
    });

    // Handle form submission
    $('#prayerRequestForm').on('submit', function(event) {
        event.preventDefault();

        const pastorId = $('#pastorSelect').val();
        const message = $('#message').val();

        $.post('/api/prayer/submit', { userId, pastorId, message })
            .done(function() {
                $('#successMessage').text('Prayer request submitted successfully!').show();
                $('#prayerRequestForm')[0].reset(); // Reset the form
            })
            .fail(function() {
                alert('Error submitting prayer request. Please try again.');
            });
    });
});
