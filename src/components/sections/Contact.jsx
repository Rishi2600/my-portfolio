import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import Reveal from "../ui/Reveal";
import { useMagnetic } from "../../hooks/useMagnetic";

export default function Contact() {
  const emailBtn = useMagnetic();
  const githubLink = useMagnetic(0.5);
  const linkedinLink = useMagnetic(0.5);

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
            href="mailto:hello@yourname.com"
            className="btn-primary magnetic inline-flex"
          >
            <Mail size={16} strokeWidth={2.25} />
            hello@yourname.com
          </a>
        </Reveal>
        <Reveal delay={3} className="mt-10 flex items-center justify-center gap-6">
          <a
            ref={githubLink.ref}
            onMouseMove={githubLink.onMouseMove}
            onMouseLeave={githubLink.onMouseLeave}
            href="#"
            aria-label="GitHub"
            className="social-link magnetic"
          >
            <GithubIcon size={20} strokeWidth={1.75} />
          </a>
          <a
            ref={linkedinLink.ref}
            onMouseMove={linkedinLink.onMouseMove}
            onMouseLeave={linkedinLink.onMouseLeave}
            href="#"
            aria-label="LinkedIn"
            className="social-link magnetic"
          >
            <LinkedinIcon size={20} strokeWidth={1.75} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
