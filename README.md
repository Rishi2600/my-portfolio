# Portfolio

A personal portfolio built with React + Vite, Tailwind, and a Three.js
background scene. Warm, sunlit palette; scroll-linked animation; placeholder
project cards ready to swap for real case studies.

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
    sections/Projects.jsx      Currently rendering placeholder cards
    sections/Contact.jsx
    ui/Reveal.jsx               Fade/slide-in wrapper used across sections
  hooks/
    useReveal.js                Scroll-into-view detection (IntersectionObserver)
  data/
    skills.js                   Skill chips shown in the Skills section
    projects.js                 Project placeholders — edit this to add real work
    railSections.js              Section ids/labels used by the scroll rail
```

## Personalizing

A few things are placeholder text on purpose:

- **Name** — currently "Your Name" in `Nav.jsx` and `Hero.jsx`.
- **Bio** — the paragraphs in `About.jsx`.
- **Email** — `hello@yourname.com` in `Contact.jsx`.
- **Social links** — the `href="#"` placeholders in `Contact.jsx`.
- **Projects** — edit `src/data/projects.js` to add real project data, then
  update `Projects.jsx` to render whatever fields you add (image, link, tags,
  outcome, etc).

## Design notes

- Colors and fonts are defined as CSS custom properties at the top of
  `src/index.css` — change them there and they propagate everywhere.
- The Three.js scene is scroll-linked: it reads scroll progress (0–1 across
  the whole document) each frame to drive the crystal's rotation/position and
  the dust motes' color, so the same scene runs continuously behind every
  section rather than resetting per section.
- Respects `prefers-reduced-motion`: the 3D scene slows down significantly
  and CSS reveal/float animations are disabled.
