import type { ContactSubmissionRecord, QuoteSubmissionRecord } from "../repository/types";

export interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderRows(rows: Array<[string, string | undefined]>): { text: string; html: string } {
  const present = rows.filter((row): row is [string, string] => Boolean(row[1]));
  const text = present.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = present
    .map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`)
    .join("");
  return { text, html: `<table>${html}</table>` };
}

export function contactNotificationEmail(record: ContactSubmissionRecord): EmailContent {
  const { text, html } = renderRows([
    ["Name", record.name],
    ["Email", record.email],
    ["Phone", record.phone],
    ["Locale", record.locale],
    ["Submitted at", record.createdAt],
  ]);
  return {
    subject: `New contact form submission from ${record.name}`,
    text: `${text}\n\nMessage:\n${record.message}`,
    html: `${html}<p><strong>Message:</strong><br/>${escapeHtml(record.message)}</p>`,
  };
}

export function quoteNotificationEmail(record: QuoteSubmissionRecord): EmailContent {
  const { text, html } = renderRows([
    ["Name", record.name],
    ["Email", record.email],
    ["Phone", record.phone],
    ["Property location", record.propertyLocation],
    ["Project type", record.projectType],
    ["Estimated budget", record.estimatedBudgetRange],
    ["Preferred contact method", record.preferredContactMethod],
    ["Desired start date", record.desiredStartDate],
    ["Locale", record.locale],
    ["Submitted at", record.createdAt],
  ]);
  return {
    subject: `New quote request from ${record.name}`,
    text: `${text}\n\nProject scope:\n${record.projectScopeNotes}`,
    html: `${html}<p><strong>Project scope:</strong><br/>${escapeHtml(record.projectScopeNotes)}</p>`,
  };
}
