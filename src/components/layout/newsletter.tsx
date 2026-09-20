"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";

/** MOCK: stores nothing. Wire to your ESP (Resend, Mailchimp, HubSpot) later. */
export function Newsletter({
  copy,
}: {
  copy: Dictionary["footer"]["newsletter"];
}) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-forest-900/60 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="display-3 text-fg">{copy.title}</p>
        <p className="mt-1 text-fg-muted">{copy.body}</p>
      </div>
      {done ? (
        <p className="font-mono text-[0.8rem] uppercase tracking-[0.16em] text-accent">
          {copy.success}
        </p>
      ) : (
        <form
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            {copy.placeholder}
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder={copy.placeholder}
            className="h-12 w-full min-w-0 flex-1 rounded-full border border-line bg-transparent px-5 text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-accent px-5 font-medium text-forest-900 transition-colors hover:bg-copper-300"
          >
            {copy.button}
          </button>
        </form>
      )}
    </div>
  );
}
