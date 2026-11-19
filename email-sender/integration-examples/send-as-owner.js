/**
 * Send Email as the Company Owner / Founder of Okiza
 *
 * Usage:
 *   # Dry-Run (preview output without sending):
 *   node email-sender/integration-examples/send-as-owner.js
 *
 *   # Live Send with Resend API:
 *   RESEND_API_KEY="re_123456789" node email-sender/integration-examples/send-as-owner.js
 */

const fs = require('fs');
const path = require('path');
const { renderEmail } = require('../utils/template-loader');

// Default Owner Configuration
const OWNER_CONFIG = {
  founderName: 'Founder & CEO',                 // Executive name or placeholder
  founderTitle: 'Founder & CEO, Okiza',         // Your executive title
  founderEmail: 'founder@okiza.ai',             // Your personal reply-to email
  founderNote: 'I read and reply to every email personally. If you have any feedback or ideas, just hit reply directly to this message.',
};

/**
 * Prepares and sends an executive personal letter as the Founder/Owner.
 */
async function sendAsOwner({
  toEmail,
  recipientName,
  subject,
  message,
  buttonText = 'Schedule 15-Min Founder Chat',
  buttonUrl = 'https://okiza-frontend-a9l9.vercel.app/founder-meeting',
  customConfig = {},
}) {
  const config = { ...OWNER_CONFIG, ...customConfig };

  // 1. Render template to HTML string with safe escaping
  const html = renderEmail('founder-message', {
    founderName: config.founderName,
    founderTitle: config.founderTitle,
    founderEmail: config.founderEmail,
    founderNote: config.founderNote,
    recipientName,
    subject,
    message,
    buttonText,
    buttonUrl,
    siteUrl: 'https://okiza-frontend-a9l9.vercel.app',
    currentYear: new Date().getFullYear().toString(),
  }, {
    allowHtmlInMessage: true // Allows clean paragraph formatting <br>
  });

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === 're_test_dummy_key') {
    console.log('\n======================================================');
    console.log(' [DRY-RUN MODE] Email Prepared as Company Owner');
    console.log('======================================================');
    console.log(` From:       ${config.founderName} <${config.founderEmail}>`);
    console.log(` To:         ${recipientName} <${toEmail}>`);
    console.log(` Subject:    ${subject}`);
    console.log(` Action CTA: ${buttonText} -> ${buttonUrl}`);
    console.log(` Length:     ${html.length} characters`);
    console.log('------------------------------------------------------');
    console.log(' Note: To send live, set RESEND_API_KEY and run again.');
    console.log('======================================================\n');
    return { dryRun: true, html };
  }

  // Live send via Resend
  const { Resend } = require('resend');
  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: `${config.founderName} <${config.founderEmail}>`,
    reply_to: config.founderEmail,
    to: toEmail,
    subject: subject,
    html: html,
  });

  console.log(`✓ Email sent successfully as Owner to ${toEmail}! ID:`, response.data?.id);
  return response;
}

// Example Execution
if (require.main === module) {
  sendAsOwner({
    toEmail: 'customer@example.com',
    recipientName: 'Alex',
    subject: 'A personal note from the founder of Okiza',
    message: `I wanted to personally reach out and welcome you to Okiza.<br><br>As the founder, my goal is to ensure you have complete unfair advantage when it comes to competitor intelligence and autonomous growth marketing.<br><br>I would love to learn more about your brand and personally ensure our AI agents are configured for maximum impact. Would you have 15 minutes this week for a 1-on-1 chat?`,
    buttonText: 'Book 15-Min Chat with Founder',
    buttonUrl: 'https://okiza-frontend-a9l9.vercel.app/calendar',
  }).catch(console.error);
}

module.exports = { sendAsOwner, OWNER_CONFIG };
