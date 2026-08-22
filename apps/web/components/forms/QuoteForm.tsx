"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import {
  BUDGET_RANGES,
  CONTACT_METHODS,
  PROJECT_TYPES,
  quoteSubmissionSchema,
  type Locale,
  type QuoteSubmissionInput,
} from "@rha/shared";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/Button";
import { FormField, inputClassName } from "./FormField";
import { SubmitStatus } from "./SubmitStatus";

export function QuoteForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations("quote.form");
  const tCategories = useTranslations("services.categories");
  const tCommon = useTranslations("common");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteSubmissionInput>({
    resolver: zodResolver(quoteSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      propertyLocation: "",
      projectType: "residential",
      estimatedBudgetRange: "not-sure",
      preferredContactMethod: "phone",
      projectScopeNotes: "",
      desiredStartDate: "",
      locale,
      companyWebsite: "",
    },
  });

  async function onSubmit(data: QuoteSubmissionInput) {
    setStatus("idle");
    try {
      const response = await fetch(`${siteConfig.apiBaseUrl}/quote`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input type="hidden" {...register("locale")} />

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="companyWebsite-quote">Company Website</label>
        <input id="companyWebsite-quote" type="text" tabIndex={-1} autoComplete="off" {...register("companyWebsite")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={t("name")} htmlFor="q-name" error={errors.name?.message}>
          <input id="q-name" className={inputClassName} {...register("name")} />
        </FormField>

        <FormField label={t("email")} htmlFor="q-email" error={errors.email?.message}>
          <input id="q-email" type="email" className={inputClassName} {...register("email")} />
        </FormField>

        <FormField label={t("phone")} htmlFor="q-phone" error={errors.phone?.message}>
          <input id="q-phone" type="tel" className={inputClassName} {...register("phone")} />
        </FormField>

        <FormField label={t("propertyLocation")} htmlFor="q-location" error={errors.propertyLocation?.message}>
          <input
            id="q-location"
            placeholder={t("propertyLocationPlaceholder")}
            className={inputClassName}
            {...register("propertyLocation")}
          />
        </FormField>

        <FormField label={t("projectType")} htmlFor="q-projectType" error={errors.projectType?.message}>
          <select id="q-projectType" className={inputClassName} {...register("projectType")}>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {tCategories(type)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t("estimatedBudgetRange")} htmlFor="q-budget" error={errors.estimatedBudgetRange?.message}>
          <select id="q-budget" className={inputClassName} {...register("estimatedBudgetRange")}>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {t(`budgetRanges.${range}`)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label={t("preferredContactMethod")}
          htmlFor="q-contactMethod"
          error={errors.preferredContactMethod?.message}
        >
          <select id="q-contactMethod" className={inputClassName} {...register("preferredContactMethod")}>
            {CONTACT_METHODS.map((method) => (
              <option key={method} value={method}>
                {t(`contactMethods.${method}`)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t("desiredStartDate")} htmlFor="q-startDate" error={errors.desiredStartDate?.message}>
          <input id="q-startDate" type="date" className={inputClassName} {...register("desiredStartDate")} />
        </FormField>
      </div>

      <FormField label={t("projectScopeNotes")} htmlFor="q-notes" error={errors.projectScopeNotes?.message}>
        <textarea
          id="q-notes"
          rows={5}
          placeholder={t("projectScopeNotesPlaceholder")}
          className={inputClassName}
          {...register("projectScopeNotes")}
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? tCommon("sending") : tCommon("submit")}
      </Button>

      {status === "success" && <SubmitStatus status="success" successMessage={t("success")} errorMessage="" />}
      {status === "error" && <SubmitStatus status="error" successMessage="" errorMessage={t("error")} />}
    </form>
  );
}
