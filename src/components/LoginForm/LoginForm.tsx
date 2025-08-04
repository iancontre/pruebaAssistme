import React, { useState } from 'react';
import { loginWithJWT, LoginCredentials } from '../../services/apiService';
import Swal from 'sweetalert2';
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
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched({ ...touched, [field]: true });
    setErrors(validate());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      try {
        const credentials: LoginCredentials = { email, password };
        const response = await loginWithJWT(credentials);
        
        if (response.success) {
          // Guardar el ID del usuario si está disponible
          if (response.user?.id) {
            localStorage.setItem('userId', response.user.id);
            console.log('User ID saved:', response.user.id);
          }
          
          // Alerta de éxito
          Swal.fire({
            icon: 'success',
            title: 'You have successfully logged in!',
            html: `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 18px; color: #2c3e50; margin-bottom: 10px; font-weight: bold;">
                  Welcome to the Assist-me dashboard
                </div>
              </div>
            `,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: false,
            background: '#fff',
            backdrop: 'rgba(0,0,0,0.4)',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
              popup: 'animated fadeInDown',
              title: 'swal2-title-custom',
              htmlContainer: 'swal2-html-custom'
            }
          }).then(() => {
            // Cerrar la alerta y redirigir al dashboard
            Swal.close();
            window.location.href = '/dashboard';
          });
        } else {
          // Alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Login Error',
            text: 'Please try again, your password or email are incorrect.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff6b6b',
            background: '#fff',
            backdrop: 'rgba(0,0,0,0.4)',
            allowOutsideClick: true,
            allowEscapeKey: true,
            customClass: {
              popup: 'animated fadeInDown'
            }
          }).then(() => {
            // Recargar la página para limpiar completamente
            window.location.reload();
          });
        }
      } catch (error) {
        // Alerta de error de red
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'Could not connect to the server. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff6b6b',
          background: '#fff',
          backdrop: 'rgba(0,0,0,0.4)',
          allowOutsideClick: true,
          allowEscapeKey: true,
          customClass: {
            popup: 'animated fadeInDown'
          }
        }).then(() => {
          // Recargar la página para limpiar completamente
          window.location.reload();
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isValid = email && password && Object.keys(validate()).length === 0;

  return (
    <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
      <h2>Welcome to <span className="brand"> <br />Assist-Me</span></h2>
      <div className="divider"><span>Login</span></div>
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        {touched.password && errors.password && <div className="error">{errors.password}</div>}
      </div>
      <div className="form-options">
        <label className="remember-me">
          <input type="checkbox" disabled={isLoading} /> Remember me
        </label>
        <a href="#" className="forgot">Forgot Password?</a>
      </div>
      <button 
        type="submit" 
        className={`login-btn ${isLoading ? 'loading' : ''}`} 
        disabled={!isValid || isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Login'}
      </button>
      <div className="register-link">
        Don't have an account? <a href="#">Register</a>
      </div>
    </form>
  );
};

export default LoginForm; 