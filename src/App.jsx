import './App.css'
import { Hero } from './components/Hero/Hero.jsx';
import { About } from './components/About/About.jsx';
import {Contact} from './components/Contact/Contact.jsx';
import { Navbar } from './components/Navbar/Navbar.jsx';
import { Footer } from './components/Footer/Footer.jsx';
import SpaceCursor from './components/ui/SpaceCursor/SpaceCursor.jsx';
import AlienHunt from "./components/ui/AlienHunt/AlienHunt.jsx";
import { MyWork } from "./components/MyWork/MyWork.jsx";

function App() {
  return (
    <>
      <SpaceCursor />
      <AlienHunt />
      <div className="app-background">
        <Navbar />
        <Hero />
        <About />
        {/* <Skills /> */}
        <MyWork />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

export default App
