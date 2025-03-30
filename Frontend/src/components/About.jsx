// src/components/About.js
import React from 'react';
import aboutImage from '../assets/react.svg'; // Adjust the path as necessary
import '../css/About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p>This application is designed to provide quick and reliable first aid information.</p>
      <p>Developed by a team of healthcare professionals and software engineers.</p>
      <h2>Features:</h2>
      <ul>
        <li>Interactive chatbot for first aid queries</li>
        <li>User-friendly interface</li>
        <li>Responsive design for all devices</li>
      </ul>
    </div>
  );
};

export default About;