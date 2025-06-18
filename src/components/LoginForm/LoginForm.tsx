import React, { useState } from 'react';
import './LoginForm.css';

interface Errors {
  email?: string;
  password?: string;
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{email: boolean, password: boolean}>({email: false, password: false});

  const validate = () => {
    const newErrors: Errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    return newErrors;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched({ ...touched, [field]: true });
    setErrors(validate());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(newErrors).length === 0) {
      // lógica login. 
      alert('Login successful (frontend only)');
    }
  };

  const isValid = email && password && Object.keys(validate()).length === 0;

  return (
    <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
      <h2>Welcome to <span className="brand"> <br />Assist-Me</span></h2>
      <div className="social-buttons">
        <button type="button" className="social google"><span className="icon-google"/> Login with Google</button>
        <button type="button" className="social facebook"><span className="icon-facebook"/> Login with Facebook</button>
      </div>
      <div className="divider"><span>OR</span></div>
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <div className="input-icon">
          <span className="icon-email"/>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="example@gmail.com"
            autoComplete="username"
          />
        </div>
        {touched.email && errors.email && <div className="error">{errors.email}</div>}
      </div>
      <div className="input-group">
        <label htmlFor="password">Password</label>
        <div className="input-icon">
          <span className="icon-password"/>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            placeholder="********"
            autoComplete="current-password"
          />
        </div>
        {touched.password && errors.password && <div className="error">{errors.password}</div>}
      </div>
      <div className="form-options">
        <label className="remember-me">
          <input type="checkbox" /> Remember me
        </label>
        <a href="#" className="forgot">Forgot Password?</a>
      </div>
      <button type="submit" className="login-btn" disabled={!isValid}>Login</button>
      <div className="register-link">
        Don't have an account? <a href="#">Register</a>
      </div>
    </form>
  );
};

export default LoginForm; 