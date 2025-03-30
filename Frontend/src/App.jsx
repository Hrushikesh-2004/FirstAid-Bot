import React from 'react';
import Chat from './components/chat';
import './App.css';
import userImage from './images/user-removebg.png';
import greenCross from './images/green-cross.png';
import About from './components/About';

const App = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>MediTalk</h1>
          <p>Your go-to companion for medical assistance and first aid guidance. Chat with our AI assistant for immediate help!</p>
        </div>
        <div className="hero-image">
          <div className="healing-container">
            <img src={userImage} alt="Healing Image" className="healing-image" />
            {[...Array(8)].map((_, i) => (
              <div key={i} className="plus-symbol">
                <img src= {greenCross} alt="+" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <About/> */}
      {/* Chat Section */}
      <div className="chat-section">
        <h1>FirstAid Bot</h1>
        <Chat />
      </div>
    </div>
  );
};

export default App;
