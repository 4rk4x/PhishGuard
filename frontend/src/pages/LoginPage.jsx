
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-navy-surface border border-navy-border rounded-2xl p-8 shadow-card">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-navy-card border border-electric/40 flex items-center justify-center text-electric mx-auto mb-3 shadow-cyber">
            <Shield className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-offwhite">
            Researcher Sign In
          </h2>

          <p className="text-xs text-navy-muted font-mono mt-1">
            Authenticate into the PhishGuard Security Portal
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-navy-muted mb-1.5">
              Email Address
            </label>

            <div className="relative">
              <Mail className="w-4 h-4 text-navy-muted absolute left-3 top-3" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@phishguard.ac.in"
                className="w-full pl-10 pr-4 py-2.5 bg-navy-card border border-navy-border focus:border-electric rounded-lg text-sm text-offwhite placeholder:text-navy-muted font-mono outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-navy-muted mb-1.5">
              Password
            </label>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-electric hover:bg-electric-hover disabled:opacity-50 text-navy font-bold rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <span className="font-mono text-xs">
                Authenticating...
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Registration Link */}
        <div className="mt-6 text-center text-xs text-navy-muted">
          <span>Need a new research account? </span>

          <Link
            to="/register"
            className="text-electric hover:underline font-semibold"
          >
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};
