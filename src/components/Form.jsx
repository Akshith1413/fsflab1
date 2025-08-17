import { useState, useEffect } from 'react' // ReactJS State Management Using React Hooks
import { motion, AnimatePresence } from 'framer-motion' // ReactJS - Animation
import { FaUser, FaLock, FaEnvelope, FaSmile, FaChild, FaHome, FaRocket, FaChessKnight, FaBrain } from 'react-icons/fa'
import { GiSparkles,GiPartyPopper } from 'react-icons/gi'
import { TbConfetti } from 'react-icons/tb'
import { RiEmotionHappyLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'; // ReactJS - Routing

// ReactJS Components - Creating a functional component
// ReactJS - Properties (props) - Component accepts isSignUp prop with default value
const Form = ({ isSignUp = false }) => { // props
    const navigate = useNavigate(); // ReactJS - Routing
  
  // ReactJS State Management Using React Hooks - Using useState for form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  // ReactJS State Management Using React Hooks - Multiple state variables
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [activeExpression, setActiveExpression] = useState(0)
  const [countdown, setCountdown] = useState(3);
  const [showBoom, setShowBoom] = useState(false);
  
  // Character expression - JSX elements stored in array
  const expressions = [
    <FaSmile className="expression" />, // ReactJS - JSX
    <RiEmotionHappyLine className="expression" />, // ReactJS - JSX
    <FaChild className="expression" /> // ReactJS - JSX
  ]
  
  // ReactJS - Event management - Event handlers
  const handleSignInClick = () => {
    navigate('/signin'); // ReactJS - Routing
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // ReactJS - Routing
  };
  
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#8338EC']

  // ReactJS - Component Life Cycle Using React Hooks - useEffect for side effects
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExpression((prev) => (prev + 1) % expressions.length)
    }, 4000) 
    return () => clearInterval(interval)
  }, [])

  // ReactJS - Component Life Cycle Using React Hooks - useEffect with dependencies
  useEffect(() => {
    if (currentStep === 2) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        return () => clearTimeout(timer)
      } else {
        setShowBoom(true)
        const redirectTimer = setTimeout(() => navigate('/home'), 2000) // ReactJS - Routing
        return () => clearTimeout(redirectTimer)
      }
    }
  }, [countdown, currentStep, navigate])

  // ReactJS - Event management - Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'What should we call you?'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Name too short!'
    }
    
    // ReactJS - Conditional Rendering - Different validation based on isSignUp prop
    if (isSignUp) { // props
      if (!formData.email.trim()) {
        newErrors.email = 'We need your email!'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email looks funny!'
      }
      
      if (!formData.password) {
        newErrors.password = 'Create a secret code!'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Too short! (6+ characters)'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Secret codes must match!'
      }
    } else {
      if (!formData.password) {
        newErrors.password = 'Enter your secret code!'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ReactJS - Event management - Form submit handler
  // ReactJS Form Programming - Form submission handling
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      setIsSubmitting(true)
      
      setTimeout(() => {
        setIsSubmitting(false)
        // Set authentication token in localStorage
        localStorage.setItem('authToken', 'true')
        localStorage.setItem('username', formData.username)
        setCurrentStep(2)
        
        setTimeout(() => {
          console.log('Redirecting to learning page...')
        }, 2000)
      }, 1500)
    }
  }

  const getInputColor = (fieldName) => {
    if (errors[fieldName]) return '#FF6B6B'
    if (formData[fieldName]) return '#A5DD9B'
    return '#45B7D1'
  }

  // ReactJS - JSX - Component's render method using JSX
  return (
    <div style={{
      position: 'relative',
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif'
    }}>
      
      {/* ReactJS Lists - Mapping over array to create elements */}
      {/* ReactJS - Keys - Each mapped element should have a key prop */}
      {currentStep === 1 && Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i} // ReactJS - Keys
          style={{
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            fontSize: '20px',
            color: colors[i % colors.length],
            left: `${20 + i * 30}%`,
            top: `${15 + i * 25}%`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 6,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <GiSparkles />
        </motion.div>
      ))}
      
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <motion.div
          style={{
            fontSize: '3rem',
            color: '#FF6B6B',
            flexShrink: 0
          }}
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {expressions[activeExpression]}
        </motion.div>
        <motion.div
          style={{
            backgroundColor: '#F7FFF7',
            padding: '1rem',
            borderRadius: '15px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#1A535C',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{
            position: 'absolute',
            left: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: '10px solid #F7FFF7'
          }} />
          {/* ReactJS - Conditional Rendering - Different text based on currentStep and isSignUp */}
          {currentStep === 1 ? (
            isSignUp ? "Let's create your special account!" : "Welcome back friend!" // props
          ) : (
            "You did amazing! Let's go learn!"
          )}
        </motion.div>
      </div>
      
      {/* ReactJS - Animation - AnimatePresence for exit animations */}
      <AnimatePresence>
        {/* ReactJS - Conditional Rendering - Show different content based on currentStep */}
        {currentStep === 1 ? (
          <motion.form
            onSubmit={handleSubmit} // ReactJS - Event management
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 2
            }}
          >
            <h2 style={{
              color: '#8338EC',
              textAlign: 'center',
              marginBottom: '1rem',
              fontSize: '2rem'
            }}>
              {/* ReactJS - Conditional Rendering - Different title based on isSignUp prop */}
              {isSignUp ? 'Join Our Family!' : 'Welcome Back!'} {/* props */}
            </h2>
            
            {/* ReactJS Form Programming - Controlled Component - Input controlled by React state */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold',
                color: '#1A535C'
              }}>
                <FaUser /> Your Special Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="username"
                  value={formData.username} // ReactJS Controlled Component - Value controlled by state
                  onChange={handleChange} // ReactJS - Event management
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: `2px solid ${getInputColor('username')}`,
                    borderRadius: '10px',
                    fontSize: '1rem',
                    backgroundColor: '#F7FFF7',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
                {/* ReactJS - Conditional Rendering - Show checkmark when valid */}
                {formData.username && !errors.username && (
                  <motion.span 
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#A5DD9B',
                      fontWeight: 'bold'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </div>
              {/* ReactJS - Conditional Rendering - Show error message if exists */}
              {errors.username && (
                <motion.div 
                  style={{
                    color: '#FF6B6B',
                    fontSize: '0.9rem',
                    padding: '0.3rem 0.5rem',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderRadius: '5px'
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.username}
                </motion.div>
              )}
            </div>
            
            {/* ReactJS - Conditional Rendering - Show email field only for signup */}
            {isSignUp && ( // props
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'bold',
                  color: '#1A535C'
                }}>
                  <FaEnvelope /> Grown-up's Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email} // ReactJS Controlled Component
                    onChange={handleChange} // ReactJS - Event management
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: `2px solid ${getInputColor('email')}`,
                      borderRadius: '10px',
                      fontSize: '1rem',
                      backgroundColor: '#F7FFF7',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                  />
                  {/* ReactJS - Conditional Rendering */}
                  {formData.email && !errors.email && (
                    <motion.span 
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#A5DD9B',
                        fontWeight: 'bold'
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </div>
                {/* ReactJS - Conditional Rendering */}
                {errors.email && (
                  <motion.div 
                    style={{
                      color: '#FF6B6B',
                      fontSize: '0.9rem',
                      padding: '0.3rem 0.5rem',
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      borderRadius: '5px'
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email}
                  </motion.div>
                )}
              </div>
            )}
            
            {/* ReactJS Form Programming - Password input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold',
                color: '#1A535C'
              }}>
                <FaLock /> {/* ReactJS - Conditional Rendering */}
                {isSignUp ? 'Create Secret Code' : 'Your Secret Code'} {/* props */}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="password"
                  value={formData.password} // ReactJS Controlled Component
                  onChange={handleChange} // ReactJS - Event management
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: `2px solid ${getInputColor('password')}`,
                    borderRadius: '10px',
                    fontSize: '1rem',
                    backgroundColor: '#F7FFF7',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
                {/* ReactJS - Conditional Rendering */}
                {formData.password && !errors.password && (
                  <motion.span 
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#A5DD9B',
                      fontWeight: 'bold'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </div>
              {/* ReactJS - Conditional Rendering */}
              {errors.password && (
                <motion.div 
                  style={{
                    color: '#FF6B6B',
                    fontSize: '0.9rem',
                    padding: '0.3rem 0.5rem',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderRadius: '5px'
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password}
                </motion.div>
              )}
            </div>
            
            {/* ReactJS - Conditional Rendering - Confirm password only for signup */}
            {isSignUp && ( // props
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'bold',
                  color: '#1A535C'
                }}>
                  <FaLock /> Repeat Secret Code
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword} // ReactJS Controlled Component
                    onChange={handleChange} // ReactJS - Event management
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: `2px solid ${getInputColor('confirmPassword')}`,
                      borderRadius: '10px',
                      fontSize: '1rem',
                      backgroundColor: '#F7FFF7',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                  />
                  {/* ReactJS - Conditional Rendering */}
                  {formData.confirmPassword && !errors.confirmPassword && (
                    <motion.span 
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#A5DD9B',
                        fontWeight: 'bold'
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </div>
                {/* ReactJS - Conditional Rendering */}
                {errors.confirmPassword && (
                  <motion.div 
                    style={{
                      color: '#FF6B6B',
                      fontSize: '0.9rem',
                      padding: '0.3rem 0.5rem',
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      borderRadius: '5px'
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.confirmPassword}
                  </motion.div>
                )}
              </div>
            )}
            
            <motion.button
              type="submit"
              style={{
                padding: '1rem',
                border: 'none',
                borderRadius: '15px',
                backgroundColor: isSubmitting ? '#ccc' : '#4ECDC4',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              whileHover={!isSubmitting ? { scale: 1.02, backgroundColor: '#45B7D1' } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              disabled={isSubmitting}
            >
              {/* ReactJS - Conditional Rendering - Different button content based on state */}
              {isSubmitting ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⏳
                </motion.span>
              ) : isSignUp ? ( // props
                'Join the Family!'
              ) : (
                'Let Me In!'
              )}
            </motion.button>
            
            <div style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: '#1A535C'
            }}>
              {/* ReactJS - Conditional Rendering - Different text and click handlers based on isSignUp */}
              {isSignUp ? ( // props
                <>
                  Already part of our family?{' '}
                  <span style={{
                    color: '#3A86FF',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}onClick={handleSignInClick}> {/* ReactJS - Event management */}
                    Sign In
                  </span>
                </>
              ) : (
                <>
                  New friend?{' '}
                  <span style={{
                    color: '#3A86FF',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }} onClick={handleSignUpClick}> {/* ReactJS - Event management */}
                    Create Account
                  </span>
                </>
              )}
            </div>
          </motion.form>
        ) : (
          <motion.div
            style={{
              textAlign: 'center',
              padding: '2rem',
              position: 'relative',
              zIndex: 2
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <motion.h2
              style={{
                color: '#8338EC',
                marginBottom: '1rem',
                fontSize: '2rem'
              }}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Awesome! You're All Set! 
              <motion.span
                style={{ display: 'inline-block' }}
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  repeat: 3,
                  duration: 0.5,
                  ease: "easeInOut"
                }}
              >
                🎉
              </motion.span>
            </motion.h2>

            <motion.p
              style={{
                color: '#1A535C',
                fontSize: '1.2rem',
                marginBottom: '2rem'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Get ready for a fun learning adventure!
            </motion.p>

            <div style={{ height: '120px', position: 'relative' }}>
              <AnimatePresence mode='wait'>
                {/* ReactJS - Conditional Rendering - Show countdown or boom based on state */}
                {countdown > 0 ? (
                  <motion.div
                    key="countdown"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: '#FFBE0B',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      margin: '0 auto'
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {countdown}
                  </motion.div>
                ) : showBoom ? (
                  <motion.div
                    key="boom"
                    style={{
                      display: 'inline-block',
                      fontSize: '3rem'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1.5, 1],
                      rotate: [0, 360]
                    }}
                    exit={{ scale: 0 }}
                    transition={{ 
                      duration: 0.7,
                      ease: "backOut"
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <motion.span
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1.5
                        }}
                      >
                        🚀
                      </motion.span>
                      BOOM!
                      <motion.span
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, -10, 10, 0]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1.5,
                          delay: 0.3
                        }}
                      >
                        ✨
                      </motion.span>
                    </div>
                    <motion.p
                      style={{ fontSize: '1rem', marginTop: '0.5rem' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Let's go learn!
                    </motion.p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* ReactJS - Animation - Animated confetti elements */}
            <motion.div
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                overflow: 'hidden'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              
              {/* ReactJS Lists - Mapping over array to create confetti elements */}
              {/* ReactJS - Keys - Each mapped element has a key */}
              {Array.from({ length: 12 }).map((_, i) => {
                const randomShape = Math.random() > 0.5 ? 'circle' : 'square';
                const size = 8 + Math.random() * 8;
                const Icon = [GiPartyPopper, TbConfetti, FaRocket, FaChessKnight, FaBrain][i % 5];
                
                return (
                  <motion.div
                    key={i} // ReactJS - Keys
                    style={{
                      position: 'absolute',
                      width: `${size}px`,
                      height: `${size}px`,
                      borderRadius: randomShape === 'circle' ? '50%' : '2px',
                      top: `${10 + Math.random() * 80}%`,
                      left: `${Math.random() * 100}%`,
                      backgroundColor: colors[i % colors.length],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: `${size * 1.5}px`
                    }}
                    initial={{ 
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 1,
                      rotate: 0
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                      scale: [0, 1, 0],
                      opacity: [1, 0.8, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    {/* ReactJS - Conditional Rendering - Show icon based on index */}
                    {i % 3 === 0 && <Icon style={{ color: 'white', fontSize: 'inherit' }} />}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ReactJS - Animation - Animated background gradient */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,190,11,0.1) 0%, rgba(131,56,236,0.1) 100%)',
                zIndex: 0,
                borderRadius: '20px'
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Form