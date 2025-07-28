import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5000");

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);

  const joinChat = () => {
    socket.emit('join', username);
    setJoined(true);
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send_message', { message });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChatMessages(prev => [...prev, data]);
    });

    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <div>
          <h2>Join Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {username}</h2>
          <div>
            <strong>Online Users:</strong>
            <ul>
              {users.map((user, index) => <li key={index}>{user}</li>)}
            </ul>
          </div>

          <div style={{ border: '1px solid gray', padding: 10, height: 300, overflowY: 'scroll' }}>
            {chatMessages.map((msg, index) => (
              <div key={index}>
                <b>{msg.sender}:</b> {msg.message}
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Type message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;