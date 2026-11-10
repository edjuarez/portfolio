import { useState } from 'react'
import './App.css'
import { Hero } from './components/Hero/Hero.jsx'
import { About } from './components/About/About.jsx'
import {Contact} from './components/Contact/Contact'
import { MyWork } from './components/MyWork/MyWork'
import { Navbar } from './components/Navbar/Navbar'
import { Footer } from './components/Footer/Footer'
import SpaceCursor from './components/ui/SpaceCursor/SpaceCursor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <SpaceCursor />
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
