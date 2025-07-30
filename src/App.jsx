import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NavigationBar from './components/NavigationBar'
import StartButton from './components/StartButton'
import Form from './components/Form'
import HomePages from './components/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
import Quiz from './components/Quiz'
import About from './components/About'
// Homepage content moved into its own component for clarity
function HomePage() {
  const [buttonClicked, setButtonClicked] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (buttonClicked) {
      const timer = setTimeout(() => {
        navigate('/signup') // You can change this to /signin if desired
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [buttonClicked, navigate])

  return (
    <main className="main-layout">
      <div className="text-content">
        <h1>Welcome to Family Fun Learning!</h1>
        <p>
          A special place where you can learn about families in a fun,
          colorful way. Meet mommy, daddy, grandparents, and all the
          important people who love you!
        </p>
        <div className="features">
          <div className="feature-item">
            <span>🌈</span> Colorful interactive lessons
          </div>
          <div className="feature-item">
            <span>🎵</span> Gentle sounds and music
          </div>
          <div className="feature-item">
            <span>🧩</span> Fun games to learn family roles
          </div>
        </div>
      </div>
      <StartButton onClick={() => setButtonClicked(true)} />
      {buttonClicked && (
        <div className="transition-effect">
          Let's get started! Loading your adventure...
        </div>
      )}
    </main>
  )
}

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Form isSignUp />} />
        <Route path="/signin" element={<Form isSignUp={false} />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePages />
            </ProtectedRoute>
          }
        />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
