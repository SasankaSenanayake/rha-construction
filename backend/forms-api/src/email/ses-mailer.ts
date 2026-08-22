import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { EmailContent } from "./templates";
import type { Mailer } from "./mailer.interface";

export class SesMailer implements Mailer {
  private readonly client: SESClient;
  private readonly fromAddress: string;

  constructor(fromAddress: string, client: SESClient = new SESClient({})) {
    this.client = client;
    this.fromAddress = fromAddress;
  }

  async send(toAddress: string, content: EmailContent): Promise<void> {
    await this.client.send(
      new SendEmailCommand({
        Source: this.fromAddress,
        Destination: { ToAddresses: [toAddress] },
        Message: {
          Subject: { Data: content.subject, Charset: "UTF-8" },
          Body: {
            Text: { Data: content.text, Charset: "UTF-8" },
            Html: { Data: content.html, Charset: "UTF-8" },
          },
        },
      }),
    );
  }
}
