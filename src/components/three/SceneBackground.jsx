import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A full-page, scroll-linked Three.js background.
 *
 * A faceted "light crystal" sits at the center of the scene, lit with a
 * moving point light so it visibly shades and glints — that's what makes
 * it read as real 3D rather than a flat animated image. Two thin rings
 * orbit it, a soft glow sprite fakes bloom behind it, and a handful of
 * sparkles drift around it on individual orbits.
 *
 * Everything is tied to scroll progress (0–1 across the whole document):
 * the crystal spins faster, rises, and scales up; the dust motes shift
 * from cool morning tones to warm gold to dusk clay; and the camera
 * drifts and dollies slightly — so the same scene runs continuously
 * behind every section instead of stopping after the hero.
 */
export default function SceneBackground() {
  const mountRef = useRef(null);
  const scrollRef = useRef(0);

  // Track scroll progress in a ref (not state) so we don't trigger
  // React re-renders on every scroll tick — the animate loop reads it.
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
    crystalGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const edgesGeo = new THREE.EdgesGeometry(coreGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x6b4326,
      transparent: true,
      opacity: 0.55,
    });
    crystalGroup.add(new THREE.LineSegments(edgesGeo, edgesMat));

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
    crystalGroup.add(new THREE.Mesh(innerGeo, innerMat));

    const ringGeo = new THREE.TorusGeometry(3.1, 0.02, 8, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc9832a,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;
    crystalGroup.add(ring);

    const ring2Geo = ringGeo.clone();
    const ring2Mat = ringMat.clone();
    ring2Mat.opacity = 0.28;
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3.2;
    ring2.rotation.z = Math.PI / 5;
    ring2.scale.setScalar(0.72);
    crystalGroup.add(ring2);

    crystalGroup.position.set(2.4, 0.4, -2);
    scene.add(crystalGroup);

    // ---- soft glow halo behind the crystal (fakes bloom without post-fx) ----
    const glowTexture = makeRadialTexture(128, [
      [0, "rgba(255,222,158,0.9)"],
      [0.5, "rgba(232,166,61,0.25)"],
      [1, "rgba(232,166,61,0)"],
    ]);
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
    sparkGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(SPARK_COUNT * 3), 3),
    );
    const sparkOrbit = Array.from({ length: SPARK_COUNT }, () => ({
      radius: 2.6 + Math.random() * 1.6,
      speed: 0.3 + Math.random() * 0.6,
      offset: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 1.4,
    }));
    const sparkTexture = makeRadialTexture(32, [
      [0, "rgba(255,255,255,1)"],
      [0.5, "rgba(255,214,140,0.7)"],
      [1, "rgba(255,214,140,0)"],
    ]);
    const sparkMat = new THREE.PointsMaterial({
      size: 0.09,
      map: sparkTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    // ---- dust motes, drifting across the whole page ----
    const moteTexture = makeRadialTexture(64, [
      [0, "rgba(255,246,222,1)"],
      [0.4, "rgba(255,206,128,0.75)"],
      [1, "rgba(255,206,128,0)"],
    ]);
    const MOTE_COUNT = 280;
    const motePositions = new Float32Array(MOTE_COUNT * 3);
    const moteSeeds = new Float32Array(MOTE_COUNT);
    for (let i = 0; i < MOTE_COUNT; i++) {
      motePositions[i * 3] = (Math.random() - 0.5) * 20;
      motePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      motePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      moteSeeds[i] = Math.random() * Math.PI * 2;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(motePositions, 3),
    );
    const moteMat = new THREE.PointsMaterial({
      size: 0.15,
      map: moteTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

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
      const moteAttr = moteGeo.attributes.position;
      for (let i = 0; i < MOTE_COUNT; i++) {
        moteAttr.array[i * 3 + 1] +=
          Math.sin(t * 3 + moteSeeds[i]) * 0.001 * speed;
        moteAttr.array[i * 3] +=
          Math.cos(t * 2 + moteSeeds[i]) * 0.0005 * speed;
      }
      moteAttr.needsUpdate = true;
      motes.rotation.y = t * 0.1 + p * 1.2;

      if (p < 0.5) {
        moteMat.color.copy(colorMorning).lerp(colorMidday, p / 0.5);
      } else {
        moteMat.color.copy(colorMidday).lerp(colorDusk, (p - 0.5) / 0.5);
      }

      // crystal: continuous spin, plus it visibly turns faster & rises with
      // scroll, and tilts toward the cursor for a touch of interactivity
      crystalGroup.rotation.y = t * 0.35 + p * Math.PI * 1.6 + mouseX * 0.65;
      crystalGroup.rotation.x =
        Math.sin(t * 0.4) * 0.15 + p * 0.6 - mouseY * 0.5;
      crystalGroup.rotation.z +=
        (mouseX * 0.22 - crystalGroup.rotation.z) * 0.05;
      crystalGroup.position.y = 0.4 + Math.sin(t * 0.6) * 0.3 - p * 2.4;
      crystalGroup.position.x = 2.4 - p * 1.6;
      const s = (1 + p * 0.35) * (1 + Math.sin(t * 1.1) * 0.02);
      crystalGroup.scale.set(s, s, s);

      ring.rotation.z = t * 0.5;
      ring2.rotation.z = -t * 0.7;

      // light glint orbits the crystal
      glow.position.x = crystalGroup.position.x + Math.cos(t * 1.4) * 3;
      glow.position.y = crystalGroup.position.y + Math.sin(t * 1.4) * 3;
      glow.color.copy(moteMat.color);

      // glow halo follows the crystal, pulses gently, and warms with scroll
      glowSprite.position.set(
        crystalGroup.position.x,
        crystalGroup.position.y,
        crystalGroup.position.z - 0.5,
      );
      const pulse = 8.5 + Math.sin(t * 1.6) * 0.6 + p * 2;
      glowSprite.scale.set(pulse, pulse, 1);
      glowSpriteMat.color.copy(moteMat.color);

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
      camera.position.x += (mouseX * 1.8 - p * 0.8 - camera.position.x) * 0.035;
      camera.position.y +=
        (-mouseY * 1.2 + p * 0.4 - camera.position.y) * 0.035;
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
        ringGeo,
        ring2Geo,
        sparkGeo,
        moteGeo,
      ].forEach((g) => g.dispose());
      [
        coreMat,
        edgesMat,
        innerMat,
        ringMat,
        ring2Mat,
        sparkMat,
        moteMat,
        glowSpriteMat,
      ].forEach((m) => m.dispose());
      [glowTexture, sparkTexture, moteTexture].forEach((tex) => tex.dispose());

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

/** Small helper: a radial-gradient canvas texture used for sprites/points. */
function makeRadialTexture(size, stops) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  stops.forEach(([offset, color]) => grad.addColorStop(offset, color));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
