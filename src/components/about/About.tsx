import React from 'react';
import './About.css'
import imagenAbout from '../../assets/images/about.png'
const About: React.FC = () => {
    return (
      <div className="about-fullscreen">
        <div className="about-content">
          <img src={imagenAbout} alt="Encabezado" className="about-image" />
          <div className="about-text">
            <h1 className='tittle-about'>About Us</h1>
            <p>We are a virtual assistant company committed to helping professionals and businesses optimize their time, improve their productivity, 
                and simplify their daily operations. We have a team of highly trained, bilingual virtual assistants who provide personalized support 
                in taking calls for our clients.Our mission is to offer reliable, efficient, and people-centered service so our clients can focus 
                on growing their businesses.</p>
          </div>
        </div>
      </div>
    );
  };
  export default About;