import { useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";

// A browser can't send mail — SMTP needs a credential — so this posts to
// Web3Forms, which holds the mail credential and relays to the inbox that
// created the access key.
//
// The key travels in the request body and is visible in the Network tab.
// That is how Web3Forms is designed to work: their free tier rejects
// server-to-server calls outright (403, "use our API in client side"), so
// proxying it through a serverless function to hide the key is not an
// option here. It's a public identifier, not a secret — the only thing it
// can do in the wrong hands is deliver mail to that same inbox, which is
// what the honeypot and the length caps below are guarding against.
const ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const EMPTY = { name: "", email: "", message: "" };
const LIMITS = { name: 80, email: 120, message: 2000 };

// Deliberately loose: the real check is the reply landing or not.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "Your name, please.";
  if (!email.trim()) errors.email = "An email I can reply to.";
  else if (!EMAIL_RE.test(email.trim())) errors.email = "That address looks off.";
  if (!message.trim()) errors.message = "Tell me what you need.";
  else if (message.trim().length < 10) errors.message = "A little more detail?";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [failure, setFailure] = useState("");

  const update = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    // Clear the error the moment they start fixing it, not on next submit.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  async function onSubmit(event) {
    event.preventDefault();
    if (status === "sending") return;

    // Honeypot: a field positioned off-screen that humans never see and
    // never fill. Anything in it is a bot, so drop it and show success —
    // a visible rejection just teaches the bot to try again.
    if (event.target.company.value) {
      setStatus("sent");
      return;
    }

    const found = validate(values);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    if (!ACCESS_KEY) {
      setStatus("error");
      setFailure("The form isn't configured yet — email me directly below.");
      return;
    }

    setStatus("sending");
    setFailure("");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio enquiry from ${values.name.trim()}`,
          from_name: "Portfolio",
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          botcheck: false,
        }),
      });

      // Read once as text, then parse. Going straight to .json() and
      // swallowing the throw hides what actually came back when it fails.
      const raw = await response.text();
      let result = null;
      try {
        result = JSON.parse(raw);
      } catch {
        console.error("[contact] non-JSON response", response.status, raw.slice(0, 300));
      }

      if (response.ok && result?.success) {
        setStatus("sent");
        setValues(EMPTY);
      } else {
        console.error("[contact] Web3Forms rejected the submission", response.status, result);
        setStatus("error");
        setFailure("That didn't go through. Try again, or email me directly.");
      }
    } catch {
      setStatus("error");
      setFailure("Network trouble — check your connection, or email me directly.");
    }
  }

  if (status === "sent") {
    return (
      <div className="contact-form contact-form-sent" role="status">
        <span className="form-sent-mark" aria-hidden="true">
          <Check size={20} strokeWidth={2.5} />
        </span>
        <p className="font-display text-2xl">That's with me.</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          I read everything that lands and usually reply within a day or two.
        </p>
        <button type="button" className="form-reset" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      {/* Off-screen, tab-skipped, autocomplete-proof. Bots fill it; people don't. */}
      <input
        type="text"
        name="company"
        className="form-honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="form-row">
        <Field
          id="cf-name"
          label="Name"
          value={values.name}
          onChange={update("name")}
          error={errors.name}
          maxLength={LIMITS.name}
          autoComplete="name"
          disabled={sending}
        />
        <Field
          id="cf-email"
          label="Email"
          type="email"
          value={values.email}
          onChange={update("email")}
          error={errors.email}
          maxLength={LIMITS.email}
          autoComplete="email"
          disabled={sending}
        />
      </div>

      <Field
        id="cf-message"
        label="What do you need?"
        as="textarea"
        rows={5}
        value={values.message}
        onChange={update("message")}
        error={errors.message}
        maxLength={LIMITS.message}
        disabled={sending}
      />

      <div className="form-foot">
        <button type="submit" className="btn-primary" disabled={sending}>
          {sending ? (
            <>
              <Loader2 size={16} strokeWidth={2.25} className="form-spin" />
              Sending
            </>
          ) : (
            <>
              Send it over
              <ArrowUpRight size={16} strokeWidth={2.25} />
            </>
          )}
        </button>
        {status === "error" && (
          <p className="form-failure" role="alert">
            {failure}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({ id, label, as = "input", error, ...rest }) {
  const Tag = as;
  return (
    <p className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <Tag
        id={id}
        className={`form-control ${error ? "has-error" : ""}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className="form-error">
          {error}
        </span>
      )}
    </p>
  );
}
