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

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    res.json(await authService.getMe(userId));
  } catch (e) { next(e); }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    res.json(await authService.updateProfile(userId, req.body));
  } catch (e) { next(e); }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    res.json(await authService.changePassword(userId, req.body));
  } catch (e) { next(e); }
}

export async function addAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    res.status(201).json(await authService.addAddress(userId, req.body));
  } catch (e) { next(e); }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    res.json(await authService.updateAddress(userId, req.params.addressId, req.body));
  } catch (e) { next(e); }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    res.json(await authService.deleteAddress(userId, req.params.addressId));
  } catch (e) { next(e); }
}
