import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { parseCookies, CSRF_COOKIE } from '../utils/cookies';
import { env } from '../config/env';

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/**
 * CSRF double-submit cookie.
 * Ap dung cho cac endpoint dua HOAN TOAN vao cookie de xac thuc (vd /auth/refresh, /auth/logout).
 * Yeu cau: cookie 'csrfToken' (JS doc duoc) phai KHOP header 'X-CSRF-Token' do client gui len.
 * Ke tan cong o site khac khong doc duoc cookie -> khong the tao header khop -> bi chan.
 */
export function verifyCsrf(req: Request, res: Response, next: NextFunction) {
  if (!env.csrfEnabled) return next();
  const cookieToken = parseCookies(req)[CSRF_COOKIE] || '';
  const headerToken = (req.get('X-CSRF-Token') || '').trim();
  if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  next();
}
