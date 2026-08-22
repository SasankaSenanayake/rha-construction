import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { renderWithIntl } from "../test-utils";

describe("QuoteForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("requires a phone number and does not call fetch when missing", async () => {
    const user = userEvent.setup();
    renderWithIntl(<QuoteForm />);

    await user.type(screen.getByLabelText(/full name/i), "Nimali Fernando");
    await user.type(screen.getByLabelText(/email address/i), "nimali@example.com");
    await user.type(screen.getByLabelText(/property location/i), "Kandy");
    await user.type(screen.getByLabelText(/tell us about your project/i), "Two-storey extension to an existing house.");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits valid data to the quote endpoint", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true });
    const user = userEvent.setup();
    renderWithIntl(<QuoteForm />);

    await user.type(screen.getByLabelText(/full name/i), "Nimali Fernando");
    await user.type(screen.getByLabelText(/email address/i), "nimali@example.com");
    await user.type(screen.getByLabelText(/^phone number$/i), "+94771234567");
    await user.type(screen.getByLabelText(/property location/i), "Kandy");
    await user.type(screen.getByLabelText(/tell us about your project/i), "Two-storey extension to an existing house.");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const [url, options] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(url).toMatch(/\/quote$/);
    const body = JSON.parse(options.body);
    expect(body.propertyLocation).toBe("Kandy");
    expect(body.projectType).toBe("residential");

    expect(await screen.findByRole("status")).toHaveTextContent(/thanks/i);
  });
});
