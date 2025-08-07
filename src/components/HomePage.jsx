import { useState, useEffect, useRef } from 'react'
import '/src/components/styles/HomePage.css' 
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
  const [focusedIndex, setFocusedIndex] = useState(-1) 
  const [keyboardMode, setKeyboardMode] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null)
  const rewardTimeoutRef = useRef(null)
  const sparkleIntervalRef = useRef(null)
  const memberRefs = useRef([])
  const lastInteractionType = useRef(null) 

  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607', 
    '#8338EC', '#3A86FF', '#FF006E', '#A5DD9B'
  ]

  
  useEffect(() => {
    memberRefs.current = memberRefs.current.slice(0, members.length)
  }, [members.length])

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Only switch to mouse mode if the user is actively using the mouse
      if (lastInteractionType.current !== 'mouse') {
        lastInteractionType.current = 'mouse'
        setKeyboardMode(false)
        setFocusedIndex(-1) // Remove focus when using mouse
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keyboard navigation when modal is not open
      if (activeMember) return

      // Check if we're starting keyboard navigation
      if (['ArrowLeft', 'ArrowRight', 'Tab', 'Enter', ' '].includes(e.key) && 
          lastInteractionType.current !== 'keyboard') {
        lastInteractionType.current = 'keyboard'
        setKeyboardMode(true)
        setShowKeyboardHelp(true)
        
        // Set initial focus if nothing is focused
        if (focusedIndex === -1) {
          setFocusedIndex(0)
          setTimeout(() => {
            if (memberRefs.current[0]) {
              memberRefs.current[0].focus()
            }
          }, 0)
        }
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setFocusedIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : members.length - 1
            setTimeout(() => {
              if (memberRefs.current[newIndex]) {
                memberRefs.current[newIndex].focus()
              }
            }, 0)
            return newIndex
          })
          break

        case 'ArrowRight':
          e.preventDefault()
          setFocusedIndex(prev => {
            const newIndex = prev < members.length - 1 ? prev + 1 : 0
            setTimeout(() => {
              if (memberRefs.current[newIndex]) {
                memberRefs.current[newIndex].focus()
              }
            }, 0)
            return newIndex
          })
          break

        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0 && memberRefs.current[focusedIndex]) {
            const member = members[focusedIndex]
            handleMemberClick(member, { 
              currentTarget: memberRefs.current[focusedIndex],
              target: memberRefs.current[focusedIndex]
            })
          }
          break

        case 'Escape':
          if (focusedIndex >= 0 && memberRefs.current[focusedIndex]) {
            memberRefs.current[focusedIndex].blur()
          }
          setFocusedIndex(-1)
          setKeyboardMode(false)
          setShowKeyboardHelp(false)
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [members.length, activeMember, focusedIndex])

  // Handle modal keyboard navigation
  useEffect(() => {
    if (activeMember) {
      const handleModalKeyDown = (e) => {
        if (e.key === 'Escape') {
          setActiveMember(null)
          if (synthRef.current) {
            synthRef.current.cancel()
          }
          setIsSpeaking(false)
          
          setTimeout(() => {
            if (focusedIndex >= 0 && memberRefs.current[focusedIndex]) {
              memberRefs.current[focusedIndex].focus()
              setKeyboardMode(true)
            }
          }, 100)
        }
      }

      window.addEventListener('keydown', handleModalKeyDown)
      return () => window.removeEventListener('keydown', handleModalKeyDown)
    }
  }, [activeMember, focusedIndex])

 
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


  useEffect(() => {
    let timeout
    if (showKeyboardHelp) {
      timeout = setTimeout(() => {
        setShowKeyboardHelp(false)
      }, 3000)
    }
    return () => clearTimeout(timeout)
  }, [showKeyboardHelp])

  
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

  
  const handleMemberFocus = (index) => {
    if (keyboardMode) {
      setFocusedIndex(index)
    }
  }

  
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
        
        {showKeyboardHelp && (
          <div 
            className="keyboard-help"
            style={{
              position: 'fixed',
              top: '10px',
              right: '10px',
              background: 'rgba(131, 56, 236, 0.9)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              zIndex: 1002,
              backdropFilter: 'blur(5px)',
              animation: 'fadeInOut 3s ease-in-out'
            }}
          >
            ← → Navigate | Enter/Space Select | Esc Exit
          </div>
        )}

        
        <header className="homepage-header">
          <div className="header-icon">
            🏠
          </div>
          <h1>Meet My Family!</h1>
          <div className="star-count">
            ⭐ {collectedStars}/{familyMembers.length}
          </div>
        </header>
        
        
        <section className="introduction">
          <p>
            <span className="highlight">Hello friend!</span> Let's meet all the 
            special people in a family. Click on each person to learn about them!
            <br />
          </p>
          <div className="helper-character">
            🧒
          </div>
        </section>
        
        
        <section className="family-grid">
          {members.map((member, index) => (
            <div
              key={member.id}
              ref={el => memberRefs.current[index] = el}
              className={`family-member ${member.viewed ? 'viewed' : ''} ${activeMember?.id === member.id ? 'active' : ''} ${keyboardMode && focusedIndex === index ? 'keyboard-focused' : ''}`}
              onClick={(e) => handleMemberClick(member, e)}
              onFocus={() => handleMemberFocus(index)}
              tabIndex={0}
              style={{
                animationDelay: `${member.id * 0.1}s`,
                '--member-color': member.color,
                outline: keyboardMode && focusedIndex === index ? `3px solid ${member.color}` : 'none',
                outlineOffset: '2px'
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
                tabIndex={-1}
              >
                🔊
              </button>
            </div>
          ))}
        </section>
        
        
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
                    // Return focus to the previously focused member
                    setTimeout(() => {
                      if (focusedIndex >= 0 && memberRefs.current[focusedIndex]) {
                        memberRefs.current[focusedIndex].focus()
                        setKeyboardMode(true)
                      }
                    }, 100)
                  }}
                  autoFocus
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
                      style={{ marginBottom: '1rem' }}
                    >
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
                        // Return focus to the previously focused member
                        setTimeout(() => {
                          if (focusedIndex >= 0 && memberRefs.current[focusedIndex]) {
                            memberRefs.current[focusedIndex].focus()
                            setKeyboardMode(true)
                          }
                        }, 100)
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
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }

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

        
        .family-member.keyboard-focused {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 0 0 3px var(--member-color), 0 15px 35px rgba(0, 0, 0, 0.2);
          z-index: 10;
        }

        .family-member:focus {
          outline: none;
        }

        
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

        .modal-body {
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          padding: 20px;
          overflow: hidden;
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