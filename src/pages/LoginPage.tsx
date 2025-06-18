import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import './LoginPage.css';
import logoWhite from '../assets/images/logowhite.png';

const LoginPage: React.FC = () => {
  return (
    <div className="login-bg">
      <img src={logoWhite} alt="Assist-Me Logo" className="login-logo-bg" />
      <div className="login-form-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage; 