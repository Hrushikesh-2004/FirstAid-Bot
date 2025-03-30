// src/components/Home.js
import React from 'react';
import homeImage from '../assets/react.svg'; // Adjust the path as necessary
import { Link } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <img src={homeImage} alt="First Aid" className="home-image" />
      <h1>Welcome to the First Aid Chatbot</h1>
      <p>Your go-to resource for first aid information and assistance.</p>
      <Link to="/chat" className="cta-button">Start Chat</Link>
    </div>
  );
};

export default Home;