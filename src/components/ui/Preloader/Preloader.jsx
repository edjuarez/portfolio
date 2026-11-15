
import { useEffect, useState } from 'react'
import './Preloader.css'

export const Preloader = () => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const startTime = Date.now()

    const finishLoading = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 900 - elapsed)

      setTimeout(() => {
        setVisible(false)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      finishLoading()
    } else {
      window.addEventListener('load', finishLoading, { once: true })
    }

    return () => {
      window.removeEventListener('load', finishLoading)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="preloader-spinner" />
        <span className="preloader-text">LOADING</span>
      </div>
    </div>
  )
}
