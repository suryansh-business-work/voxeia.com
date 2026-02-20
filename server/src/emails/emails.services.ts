import nodemailer from 'nodemailer';
import { envConfig } from '../config';
import { getSettings } from '../settings/settings.services';
import { SendEmailInput } from './emails.validators';

/**
 * Build a transporter from user-resolved config (user settings or env defaults).
 */
const buildTransporter = async (userId: string): Promise<{ transporter: nodemailer.Transporter; from: string }> => {
  const settings = await getSettings(userId);

  // Use user-specific email config when custom config is enabled and fields are provided
  const useCustom = settings.useCustomEmailConfig && settings.emailConfig?.smtpHost;
  const host = useCustom ? settings.emailConfig.smtpHost : envConfig.SMTP_HOST;
  const port = useCustom ? settings.emailConfig.smtpPort : envConfig.SMTP_PORT;
  const user = useCustom ? settings.emailConfig.smtpUser : envConfig.SMTP_USER;
  const pass = useCustom ? settings.emailConfig.smtpPass : envConfig.SMTP_PASS;
  const from = useCustom ? (settings.emailConfig.smtpFrom || envConfig.SMTP_FROM) : envConfig.SMTP_FROM;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return { transporter, from };
};

export const sendEmail = async (
  userId: string,
  data: SendEmailInput
): Promise<void> => {
  const { transporter, from } = await buildTransporter(userId);

  const mailOptions: nodemailer.SendMailOptions = {
    from,
    to: data.to,
    subject: data.subject,
    html: data.html,
  };

  if (data.cc) mailOptions.cc = data.cc;
  if (data.bcc) mailOptions.bcc = data.bcc;

  await transporter.sendMail(mailOptions);
};

/**
 * Verify SMTP connection by calling transporter.verify().
 */
export const validateSmtp = async (userId: string): Promise<{ valid: boolean; message: string }> => {
  try {
    const { transporter } = await buildTransporter(userId);
    await transporter.verify();
    return { valid: true, message: 'SMTP connection successful' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'SMTP connection failed';
    return { valid: false, message: msg };
  }
};

/**
 * Send a test email to the configured from address.
 */
export const sendTestEmail = async (userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { transporter, from } = await buildTransporter(userId);
    await transporter.sendMail({
      from,
      to: from,
      subject: 'Test Email — Auto Calling Agents',
      html: '<h2>SMTP Test Successful</h2><p>Your email configuration is working correctly.</p><p style="color:#888;font-size:12px;">Sent at ' + new Date().toISOString() + '</p>',
    });
    return { success: true, message: `Test email sent to ${from}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to send test email';
    return { success: false, message: msg };
  }
};
