"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useActionState } from "react";
import {
  type ContactState,
  submitContact,
} from "@/app/[locale]/contact/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle" };

export function ContactForm({
  copy,
  locale,
}: {
  copy: Dictionary["contact"]["form"];
  locale: Locale;
}) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const errors = state.status === "error" ? state.fieldErrors : {};
  const msg = (code?: string) =>
    code === "invalidEmail"
      ? copy.invalidEmail
      : code === "tooShort"
        ? copy.tooShort
        : code
          ? copy.required
          : undefined;

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-accent bg-accent-soft p-10"
        role="status"
        aria-live="polite"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-forest-900">
          <Check className="h-6 w-6" />
        </span>
        <p className="display-3 mt-6">{copy.success.title}</p>
        <p className="mt-3 text-fg-muted">{copy.success.body}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label={copy.name}
          name="name"
          error={msg(errors.name)}
          autoComplete="name"
        />
        <Field
          label={copy.email}
          name="email"
          type="email"
          error={msg(errors.email)}
          autoComplete="email"
        />
      </div>
      <Field
        label={copy.company}
        name="company"
        error={msg(errors.company)}
        autoComplete="organization"
      />
      <Field
        label={copy.need}
        name="need"
        as="textarea"
        placeholder={copy.needPlaceholder}
        error={msg(errors.need)}
      />
      <div>
        <label htmlFor="budget" className="eyebrow mb-2 block">
          {copy.budget}
        </label>
        <select id="budget" name="budget" className={inputCls}>
          {copy.budgetOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-fg-subtle">{copy.privacy}</p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-14 items-center justify-center rounded-full bg-accent px-8 font-medium text-forest-900 transition-colors hover:bg-copper-300 disabled:opacity-60"
        >
          {pending ? copy.sending : copy.submit}
        </button>
      </div>
      {state.status === "failed" && (
        <p role="alert" className="text-sm text-red-700">
          {copy.error}
        </p>
      )}
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-bg-elevated px-4 py-3.5 text-fg placeholder:text-fg-subtle transition-colors focus:border-accent focus:outline-none";

function Field({
  label,
  name,
  type = "text",
  as = "input",
  placeholder,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}) {
  const id = `contact-${name}`;
  const common = {
    id,
    name,
    placeholder,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: cn(inputCls, error && "border-red-600"),
  };
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea rows={5} {...common} />
      ) : (
        <input type={type} {...common} />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
