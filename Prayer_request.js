$(document).ready(function() {
    const userId = 1; // Replace with the actual user ID
    const socket = io.connect('http://localhost:3000');

    // Fetch pastors on page load for the prayer request form
    $.get('/api/pastors', function(pastors) {
        pastors.forEach(pastor => {
            $('#pastorSelect').append(new Option(pastor.username, pastor.id));
            $('#pastorList').append(`
                <li class="list-group-item pastor-item" data-id="${pastor.id}">
                    ${pastor.username}
                </li>
            `);
        });
    });

    // Handle form submission for prayer requests
    $('#prayerRequestForm').on('submit', function(event) {
        event.preventDefault();

        const pastorId = $('#pastorSelect').val();
        const message = $('#message').val();

        $.post('/api/prayer/submit', { userId, pastorId, message })
            .done(function() {
                $('#successMessage').text('Prayer request submitted successfully!').show();
                $('#prayerRequestForm')[0].reset();
            })
            .fail(function() {
                alert('Error submitting prayer request. Please try again.');
            });
    });

    // Handle click on a pastor's name
    $('#pastorList').on('click', '.pastor-item', function() {
        $('.pastor-item').removeClass('active');
        $(this).addClass('active');

        const pastorId = $(this).data('id');
        $('#pastorName').text($(this).text());
        $('#conversation').show();

        // Fetch prayer requests for the selected pastor
        $.get(`/api/prayer/requests/${pastorId}`, function(requests) {
            $('#requestList').empty();
            requests.forEach(request => {
                $('#requestList').append(`
                    <li class="list-group-item">
                        <strong>From:</strong> ${request.username} <br>
                        <strong>Request:</strong> ${request.message} <br>
                        <small>Submitted at: ${request.created_at}</small>
                        <button class="btn btn-link reply-button" data-request-id="${request.id}">Reply</button>
                        <div class="reply-input" style="display:none; margin-top: 10px;">
                            <textarea class="form-control responseMessage" rows="2" placeholder="Type your response..." required></textarea>
                            <button class="btn btn-primary send-response" data-request-id="${request.id}">Send</button>
                        </div>
                        <ul class="response-list"></ul>
                    </li>
                `);
            });
        });
    });

    // Show the reply input field when the Reply button is clicked
    $('#requestList').on('click', '.reply-button', function() {
        $(this).siblings('.reply-input').toggle(); // Show or hide the reply input
    });

    // Send response to a prayer request
    $('#requestList').on('click', '.send-response', function() {
        const responseMessage = $(this).siblings('.responseMessage').val();
        const requestId = $(this).data('request-id');
        const pastorName = $('.pastor-item.active').text();

        if (!responseMessage) {
            alert('Please enter a response message.');
            return;
        }

        $.post('/api/prayer/response', { requestId, message: responseMessage, pastorName })
            .done(function() {
                // Clear the input and hide the reply section
                $(this).siblings('.responseMessage').val('');
                $(this).parent().hide();

                // Append the response to the corresponding request in the list
                const responseHtml = `
                    <li class="list-group-item ml-4">
                        <strong>${pastorName}:</strong> ${responseMessage} <br>
                        <small>Responded at: ${new Date().toLocaleString()}</small>
                    </li>
                `;
                $(`button[data-request-id="${requestId}"]`).siblings('.response-list').append(responseHtml);
            }.bind(this)) // Bind this to access the context
            .fail(function(jqXHR) {
                console.error('Failed to send response:', { requestId, message: responseMessage });
                alert('Error sending response.');
            });
    });
});
