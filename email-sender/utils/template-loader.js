/**
 * Okiza Email Template Loader & Interpolator
 *
 * Designed for seamless integration with Resend, SendGrid, Postmark, AWS SES, or Nodemailer.
 * - Loads HTML email templates as strings.
 * - Safely escapes user input to prevent HTML injection.
 * - Replaces {{placeholder}} tokens cleanly.
 * - Includes caching for high-performance serverless execution (Vercel, AWS Lambda).
 */

const fs = require('fs');
const path = require('path');

// In-memory template cache for serverless environments
const templateCache = new Map();

/**
 * Escapes special HTML characters to prevent XSS / markup corruption in email clients.
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Loads an email template file and returns its raw HTML string.
 * @param {string} templateName - e.g., 'general-notification', 'welcome', 'verification-code'
 * @param {boolean} [useCache=true] - Whether to cache the raw template string
 * @returns {string} Raw HTML content
 */
function loadTemplate(templateName, useCache = true) {
  const normalizedName = templateName.endsWith('.html') ? templateName : `${templateName}.html`;

  if (useCache && templateCache.has(normalizedName)) {
    return templateCache.get(normalizedName);
  }

  const templatePath = path.join(__dirname, '..', 'templates', normalizedName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`[Okiza Email Error] Template not found: "${templatePath}"`);
  }

  const rawHtml = fs.readFileSync(templatePath, 'utf8');
  if (useCache) {
    templateCache.set(normalizedName, rawHtml);
  }

  return rawHtml;
}

/**
 * Renders an email template with dynamic placeholder data.
 *
 * @param {string} templateName - Name of the template (e.g. 'general-notification')
 * @param {Object} data - Key-value map of placeholders
 * @param {Object} [options] - Optional settings
 * @param {boolean} [options.sanitize=true] - Whether to auto-escape HTML characters in values
 * @param {boolean} [options.allowHtmlInMessage=false] - If true, prevents escaping the {{message}} field
 * @returns {string} Fully rendered HTML string ready for Resend
 */
function renderEmail(templateName, data = {}, options = {}) {
  const { sanitize = true, allowHtmlInMessage = false } = options;
  const rawHtml = loadTemplate(templateName);

  // Default values for standard Okiza branding
  const context = {
    siteUrl: 'https://okiza-frontend-a9l9.vercel.app',
    currentYear: new Date().getFullYear().toString(),
    recipientName: 'Valued Member',
    subject: 'Notification from Okiza',
    buttonText: 'Open Dashboard',
    buttonUrl: 'https://okiza-frontend-a9l9.vercel.app/dashboard',
    message: '',
    ...data,
  };

  // Interpolate placeholders
  let rendered = rawHtml.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, key) => {
    if (key in context) {
      const val = context[key];
      if (!sanitize || (key === 'message' && allowHtmlInMessage)) {
        return String(val ?? '');
      }
      return escapeHtml(val);
    }
    return match; // Keep unresolved tokens if not matched
  });

  return rendered;
}

/**
 * Returns a list of placeholders present in the rendered HTML that were not substituted.
 * @param {string} renderedHtml
 * @returns {string[]}
 */
function getMissingPlaceholders(renderedHtml) {
  const matches = renderedHtml.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
  return [...new Set(matches)];
}

module.exports = {
  loadTemplate,
  renderEmail,
  escapeHtml,
  getMissingPlaceholders,
};
