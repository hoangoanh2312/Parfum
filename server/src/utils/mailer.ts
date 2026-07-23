import { logger } from './logger';

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

export function assertMailConfigured() {
  if (!isMailConfigured()) {
    throw Object.assign(new Error('Dich vu email chua duoc cau hinh'), { status: 503 });
  }
}

function escapeDisplayName(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function normalizeMailFrom(mailFrom: string | undefined, smtpUser: string) {
  const fallbackName = "L'Essence Noire";
  const raw = String(mailFrom || '').trim();
  if (!raw) return `"${escapeDisplayName(fallbackName)}" <${smtpUser}>`;
  if (raw.includes('<') && raw.includes('>')) return raw;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return `"${escapeDisplayName(fallbackName)}" <${raw}>`;
  }

  const email = raw.match(/[^\s<>"']+@[^\s<>"']+\.[^\s<>"']+/)?.[0];
  if (email) {
    const displayName = raw
      .replace(email, '')
      .replace(/[<>]/g, '')
      .trim()
      .replace(/^['"]|['"]$/g, '');
    return `"${escapeDisplayName(displayName || fallbackName)}" <${email}>`;
  }

  return `"${escapeDisplayName(raw)}" <${smtpUser}>`;
}

/**
 * Gui email qua SMTP neu da cau hinh (SMTP_HOST/SMTP_USER/SMTP_PASS).
 * - Neu chua cau hinh: khong nem loi, chi log ra de luong nghiep vu (dang ky, quen mat khau) khong bi chan.
 * - Dung dynamic import voi bien specifier de tsc khong bat buoc phai cai nodemailer luc build.
 */
export async function sendMail(input: MailInput): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

  if (!isMailConfigured() || !SMTP_USER || !SMTP_PASS) {
    logger.warn(
      `SMTP chua cau hinh - bo qua gui email toi ${input.to} (subject: ${input.subject})`,
    );
    return false;
  }

  try {
    const moduleName = 'nodemailer';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imported: any = await import(moduleName);
    // Ho tro ca CommonJS (module.exports) lan ESM (export default) cua nodemailer,
    // vi tuy trinh chay (tsx/tsc) ma dynamic import tra ve namespace khac nhau.
    const nodemailer: any = imported?.createTransport
      ? imported
      : imported?.default;

    if (!nodemailer?.createTransport) {
      logger.error(
        'Khong nap duoc nodemailer.createTransport - kiem tra da cai dat nodemailer (phien ban hop le, vi du ^6.9.14) hay chua',
      );
      return false;
    }

    const transport = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const info = await transport.sendMail({
      from: normalizeMailFrom(MAIL_FROM, SMTP_USER),
      sender: SMTP_USER,
      replyTo: SMTP_USER,
      envelope: { from: SMTP_USER, to: input.to },
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    const accepted = Array.isArray(info.accepted) ? info.accepted.length : 0;
    const rejected = Array.isArray(info.rejected) ? info.rejected.length : 0;
    if (rejected > 0 && accepted === 0) {
      logger.warn(`SMTP tu choi email toi ${input.to} (subject: ${input.subject})`);
      return false;
    }
    logger.info(`Da gui email toi ${input.to} (messageId: ${info.messageId || 'unknown'})`);
    return accepted > 0 || rejected === 0;
  } catch (error) {
    logger.error('Gui email that bai', error);
    return false;
  }
}
