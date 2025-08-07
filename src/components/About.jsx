import { motion } from 'framer-motion'
import { FaChild, FaHome, FaUsers, FaQuestionCircle, FaStar } from 'react-icons/fa'
import { GiFamilyHouse } from 'react-icons/gi'
import '/src/components/styles/About.css'
const About = () => {
  return (
    <div className="about-container">
      <motion.div 
        className="about-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GiFamilyHouse className="header-icon" />
        <h1>Welcome to Family Explorer</h1>
        <p>A fun way for kids to learn about families</p>
      </motion.div>

      <div className="features-overview">
        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="feature-icon">
            <FaHome />
          </div>
          <h3>Friendly Home Base</h3>
          <p>
            Our home screen greets kids with a cheerful house that guides them 
            through the learning journey. Bright colors and fun animations make 
            exploring feel like playtime.
          </p>
        </motion.div>

        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="feature-icon">
            <FaUsers />
          </div>
          <h3>Meet the Family</h3>
          <p>
            Kids get to know different family members through animated characters. 
            Each one has its own personality and voice that helps explain family 
            relationships in a simple way.
          </p>
        </motion.div>

        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="feature-icon">
            <img
              src="/images/quiz.png"
              alt="Quiz"
              style={{
                width: '24px',
                height: '24px',
                filter: 'invert(49%) sepia(73%) saturate(747%) hue-rotate(323deg) brightness(101%) contrast(104%)'
              }}
            />
          </div>
          <h3>Learning Games</h3>
          <p>
            Our quiz turns learning into a game with cheers for right answers 
            and helpful hints when needed. Kids earn stars as they go, making 
            learning feel like an exciting adventure.
          </p>
        </motion.div>

        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="feature-icon">
            <FaChild />
          </div>
          <h3>Comfortable for Everyone</h3>
          <p>
            We've designed everything to be easy and comfortable to use. The 
            colors, sounds, and movements are all chosen carefully to be fun 
            without being overwhelming.
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="developer-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="made-by-card">
          <h3>"Creating connections through technology"</h3>
          <p>
            Family Explorer was made by 
            <span className="developer-name"> Ravula Akshith</span>, 
            a developer who loves creating learning tools that work for all kids.
          </p>
          <div className="developer-quote">
            <p>
              "I wanted to build something that makes learning about families 
              enjoyable for every child. The animations and interactions are 
              designed to keep kids engaged while they learn."
            </p>
            <p>
              "To me, good technology should be about more than just working 
              properly - it should help people and bring them joy."
            </p>
            <p>
              "This project is my way of using coding skills to make something 
              that might help kids understand their world a little better."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default About