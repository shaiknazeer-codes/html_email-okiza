/**
 * Send Real Email Endpoint
 * Works on Vercel Serverless Functions and local Node.js server.
 */

async function handleSendEmail(reqBody, envApiKey) {
  const { to, subject, html, from, apiKey } = reqBody;

  // 1. Validate recipient
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    return {
      status: 400,
      body: { success: false, error: 'Please enter a valid recipient email address.' }
    };
  }

  // 2. Validate API key
  const activeKey = (apiKey && apiKey.trim()) || envApiKey || process.env.RESEND_API_KEY;
  if (!activeKey || !activeKey.startsWith('re_')) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Resend API Key missing or invalid. Please provide an API key starting with "re_". You can get a free key from https://resend.com/api-keys'
      }
    };
  }

  // 3. Sender address (default to Resend free onboarding domain if not specified)
  const fromAddress = from && from.trim() ? from.trim() : 'Okiza <onboarding@resend.dev>';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to.trim()],
        subject: subject || 'Notification from Okiza',
        html: html || '<p>Hello from Okiza</p>'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Friendly explanation for common Resend restrictions
      let errorMsg = data.message || 'Failed to send email through Resend.';
      if (data.name === 'validation_error' && errorMsg.includes('domain')) {
        errorMsg += ' Tip: For free Resend test accounts without a verified custom domain, use "onboarding@resend.dev" as From address, and send to the email address registered with your Resend account.';
      }
      return {
        status: response.status,
        body: { success: false, error: errorMsg, details: data }
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        id: data.id,
        message: `Email successfully sent to ${to}!`
      }
    };
  } catch (err) {
    return {
      status: 500,
      body: { success: false, error: err.message || 'Internal server error while dispatching email.' }
    };
  }
}

// Vercel Serverless Handler
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
    return;
  }

  const result = await handleSendEmail(req.body || {}, process.env.RESEND_API_KEY);
  res.status(result.status).json(result.body);
};

module.exports.handleSendEmail = handleSendEmail;
