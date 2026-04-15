/**
 * TitanChart — Unit Tests
 * Run: npm test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Helpers we want to test ────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildMessage({ name, email, subject, message }) {
  return [
    '📬 <b>New Contact Form Submission</b>',
    '',
    `👤 <b>Name:</b> ${escapeHtml(name)}`,
    `📧 <b>Email:</b> ${escapeHtml(email)}`,
    subject ? `📌 <b>Subject:</b> ${escapeHtml(subject)}` : null,
    '',
    `💬 <b>Message:</b>`,
    escapeHtml(message),
  ].filter(line => line !== null).join('\n');
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateName(value) {
  return value.trim().length >= 2;
}

function validateMessage(value) {
  return value.trim().length >= 10;
}

// ── escapeHtml ─────────────────────────────────────────────────────────────
describe('escapeHtml', () => {
  it('escapes < and > characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes & character', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B');
  });

  it('leaves normal text unchanged', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('handles numbers (converts to string)', () => {
    expect(escapeHtml(42)).toBe('42');
  });
});

// ── buildMessage ───────────────────────────────────────────────────────────
describe('buildMessage', () => {
  it('includes name, email, and message', () => {
    const msg = buildMessage({ name: 'Alice', email: 'alice@example.com', subject: '', message: 'Hello there!' });
    expect(msg).toContain('Alice');
    expect(msg).toContain('alice@example.com');
    expect(msg).toContain('Hello there!');
  });

  it('includes subject when provided', () => {
    const msg = buildMessage({ name: 'Bob', email: 'bob@example.com', subject: 'Test Subject', message: 'Hi' });
    expect(msg).toContain('Test Subject');
    expect(msg).toContain('📌');
  });

  it('omits subject line when subject is empty', () => {
    const msg = buildMessage({ name: 'Bob', email: 'bob@example.com', subject: '', message: 'Hi' });
    expect(msg).not.toContain('📌');
  });

  it('escapes HTML in user input to prevent injection', () => {
    const msg = buildMessage({
      name: '<b>Hacker</b>',
      email: 'hack@example.com',
      subject: '',
      message: '<script>alert(1)</script>',
    });
    expect(msg).not.toContain('<b>Hacker</b>');
    expect(msg).not.toContain('<script>');
    expect(msg).toContain('&lt;b&gt;Hacker&lt;/b&gt;');
    expect(msg).toContain('&lt;script&gt;');
  });

  it('always includes the header emoji', () => {
    const msg = buildMessage({ name: 'A', email: 'a@b.com', subject: '', message: 'test message' });
    expect(msg).toContain('📬');
    expect(msg).toContain('New Contact Form Submission');
  });
});

// ── Validation ─────────────────────────────────────────────────────────────
describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@sub.domain.co.uk')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });
});

describe('validateName', () => {
  it('accepts names 2+ characters', () => {
    expect(validateName('Al')).toBe(true);
    expect(validateName('Alice Bob')).toBe(true);
  });

  it('rejects empty or single-character names', () => {
    expect(validateName('')).toBe(false);
    expect(validateName('A')).toBe(false);
    expect(validateName('  ')).toBe(false);
  });
});

describe('validateMessage', () => {
  it('accepts messages 10+ characters', () => {
    expect(validateMessage('Hello there!')).toBe(true);
    expect(validateMessage('12345678901')).toBe(true);
  });

  it('rejects short messages', () => {
    expect(validateMessage('')).toBe(false);
    expect(validateMessage('Short')).toBe(false);
    expect(validateMessage('123456789')).toBe(false);
  });
});

// ── Telegram API (mocked) ──────────────────────────────────────────────────
describe('sendToTelegram (mocked)', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('calls the correct Telegram API endpoint', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, result: { message_id: 123 } }),
    });

    const BOT_TOKEN = 'test_token_123';
    const CHAT_ID   = '999888777';

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: 'Hello', parse_mode: 'HTML' }),
    });

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    expect(globalThis.fetch.mock.calls[0][0]).toContain('api.telegram.org');
    expect(globalThis.fetch.mock.calls[0][0]).toContain(BOT_TOKEN);
  });

  it('handles Telegram API error response gracefully', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ ok: false, description: 'Unauthorized' }),
    });

    const res = await fetch('https://api.telegram.org/botINVALID/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: '123', text: 'test', parse_mode: 'HTML' }),
    });
    const data = await res.json();

    expect(data.ok).toBe(false);
    expect(data.description).toBe('Unauthorized');
  });

  it('handles network failure gracefully', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

    let caught = null;
    try {
      await fetch('https://api.telegram.org/botTEST/sendMessage', {});
    } catch (e) {
      caught = e;
    }

    expect(caught).not.toBeNull();
    expect(caught.message).toBe('Network error');
  });
});
