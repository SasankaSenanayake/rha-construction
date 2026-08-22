"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { contactSubmissionSchema, type ContactSubmissionInput, type Locale } from "@rha/shared";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/Button";
import { FormField, inputClassName } from "./FormField";
import { SubmitStatus } from "./SubmitStatus";

export function ContactForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations("contact.form");
  const tc = useTranslations("common");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactSubmissionInput>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", locale, companyWebsite: "" },
  });

  async function onSubmit(data: ContactSubmissionInput) {
    setStatus("idle");
    try {
      const response = await fetch(`${siteConfig.apiBaseUrl}/contact`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      reset({ name: "", email: "", phone: "", message: "", locale, companyWebsite: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input type="hidden" {...register("locale")} />

      {/* Honeypot — hidden from sighted users, invisible to screen readers; a
          filled value means a bot filled the form and the Lambda rejects it. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="companyWebsite">Company Website</label>
        <input id="companyWebsite" type="text" tabIndex={-1} autoComplete="off" {...register("companyWebsite")} />
      </div>

      <FormField label={t("name")} htmlFor="name" error={errors.name?.message}>
        <input id="name" className={inputClassName} {...register("name")} />
      </FormField>

      <FormField label={t("email")} htmlFor="email" error={errors.email?.message}>
        <input id="email" type="email" className={inputClassName} {...register("email")} />
      </FormField>

      <FormField label={t("phone")} htmlFor="phone" error={errors.phone?.message}>
        <input id="phone" type="tel" className={inputClassName} {...register("phone")} />
      </FormField>

      <FormField label={t("message")} htmlFor="message" error={errors.message?.message}>
        <textarea
          id="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          className={inputClassName}
          {...register("message")}
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? tc("sending") : tc("submit")}
      </Button>

      {status === "success" && <SubmitStatus status="success" successMessage={t("success")} errorMessage="" />}
      {status === "error" && <SubmitStatus status="error" successMessage="" errorMessage={t("error")} />}
    </form>
  );
}
