import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css'; // Import the CSS file

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Make **text** bold
      .replace(/\n/g, '<br>'); // Add line breaks
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message to chat
      setMessages([...messages, { text: input, sender: 'user' }]);

      try {
        // Send request to backend
        const response = await axios.post(`http://localhost:5000/query`, {
          query: input,
        });

        // Display assistant's response with formatting
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: formatText(response.data.answer || 'No response from assistant'), sender: 'assistant', isFormatted: true },
        ]);
      } catch (error) {
        console.error('Error sending query:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Error: Unable to get a response from the server.', sender: 'assistant' },
        ]);
      }

      setInput(''); // Clear input
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.sender}`}
          >
            {msg.isFormatted ? (
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="chat-submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
