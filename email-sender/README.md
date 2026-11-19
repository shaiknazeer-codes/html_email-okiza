# Okiza HTML Email Templates Suite

> **Premium, responsive, production-ready HTML email designs for Okiza — The AI CMO.**  
> Website: [https://okiza-frontend-a9l9.vercel.app/](https://okiza-frontend-a9l9.vercel.app/)

---

## Table of Contents
1. [Overview & Design System](#overview--design-system)
2. [Folder Structure](#folder-structure)
3. [Template Catalog](#template-catalog)
4. [Sending as Company Owner / Founder](#sending-as-company-owner--founder)
5. [Standard Dynamic Placeholders](#standard-dynamic-placeholders)
6. [Backend Integration Guide (Resend)](#backend-integration-guide-resend)
7. [Email Client Compatibility](#email-client-compatibility)
8. [Interactive Preview Tool](#interactive-preview-tool)
9. [Asset Management](#asset-management)

---

## Overview & Design System

These templates reflect Okiza's actual branding, visual language, and typography:

- **Theme**: Dark, modern SaaS aesthetic with subtle high-contrast surfaces (inspired by Vercel, Linear, and modern AI platforms).
- **Core Canvas Color**: `#050507` (Deep slate black)
- **Container / Card Color**: `#0f0f13` with `1px solid #26262b` border and rounded corners
- **Typography**: Apple System / Segoe UI / Roboto font stack with crisp hierarchy
  - Headings: `#ffffff` (bold, tracking -0.5px)
  - Body Text: `#d4d4d8` / `#a1a1aa` (high contrast, 15px with 24-25px line height)
  - Muted/Metadata: `#71717a`
- **Call-to-Action Buttons**:
  - High-contrast pure white `#ffffff` background with pitch black `#000000` text
  - Pill shape (`border-radius: 9999px`)
  - Bulletproof Outlook VML support with fallbacks
- **Header & Footer**:
  - Okiza wordmark + high-resolution logo (`logo-white.png` / `logo-black.png`)
  - "All Systems Operational" pulse indicator
  - Comprehensive footer with tagline, navigation links, copyright, and CAN-SPAM / GDPR unsubscribe notices

---

## Folder Structure

All email assets, templates, utilities, and documentation are strictly self-contained within `email-sender`:

```
email-sender/
├── assets/
│   ├── logo-white.png              # White Okiza logo (for dark theme emails)
│   ├── logo-black.png              # Black Okiza logo (for light theme emails)
│   └── icon.png                    # Brand favicon icon
├── templates/
│   ├── founder-message.html        # Direct personal letter from Founder / CEO
│   ├── general-notification.html   # Primary multi-purpose transactional notification (Dark)
│   ├── welcome.html                # New user onboarding & 3-step growth setup
│   ├── verification-code.html      # Security OTP verification & magic sign-in
│   ├── growth-report.html          # AI intelligence, competitor radar & GEO search digest
│   ├── billing-receipt.html        # Subscription confirmation & invoice breakdown
│   ├── password-reset.html         # Account security password reset flow
│   ├── team-invitation.html        # Workspace team member invite
│   └── general-notification-light.html # Clean light-mode alternative for enterprise clients
├── preview/
│   ├── preview.html                # Interactive local previewer (Desktop, Tablet, Mobile)
│   └── preview-data.json           # Mock data dictionary for testing templates
├── utils/
│   ├── template-loader.js          # Production Node.js template loader with safe escaping & caching
│   └── template-loader.ts          # TypeScript version with strict type definitions
├── integration-examples/
│   ├── send-as-owner.js            # Direct executive sending script as Company Owner / Founder
│   ├── resend-example.js           # Ready-to-run Resend backend integration functions
│   └── resend-example.ts           # TypeScript Resend backend integration functions
├── serve.js                        # Zero-dependency localhost preview server
└── README.md                       # Comprehensive guide and integration reference
```

---

## Template Catalog

| Template File | Purpose | Key Highlights |
| :--- | :--- | :--- |
| `founder-message.html` | **Personal Founder / Owner Letter** | Executive personal note, founder signature block, 1-on-1 meeting CTA, direct reply P.S. |
| `general-notification.html` | Core versatile notification | Supports all standard placeholders, intelligence callout box, direct fallback link |
| `welcome.html` | User onboarding | Welcome message, 3-step quick launch cards, dashboard CTA |
| `verification-code.html` | Auth & Security OTP | Monospace one-time code box, expiration timer, direct magic link, security tip |
| `growth-report.html` | AI Intelligence Digest | 3-column metric cards (Competitor signals, GEO citations, Blueprints), opportunity callout |
| `billing-receipt.html` | Payment Confirmation | Itemized table: Plan, Date, Payment Method, Total Amount, Invoice ID |
| `password-reset.html` | Account Security | Password reset CTA button, security alert notice, link expiry indicator |
| `team-invitation.html` | Workspace Collaboration | Inviter name, workspace title, assigned role badge, accept invite button |
| `general-notification-light.html` | Enterprise Light Mode | Light canvas (`#f4f4f5`), black logo (`logo-black.png`), charcoal typography |

---

## Sending as Company Owner / Founder

To send emails directly as the company owner or founder (e.g. VIP welcomes, executive onboarding, investor updates, or personal check-ins):

### Run via Terminal (Dry-Run or Live Send)

```bash
# 1. Test in dry-run mode (previews the email in your console):
node email-sender/integration-examples/send-as-owner.js

# 2. Send live via Resend:
RESEND_API_KEY="re_your_api_key_here" node email-sender/integration-examples/send-as-owner.js
```

### In Code (Node.js / Next.js)

```javascript
const { sendAsOwner } = require('./email-sender/integration-examples/send-as-owner');

await sendAsOwner({
  toEmail: 'customer@company.com',
  recipientName: 'Alex',
  subject: 'A personal note from the founder of Okiza',
  message: 'I personally wanted to reach out and say thank you for exploring Okiza. Would you have 15 minutes this week for a 1-on-1 walkthrough?',
  buttonText: 'Book 15-Min Chat with Founder',
  buttonUrl: 'https://okiza-frontend-a9l9.vercel.app/calendar',
  customConfig: {
    founderName: 'Founder & CEO',
    founderTitle: 'Founder & CEO, Okiza',
    founderEmail: 'founder@okiza.ai'
  }
});
```

---

## Standard Dynamic Placeholders

Every template is fully parameterized with the following standard placeholders:

| Placeholder | Type | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `{{recipientName}}` | `string` | First name or full name of recipient | `"Alex Rivers"` |
| `{{subject}}` | `string` | Email subject and hero title | `"A personal note from the founder of Okiza"` |
| `{{message}}` | `string` | Main body message text | `"I wanted to personally reach out and welcome you to Okiza..."` |
| `{{buttonText}}` | `string` | Label for primary call-to-action button | `"Schedule 15-Min Founder Chat"` |
| `{{buttonUrl}}` | `string` | Destination URL for primary button | `"https://okiza-frontend-a9l9.vercel.app/calendar"` |
| `{{siteUrl}}` | `string` | Root URL of Okiza application | `"https://okiza-frontend-a9l9.vercel.app"` |
| `{{currentYear}}` | `string` | Dynamic copyright year | `"2026"` |

### Founder / Specialized Placeholders

| Template | Additional Placeholders | Purpose |
| :--- | :--- | :--- |
| `founder-message.html` | `{{founderName}}`, `{{founderTitle}}`, `{{founderEmail}}`, `{{founderNote}}` | Founder signature and direct reply notice |
| `verification-code.html` | `{{otpCode}}`, `{{expiryMinutes}}` | The 6-digit passcode and expiration countdown |
| `billing-receipt.html` | `{{invoiceId}}`, `{{planName}}`, `{{paymentDate}}`, `{{paymentMethod}}`, `{{billingAmount}}` | Itemized invoice breakdown |
| `team-invitation.html` | `{{inviterName}}`, `{{workspaceName}}`, `{{roleName}}` | Team invitation metadata |

---

## Backend Integration Guide (Resend)

### Step 1: Install Resend
```bash
npm install resend
# or
pnpm add resend
```

### Step 2: Import and Send (Node.js / Express / Next.js)

```javascript
import { Resend } from 'resend';
import { renderEmail } from './email-sender/utils/template-loader';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailNotification(toEmail, userName) {
  const html = renderEmail('founder-message', {
    founderName: 'Founder & CEO',
    founderTitle: 'Founder & CEO, Okiza',
    founderEmail: 'founder@okiza.ai',
    recipientName: userName,
    subject: 'Welcome to Okiza from the Founder',
    message: 'Welcome to Okiza. I am available anytime if you need help scaling your autonomous growth engine.',
    buttonText: 'Book Onboarding Call',
    buttonUrl: 'https://okiza-frontend-a9l9.vercel.app/meeting',
  });

  const { data, error } = await resend.emails.send({
    from: 'Okiza Founder <founder@okiza.ai>',
    reply_to: 'founder@okiza.ai',
    to: toEmail,
    subject: 'Welcome to Okiza from the Founder',
    html: html,
  });

  if (error) throw error;
  return data;
}
```

---

## Email Client Compatibility

Every template has been crafted according to strict email standards:

| Email Client | Rendering Engine | Compatibility Features Included |
| :--- | :--- | :--- |
| **Outlook 2007–2021 (Windows)** | Microsoft Word (MSO) | Bulletproof VML buttons (`v:roundrect`), conditional width tables (`<!--[if (gte mso 9)|(IE)]>`), `mso-table-lspace: 0pt` |
| **Gmail (Web, iOS, Android)** | Blink / WebKit | Fully inlined CSS styles, table layouts, file size < 21KB (avoids 102KB clipping) |
| **Apple Mail & iOS Mail** | WebKit | `-webkit-text-size-adjust: 100%` (prevents iOS font auto-scaling), high-DPI image support |
| **Dark Mode Clients** | Native / Inverted | `<meta name="color-scheme" content="dark">`, explicit contrast borders, solid dark card backgrounds |

---

## Interactive Preview Tool & Live Email Dispatch

To preview and send real emails directly from your browser:

1. Open [http://localhost:3000](http://localhost:3000) (or your Vercel deployment URL).
2. Select any template (e.g. **★ Note from Founder & CEO**).
3. Customize the fields in the left sidebar with real names, text, and links.
4. Click the **"Send Real Email 🚀"** button in the top navigation bar.
5. In the modal:
   - Enter the recipient's real email address.
   - Enter your Resend API Key (`re_...`) from [resend.com/api-keys](https://resend.com/api-keys). The browser will securely remember it for next time.
   - Click **"Send Email Now 🚀"**.
6. The email will be dispatched in real time via Resend and delivered to the inbox!

---

## Real Email Sending API Endpoint (`/api/send-email`)

The project includes a unified endpoint that works on both localhost and Vercel serverless functions:

```bash
curl -X POST https://your-site.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "colleague@example.com",
    "subject": "Hello from Okiza",
    "html": "<h1>Welcome</h1>",
    "apiKey": "re_your_resend_api_key"
  }'
```

---
