import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const data = await authService.register(name, email, password);
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export function logout(_req: Request, res: Response) {
  const data = authService.logout();
  res.json({ success: true, data });
}
