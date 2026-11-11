
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Search,
  LayoutDashboard,
  History,
  FileCode,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Scanner', path: '/scanner', icon: Search },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { name: 'History', path: '/history', icon: History, protected: true },
    { name: 'Research Docs', path: '/docs', icon: FileCode },
  ];

  if (isAdmin) {
    navLinks.push({
      name: 'Admin Portal',
      path: '/admin',
      icon: ShieldCheck,
      adminOnly: true
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-md border-b border-navy-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-navy-surface border border-electric/40 flex items-center justify-center text-electric group-hover:border-electric transition">
              <Shield className="w-6 h-6 group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-offwhite">
                  Phish<span className="text-electric">Guard</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-electric/10 text-electric border border-electric/30">
                  XAI ML
                </span>
              </div>
              <p className="text-[10px] text-navy-muted tracking-wide font-mono -mt-1">
                Explainable Detection System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              if (item.protected && !isAuthenticated) return null;

              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${active
                      ? 'bg-navy-surface text-electric border border-electric/30'
                      : 'text-offwhite/80 hover:text-offwhite hover:bg-navy-surface/60'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-electric' : 'text-navy-muted'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Authentication Controls */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-offwhite/90 hover:text-offwhite hover:bg-navy-surface rounded-lg transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-electric hover:bg-electric-hover text-navy rounded-lg font-semibold transition shadow-sm hover:shadow-cyber"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-medium text-offwhite flex items-center justify-end gap-1.5">
                    <span>{user?.full_name || 'Researcher'}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${isAdmin
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-electric/10 text-electric border-electric/30'
                      }`}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-navy-muted font-mono">
                    {user?.email}
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-navy-muted hover:text-offwhite hover:bg-navy-surface rounded-lg transition"
                  title="Logout session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-offwhite hover:bg-navy-surface"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen
                ? <X className="w-6 h-6" />
                : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-surface border-b border-navy-border px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((item) => {
            if (item.protected && !isAuthenticated) return null;

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-offwhite hover:bg-navy-card"
              >
                <Icon className="w-5 h-5 text-electric" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-navy-border/60">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm text-offwhite bg-navy-card rounded-lg"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm bg-electric text-navy font-semibold rounded-lg"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-offwhite">
                    {user?.full_name}
                  </div>
                  <div className="text-xs text-navy-muted">
                    {user?.email}
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-mono text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
