"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { sendPressMessage, type ActionState } from "@/app/presskit/actions";

function ErrorText({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-sm text-red-600">{text}</p>;
}

function SuccessBanner({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="rounded-md bg-green-50 border border-green-200 text-green-800 px-4 py-3">
      {text}
    </div>
  );
}

function DangerBanner({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="rounded-md bg-red-50 border border-red-200 text-red-800 px-4 py-3">
      {text}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-semibold px-6 py-3 text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export default function PressContactForm() {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [state, formAction] = useFormState<ActionState, FormData>(
    sendPressMessage,
    { ok: false }
  );

  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4" noValidate>
      {state.ok && <SuccessBanner text={state.message} />}
      {!state.ok && state.errors?._global && (
        <DangerBanner text={state.errors._global} />
      )}

      {/* Honeypot anti-bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label
          className="block text-sm font-medium text-neutral-700"
          htmlFor="name"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
          aria-invalid={!!state.errors?.name}
        />
        <ErrorText text={state.errors?.name} />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-neutral-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={120}
          autoComplete="email"
          inputMode="email"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
          aria-invalid={!!state.errors?.email}
        />
        <ErrorText text={state.errors?.email} />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-neutral-700"
          htmlFor="subject"
        >
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          minLength={4}
          maxLength={120}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
          aria-invalid={!!state.errors?.subject}
        />
        <ErrorText text={state.errors?.subject} />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-neutral-700"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={4000}
          rows={6}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
          aria-invalid={!!state.errors?.message}
        />
        <ErrorText text={state.errors?.message} />
      </div>

      <SubmitButton />
      <p className="text-xs text-neutral-500">
        We store submissions for press coordination only. Do not share sensitive
        information.
      </p>
    </form>
  );
}
