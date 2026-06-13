import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/AuthLayout";
import SocialLoginButtons from "../../components/SocialLoginButtons";

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 shrink-0 text-brand-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    cafe_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const payload = { ...form };
      if (!payload.email) delete payload.email;
      if (!payload.phone) delete payload.phone;

      await register(payload);
      navigate("/admin");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: ["Something went wrong. Please try again."] });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (field) => errors[field]?.[0];

  return (
    <AuthLayout
      title="Start your free 7-day trial"
      subtitle="Build a beautiful digital menu in minutes — no credit card, no approval needed"
      brandingExtra={
        <ul className="mt-6 space-y-2 text-sm text-ink-700">
          <li className="flex items-center gap-2">
            <CheckIcon /> Unlimited categories & menu items
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon /> Your own link, e.g. mycafe.menu.com
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon /> Photos, prices & dietary tags customers love
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon /> Cancel anytime — plans from 1,000 ETB/month
          </li>
        </ul>
      }
    >
      {errors.general && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
          {errors.general[0]}
        </div>
      )}

      <div className="mt-4 rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 px-3 py-2.5 text-center text-xs font-semibold text-brand-700">
        🎉 7 days free, then from just 1,000 ETB — cancel anytime
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700">
            Your name
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Jane Doe"
          />
          {fieldError("name") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("name")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700">
            Cafe / restaurant name
          </label>
          <input
            name="cafe_name"
            required
            value={form.cafe_name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="My Downtown Cafe"
          />
          {fieldError("cafe_name") && (
            <p className="mt-1 text-xs text-red-600">
              {fieldError("cafe_name")}
            </p>
          )}
          <p className="mt-1 text-xs text-ink-500">
            This determines your menu link, e.g. mydowntowncafe.menu.com
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="you@example.com"
          />
          {fieldError("email") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("email")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700">
            Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="+15551234567"
          />
          {fieldError("phone") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("phone")}</p>
          )}
          <p className="mt-1 text-xs text-ink-500">
            Provide at least an email or a phone number.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="••••••••"
          />
          {fieldError("password") && (
            <p className="mt-1 text-xs text-red-600">
              {fieldError("password")}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700">
            Confirm password
          </label>
          <input
            type="password"
            name="password_confirmation"
            required
            value={form.password_confirmation}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Start my free trial"}
        </button>
      </form>

      <div className="mt-5 flex items-center gap-2 text-xs text-ink-500">
        <div className="h-px flex-1 bg-ink-100" />
        <span>or continue with</span>
        <div className="h-px flex-1 bg-ink-100" />
      </div>

      <SocialLoginButtons />

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-700"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
