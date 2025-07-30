import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { 
  FaChild, 
  FaHome, 
  FaStar, 
  FaHeart, 
  FaSmile, 
  FaHandPointer,
  FaMusic
} from 'react-icons/fa'
import { GiSparkles, GiJumpingDog } from 'react-icons/gi'
import { RiEmotionHappyLine } from 'react-icons/ri'
import './styles/StartButton.css'

const StartButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [activeParticles, setActiveParticles] = useState([])
  const [activeBubbles, setActiveBubbles] = useState([])
  const [activeStars, setActiveStars] = useState([])
  const controls = useAnimation()
  const buttonRef = useRef(null)

  // Character expressions
  const expressions = [
    <FaSmile className="expression" />,
    <RiEmotionHappyLine className="expression" />,
    <FaChild className="expression" />
  ]
  const [currentExpression, setCurrentExpression] = useState(0)

  // Colors
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607', 
    '#8338EC', '#3A86FF', '#FF006E', '#A5DD9B'
  ]

  // Sound effects (uncomment to enable)
  /*
  const playSound = () => {
    const sounds = [
      '/sounds/pop.mp3',
      '/sounds/boing.mp3',
      '/sounds/twinkle.mp3'
    ]
    const sound = new Audio(sounds[Math.floor(Math.random() * sounds.length)])
    sound.volume = 0.3
    sound.play()
  }
  */

  // Expression changer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExpression((prev) => (prev + 1) % expressions.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Regular particles
  const generateParticles = () => {
    const particles = Array.from({ length: 25 }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      size: Math.random() * 15 + 5,
      delay: Math.random() * 0.5,
      type: Math.random() > 0.5 ? 'star' : 'heart',
      rotation: Math.random() * 360
    }))
    setActiveParticles(particles)
    
    setTimeout(() => {
      setActiveParticles([])
    }, 1500)
  }

  // Bubble particles
  const generateBubbles = () => {
    const bubbles = Array.from({ length: 15 }, (_, i) => ({
      id: `bubble-${Date.now()}-${i}`,
      x: Math.random() * 100 - 50,
      y: 100,
      size: Math.random() * 30 + 10,
      speed: Math.random() * 2 + 1
    }))
    setActiveBubbles(bubbles)
    
    setTimeout(() => {
      setActiveBubbles([])
    }, 3000)
  }

  // Shooting stars
  const generateStars = () => {
    const stars = Array.from({ length: 8 }, (_, i) => ({
      id: `star-${Date.now()}-${i}`,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      size: Math.random() * 20 + 10,
      tailLength: Math.random() * 30 + 20
    }))
    setActiveStars(stars)
    
    setTimeout(() => {
      setActiveStars([])
    }, 1000)
  }

  const handleClick = () => {
    setIsClicked(true)
    // playSound()
    generateParticles()
    generateBubbles()
    generateStars()
    
    controls.start({
      scale: [1, 1.1, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.8 }
    })
    
    setTimeout(() => {
      onClick()
    }, 1500)
  }

  const handleHoverStart = () => {
    setIsHovered(true)
    generateBubbles()
    controls.start({
      scale: 1.05,
      transition: { duration: 0.3 }
    })
  }

  const handleHoverEnd = () => {
    setIsHovered(false)
    controls.start({
      scale: 1,
      transition: { duration: 0.3 }
    })
  }

  return (
    <div className="super-button-container" ref={buttonRef}>
      {/* Main Interactive House Character */}
      <motion.div
        className="interactive-house"
        onClick={handleClick}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        animate={controls}
        whileTap={{ scale: 0.95 }}
      >
        {/* House Roof */}
        <motion.div 
          className="house-roof"
          animate={{
            rotate: isHovered ? [0, 5, -5, 0] : 0,
            y: isHovered ? [0, -5, 0] : 0
          }}
          transition={{
            rotate: { duration: 1, repeat: Infinity },
            y: { duration: 0.5, repeat: Infinity }
          }}
        >
          <div className="roof-pattern"></div>
        </motion.div>
        
        {/* House Body */}
        <div className="house-body">
          {/* Door */}
          <motion.div 
            className="house-door"
            animate={{
              y: isHovered ? [0, -5, 0] : 0
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity
            }}
          >
            <div className="door-knob"></div>
          </motion.div>
          
          {/* Window with character */}
          <div className="house-window">
            <motion.div 
              className="window-character"
              animate={{
                scale: isHovered ? [1, 1.1, 1] : 1,
                rotate: isHovered ? [0, 10, -10, 0] : 0
              }}
              transition={{
                duration: 1,
                repeat: Infinity
              }}
            >
              {expressions[currentExpression]}
            </motion.div>
          </div>
        </div>
        
        {/* House Text */}
        <motion.div 
          className="house-text"
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
            y: isHovered ? [0, -5, 0] : 0
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity
          }}
        >
          START HERE!
          <motion.div
            animate={{
              x: isHovered ? [0, 10, 0] : 0
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity
            }}
          >
            <FaHandPointer />
          </motion.div>
        </motion.div>
        
        {/* House Base */}
        <div className="house-base"></div>
      </motion.div>
      
      {/* Floating helper text */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="helper-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Click the happy house to begin!
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Particle Systems */}
      <div className="particle-system">
        {/* Regular particles */}
        {activeParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`particle ${particle.type}`}
            initial={{ 
              opacity: 0,
              x: 0,
              y: 0,
              scale: 0,
              rotate: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              x: particle.x,
              y: particle.y,
              scale: [0, 1, 0],
              rotate: particle.rotation
            }}
            transition={{
              delay: particle.delay,
              duration: 1.5,
              ease: "easeOut"
            }}
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)]
            }}
          >
            {particle.type === 'star' ? <FaStar /> : <FaHeart />}
          </motion.div>
        ))}
        
        {/* Bubbles */}
        {activeBubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="bubble"
            initial={{ 
              opacity: 0,
              x: bubble.x,
              y: bubble.y,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.8, 0],
              y: -100,
              scale: [0, 1, 1.2]
            }}
            transition={{
              duration: bubble.speed,
              ease: "linear"
            }}
            style={{
              width: bubble.size,
              height: bubble.size,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)]
            }}
          />
        ))}
        
        {/* Shooting stars */}
        {activeStars.map((star) => (
          <motion.div
            key={star.id}
            className="shooting-star"
            initial={{ 
              opacity: 0,
              x: star.x,
              y: star.y,
              rotate: -45
            }}
            animate={{
              opacity: [0, 1, 0],
              x: star.x + 100,
              y: star.y - 100
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            style={{
              width: star.size,
              height: star.size / 4
            }}
          >
            <div 
              className="star-tail"
              style={{ width: star.tailLength }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Floating decorative elements */}
      <motion.div 
        className="floating-icon music-note"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <FaMusic />
      </motion.div>
      
      <motion.div 
        className="floating-icon sparkles"
        animate={{
          y: [0, -30, 0],
          x: [0, 10, 0],
          rotate: [0, 180, 360],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <GiSparkles />
      </motion.div>
      
      <motion.div 
        className="floating-icon jumping-dog"
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <GiJumpingDog />
      </motion.div>
    </div>
  )
}

export default StartButton