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
        <h1>About Family Explorer</h1>
        <p>A Special Learning Adventure for Amazing Kids</p>
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
          <h3>Interactive Home</h3>
          <p>
            Our magical home page welcomes children with a friendly house character 
            that invites them to start learning. The vibrant colors and playful 
            animations create a comforting environment that encourages exploration.
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
            Children discover colorful cartoon family members with interactive 
            profiles. Each character comes to life with voice descriptions and 
            animations, helping kids understand family roles in an engaging way.
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
          <h3>Fun Learning Quiz</h3>
          <p>
            Our interactive quiz tests knowledge with positive reinforcement. 
            Correct answers trigger celebration animations, while gentle 
            encouragement helps with mistakes. A star reward system motivates 
            continued learning.
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
          <h3>Autism-Friendly Design</h3>
          <p>
            Every element is crafted with sensory needs in mind - from the 
            carefully chosen color palette to predictable interactions. The 
            interface avoids overwhelming stimuli while maintaining engagement.
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
          <h3>"Building Bridges Through Code, One Smile at a Time"</h3>
          <p>
            Family Explorer was created with love and dedication by 
            <span className="developer-name"> Ravula Akshith</span>, 
            a Full Stack Developer passionate about creating meaningful 
            educational experiences.
          </p>
          <div className="developer-quote">
            <p>
              "Seeing the potential of technology to create inclusive learning 
              spaces inspired this project. Every animation, every interaction 
              was designed to make understanding family relationships joyful 
              and accessible for all children."
            </p>
            <p>
              "As a developer, I believe our code should do more than function - 
              it should connect, educate, and bring happiness to users."
            </p>
            <p>
              "This project represents my commitment to building technology 
              that makes a real difference in people's lives."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default About