/**
 * Okiza Email Sending with Resend (TypeScript)
 *
 * Requirements:
 *   npm install resend
 */

import { Resend } from 'resend';
import { renderEmail } from '../utils/template-loader';

const resend = new Resend(process.env.RESEND_API_KEY || 're_test_dummy_key');

export interface SendGeneralEmailParams {
  to: string | string[];
  recipientName: string;
  subject: string;
  message: string;
  buttonText: string;
  buttonUrl: string;
}

export async function sendGeneralNotification(params: SendGeneralEmailParams) {
  const html = renderEmail('general-notification', {
    recipientName: params.recipientName,
    subject: params.subject,
    message: params.message,
    buttonText: params.buttonText,
    buttonUrl: params.buttonUrl,
  });

  return await resend.emails.send({
    from: 'Okiza <notifications@okiza.ai>',
    to: params.to,
    subject: params.subject,
    html,
  });
}

export async function sendWelcomeEmail(to: string, recipientName: string) {
  const subject = 'Welcome to Okiza — The AI Growth Operating System';
  const html = renderEmail('welcome', {
    recipientName,
    subject,
    message: 'We are thrilled to welcome you to Okiza. Your autonomous AI growth agents are standing by to discover competitor movements and optimize market opportunities.',
    buttonText: 'Launch Growth Dashboard',
    buttonUrl: 'https://okiza-frontend-a9l9.vercel.app/dashboard',
  });

  return await resend.emails.send({
    from: 'Okiza Team <welcome@okiza.ai>',
    to,
    subject,
    html,
  });
}

export async function sendVerificationOtp(to: string, recipientName: string, otpCode: string, expiryMinutes = 10) {
  const subject = 'Your Okiza Verification Code';
  const html = renderEmail('verification-code', {
    recipientName,
    subject,
    message: 'Please use the one-time passcode below to verify your Okiza session. This code will expire shortly.',
    otpCode,
    expiryMinutes: String(expiryMinutes),
    buttonText: 'Sign In to Okiza Directly',
    buttonUrl: `https://okiza-frontend-a9l9.vercel.app/verify?code=${otpCode}`,
  });

  return await resend.emails.send({
    from: 'Okiza Security <security@okiza.ai>',
    to,
    subject,
    html,
  });
}
