import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import './Admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'admin' && password === 'taimoor123') {
        sessionStorage.setItem('admin_auth', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-logo">
            <ShieldCheck size={34} />
          </div>
          <h1>Admin Panel</h1>
          <p>Sign in to manage your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="admin-login-form" noValidate>
          {/* Username */}
          <div className="afield">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              required
              autoComplete="username"
              autoFocus
              className={error ? 'afield-input error' : 'afield-input'}
            />
          </div>

          {/* Password */}
          <div className="afield">
            <label htmlFor="password">Password</label>
            <div className="afield-password">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className={error ? 'afield-input error' : 'afield-input'}
              />
              <button
                type="button"
                className="afield-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="admin-error" role="alert">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading
              ? <span className="aloader"></span>
              : 'Sign In'
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
