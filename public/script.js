let socket;
let userId;
const sentMessages = {}; // to track message IDs and update statuses

document.getElementById('userId').addEventListener('change', function () {
  userId = this.value.trim();
  if (!userId) return;

  socket = io('http://localhost:3000', { query: { userId } });

  socket.on('new-message', (msg) => {
    const chatBox = document.getElementById('chatBox');
    const msgElement = document.createElement('p');
    msgElement.textContent = `${msg.from} ➡️ ${msg.to}: ${msg.text}`;
    chatBox.appendChild(msgElement);

    // Mark message as read if it's for this user
    if (msg.to === userId) {
      socket.emit('mark-read', { messageId: msg._id });
    }
  });

  socket.on('status-change', (status) => {
    console.log('Status update:', status);
  });
});

function sendMessage() {
  const to = document.getElementById('toUser').value.trim();
  const text = document.getElementById('msgInput').value.trim();
  if (!to || !text || !socket) return;

  // Create local message entry
  const tempId = 'temp-' + Date.now();
  const msgElement = document.createElement('p');
  msgElement.id = tempId;
  msgElement.textContent = `You ➡️ ${to}: ${text} (sent...)`;
  document.getElementById('chatBox').appendChild(msgElement);
  document.getElementById('msgInput').value = '';

  socket.emit('send-message', { from: userId, to, text });

  // Listen for delivery confirmation
  socket.on('new-message', (msg) => {
    if (msg.from === userId && msg.to === to && msg.text === text) {
      const el = document.getElementById(tempId);
      if (el) el.textContent = `You ➡️ ${to}: ${text} (delivered...)`;

      sentMessages[msg._id] = el;

      // Listen for read (optional enhancement)
      socket.on('read', (readMsgId) => {
        if (sentMessages[readMsgId]) {
          sentMessages[readMsgId].textContent =
            `You ➡️ ${to}: ${text} (read ✅)`;
        }
      });
    }
  });
}
