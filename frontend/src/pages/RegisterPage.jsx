import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Try an alternate email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-navy-surface border border-navy-border rounded-2xl p-8 shadow-card">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-navy-card border border-electric/40 flex items-center justify-center text-electric mx-auto mb-3 shadow-cyber">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-offwhite">Create Account</h2>
          <p className="text-xs text-navy-muted font-mono mt-1">Register as a Student / Security Researcher</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-navy-muted mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-navy-muted absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full pl-10 pr-4 py-2.5 bg-navy-card border border-navy-border focus:border-electric rounded-lg text-sm text-offwhite placeholder:text-navy-muted font-mono outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-navy-muted mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-navy-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.mercer@univ.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-navy-card border border-navy-border focus:border-electric rounded-lg text-sm text-offwhite placeholder:text-navy-muted font-mono outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-navy-muted mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-navy-card border border-navy-border focus:border-electric rounded-lg text-sm text-offwhite placeholder:text-navy-muted font-mono outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-navy-muted mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-navy-card border border-navy-border focus:border-electric rounded-lg text-sm text-offwhite placeholder:text-navy-muted font-mono outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-electric hover:bg-electric-hover disabled:opacity-50 text-navy font-bold rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <span className="font-mono text-xs">Provisioning Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-navy-muted">
          <span>Already have an account? </span>
          <Link to="/login" className="text-electric hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

