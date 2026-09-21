"use server";

import { z } from "zod";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "failed" }
  | {
      status: "error";
      fieldErrors: Partial<
        Record<
          "name" | "email" | "company" | "need",
          "required" | "invalidEmail" | "tooShort"
        >
      >;
    };

const schema = z.object({
  name: z.string().trim().min(1, "required"),
  email: z.string().trim().min(1, "required").email("invalidEmail"),
  company: z.string().trim().min(1, "required"),
  need: z.string().trim().min(1, "required").min(20, "tooShort"),
  locale: z.string().optional(),
  website: z.string().optional(), // honeypot
});

/**
 * MOCK submission: validates and logs. Replace the body with your CRM/email
 * provider (HubSpot, Resend, Slack webhook…) when the commercial channel is defined.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<
      string,
      "required" | "invalidEmail" | "tooShort"
    > = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key])
        fieldErrors[key] = issue.message as
          | "required"
          | "invalidEmail"
          | "tooShort";
    }
    return { status: "error", fieldErrors };
  }
  if (parsed.data.website) return { status: "success" }; // bot: pretend success

  try {
    await new Promise((r) => setTimeout(r, 500));
    console.info("[contact] new request", {
      ...parsed.data,
      receivedAt: new Date().toISOString(),
    });
    return { status: "success" };
  } catch {
    return { status: "failed" };
  }
}
