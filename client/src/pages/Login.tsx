import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../store/auth.store';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useAuth((s) => s.setUser);
  const navigate = useNavigate();
  const location = useLocation() as any;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    const from = location.state?.from || '/';
    navigate(from);
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
      <div className="mb-7 text-center">
        <div className="text-xs uppercase tracking-[0.35em] text-amber-800">HOC PARFUM</div>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Đăng nhập</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Đăng nhập để lưu và quản lý danh sách yêu thích của bạn.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-amber-100"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Mật khẩu
          <input
            type="password"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-amber-100"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
