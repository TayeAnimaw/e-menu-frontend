import { useState } from "react";
import { Link } from "react-router-dom";

const FAQS = [
  {
    question: "How do I add a category and menu items?",
    answer:
      'Go to "Categories" to create a group (e.g. Drinks, Breakfast), then go to "Menu Items" to add dishes, set a price, description, photo and dietary tags under that category.',
  },
  {
    question: "How do customers see my menu?",
    answer:
      "Your menu is published at your public link, shown on the Dashboard (e.g. yoursubdomain.menu.com). Share that link or QR code with your customers.",
  },
  {
    question: "What happens after my free trial ends?",
    answer:
      "Your menu becomes read-only for editing until you subscribe. Choose a plan from the Dashboard — payments are processed securely via Chapa.",
  },
  {
    question: "Can I change my cafe name or photo later?",
    answer:
      'Yes — open "Profile" from the menu in the top-right corner to update your name, cafe name, contact details, password and profile photo at any time.',
  },
  {
    question: "I forgot my password. What do I do?",
    answer:
      'Use the "Forgot password" link on the login page, or contact us and we will help you regain access.',
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Help & FAQs
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Answers to common questions about managing your digital menu.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-ink-100 transition hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-3 p-5 text-left"
              >
                <h3 className="font-display text-base font-semibold text-ink-900">
                  {faq.question}
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isOpen && (
                <p className="px-5 pb-5 text-sm text-ink-500">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-5 text-sm text-brand-800 ring-1 ring-brand-100">
        Still need help? Visit the{" "}
        <Link
          to="/admin/contact"
          className="font-semibold underline-offset-2 hover:underline"
        >
          Contact us
        </Link>{" "}
        page and we'll get back to you.
      </div>
    </div>
  );
}
