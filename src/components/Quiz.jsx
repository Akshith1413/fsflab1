import { useState, useEffect, useRef } from 'react' // ReactJS State Management Using React Hooks
import { motion, AnimatePresence } from 'framer-motion' // ReactJS - Animation
import { FaStar, FaHeart, FaCheck, FaTimes, FaTrophy, FaChild } from 'react-icons/fa'
import { GiSparkles, GiPartyPopper } from 'react-icons/gi'
import questions from '../data/quizQuestions'
import '/src/components/styles/Quiz.css' // ReactJS Styling

// ReactJS Components, ReactJS - Creating a React Application
const Quiz = () => {
  // ReactJS State Management Using React Hooks
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [floatingElements, setFloatingElements] = useState([])
  const audioRef = useRef(null)

  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607', 
    '#8338EC', '#3A86FF', '#FF006E', '#A5DD9B'
  ]

  // ReactJS - Component Life Cycle Using React Hooks
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      icon: Math.random() > 0.5 ? <GiSparkles /> : <FaHeart />, // ReactJS - JSX
      size: Math.random() * 20 + 15,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }))
    setFloatingElements(elements)
  }, [])

  
  const playSound = (sound) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const audio = new Audio(sound)
    audio.volume = 0.3
    audioRef.current = audio
    audio.play()
  }

  // ReactJS - Event management
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
    const correct = answer === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)
    
    if (correct) {
      playSound('/sounds/Correct.mp3')
      setScore(score + 1)
    } else {
      playSound('/sounds/wrong.mp3')
    }
    
    setShowFeedback(true)
    
    setTimeout(() => {
      setShowFeedback(false)
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setQuizCompleted(true)
        playSound('/sounds/complete.mp3')
      }
    }, 2000)
  }

  // ReactJS - Event management
  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setQuizCompleted(false)
    setShowFeedback(false)
  }

  const getAnswerColor = (answer) => {
    if (!showFeedback) return '#45B7D1'
    if (answer === questions[currentQuestion].correctAnswer) return '#A5DD9B'
    if (answer === selectedAnswer && !isCorrect) return '#FF6B6B'
    return '#45B7D1'
  }

  // ReactJS - JSX
  return (
    <div className="quiz-container">
      {/* Hidden audio element */}
      <audio ref={audioRef} />
      
      {/* ReactJS Lists */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id} // ReactJS - Keys
          className="floating-element"
          initial={{
            x: `${element.x}%`,
            y: `${element.y}%`,
            opacity: 0
          }}
          animate={{
            y: [`${element.y}%`, `${element.y - 10}%`, `${element.y}%`],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: "easeInOut"
          }}
          style={{
            fontSize: `${element.size}px`,
            color: colors[Math.floor(Math.random() * colors.length)]
          }}
        >
          {element.icon}
        </motion.div>
      ))}
      
      
      <header className="quiz-header">
        <h1>Family Quiz Time!</h1>
        <div className="progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="score">
          <FaStar /> {score}
        </div>
      </header>
      
      
      <div className="quiz-content">
        {/* ReactJS  Conditional Rendering */}
        <AnimatePresence mode='wait'>
          {!quizCompleted ? (
            <motion.div
              key={`question-${currentQuestion}`} // ReactJS - Keys
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="question-container"
            >
              <motion.div 
                className="question-character"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img 
                  src={questions[currentQuestion].image} 
                  alt={questions[currentQuestion].question} 
                />
              </motion.div>
              
              <h2>{questions[currentQuestion].question}</h2>
              
              <div className="answers-grid">
                {/* ReactJS Lists */}
                {questions[currentQuestion].answers.map((answer, index) => (
                  <motion.button
                    key={index} // ReactJS - Keys
                    className={`answer-button ${selectedAnswer === answer ? 'selected' : ''}`}
                    onClick={() => !showFeedback && handleAnswerSelect(answer)} // ReactJS - Event management
                    disabled={showFeedback}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: selectedAnswer ? 1 : 1.05 }}
                    whileTap={{ scale: selectedAnswer ? 1 : 0.95 }}
                    style={{
                      backgroundColor: getAnswerColor(answer),
                      cursor: showFeedback ? 'default' : 'pointer'
                    }}
                  >
                    {answer}
                    {/* ReactJS - Conditional Rendering */}
                    {showFeedback && answer === questions[currentQuestion].correctAnswer && (
                      <motion.span 
                        className="feedback-icon correct"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <FaCheck />
                      </motion.span>
                    )}
                    {/* ReactJS - Conditional Rendering */}
                    {showFeedback && answer === selectedAnswer && !isCorrect && (
                      <motion.span 
                        className="feedback-icon incorrect"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <FaTimes />
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz-complete" // ReactJS - Keys
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="quiz-complete"
            >
              <div className="trophy-icon">
                <FaTrophy />
              </div>
              <h2>Quiz Complete!</h2>
              <p>
                You scored {score} out of {questions.length}!
              </p>
              <div className="result-message">
                {/* ReactJS - Conditional Rendering */}
                {score === questions.length ? (
                  <>
                    Perfect! You know families so well! <GiPartyPopper />
                  </>
                ) : score >= questions.length / 2 ? (
                  <>
                    Great job! You're learning so much! <FaChild />
                  </>
                ) : (
                  <>
                    Good try! Let's practice some more! <FaHeart />
                  </>
                )}
              </div>
              
              <motion.button
                className="restart-button"
                onClick={restartQuiz} // ReactJS - Event management
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
              
              <div className="celebration-particles">
                {/* ReactJS Lists */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i} // ReactJS - Keys
                    className="particle"
                    initial={{ 
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 1
                    }}
                    animate={{
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 200 - 100,
                      scale: [0, 1, 0],
                      opacity: [1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1
                    }}
                    style={{
                      backgroundColor: colors[i % colors.length]
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* ReactJS Conditional Rendering */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className="feedback-overlay"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
          >
            {/* ReactJS - Conditional Rendering */}
            {isCorrect ? (
              <>
                <motion.div
                  className="feedback-emoji"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                    y: [0, -20, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  🎉
                </motion.div>
                <h3>Great Job!</h3>
              </>
            ) : (
              <>
                <motion.div
                  className="feedback-emoji"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity
                  }}
                >
                  🤔
                </motion.div>
                <h3>Let's Try Again!</h3>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Quiz 