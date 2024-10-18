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
                const unreadClass = request.viewed ? '' : 'unread';
                $('#requestList').append(`
                    <li class="list-group-item ${unreadClass}">
                        <strong>From:</strong> ${request.username} <br>
                        <strong>Request:</strong> ${request.message} <br>
                        <small>Submitted at: ${request.created_at}</small>
                        <button class="btn btn-link reply-button" data-request-id="${request.id}">Reply</button>
                        <button class="btn btn-primary call-button" data-username="${request.username}">Call</button>
                        <button class="btn btn-link show-replies" data-request-id="${request.id}">Show Replies</button>
                        <div class="reply-input" style="display:none; margin-top: 10px;">
                            <textarea class="form-control responseMessage" rows="2" placeholder="Type your response..." required></textarea>
                            <button class="btn btn-primary send-response" data-request-id="${request.id}">Send</button>
                        </div>
                        <ul class="response-list" style="display:none;"></ul>
                    </li>
                `);
            });
        });
    });

    // Show the reply input field when the Reply button is clicked
    $('#requestList').on('click', '.reply-button', function() {
        $(this).siblings('.reply-input').toggle(); // Show or hide the reply input
    });

    // Show replies when the Show Replies button is clicked
    $('#requestList').on('click', '.show-replies', function() {
        const requestId = $(this).data('request-id');
        const responseList = $(this).siblings('.response-list');
        responseList.toggle(); // Show or hide replies

        if (responseList.is(':visible')) {
            // Fetch replies for the specific request
            $.get(`/api/prayer/replies/${requestId}`, function(replies) {
                responseList.empty(); // Clear existing replies
                replies.forEach(reply => {
                    const replyHtml = `
                        <li class="list-group-item ml-4">
                            <strong>${reply.pastor_name}:</strong> ${reply.message} <br>
                            <small>Responded at: ${reply.created_at}</small>
                        </li>
                    `;
                    responseList.append(replyHtml);
                });
            });
        }
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
                $(this).siblings('.responseMessage').val('');
                $(this).parent().hide();

                const responseHtml = `
                    <li class="list-group-item ml-4 unread">
                        <strong>${pastorName}:</strong> ${responseMessage} <br>
                        <small>Responded at: ${new Date().toLocaleString()}</small>
                    </li>
                `;
                $(`button[data-request-id="${requestId}"]`).siblings('.response-list').append(responseHtml);
            }.bind(this))
            .fail(function(jqXHR) {
                console.error('Failed to send response:', { requestId, message: responseMessage });
                alert('Error sending response.');
            });
    });

    // Handle click on the Call button
    $('#requestList').on('click', '.call-button', function() {
        const username = $(this).data('username');
        initiateCall(username);
    });

    // Example function to initiate a call
    function initiateCall(username) {
        alert(`Initiating call to ${username}...`);
        // Implement your actual calling logic here (e.g., WebRTC, Twilio)
    }
});
