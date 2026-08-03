import SceneBackground from "./components/three/SceneBackground";
import CursorGlow from "./components/ui/CursorGlow";
import ScrollRail from "./components/layout/ScrollRail";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";

export default function App() {
  return (
    <>
      <SceneBackground />
      <CursorGlow />
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
    </>
  );
}
