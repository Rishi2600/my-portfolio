import { Mail } from "lucide-react";
import { GithubIcon, XIcon } from "../ui/BrandIcons";
import Reveal from "../ui/Reveal";
import { useMagnetic } from "../../hooks/useMagnetic";

export default function Contact() {
  const emailBtn = useMagnetic();
  const githubLink = useMagnetic(0.5);
  const xLink = useMagnetic(0.5);

  return (
    <section id="contact" className="section-flow">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-36 text-center">
        <Reveal className="font-mono text-xs uppercase tracking-[0.25em] mb-6" style={{ color: "var(--clay)" }}>
          Contact
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-3xl mx-auto">
            Let's build something worth the light.
          </h2>
        </Reveal>
        <Reveal delay={2} className="mt-8">
          <a
            ref={emailBtn.ref}
            onMouseMove={emailBtn.onMouseMove}
            onMouseLeave={emailBtn.onMouseLeave}
            href="mailto:rishiraj6177@gmail.com"
            className="btn-primary magnetic inline-flex"
          >
            <Mail size={16} strokeWidth={2.25} />
            rishiraj6177@gmail.com
          </a>
        </Reveal>
        <Reveal delay={3} className="mt-10 flex items-center justify-center gap-6">
          <a
            ref={githubLink.ref}
            onMouseMove={githubLink.onMouseMove}
            onMouseLeave={githubLink.onMouseLeave}
            href="https://github.com/Rishi2600"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="social-link magnetic"
          >
            <GithubIcon size={20} strokeWidth={1.75} />
          </a>
          <a
            ref={xLink.ref}
            onMouseMove={xLink.onMouseMove}
            onMouseLeave={xLink.onMouseLeave}
            href="https://x.com/secur3shell"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="X"
            className="social-link magnetic"
          >
            <XIcon size={17} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
