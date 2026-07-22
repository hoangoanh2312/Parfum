import { logger } from './logger';

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export function assertMailConfigured() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw Object.assign(new Error('Dich vu email chua duoc cau hinh'), { status: 503 });
  }
}

/**
 * Gui email qua SMTP neu da cau hinh (SMTP_HOST/SMTP_USER/SMTP_PASS).
 * - Neu chua cau hinh: khong nem loi, chi log ra de luong nghiep vu (dang ky, quen mat khau) khong bi chan.
 * - Dung dynamic import voi bien specifier de tsc khong bat buoc phai cai nodemailer luc build.
 */
export async function sendMail(input: MailInput): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    logger.warn(
      `SMTP chua cau hinh - bo qua gui email toi ${input.to} (subject: ${input.subject})`,
    );
    return false;
  }

  try {
    const moduleName = 'nodemailer';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodemailer: any = await import(moduleName);
    const transport = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transport.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    return true;
  } catch (error) {
    logger.error('Gui email that bai', error);
    return false;
  }
}
