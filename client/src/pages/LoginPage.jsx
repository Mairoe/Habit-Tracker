import Grainient from '../components/UI/Grainient';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { CheckSquare, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Grainient
          color1="#95b2e3"
          color2="#32548d"
          color3="#b18dd3"
          timeSpeed={0.25}
          colorBalance={-0.08}
          warpStrength={2.55}
          warpFrequency={4.2}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={-6}
          blendSoftness={0.15}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}
        className="min-h-screen flex items-center justify-center px-4">

        <div className="w-full max-w-md z-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-accentCyan flex items-center justify-center shadow-glow mb-4">
              <CheckSquare size={20} className="text-brand-bg stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold tracking-wide text-white font-sans">
              Log in to HabitPulse
            </h2>
            <p className="text-xs text-white/70 mt-1 font-light uppercase tracking-wider">
              Build habits, track consistency
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Error Alert */}
            {errorMsg && (
              <div className="flex items-start space-x-2.5 p-3.5 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium mb-6">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/10 border border-white/20 hover:border-white/40 focus:border-white/60 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col space-y-1.5 relative">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/20 hover:border-white/40 focus:border-white/60 text-white placeholder-white/40 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center justify-center space-x-2 w-full py-3.5 bg-brand-accent hover:bg-brand-accent/90 disabled:bg-brand-accent/60 text-brand-bg font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-glow hover:scale-[1.01] focus:outline-none"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-brand-bg border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Redirect link */}
            <p className="text-center text-xs text-white/60 mt-6 font-light">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-white hover:underline font-semibold focus:outline-none"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;