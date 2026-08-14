import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import './styles/motion.css'
import './styles/project.css'

/**
 * NOTE: StrictMode is intentionally OFF.
 * R3F 8.x + StrictMode double-invokes effects in dev, which can leave the
 * internal rAF loop in a bad state. Re-enable only if the loop is verified.
 */
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
