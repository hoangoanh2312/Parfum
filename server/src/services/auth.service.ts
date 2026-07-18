import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { signAccess, signRefresh } from '../utils/jwt';

export async function register(name: string, email: string, password: string) {
  const exists = await User.findOne({ email });
  if (exists) throw Object.assign(new Error('Email da ton tai'), { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  return issueTokens(user);
}

export async function login(email: string, password: string) {
  // FIXED: select +password vì field được mark select:false trong schema
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw Object.assign(new Error('Sai thong tin dang nhap'), { status: 401 });
  const ok = await bcrypt.compare(password, user.password as string);
  if (!ok) throw Object.assign(new Error('Sai thong tin dang nhap'), { status: 401 });
  return issueTokens(user);
}

function issueTokens(user: any) {
  const payload = { id: user._id, role: user.role };
  return {
    accessToken: signAccess(payload),
    refreshToken: signRefresh(payload),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
}
