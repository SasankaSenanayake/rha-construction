import type { EmailContent } from "./templates";

export interface Mailer {
  send(toAddress: string, content: EmailContent): Promise<void>;
}
