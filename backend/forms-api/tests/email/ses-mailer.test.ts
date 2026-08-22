import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { SesMailer } from "../../src/email/ses-mailer";

const sesMock = mockClient(SESClient);

beforeEach(() => {
  sesMock.reset();
});

describe("SesMailer", () => {
  it("sends an email with the expected source, destination, and content", async () => {
    sesMock.on(SendEmailCommand).resolves({ MessageId: "abc-123" });
    const mailer = new SesMailer("noreply@example.com", new SESClient({}));

    await mailer.send("owner@example.com", {
      subject: "New lead",
      text: "plain text body",
      html: "<p>html body</p>",
    });

    const calls = sesMock.commandCalls(SendEmailCommand);
    expect(calls).toHaveLength(1);
    const input = calls[0]!.args[0].input;
    expect(input.Source).toBe("noreply@example.com");
    expect(input.Destination?.ToAddresses).toEqual(["owner@example.com"]);
    expect(input.Message?.Subject?.Data).toBe("New lead");
  });

  it("propagates errors from SES", async () => {
    sesMock.on(SendEmailCommand).rejects(new Error("MessageRejected"));
    const mailer = new SesMailer("noreply@example.com", new SESClient({}));

    await expect(
      mailer.send("owner@example.com", { subject: "x", text: "x", html: "x" }),
    ).rejects.toThrow("MessageRejected");
  });
});
