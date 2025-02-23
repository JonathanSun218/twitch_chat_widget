// Connect to WebSocket
const socket = io();

socket.on("ping", () => {
    console.log("Ping received from server, sending pong...");
    socket.emit("pong");
    socket.emit("PONG :tmi.twitch.tv")
})

// Listen for chat messages from the server
socket.on('chatMessage', (data) => {
    const chatContainer = document.getElementById('chat-container');
    const newMessage = document.createElement('div');
    newMessage.classList.add('chat-message');
    newMessage.innerHTML = `<span class="chat-user">${data.user}:</span> ${data.message}`;
    chatContainer.appendChild(newMessage);

    // Scroll to the bottom to show the latest message
    chatContainer.scrollTop = chatContainer.scrollHeight;
});
