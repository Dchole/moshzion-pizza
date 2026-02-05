"use client";

import { useActionState } from "react";
import { submitContactForm, ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = {
  success: false
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.success && state.message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">{state.message}</p>
        </div>
      )}

      {state.errors?._form && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{state.errors._form[0]}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-[#5D3A1A] mb-2"
        >
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 border border-[#8B5A2B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent bg-white"
          placeholder="Your name"
          disabled={isPending}
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#5D3A1A] mb-2"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 border border-[#8B5A2B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent bg-white"
          placeholder="your.email@example.com"
          disabled={isPending}
        />
        {state.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-[#5D3A1A] mb-2"
        >
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="w-full px-4 py-3 border border-[#8B5A2B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent bg-white"
          placeholder="What's this about?"
          disabled={isPending}
        />
        {state.errors?.subject && (
          <p className="mt-1 text-sm text-red-600">{state.errors.subject[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-[#5D3A1A] mb-2"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full px-4 py-3 border border-[#8B5A2B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] focus:border-transparent bg-white resize-none"
          placeholder="Tell us how we can help..."
          disabled={isPending}
        />
        {state.errors?.message && (
          <p className="mt-1 text-sm text-red-600">{state.errors.message[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#5D3A1A] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#8B5A2B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>

      <p className="text-sm text-[#8B5A2B]/70 text-center">
        We typically respond within 24 hours
      </p>
    </form>
  );
}
