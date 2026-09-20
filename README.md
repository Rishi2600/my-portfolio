# Portfolio

Rishi's personal portfolio — React + Vite, Tailwind, and a Three.js background
scene. Warm, sunlit palette, scroll-linked animation, and four real case
studies.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

Other commands:

```bash
npm run build     # production build, output to dist/
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  App.jsx                     Assembles the page from sections
  index.css                   Design tokens (colors, fonts) + all custom CSS
  components/
    three/SceneBackground.jsx The Three.js scene (crystal, particles, sparkles)
    layout/Nav.jsx             Top navigation
    layout/ScrollRail.jsx      The scroll-progress rail down the left edge
    layout/Footer.jsx
    sections/Hero.jsx
    sections/About.jsx
    sections/Skills.jsx
    sections/Projects.jsx      Case-study cards
    sections/Contact.jsx
    sections/ContactForm.jsx   Contact form, relayed to email via Web3Forms
    ui/Reveal.jsx               Fade/slide-in wrapper used across sections
  hooks/
    useReveal.js                Scroll-into-view detection (IntersectionObserver)
  data/
    skills.js                   Skill chips shown in the Skills section
    projects.js                 Case studies — title, blurb, stack, live + code links
    railSections.js              Section ids/labels used by the scroll rail
```

## Contact form

There is no backend. A browser can't send mail — SMTP needs a credential — so
`sections/ContactForm.jsx` posts to [Web3Forms](https://web3forms.com), which
holds the mail credential and relays to the inbox that created the key:

```
ContactForm.jsx  ──►  Web3Forms  ──►  inbox
   (browser)           (relay)
 access_key + fields
```

To set it up:

1. Get a free access key at [web3forms.com](https://web3forms.com) — enter the
   destination email and the key is mailed to you.
2. `cp .env.example .env.local` and set `VITE_WEB3FORMS_KEY`.
3. Set the same variable in Vercel → Settings → Environment Variables, then
   redeploy. `VITE_` vars are inlined at build time, so a redeploy is required.

Without the key the form still renders and validates, but tells the visitor to
use the direct email link instead.

### On the key being public

It is visible in the bundle and in the Network tab, and that is unavoidable on
the free tier: Web3Forms rejects server-to-server calls with
`403 — "use our API in client side"`, so putting it behind a serverless proxy
does not work. Hiding it requires either their Pro plan (server IP allowlist)
or a relay built for server-side use, such as Resend.

The exposure is bounded — the key only ever delivers to the address that
created it, so spam is the realistic threat rather than exfiltration. Hence the
off-screen honeypot and the length caps. A filled honeypot is answered with a
success response and then dropped, since a visible rejection just tells the bot
to try again. If it does get abused, Web3Forms supports hCaptcha.

## Editing content

Copy lives next to the thing it renders:

- **Projects** — `src/data/projects.js`. Each entry takes `kind`, `title`,
  `description`, `stack`, `live` and `code`; `Projects.jsx` renders all of them,
  so adding a fifth project is a data-only change.
- **Skills** — `src/data/skills.js`, each chip a `{ label, icon }` pair using a
  [lucide](https://lucide.dev) icon.
- **Bio and the facts row** — `About.jsx`.
- **Name and headline** — `Nav.jsx`, `Hero.jsx`, `Footer.jsx`, plus the
  `<title>` and meta description in `index.html`.
- **Email and socials** — `Contact.jsx`. GitHub and X marks are hand-rolled
  SVGs in `ui/BrandIcons.jsx`, since lucide dropped brand logos.

## Design notes

- Colors and fonts are defined as CSS custom properties at the top of
  `src/index.css` — change them there and they propagate everywhere.
- The Three.js scene is scroll-linked: it reads scroll progress (0–1 across
  the whole document) each frame to drive the crystal's rotation/position and
  the dust motes' color, so the same scene runs continuously behind every
  section rather than resetting per section.
- Respects `prefers-reduced-motion`: the 3D scene slows down significantly
  and CSS reveal/float animations are disabled.
