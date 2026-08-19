import type { Locale, Messages } from 'next-intl';
import { CapHit } from './templates/cap-hit';
import { ContactMessage } from './templates/contact-message';
import { CreditsLow } from './templates/credits-low';
import { FirstWin } from './templates/first-win';
import { ForgotPassword } from './templates/forgot-password';
import { LinkedinPlaybook } from './templates/linkedin-playbook';
import { SubscribeNewsletter } from './templates/subscribe-newsletter';
import { TemplatesTour } from './templates/templates-tour';
import { UpgradeNudge } from './templates/upgrade-nudge';
import { VerifyEmail } from './templates/verify-email';
import { WeeklyDigest } from './templates/weekly-digest';
import { Welcome } from './templates/welcome';
import { WinBack } from './templates/win-back';

/**
 * list all the email templates here
 */
export const EmailTemplates = {
  verifyEmail: VerifyEmail,
  forgotPassword: ForgotPassword,
  subscribeNewsletter: SubscribeNewsletter,
  contactMessage: ContactMessage,
  welcome: Welcome,
  creditsLow: CreditsLow,
  capHit: CapHit,
  winBack: WinBack,
  firstWin: FirstWin,
  templatesTour: TemplatesTour,
  linkedinPlaybook: LinkedinPlaybook,
  upgradeNudge: UpgradeNudge,
  weeklyDigest: WeeklyDigest,
} as const;

/**
 * Email template types
 */
export type EmailTemplate = keyof typeof EmailTemplates;

/**
 * Base email component props
 */
export interface BaseEmailProps {
  locale: Locale;
  messages: Messages;
}

/**
 * Common email sending parameters
 */
export interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html: string;
  from?: string;
}

/**
 * Result of sending an email
 */
export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: any;
}

/**
 * Parameters for sending an email using a template
 */
export interface SendTemplateParams {
  to: string;
  template: EmailTemplate;
  context: Record<string, any>;
  locale?: Locale;
  /** Overrides the static subject from messages (e.g. the weekly digest). */
  subject?: string;
  /** Extra SMTP headers (e.g. List-Unsubscribe). */
  headers?: Record<string, string>;
}

/**
 * Parameters for sending a raw email
 */
export interface SendRawEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  locale?: Locale;
  /** Extra SMTP headers (e.g. List-Unsubscribe). */
  headers?: Record<string, string>;
}

/**
 * Mail provider interface
 */
export interface MailProvider {
  /**
   * Send an email using a template
   */
  sendTemplate(params: SendTemplateParams): Promise<SendEmailResult>;

  /**
   * Send a raw email
   */
  sendRawEmail(params: SendRawEmailParams): Promise<SendEmailResult>;

  /**
   * Get the provider's name
   */
  getProviderName(): string;
}
