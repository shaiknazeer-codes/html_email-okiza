/**
 * Okiza Email Template Loader & Interpolator (TypeScript)
 */

import * as fs from 'fs';
import * as path from 'path';

export interface BaseOkizaEmailData {
  recipientName: string;
  subject: string;
  message: string;
  buttonText: string;
  buttonUrl: string;
  siteUrl?: string;
  currentYear?: string;
  [key: string]: string | undefined;
}

export interface RenderOptions {
  sanitize?: boolean;
  allowHtmlInMessage?: boolean;
  useCache?: boolean;
}

const templateCache = new Map<string, string>();

export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function loadTemplate(templateName: string, useCache = true): string {
  const normalizedName = templateName.endsWith('.html') ? templateName : `${templateName}.html`;

  if (useCache && templateCache.has(normalizedName)) {
    return templateCache.get(normalizedName)!;
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

export function renderEmail(
  templateName: string,
  data: BaseOkizaEmailData,
  options: RenderOptions = {}
): string {
  const { sanitize = true, allowHtmlInMessage = false, useCache = true } = options;
  const rawHtml = loadTemplate(templateName, useCache);

  const context: Record<string, string> = {
    siteUrl: 'https://okiza-frontend-a9l9.vercel.app',
    currentYear: new Date().getFullYear().toString(),
    ...data,
  };

  return rawHtml.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, key) => {
    if (key in context) {
      const val = context[key] ?? '';
      if (!sanitize || (key === 'message' && allowHtmlInMessage)) {
        return val;
      }
      return escapeHtml(val);
    }
    return match;
  });
}

export function getMissingPlaceholders(renderedHtml: string): string[] {
  const matches = renderedHtml.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
  return [...new Set(matches)];
}
