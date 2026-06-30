import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    res.status(201).json(await authService.register(name, email, password));
  } catch (e) { next(e); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    res.json(await authService.login(email, password));
  } catch (e) { next(e); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });
    res.json(await authService.refreshAccessToken(refreshToken));
  } catch (e) { next(e); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    await authService.logout(userId);
    res.json({ message: 'Logged out' });
  } catch (e) { next(e); }
}

export async function me(req: Request, res: Response) {
  res.json((req as any).user);
}
