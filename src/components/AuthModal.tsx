import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  // const { login, signup } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // const err = await login(email, password);
    setLoading(false);
    // if (err) setError(err);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // const err = await signup(name, email, password);
    setLoading(false);
    // if (err) setError(err);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <X size={22} />
        </button>
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-semibold rounded-l-xl ${tab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTab('login')}
            disabled={loading}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-r-xl ${tab === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTab('signup')}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              className="border rounded px-3 py-2 text-sm"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              className="border rounded px-3 py-2 text-sm"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            {error && <div className="text-red-500 text-xs">{error}</div>}
            <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <input
              className="border rounded px-3 py-2 text-sm"
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
            />
            <input
              className="border rounded px-3 py-2 text-sm"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              className="border rounded px-3 py-2 text-sm"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            {error && <div className="text-red-500 text-xs">{error}</div>}
            <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 