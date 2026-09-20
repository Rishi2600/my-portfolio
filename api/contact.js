// Serverless function — runs on Vercel, not in the browser.
//
// The whole reason this file exists: the browser must never carry the
// Web3Forms key. It posts here with just the form fields, and the key gets
// attached on this side, where the Network tab can't reach it. Note the env
// var has no VITE_ prefix, which is what keeps Vite from bundling it.
//
// Everything the client validates is validated again here. Client-side
// checks are a courtesy to the person typing; they are not a control, since
// anyone can POST to this endpoint directly.

const ENDPOINT = "https://api.web3forms.com/submit";
const LIMITS = { name: 80, email: 120, message: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (value) => (typeof value === "string" ? value.trim() : "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  const key = process.env.WEB3FORMS_KEY;
  if (!key) {
    console.error("WEB3FORMS_KEY is not set — contact form cannot deliver.");
    return res.status(500).json({
      success: false,
      message: "The form isn't configured yet — email me directly below.",
    });
  }

  // Vercel parses JSON bodies for us, but a hand-rolled POST might send a
  // string, so cover both rather than trusting the shape.
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, message: "Malformed request." });
    }
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ success: false, message: "Malformed request." });
  }

  // Honeypot. Accept it so the bot has nothing to learn from, then drop it.
  if (str(body.company)) {
    return res.status(200).json({ success: true });
  }

  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);

  if (
    !name ||
    !email ||
    !EMAIL_RE.test(email) ||
    message.length < 10 ||
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message
  ) {
    return res.status(400).json({ success: false, message: "Please check the form and try again." });
  }

  try {
    const upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `Portfolio enquiry from ${name}`,
        from_name: "Portfolio",
        name,
        email,
        message,
      }),
    });

    const result = await upstream.json().catch(() => ({}));

    if (upstream.ok && result.success) {
      return res.status(200).json({ success: true });
    }

    // Don't pass the upstream message through verbatim — it can leak details
    // about the relay that the visitor has no use for.
    console.error("Web3Forms rejected the submission:", result);
    return res.status(502).json({
      success: false,
      message: "That didn't go through. Try again, or email me directly.",
    });
  } catch (error) {
    console.error("Contact relay failed:", error);
    return res.status(502).json({
      success: false,
      message: "That didn't go through. Try again, or email me directly.",
    });
  }
}
