import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../store/auth.store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useAuth((s) => s.setUser);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-3">
      <h1 className="text-xl font-bold">Dang nhap</h1>
      <input className="border w-full p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border w-full p-2" type="password" placeholder="Mat khau" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-black text-white w-full p-2">Dang nhap</button>
    </form>
  );
}
