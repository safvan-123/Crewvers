"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, MessageCircle, Check } from "lucide-react";
import { company as defaultCompany, services as defaultServices } from "../lib/content";
import Link from "next/link";
import {
  localDate,
  validateEnquiry,
  enquiryMessage,
  enquiryLink,
} from "../lib/enquiry.mjs";
const initial = {
  name: "",
  mobile: "",
  email: "",
  service: "",
  date: "",
  location: "",
  requirements: "",
};
export default function ContactForm({company = defaultCompany, services = defaultServices}: {company?: typeof defaultCompany; services?: typeof defaultServices}) {
  const [data, setData] = useState(initial),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [draft, setDraft] = useState(""),
    [link, setLink] = useState(""),
    [today, setToday] = useState(""),
    [copied, setCopied] = useState(false),
    [channel, setChannel] = useState("email");
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    setToday(localDate());
    const id = new URLSearchParams(window.location.search).get("service");
    const service = services.find((s) => s.id === id);
    if (service) setData((d) => ({ ...d, service: service.title }));
  }, [services]);
  function change(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setDraft("");
    setLink("");
    setCopied(false);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const issues = validateEnquiry(data);
    setErrors(issues);
    if (Object.keys(issues).length) {
      setTimeout(
        () =>
          form.current
            ?.querySelector<HTMLElement>('[aria-invalid="true"]')
            ?.focus(),
        0,
      );
      return;
    }
    const msg = enquiryMessage(data);
    setDraft(msg);
    setLink(enquiryLink(company, msg, channel));
    setCopied(false);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
    } catch {
      setCopied(false);
      form.current?.querySelector<HTMLElement>(".draft-preview")?.focus();
    }
  }
  function input(
    name: keyof typeof initial,
    label: string,
    type = "text",
    optional = false,
  ) {
    return (
      <div className="field">
        <label htmlFor={name}>
          {label}
          {optional && <span> (optional)</span>}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={data[name]}
          onChange={change}
          maxLength={name === "name" ? 100 : name === "location" ? 150 : 100}
          min={type === "date" ? today : undefined}
          autoComplete={
            name === "name"
              ? "name"
              : name === "mobile"
                ? "tel"
                : name === "email"
                  ? "email"
                  : "off"
          }
          inputMode={name === "mobile" ? "tel" : undefined}
          required={!optional}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {errors[name] && (
          <span className="field-error" id={`${name}-error`}>
            {errors[name]}
          </span>
        )}
      </div>
    );
  }
  return (
    <form id="enquiry-form" className="contact-form" ref={form} noValidate onSubmit={submit}>
      <div className="form-heading">
        <span>YOUR NEXT PRODUCTION</span>
        <h2>Let’s find your crew.</h2>
      </div>
      <div className="form-grid">
        {input("name", "Full name")}
        {input("mobile", "Mobile number", "tel")}
        {input("email", "Email address", "email", true)}
        <div className="field">
          <label htmlFor="service">Service required</label>
          <select
            id="service"
            name="service"
            value={data.service}
            onChange={change}
            required
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "service-error" : undefined}
          >
            <option value="">Choose a service</option>
            {services.map((s) => (
              <option key={s.id}>{s.title}</option>
            ))}
            <optgroup label="Entertainment Roles">{services.find((s) => s.id === "entertainment")?.roles.map((role) => <option key={role}>{role}</option>)}</optgroup>
            <option>Multiple services / Help me choose</option>
          </select>
          {errors.service && (
            <span id="service-error" className="field-error">
              {errors.service}
            </span>
          )}
        </div>
        {input("date", "Event / production date", "date", true)}
        {input("location", "City / location")}
        <div className="field full">
          <label htmlFor="requirements">Additional requirements</label>
          <textarea
            id="requirements"
            name="requirements"
            value={data.requirements}
            onChange={change}
            rows={5}
            maxLength={2000}
            required
            placeholder="Tell us about your event, crew roles, expected team size and anything else we should know."
            aria-invalid={!!errors.requirements}
            aria-describedby={
              errors.requirements ? "requirements-error" : undefined
            }
          />
          {errors.requirements && (
            <span id="requirements-error" className="field-error">
              {errors.requirements}
            </span>
          )}
        </div>
        {company.whatsappConfirmed && (
          <div className="field full">
            <label htmlFor="channel">Prepare enquiry for</label>
            <select
              id="channel"
              value={channel}
              onChange={(e) => {
                setChannel(e.target.value);
                setDraft("");
                setLink("");
              }}
            >
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        )}
      </div>
      <button className="button yellow form-submit" type="submit">
        Prepare Enquiry <ArrowUpRight size={19} />
      </button>
      <p className="form-notice">
        Review your message, then continue to your{" "}
        {channel === "whatsapp" ? "WhatsApp" : "email"} app to send it. This
        website does not save your details or confirm a booking.
      </p>
      <p className="enquiry-policy-links">Before confirming a booking, review our <Link href="/terms">Terms</Link>, <Link href="/payment-policy">Payment Policy</Link> and <Link href="/cancellation-refund-policy">Cancellation Policy</Link>.</p>
      {draft && (
        <div className="enquiry-result" aria-live="polite">
          <p>
            Your enquiry message is ready. Open your{" "}
            {channel === "whatsapp" ? "WhatsApp" : "email"} app and send it to
            CREWVERSE.
          </p>
          <a
            href={link}
            className="button yellow"
            {...(channel === "whatsapp"
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {channel === "whatsapp" ? (
              <MessageCircle size={17} />
            ) : (
              <Mail size={17} />
            )}
            Continue to {channel === "whatsapp" ? "WhatsApp" : "Email"}{" "}
            <ArrowUpRight size={17} />
          </a>
          <details open>
            <summary>Review your message</summary>
            <pre className="draft-preview" tabIndex={0}>
              {draft}
            </pre>
          </details>
          <button type="button" className="copy-button" onClick={copy}>
            {copied ? <Check size={15} /> : <Mail size={15} />}{" "}
            {copied ? "Message copied" : "Copy message"}
          </button>
          <small>
            If an email app is not configured, copy the message and send it to{" "}
            {company.email} using your usual email service.
          </small>
        </div>
      )}
    </form>
  );
}
