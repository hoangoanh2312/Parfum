import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../store/auth.store';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuth((s) => s.setUser);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      setUser(data.data.user);
      navigate('/');
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { message?: string; errors?: unknown } } })?.response?.data;
      setError(res?.message || 'Dang ky that bai');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-3">
      <h1 className="text-xl font-bold">Dang ky</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        className="border w-full p-2"
        placeholder="Ho ten"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="border w-full p-2"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="border w-full p-2"
        type="password"
        placeholder="Mat khau (toi thieu 6 ky tu)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white w-full p-2 disabled:opacity-50"
      >
        {loading ? 'Dang xu ly...' : 'Dang ky'}
      </button>
      <p className="text-sm text-center">
        Da co tai khoan?{' '}
        <Link to="/login" className="underline">
          Dang nhap
        </Link>
      </p>
    </form>
  );
}
