import { useState, useEffect, useRef } from 'react'
import '/src/components/styles/HomePage.css' // Assuming you have a CSS file for styles
import familyMembers from '/src/data/familyMembers'
const HomePage = () => {
  const [activeMember, setActiveMember] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [collectedStars, setCollectedStars] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [members, setMembers] = useState(familyMembers)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [confetti, setConfetti] = useState([])
  const [sparkles, setSparkles] = useState([])
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null)
  const rewardTimeoutRef = useRef(null)
  const sparkleIntervalRef = useRef(null)

  // Colors for effects
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607', 
    '#8338EC', '#3A86FF', '#FF006E', '#A5DD9B'
  ]

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Create sparkle effects
  useEffect(() => {
    sparkleIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.7) {
        const newSparkle = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5
        }
        setSparkles(prev => [...prev.slice(-10), newSparkle])
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
        }, 2000)
      }
    }, 500)

    return () => {
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current)
      }
    }
  }, [])

  // Speak function with enhanced feedback
  const speak = (text) => {
    if (!synthRef.current) return
    
    if (isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.2
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    synthRef.current.speak(utterance)
  }

  // Create confetti burst
  const createConfetti = (x, y) => {
    const newConfetti = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: x,
      y: y,
      color: colors[i % colors.length],
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -5 - 2,
      size: Math.random() * 8 + 4
    }))
    setConfetti(prev => [...prev, ...newConfetti])
    setTimeout(() => {
      setConfetti(prev => prev.filter(c => !newConfetti.find(nc => nc.id === c.id)))
    }, 3000)
  }

  // Handle member click with enhanced effects
  const handleMemberClick = (member, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    if (activeMember?.id === member.id) {
      setActiveMember(null)
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      setIsSpeaking(false)
    } else {
      setActiveMember(member)
      speak(`${member.name}. ${member.description}`)
      createConfetti(centerX, centerY)
      
      // Reward system
      if (!member.viewed) {
        const updatedMembers = members.map(m => 
          m.id === member.id ? { ...m, viewed: true } : m
        )
        setMembers(updatedMembers)
        setCollectedStars(prev => prev + 1)
        
        if (collectedStars + 1 === familyMembers.length) {
          setShowReward(true)
          rewardTimeoutRef.current = setTimeout(() => setShowReward(false), 6000)
        }
      }
    }
  }

  // Clean up
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      if (rewardTimeoutRef.current) {
        clearTimeout(rewardTimeoutRef.current)
      }
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Floating confetti */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1000,
            animation: `confettiFall 3s ease-out forwards`
          }}
        />
      ))}

      {/* Floating sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          style={{
            position: 'fixed',
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 999,
            animation: `sparkleFloat 2s ease-out forwards`,
            boxShadow: `0 0 ${sparkle.size}px ${sparkle.color}`
          }}
        />
      ))}

      {/* Mouse follower effect */}
      <div
        style={{
          position: 'fixed',
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 998,
          transition: 'all 0.1s ease'
        }}
      />

      <div className="homepage-container">
        {/* Header */}
        <header className="homepage-header">
          <div className="header-icon">
            🏠
          </div>
          <h1>Meet My Family!</h1>
          <div className="star-count">
            ⭐ {collectedStars}/{familyMembers.length}
          </div>
        </header>
        
        {/* Introduction */}
        <section className="introduction">
          <p>
            <span className="highlight">Hello friend!</span> Let's meet all the 
            special people in a family. Click on each person to learn about them!
          </p>
          <div className="helper-character">
            🧒
          </div>
        </section>
        
        {/* Family Members Grid */}
        <section className="family-grid">
          {members.map((member) => (
            <div
              key={member.id}
              className={`family-member ${member.viewed ? 'viewed' : ''} ${activeMember?.id === member.id ? 'active' : ''}`}
              onClick={(e) => handleMemberClick(member, e)}
              style={{
                animationDelay: `${member.id * 0.1}s`,
                '--member-color': member.color
              }}
            >
              <div className="member-image">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  style={{ borderColor: member.color }}
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${member.color.replace('#', '%23')}"/><text x="100" y="120" text-anchor="middle" fill="white" font-size="60">${member.name.charAt(0)}</text></svg>`
                  }}
                />
                {member.viewed && (
                  <div className="viewed-badge">
                    ⭐
                  </div>
                )}
              </div>
              <h3>{member.name}</h3>
              <button
                className={`speak-button ${isSpeaking && activeMember?.id === member.id ? 'speaking' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  speak(`${member.name}. ${member.description}`)
                }}
              >
                🔊
              </button>
            </div>
          ))}
        </section>
        
        {/* Active Member Details */}
        {activeMember && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>{activeMember.name}</h2>
        <button
          className="close-button"
          onClick={() => {
            setActiveMember(null)
            if (synthRef.current) {
              synthRef.current.cancel()
            }
            setIsSpeaking(false)
          }}
        >
          ×
        </button>
      </div>
      <div className="modal-body">
        <div className="modal-image">
          <img 
            src={activeMember.detailImage} 
            alt={activeMember.name}
            onError={(e) => {
              e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="${activeMember.color.replace('#', '%23')}"/><text x="200" y="170" text-anchor="middle" fill="white" font-size="80">${activeMember.name.charAt(0)}</text></svg>`
            }}
          />
        </div>
        <div className="modal-text">
          <p>{activeMember.description}</p>
          <div style={{ display: 'flex',flexWrap: 'wrap', gap: '1rem',justifyContent: 'center' }}>

          <button
            className="speak-button large"
            onClick={() => speak(`${activeMember.name}. ${activeMember.description}`)}
           style={{ marginBottom: '1rem' }}>
            🔊 Hear Again
          </button>
          <button
                  className="close-button pinkstarter"
                  onClick={() => {
                    setActiveMember(null)
                    if (synthRef.current) {
                      synthRef.current.cancel()
                    }
                    setIsSpeaking(false)
                  }}
                >
                  Close
                </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        
        {/* Reward Animation */}
        {showReward && (
          <div className="reward-overlay">
            <div className="reward-content">
              <div className="reward-icon">
                🏆
              </div>
              <h2>Amazing Job!</h2>
              <p>You've met all the family members!</p>
              <div className="reward-particles">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="reward-particle"
                    style={{
                      backgroundColor: colors[i % colors.length],
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Floating decorative elements */}
        <div className="floating-element dog" style={{
          top: '11%',
          fontSize: '3rem'}}>
          🐕
        </div>
        

        <div className="floating-element" style={{
          top: '10%',
          left: '10%',
          fontSize: '2.5rem',
          color: '#45B7D1',
          animation: 'gentleFloat 4s ease-in-out infinite'
        }}>
          🌟
        </div>

      </div>

      

      <style jsx>{`
        @keyframes rewardParticle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) 
                      translateX(${Math.random() * 200 - 100}px) 
                      translateY(${Math.random() * 200 - 100}px) 
                      scale(1);
          }
        }
          /* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  width: 90%;
  max-height: 70vh;
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-body {position: relative;
top:0;left:0;width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;overflow: hidden;
}

.modal-image {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 20px;
}

.modal-image img {
  width: 250px;
  height: 250px;
  object-fit: cover;
}

.modal-text {
  padding: 0 10px;
}

.modal-text p {
  font-size: 1.2rem;
  line-height: 1.5;
  color: #333;
  margin-bottom: 1.8rem;
}
.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.pinkstarter {
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
          color: white;
          border: none;
          height: 45px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
          width: auto;
          padding: 0.7rem 1.5rem;
          gap: 0.5rem;
          font-weight: bold;
          font-size: 1.1rem;
}
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-body {
    flex-direction: column;
  }
  
  .modal-image {
    height: 200px;
  }
}
      `}</style>
    </>
  )
}

export default HomePage