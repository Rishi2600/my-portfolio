import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  // Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  Plus,
  Code2,
  Palette,
  Boxes,
  Server,
  Sparkles,
  PenTool,
  Database,
  Layers,
} from "lucide-react";

/* ----------------------------------------------------------------------
   Hooks
---------------------------------------------------------------------- */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const [ref, visible] = useReveal();
  const delayClass = delay ? `reveal-delay-${delay}` : "";
  return (
    <Tag
      ref={ref}
      className={`reveal ${delayClass} ${visible ? "is-visible" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------------------
   Three.js scene — a full-page, scroll-linked background.

   A faceted "light crystal" sits at the center of the page (lit with a
   moving point light so it visibly shades and glints — the clearest
   signal that this is a real 3D scene, not a flat animation). Dust motes
   drift around it. Both are tied to scroll progress: the crystal rotates
   and rises through the page, the motes shift from cool morning tones to
   warm gold, and the camera drifts slightly — so the same scene runs
   underneath every section instead of stopping after the hero.
---------------------------------------------------------------------- */

function SceneBackground() {
  const mountRef = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    // ---- lighting: this is what makes the crystal read as real 3D ----
    const ambient = new THREE.AmbientLight(0xfff1d8, 0.55);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffe3ad, 1.1);
    sun.position.set(6, 8, 6);
    scene.add(sun);

    const glow = new THREE.PointLight(0xe8a63d, 2.2, 20, 2);
    glow.position.set(-3, 1, 4);
    scene.add(glow);

    // ---- the crystal: low-poly faceted core + glowing edge lines ----
    const crystalGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(2.05, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xe8a63d,
      metalness: 0.15,
      roughness: 0.25,
      flatShading: true,
      transparent: true,
      opacity: 0.42,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    crystalGroup.add(core);

    const edgesGeo = new THREE.EdgesGeometry(coreGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x6b4326,
      transparent: true,
      opacity: 0.55,
    });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    crystalGroup.add(edges);

    const innerGeo = new THREE.IcosahedronGeometry(1.05, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xe8a63d,
      emissiveIntensity: 0.6,
      metalness: 0,
      roughness: 0.4,
      flatShading: true,
      transparent: true,
      opacity: 0.5,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    crystalGroup.add(innerCore);

    const ringGeo = new THREE.TorusGeometry(3.1, 0.02, 8, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc9832a,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;
    crystalGroup.add(ring);

    const ring2 = new THREE.Mesh(ringGeo.clone(), ringMat.clone());
    ring2.rotation.x = Math.PI / 3.2;
    ring2.rotation.z = Math.PI / 5;
    ring2.scale.setScalar(0.72);
    ring2.material.opacity = 0.28;
    crystalGroup.add(ring2);

    crystalGroup.position.set(2.4, 0.4, -2);
    scene.add(crystalGroup);

    // ---- soft glow halo behind the crystal (fakes bloom without post-fx) ----
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const gctx = glowCanvas.getContext("2d");
    const gGrad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gGrad.addColorStop(0, "rgba(255,222,158,0.9)");
    gGrad.addColorStop(0.5, "rgba(232,166,61,0.25)");
    gGrad.addColorStop(1, "rgba(232,166,61,0)");
    gctx.fillStyle = gGrad;
    gctx.fillRect(0, 0, 128, 128);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowSpriteMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(glowSpriteMat);
    glowSprite.scale.set(9, 9, 1);
    scene.add(glowSprite);

    // ---- sparkles orbiting the crystal ----
    const SPARK_COUNT = 46;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(SPARK_COUNT * 3);
    const sparkOrbit = [];
    for (let i = 0; i < SPARK_COUNT; i++) {
      sparkOrbit.push({
        radius: 2.6 + Math.random() * 1.6,
        speed: 0.3 + Math.random() * 0.6,
        offset: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 1.4,
      });
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.09,
      map: spriteTexture0(),
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    function spriteTexture0() {
      const c = document.createElement("canvas");
      c.width = 32;
      c.height = 32;
      const cx = c.getContext("2d");
      const g = cx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.5, "rgba(255,214,140,0.7)");
      g.addColorStop(1, "rgba(255,214,140,0)");
      cx.fillStyle = g;
      cx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(c);
    }

    // ---- dust motes, drifting across the whole page ----
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,246,222,1)");
    grad.addColorStop(0.4, "rgba(255,206,128,0.75)");
    grad.addColorStop(1, "rgba(255,206,128,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);

    const COUNT = 280;
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      map: spriteTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const colorMorning = new THREE.Color(0x9fb8c9);
    const colorMidday = new THREE.Color(0xffce80);
    const colorDusk = new THREE.Color(0xc97b4a);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouse = (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", handleMouse);

    let frameId;
    let t = 0;
    const speed = prefersReduced ? 0.12 : 1;

    const animate = () => {
      t += 0.006 * speed;
      const p = scrollRef.current;

      // motes drift + shift color across the page's "time of day"
      const posAttr = geometry.attributes.position;
      for (let i = 0; i < COUNT; i++) {
        posAttr.array[i * 3 + 1] += Math.sin(t * 3 + seeds[i]) * 0.001 * speed;
        posAttr.array[i * 3] += Math.cos(t * 2 + seeds[i]) * 0.0005 * speed;
      }
      posAttr.needsUpdate = true;
      points.rotation.y = t * 0.1 + p * 1.2;

      if (p < 0.5) {
        material.color.copy(colorMorning).lerp(colorMidday, p / 0.5);
      } else {
        material.color.copy(colorMidday).lerp(colorDusk, (p - 0.5) / 0.5);
      }

      // crystal: continuous spin, plus it visibly turns faster & rises with scroll,
      // and tilts toward the cursor for a touch of direct interactivity
      crystalGroup.rotation.y = t * 0.35 + p * Math.PI * 1.6 + mouseX * 0.4;
      crystalGroup.rotation.x =
        Math.sin(t * 0.4) * 0.15 + p * 0.6 - mouseY * 0.3;
      crystalGroup.rotation.z +=
        (mouseX * 0.15 - crystalGroup.rotation.z) * 0.03;
      crystalGroup.position.y = 0.4 + Math.sin(t * 0.6) * 0.3 - p * 2.4;
      crystalGroup.position.x = 2.4 - p * 1.6;
      const s = (1 + p * 0.35) * (1 + Math.sin(t * 1.1) * 0.02);
      crystalGroup.scale.set(s, s, s);

      ring.rotation.z = t * 0.5;
      ring2.rotation.z = -t * 0.7;

      // light glint orbits the crystal
      glow.position.x = crystalGroup.position.x + Math.cos(t * 1.4) * 3;
      glow.position.y = crystalGroup.position.y + Math.sin(t * 1.4) * 3;
      glow.color.copy(material.color);

      // glow halo follows the crystal, pulses gently, and warms with scroll
      glowSprite.position.set(
        crystalGroup.position.x,
        crystalGroup.position.y,
        crystalGroup.position.z - 0.5,
      );
      const pulse = 8.5 + Math.sin(t * 1.6) * 0.6 + p * 2;
      glowSprite.scale.set(pulse, pulse, 1);
      glowSprite.material.color.copy(material.color);

      // sparkles orbit the crystal on individual paths
      const sparkAttr = sparkGeo.attributes.position;
      for (let i = 0; i < SPARK_COUNT; i++) {
        const o = sparkOrbit[i];
        const a = t * o.speed + o.offset;
        sparkAttr.array[i * 3] =
          crystalGroup.position.x + Math.cos(a) * o.radius;
        sparkAttr.array[i * 3 + 1] =
          crystalGroup.position.y +
          Math.sin(a) * o.radius * 0.4 +
          Math.sin(a * 2) * o.tilt;
        sparkAttr.array[i * 3 + 2] =
          crystalGroup.position.z + Math.sin(a) * o.radius;
      }
      sparkAttr.needsUpdate = true;

      // gentle camera drift + scroll dolly, plus mouse parallax
      camera.position.x += (mouseX * 1.1 - p * 0.8 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.7 + p * 0.4 - camera.position.y) * 0.02;
      camera.position.z = 9 - p * 1.5;
      camera.lookAt(0.6, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      [
        coreGeo,
        edgesGeo,
        innerGeo,
        geometry,
        ringGeo,
        ring2.geometry,
        sparkGeo,
      ].forEach((g) => g.dispose());
      [
        coreMat,
        edgesMat,
        innerMat,
        material,
        ringMat,
        ring2.material,
        sparkMat,
        glowSpriteMat,
      ].forEach((m) => m.dispose());
      spriteTexture.dispose();
      glowTexture.dispose();
      sparkMat.map && sparkMat.map.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="scene-bg">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="scene-vignette" />
    </div>
  );
}

/* ----------------------------------------------------------------------
   Scroll rail — a single line that runs the length of the page with a
   moving marker, so the sections read as one continuous path rather
   than separate stacked screens.
---------------------------------------------------------------------- */

const RAIL_SECTIONS = [
  { id: "top", label: "Start" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

function ScrollRail() {
  const dotRef = useRef(null);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (dotRef.current) dotRef.current.style.top = `${p * 100}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = RAIL_SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0, rootMargin: "-45% 0px -45% 0px" },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return (
    <div className="rail hidden lg:flex">
      <div className="rail-track">
        <div ref={dotRef} className="rail-dot" />
      </div>
      <div className="rail-ticks">
        {RAIL_SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`rail-tick ${active === id ? "is-active" : ""}`}
          >
            <span className="rail-tick-mark" />
            <span className="rail-tick-label font-mono">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------
   Data (placeholders — swap freely)
---------------------------------------------------------------------- */

const SKILLS = [
  { label: "React", icon: Code2 },
  { label: "Three.js / WebGL", icon: Boxes },
  { label: "TypeScript", icon: Layers },
  { label: "UI Design", icon: Palette },
  { label: "Motion & Interaction", icon: Sparkles },
  { label: "Node.js", icon: Server },
  { label: "Design Systems", icon: PenTool },
  { label: "APIs & Data", icon: Database },
];

const PROJECTS = [1, 2, 3, 4];

/* ----------------------------------------------------------------------
   Page sections
---------------------------------------------------------------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["About", "#about"],
    ["Work", "#work"],
    ["Skills", "#skills"],
    ["Contact", "#contact"],
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-scrolled" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-20">
        <a
          href="#top"
          className="font-display text-xl tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          Your Name<span style={{ color: "var(--amber-deep)" }}>.</span>
        </a>
        <nav className="hidden md:flex items-center gap-9 font-mono text-xs uppercase tracking-widest">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="nav-link">
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="btn-ghost hidden md:inline-flex">
          Say hello
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-end overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pb-24 pt-40 w-full">
        <Reveal
          className="font-mono text-xs uppercase tracking-[0.25em] mb-6"
          style={{ color: "var(--clay)" }}
        >
          Portfolio — {new Date().getFullYear()}
        </Reveal>
        <Reveal delay={1}>
          <h1 className="font-display leading-[0.98] text-[13vw] md:text-[6.2vw] tracking-tight max-w-4xl">
            Hi, I'm{" "}
            <em className="italic" style={{ color: "var(--amber-deep)" }}>
              Your Name
            </em>
            .
            <br />I build interfaces that feel like sunlight through a window.
          </h1>
        </Reveal>
        <Reveal
          delay={2}
          className="mt-8 max-w-lg text-lg"
          style={{ color: "var(--muted)" }}
        >
          Frontend developer &amp; designer, working somewhere between clean
          code and warm, considered detail. Based in Delhi.
        </Reveal>
        <Reveal delay={3} className="mt-10 flex flex-wrap gap-4">
          <a href="#work" className="btn-primary">
            See my work
            <ArrowUpRight size={16} strokeWidth={2.25} />
          </a>
          <a href="#contact" className="btn-outline">
            Get in touch
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section
      id="about"
      className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-36"
    >
      <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-14 md:gap-20 items-start">
        <Reveal>
          <div className="about-portrait animate-float">
            <span
              className="font-display text-6xl"
              style={{ color: "var(--surface)" }}
            >
              YN
            </span>
          </div>
        </Reveal>
        <div>
          <Reveal
            className="font-mono text-xs uppercase tracking-[0.25em] mb-5"
            style={{ color: "var(--clay)" }}
          >
            About
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
              I like rooms with good light and interfaces with good pacing.
            </h2>
          </Reveal>
          <Reveal
            delay={2}
            className="space-y-4 text-base md:text-lg"
            style={{ color: "var(--muted)" }}
          >
            <p>
              This paragraph is a placeholder — swap it for a short, honest bio.
              A few sentences on how you got into building things, what kind of
              problems you enjoy, and the tools you reach for first.
            </p>
            <p>
              Mention a value or two that shapes your work — clarity, craft,
              curiosity — and back it up with a specific example once your
              project section is filled in.
            </p>
          </Reveal>
          <Reveal
            delay={3}
            className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-10 pt-8 fact-row"
          >
            {[
              ["Based in", "Delhi, India"],
              ["Focus", "Web & Interaction"],
              ["Currently", "Open to work"],
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  className="font-mono text-[11px] uppercase tracking-widest mb-1"
                  style={{ color: "var(--clay)" }}
                >
                  {k}
                </div>
                <div className="font-display text-lg">{v}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section-flow">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <Reveal
          className="font-mono text-xs uppercase tracking-[0.25em] mb-5"
          style={{ color: "var(--clay)" }}
        >
          What I work with
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-3xl md:text-4xl mb-12 max-w-xl">
            A toolkit built for clean code and considered detail.
          </h2>
        </Reveal>
        <div className="flex flex-wrap gap-3">
          {SKILLS.map(({ label, icon: Icon }, i) => (
            <Reveal key={label} delay={(i % 3) + 1} className="skill-chip">
              <Icon size={15} strokeWidth={2} />
              {label}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section
      id="work"
      className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-36"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <Reveal
            className="font-mono text-xs uppercase tracking-[0.25em] mb-5"
            style={{ color: "var(--clay)" }}
          >
            Selected work
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Projects, landing soon.
            </h2>
          </Reveal>
        </div>
        <Reveal
          delay={2}
          className="max-w-sm text-sm"
          style={{ color: "var(--muted)" }}
        >
          These four slots are placeholders for the design pass. Once the look
          is approved, real case studies — image, brief, outcome, link — will
          replace each card below.
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {PROJECTS.map((n) => (
          <Reveal key={n} delay={(n % 3) + 1} className="project-card">
            <div className="flex items-center justify-between mb-16">
              <span
                className="font-mono text-xs tracking-widest"
                style={{ color: "var(--clay)" }}
              >
                PLACEHOLDER
              </span>
              <span className="project-plus">
                <Plus size={16} strokeWidth={2} />
              </span>
            </div>
            <h3 className="font-display text-2xl mb-2">Project title {n}</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Case study coming soon.
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section-flow">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-36 text-center">
        <Reveal
          className="font-mono text-xs uppercase tracking-[0.25em] mb-6"
          style={{ color: "var(--clay)" }}
        >
          Contact
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-3xl mx-auto">
            Let's build something worth the light.
          </h2>
        </Reveal>
        <Reveal delay={2} className="mt-8">
          <a
            href="mailto:hello@yourname.com"
            className="btn-primary inline-flex"
          >
            <Mail size={16} strokeWidth={2.25} />
            hello@yourname.com
          </a>
        </Reveal>
        <Reveal
          delay={3}
          className="mt-10 flex items-center justify-center gap-6"
        >
          {/* <a href="#" aria-label="GitHub" className="social-link">
            <Github size={20} strokeWidth={1.75} />
          </a> */}
          <a href="#" aria-label="LinkedIn" className="social-link">
            <Linkedin size={20} strokeWidth={1.75} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs"
      style={{ color: "var(--muted)" }}
    >
      <span>© {new Date().getFullYear()} Your Name.</span>
      <span>Built with React &amp; Three.js.</span>
    </footer>
  );
}

/* ----------------------------------------------------------------------
   Root
---------------------------------------------------------------------- */

export default function Portfolio() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="portfolio-root">
      <style>{`
        .portfolio-root {
          --bg: #FBF6EC;
          --surface: #FFFDF8;
          --ink: #2A2117;
          --muted: #6E6153;
          --amber: #E8A63D;
          --amber-deep: #C9832A;
          --sage: #74886A;
          --clay: #9C5B34;
          --line: rgba(42,33,23,0.14);
          background: var(--bg);
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .portfolio-root .font-display { font-family: 'Fraunces', serif; }
        .portfolio-root .font-mono { font-family: 'JetBrains Mono', monospace; }

        /* the 3D scene sits fixed behind the whole page, not just the hero */
        .scene-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(65% 55% at 80% 12%, rgba(232,166,61,0.28), rgba(232,166,61,0) 70%),
            radial-gradient(45% 40% at 10% 90%, rgba(116,136,106,0.14), rgba(116,136,106,0) 70%),
            linear-gradient(180deg, #FDF9EF 0%, var(--bg) 45%, var(--bg) 100%);
        }
        .scene-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(120% 90% at 50% 30%, rgba(251,246,236,0) 55%, rgba(251,246,236,0.9) 100%);
        }

        .portfolio-root > .relative.z-10 { position: relative; z-index: 10; }

        .nav-scrolled {
          background: rgba(251,246,236,0.7);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--line);
        }
        .nav-link {
          color: var(--muted);
          transition: color 0.25s ease;
          position: relative;
        }
        .nav-link:hover { color: var(--ink); }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--ink);
          color: var(--bg);
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 14px 24px;
          border-radius: 999px;
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .btn-primary:hover { background: var(--amber-deep); transform: translateY(-2px); }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line);
          color: var(--ink);
          font-weight: 600;
          font-size: 14px;
          padding: 14px 24px;
          border-radius: 999px;
          backdrop-filter: blur(10px);
          background: rgba(255,253,248,0.35);
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .btn-outline:hover { border-color: var(--clay); background: rgba(156,91,52,0.1); }

        .btn-ghost {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border: 1px solid var(--line);
          padding: 10px 18px;
          border-radius: 999px;
          transition: background 0.3s ease;
        }
        .btn-ghost:hover { background: rgba(42,33,23,0.05); }

        /* no boxed backgrounds between sections — the same scene runs behind
           everything, so sections separate by spacing and the rail, not color */
        .section-flow {
          position: relative;
        }
        .section-flow::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(90%, 1152px);
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--line) 20%, var(--line) 80%, transparent);
        }

        /* the rail: a single thread running the height of the viewport, with
           a marker that travels down it as you scroll and ticks per section —
           the literal thing that "joins" the page together */
        .rail {
          position: fixed;
          left: 28px;
          top: 0;
          bottom: 0;
          z-index: 40;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .rail-track {
          position: relative;
          width: 1px;
          height: min(58vh, 460px);
          background: linear-gradient(180deg, rgba(232,166,61,0.15), var(--clay) 45%, rgba(116,136,106,0.35));
        }
        .rail-dot {
          position: absolute;
          left: 50%;
          top: 0;
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--amber-deep);
          box-shadow: 0 0 0 4px rgba(232,166,61,0.25), 0 0 16px rgba(232,166,61,0.6);
          transform: translate(-50%, -50%);
          transition: top 0.1s linear;
        }
        .rail-ticks {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: min(58vh, 460px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: auto;
        }
        .rail-tick {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 0;
        }
        .rail-tick-mark {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: var(--line);
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .rail-tick-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--muted);
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          white-space: nowrap;
        }
        .rail-tick:hover .rail-tick-label,
        .rail-tick.is-active .rail-tick-label { opacity: 1; transform: translateX(0); }
        .rail-tick.is-active .rail-tick-mark {
          background: var(--amber-deep);
          transform: scale(1.6);
        }

        .about-portrait {
          aspect-ratio: 4 / 5;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(120% 100% at 20% 0%, rgba(255,255,255,0.25), rgba(255,255,255,0) 55%),
            linear-gradient(160deg, var(--amber) 0%, var(--clay) 55%, #6b4326 100%);
          box-shadow: 0 30px 60px -25px rgba(42,33,23,0.35);
        }

        .fact-row { border-top: 1px solid var(--line); }

        .skill-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,253,248,0.55);
          backdrop-filter: blur(8px);
          border: 1px solid var(--line);
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
        }
        .skill-chip:hover {
          border-color: var(--amber-deep);
          background: rgba(232,166,61,0.16);
          transform: translateY(-3px);
        }

        .project-card {
          border: 1px dashed var(--line);
          border-radius: 20px;
          padding: 28px;
          background: rgba(255,253,248,0.5);
          backdrop-filter: blur(10px);
          transition: border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
        }
        .project-card:hover {
          border-color: var(--amber-deep);
          border-style: solid;
          transform: translateY(-4px);
          box-shadow: 0 24px 48px -28px rgba(42,33,23,0.28);
        }
        .project-plus {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--clay);
          transition: background 0.3s ease, color 0.3s ease;
        }
        .project-card:hover .project-plus { background: var(--amber); color: var(--ink); border-color: var(--amber); }

        .social-link {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          background: rgba(255,253,248,0.4);
          transition: background 0.3s ease, transform 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        .social-link:hover { background: var(--ink); color: var(--bg); transform: translateY(-3px); }

        .reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1.is-visible { transition-delay: 0.08s; }
        .reveal-delay-2.is-visible { transition-delay: 0.16s; }
        .reveal-delay-3.is-visible { transition-delay: 0.24s; }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        .animate-float { animation: float 7s ease-in-out infinite; }

        a:focus-visible, button:focus-visible { outline: 2px solid var(--clay); outline-offset: 3px; border-radius: 6px; }

        @media (prefers-reduced-motion: reduce) {
          .reveal { transition: none; opacity: 1; transform: none; }
          .animate-float { animation: none; }
        }
      `}</style>

      <SceneBackground />
      <ScrollRail />

      <div className="relative z-10">
        <Nav />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
