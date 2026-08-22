import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/ContactForm";
import { renderWithIntl } from "../test-utils";

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows validation errors and does not call fetch when submitted empty", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits valid data to the contact endpoint and shows a success message", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true });
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.type(screen.getByLabelText(/full name/i), "Kasun Perera");
    await user.type(screen.getByLabelText(/email address/i), "kasun@example.com");
    await user.type(screen.getByLabelText(/^message$/i), "I would like a quote for a small extension.");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const [url, options] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(url).toMatch(/\/contact$/);
    const body = JSON.parse(options.body);
    expect(body.name).toBe("Kasun Perera");
    expect(body.email).toBe("kasun@example.com");
    expect(body.locale).toBe("en");

    expect(await screen.findByRole("status")).toHaveTextContent(/thanks/i);
  });

  it("shows an error message when the request fails", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.type(screen.getByLabelText(/full name/i), "Kasun Perera");
    await user.type(screen.getByLabelText(/email address/i), "kasun@example.com");
    await user.type(screen.getByLabelText(/^message$/i), "I would like a quote for a small extension.");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});
