// File path: /client/src/pages/auth/Login.jsx
// Purpose: Login page with role selection and form validation
// Architecture: Uses React Hook Form and Zod for validation

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['worker', 'employer', 'admin'], {
    errorMap: () => ({ message: 'Please select a user type' }),
  }),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userType: 'worker',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.phone, data.password, data.userType);
      
      if (result.success) {
        toast.success('Login successful!');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label className="form-label">User Type</label>
            <select {...register('userType')} className="form-select">
              <option value="worker">Worker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
            {errors.userType && (
              <span className="form-error">{errors.userType.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="form-input"
              placeholder="+251911234567"
            />
            {errors.phone && (
              <span className="form-error">{errors.phone.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              {...register('password')}
              className="form-input"
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register/worker" className="auth-link">
              Register as Worker
            </Link>
            {' | '}
            <Link to="/register/employer" className="auth-link">
              Register as Employer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;