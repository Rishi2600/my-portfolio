import Header from "./components/layout/Header"
import Hero from "./components/sections/Hero"
import About from "./components/sections/About"
import Projects from "./components/sections/Projects"
import ContactUs from "./components/sections/ContactUs"
import Footer from "./components/layout/Footer"

function App() {

  return (
    <>
      <div>
        <Header />
        <Hero />
        <About />
        <Projects />
        <ContactUs />
        <Footer />
      </div>
    </>
  )
}

export default App