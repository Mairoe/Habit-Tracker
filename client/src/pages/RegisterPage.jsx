import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { CheckSquare, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard immediately
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 relative overflow-hidden bg-grid-pattern">
      {/* Background gradients */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-radial-gradient rounded-full pointer-events-none filter blur-xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-radial-gradient-cyan rounded-full pointer-events-none filter blur-xl"></div>

      <div className="w-full max-w-md z-10 my-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-accentCyan flex items-center justify-center shadow-glow mb-4">
            <CheckSquare size={20} className="text-brand-bg stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-bold tracking-wide text-brand-textPrimary font-sans">
            Create an Account
          </h2>
          <p className="text-xs text-brand-textSecondary mt-1 font-light uppercase tracking-wider">
            Start tracking and building consistency
          </p>
        </div>

        {/* Card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Error Alert */}
          {errorMsg && (
            <div className="flex items-start space-x-2.5 p-3.5 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium mb-6">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-border/90 focus:border-brand-accent/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-border/90 focus:border-brand-accent/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1.5 relative">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (Min 6 chars)"
                  className="w-full bg-brand-bg border border-brand-border hover:border-brand-border/90 focus:border-brand-accent/50 text-white rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-textSecondary hover:text-brand-textPrimary focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-textSecondary">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-border/90 focus:border-brand-accent/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center justify-center space-x-2 w-full py-3.5 bg-brand-accent hover:bg-brand-accent/90 disabled:bg-brand-accent/60 text-brand-bg font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-glow hover:shadow-brand-accent/20 hover:scale-[1.01] focus:outline-none"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-brand-bg border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Redirect link */}
          <p className="text-center text-xs text-brand-textSecondary mt-6 font-light">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-accent hover:underline font-semibold focus:outline-none"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
