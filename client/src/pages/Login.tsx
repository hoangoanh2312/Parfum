import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../store/auth.store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuth = useAuth((s) => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });

      if (!data?.accessToken || !data?.refreshToken || !data?.user) {
        throw new Error('Phản hồi đăng nhập không hợp lệ');
      }

      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      const state = location.state as { from?: { pathname: string } } | undefined;
      const fromPath = state?.from?.pathname;

      if (fromPath) {
        navigate(fromPath, { replace: true });
        return;
      }

      if (data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-3">
      <h1 className="text-xl font-bold">Dang nhap</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <input className="border w-full p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border w-full p-2" type="password" placeholder="Mat khau" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className="bg-black text-white w-full p-2" disabled={isSubmitting}>
        {isSubmitting ? 'Đang xử lý...' : 'Dang nhap'}
      </button>
    </form>
  );
}
