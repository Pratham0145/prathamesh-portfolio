'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { 
  Brain, Code, Database, Cpu, Globe, Mail, Phone, Linkedin, 
  Github, ChevronDown, ExternalLink, Sparkles, Zap, Terminal,
  Layers, Workflow, MessageSquare, BarChart3, Server, GitBranch,
  Send, MapPin, Calendar, Award, BookOpen, Users, X, MessageCircle,
  Bot, ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

// ============================================
// 🔧 CONFIGURATION - EDIT YOUR PROFILE HERE
// ============================================
const CONFIG = {
  // Profile Info
  name: "Prathamesh Patil",
  title: "Data Scientist",
  company: "6D Technologies Ltd",
  
  // Availability Status - Set to false to hide the badge
  showAvailability: true,
  availabilityText: "Available for opportunities",
  
  // Profile Image Path (change this to use different images)
  profileImage: "/profile-anime-new-small.png",
}
// ============================================

// Floating orbs background
const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)',
          top: '10%',
          left: '-10%',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(176,38,255,0.12) 0%, transparent 70%)',
          bottom: '10%',
          right: '-10%',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,45,149,0.1) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

// Particle component for background
const Particles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }>>([])
  
  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="particles-bg">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: `rgba(0, 245, 255, ${particle.opacity})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(0, 245, 255, ${particle.opacity})`,
          }}
          animate={{
            x: [0, particle.speedX * 100, 0],
            y: [0, particle.speedY * 100, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Typing animation hook
const useTypingEffect = (texts: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime])

  return displayText
}

// Glitch text component
const GlitchText = ({ text, className = '' }: { text: string; className?: string }) => {
  return (
    <span className={`glitch-text ${className}`} data-text={text}>
      {text}
    </span>
  )
}

// Navigation component
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sections = ['hero', 'about', 'skills', 'projects', 'contact']
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && window.scrollY >= element.offsetTop - 100) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.a
            href="#hero"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src="/logo.png"
                alt="PP Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text">Prathamesh</span>
          </motion.a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                  activeSection === item.id 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#00f5ff]/20 to-[#b026ff]/20 rounded-full border border-[#00f5ff]/30"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </motion.a>
            ))}
          </div>

          {/* Let's Talk Button - Desktop */}
          <motion.a
            href="#contact"
            className="hidden md:flex group relative px-5 py-2 rounded-full overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f5ff] to-[#b026ff] opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#b026ff] to-[#00f5ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-black font-semibold text-sm flex items-center gap-1">
              Let&apos;s Talk <ArrowUpRight className="w-4 h-4" />
            </span>
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-[#0a0a0f]/95 backdrop-blur-xl rounded-2xl mb-4"
            >
              <div className="py-4 px-4 space-y-2">
                {navItems.map((item) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeSection === item.id 
                        ? 'bg-gradient-to-r from-[#00f5ff]/20 to-[#b026ff]/20 text-white border border-[#00f5ff]/30' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#b026ff] text-black font-semibold text-sm text-center mt-4"
                >
                  Let&apos;s Talk
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

// Hero Section
const HeroSection = () => {
  const typedText = useTypingEffect(['Data Scientist', 'ML Engineer', 'AI Developer', 'Problem Solver'])
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Tech icons for floating animation
  const techIcons = [
    { name: 'Python', icon: '🐍', delay: 0 },
    { name: 'TensorFlow', icon: '🧠', delay: 0.5 },
    { name: 'ML', icon: '📊', delay: 1 },
    { name: 'AI', icon: '🤖', delay: 1.5 },
    { name: 'Data', icon: '📈', delay: 2 },
    { name: 'Code', icon: '💻', delay: 2.5 },
  ]

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FloatingOrbs />
      <Particles />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Floating Tech Icons - Desktop Only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {techIcons.map((tech, i) => {
          const positions = [
            { top: '15%', left: '10%' },
            { top: '25%', right: '12%' },
            { top: '60%', left: '8%' },
            { top: '70%', right: '10%' },
            { top: '40%', left: '5%' },
            { top: '45%', right: '5%' },
          ]
          return (
            <motion.div
              key={tech.name}
              className="absolute text-3xl"
              style={positions[i]}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3], 
                scale: [1, 1.1, 1],
                y: [0, -15, 0]
              }}
              transition={{ 
                duration: 4, 
                delay: tech.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <span>{tech.icon}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Profile Photo with Anime Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="mb-4 sm:mb-6"
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto">
            {/* Animated glow rings */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #00f5ff, #b026ff, #ff2d95, #00f5ff)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-1 rounded-full bg-[#0a0a0f]" />
            <Image
              src={CONFIG.profileImage}
              alt={CONFIG.name}
              width={200}
              height={200}
              className="relative z-10 rounded-full object-cover p-1 w-full h-full"
              priority
            />
            {/* Floating particles around photo - hidden on mobile */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#00f5ff] hidden sm:block"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 100],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 tracking-tight"
        >
          <span className="text-white">Hi, I&apos;m </span>
          <GlitchText text={CONFIG.name} className="gradient-text" />
        </motion.h1>

        {/* Availability Badge */}
        {CONFIG.showAvailability && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-3"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs sm:text-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
              {CONFIG.availabilityText}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl lg:text-2xl text-[#00f5ff] font-mono mb-4 h-8"
        >
          <span className="typing-cursor">{typedText}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base mb-6 sm:mb-8 px-4 leading-relaxed"
        >
          Crafting intelligent solutions through machine learning and AI. 
          Transforming complex data into actionable insights.
        </motion.p>

        {/* Tech Stack Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-4"
        >
          {['Python', 'TensorFlow', 'NLP', 'RAG', 'ML'].map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-[#00f5ff]/50 hover:text-[#00f5ff] transition-all cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
        >
          <motion.a
            href="#projects"
            className="group relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full overflow-hidden w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f5ff] to-[#b026ff]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#b026ff] to-[#ff2d95] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-black font-semibold flex items-center justify-center gap-2 text-sm sm:text-base">
              <Terminal className="w-4 h-4" />
              View Projects
            </span>
          </motion.a>
          <motion.a
            href="#contact"
            className="group px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border border-white/20 text-white hover:border-[#00f5ff]/50 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm bg-white/5 w-full sm:w-auto text-sm sm:text-base"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 245, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-4 h-4" />
            Get in Touch
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 sm:mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="w-6 h-10 rounded-full border-2 border-[#00f5ff]/30 flex items-start justify-center p-2 mx-auto">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// About Section
const AboutSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { icon: Calendar, value: '3+', label: 'Years Experience', color: '#00f5ff' },
    { icon: Award, value: '6+', label: 'Major Projects', color: '#b026ff' },
    { icon: Users, value: '7', label: 'Team Members', color: '#ff2d95' },
    { icon: BookOpen, value: '4', label: 'Languages', color: '#39ff14' }
  ]

  return (
    <section id="about" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00f5ff] to-[#b026ff] mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00f5ff] to-[#b026ff] rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative tech-card rounded-3xl p-8 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f5ff] to-[#b026ff] flex items-center justify-center shadow-lg shadow-[#00f5ff]/20">
                    <Brain className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Data Scientist</h3>
                    <p className="text-gray-400 text-sm">6D Technologies Ltd</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                  Results-oriented Data Scientist with 3+ years of experience building scalable ML models 
                  for customer segmentation, recommendation systems, and conversational AI. Proven expertise 
                  in translating business problems into data-driven solutions.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4 text-[#00f5ff]" />
                    Bengaluru, India
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <GraduationCap className="w-4 h-4 text-[#00f5ff]" />
                    B.E. CGPA: 7.91/10
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['English', 'Kannada', 'Marathi', 'Hindi'].map((lang) => (
                    <span key={lang} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${stat.color}40, transparent)` }}
                />
                <div className="relative tech-card rounded-2xl p-6 text-center backdrop-blur-xl border border-white/5">
                  <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
                  <div className="text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-center mb-10">
            <span className="gradient-text">Experience</span>
          </h3>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00f5ff]/20 to-[#b026ff]/20 rounded-3xl blur-xl opacity-50" />
            <div className="relative tech-card rounded-3xl p-8 max-w-3xl mx-auto backdrop-blur-xl">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f5ff] to-[#b026ff] flex items-center justify-center shrink-0 shadow-lg shadow-[#00f5ff]/20">
                  <Server className="w-7 h-7 text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h4 className="text-xl font-bold text-white">Data Scientist</h4>
                    <span className="text-[#00f5ff] text-sm font-mono bg-[#00f5ff]/10 px-3 py-1 rounded-full">Jan 2023 — Present</span>
                  </div>
                  <p className="text-gray-400 mb-5">6D Technologies Ltd, Bengaluru</p>
                  <ul className="space-y-3 text-gray-300 text-sm">
                    {[
                      'Developed customer segmentation models for targeted marketing',
                      'Built product recommendation engines using matrix factorization',
                      'Designed RAG-based chatbots for customer value management',
                      'Created Text-to-Rule systems for dynamic business rule generation',
                      'Automated business processes using N8N and Seahorse Workflow'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Zap className="w-4 h-4 text-[#00f5ff] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Graduation cap icon
const GraduationCap = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)

// Skills Section
const SkillsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const skillCategories = [
    {
      title: 'Data Science & ML',
      icon: Brain,
      color: '#00f5ff',
      skills: [
        { name: 'Python', level: 95 },
        { name: 'TensorFlow', level: 85 },
        { name: 'Scikit-learn', level: 90 },
        { name: 'Pandas/NumPy', level: 95 },
        { name: 'Deep Learning', level: 85 },
        { name: 'NLP', level: 88 }
      ]
    },
    {
      title: 'Databases & Vector Stores',
      icon: Database,
      color: '#b026ff',
      skills: [
        { name: 'MySQL', level: 90 },
        { name: 'SingleStoreDB', level: 85 },
        { name: 'Redis Stack', level: 80 },
        { name: 'Chroma', level: 85 },
        { name: 'Supabase', level: 82 }
      ]
    },
    {
      title: 'Web & Automation',
      icon: Workflow,
      color: '#ff2d95',
      skills: [
        { name: 'JavaScript', level: 80 },
        { name: 'Streamlit', level: 90 },
        { name: 'RESTful APIs', level: 85 },
        { name: 'N8N', level: 88 },
        { name: 'Seahorse Workflow', level: 85 }
      ]
    },
    {
      title: 'Tools & Technologies',
      icon: Code,
      color: '#39ff14',
      skills: [
        { name: 'Git', level: 90 },
        { name: 'Linux', level: 85 },
        { name: 'RAG Architecture', level: 88 },
        { name: 'Recommendation Systems', level: 90 },
        { name: 'Customer Segmentation', level: 92 }
      ]
    }
  ]

  return (
    <section id="skills" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00f5ff] to-[#b026ff] mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + categoryIndex * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${category.color}30, transparent)` }}
              />
              <div className="relative tech-card rounded-3xl p-6 backdrop-blur-xl border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}15`, boxShadow: `0 0 20px ${category.color}20` }}
                  >
                    <category.icon className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-300">{skill.name}</span>
                        <span className="text-sm font-mono" style={{ color: category.color }}>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${category.color}, ${category.color}60)`,
                            boxShadow: `0 0 10px ${category.color}40`
                          }}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: 0.5 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <h3 className="text-xl font-bold text-center mb-8 text-white">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Python', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'MySQL', 'Redis', 'Chroma', 'Streamlit', 'N8N', 'Git', 'Linux'].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-[#00f5ff]/50 hover:text-[#00f5ff] transition-all cursor-default backdrop-blur-sm"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Projects Section
const ProjectsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const projects = [
    {
      title: 'AI-Powered Customer Segmentation',
      description: 'RFM analysis and behavioral pattern recognition system integrated with CRM for targeted marketing campaigns.',
      icon: BarChart3,
      tags: ['Python', 'Scikit-learn', 'Clustering', 'CRM'],
      color: '#00f5ff'
    },
    {
      title: 'Product Recommendation Engine',
      description: 'Collaborative filtering system with real-time APIs for prepaid and postpaid customer segments.',
      icon: Sparkles,
      tags: ['TensorFlow', 'Matrix Factorization', 'REST APIs'],
      color: '#b026ff'
    },
    {
      title: 'RAG-Based CVM Chatbot',
      description: 'Vector search and semantic search powered conversational AI for customer value management.',
      icon: MessageSquare,
      tags: ['RAG', 'Vector Search', 'NLP', 'Chroma'],
      color: '#ff2d95'
    },
    {
      title: 'Text-to-Rule Automation',
      description: 'NLP-powered intent classification system for dynamic business rule configuration.',
      icon: Cpu,
      tags: ['NLP', 'Intent Classification', 'Automation'],
      color: '#39ff14'
    },
    {
      title: 'ML Workflow Pipelines',
      description: 'End-to-end ML workflow automation using Seahorse, N8N, Apache Airflow, and Metabase.',
      icon: Workflow,
      tags: ['Seahorse', 'N8N', 'Airflow', 'Metabase'],
      color: '#ffa500'
    },
    {
      title: 'Interactive ML Dashboard',
      description: 'Streamlit-based dashboard for real-time model experimentation and visualization.',
      icon: Layers,
      tags: ['Streamlit', 'Visualization', 'Real-time'],
      color: '#00f5ff'
    }
  ]

  return (
    <section id="projects" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00f5ff] to-[#b026ff] mx-auto mb-4 rounded-full" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            A collection of machine learning and AI projects that solve real-world business problems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{ background: `linear-gradient(135deg, ${project.color}40, transparent)` }}
              />
              <div className="relative tech-card rounded-3xl p-6 h-full backdrop-blur-xl border border-white/5 cursor-pointer group-hover:border-white/10 transition-colors">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${project.color}15`, boxShadow: `0 0 20px ${project.color}20` }}
                >
                  <project.icon className="w-7 h-7" style={{ color: project.color }} />
                </div>

                <h3 className="text-lg font-bold mb-3 text-white group-hover:text-[#00f5ff] transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute bottom-6 right-6"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-black" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
const ContactSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormState({ name: '', email: '', message: '' })
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+91 9187585706', href: 'tel:+919187585706' },
    { icon: Mail, label: 'Email', value: 'prathameshece2022@gmail.com', href: 'mailto:prathameshece2022@gmail.com' },
    { icon: Linkedin, label: 'LinkedIn', value: 'LinkedIn Profile', href: 'https://linkedin.com/in/prathameshpatil' },
    { icon: Github, label: 'GitHub', value: 'GitHub Profile', href: 'https://github.com/prathameshpatil' }
  ]

  return (
    <section id="contact" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00f5ff] to-[#b026ff] mx-auto mb-4 rounded-full" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s discuss how we can work together to bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00f5ff]/20 to-[#b026ff]/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative tech-card rounded-3xl p-8 backdrop-blur-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                  <Send className="w-5 h-5 text-[#00f5ff]" />
                  Send a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
                    <Input
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-white/5 border-white/10 focus:border-[#00f5ff]/50 text-white placeholder:text-gray-500 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="john@example.com"
                      className="bg-white/5 border-white/10 focus:border-[#00f5ff]/50 text-white placeholder:text-gray-500 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Message</label>
                    <Textarea
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell me about your project..."
                      rows={5}
                      className="bg-white/5 border-white/10 focus:border-[#00f5ff]/50 text-white placeholder:text-gray-500 resize-none rounded-xl"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff] text-black font-bold hover:opacity-90 transition-opacity rounded-xl py-6"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                        />
                        Sending...
                      </span>
                    ) : isSubmitted ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Message Sent!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#b026ff]/20 to-[#00f5ff]/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative tech-card rounded-3xl p-8 backdrop-blur-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                  <Globe className="w-5 h-5 text-[#00f5ff]" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group border border-white/5 hover:border-[#00f5ff]/20"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f5ff]/10 to-[#b026ff]/10 flex items-center justify-center group-hover:from-[#00f5ff]/20 group-hover:to-[#b026ff]/20 transition-all">
                        <item.icon className="w-5 h-5 text-[#00f5ff]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f5ff]/10 via-[#b026ff]/10 to-[#ff2d95]/10" />
              <div className="relative tech-card p-8 text-center backdrop-blur-xl border border-white/5">
                <h3 className="text-2xl font-bold mb-3 gradient-text">Let&apos;s Collaborate</h3>
                <p className="text-gray-400 mb-5">
                  I&apos;m always open to discussing new projects, creative ideas, or opportunities.
                </p>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff] flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="relative py-8 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-400 text-sm"
          >
            © {new Date().getFullYear()} Prathamesh Patil. All rights reserved.
          </motion.p>
          
          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: 'https://github.com/prathameshpatil' },
              { icon: Linkedin, href: 'https://linkedin.com/in/prathameshpatil' },
              { icon: Mail, href: 'mailto:prathameshece2022@gmail.com' }
            ].map((social, i) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00f5ff] hover:border-[#00f5ff]/30 transition-all"
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// Chat Widget Component - Aesthetic Version
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Hey! 👋 I'm Prathamesh's AI assistant. Ask me anything about his skills, projects, or experience!" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages })
      })

      const data = await response.json()
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I couldn't process that. Please try again!" }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, there was an error. Please try again later!" }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="relative">
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff] flex items-center justify-center shadow-lg shadow-[#00f5ff]/25">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-6 h-6 text-black" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <MessageCircle className="w-6 h-6 text-black" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[550px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />
            
            {/* Chat Header */}
            <div className="relative p-5 border-b border-white/5">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f5ff]/5 to-[#b026ff]/5" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff] flex items-center justify-center shadow-lg shadow-[#00f5ff]/20">
                    <Bot className="w-6 h-6 text-black" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#12121a]" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">AI Assistant</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online • Ask about Prathamesh
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#00f5ff] to-[#b026ff] text-black rounded-2xl rounded-br-md'
                        : 'bg-white/5 text-gray-200 rounded-2xl rounded-bl-md border border-white/5'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 p-4 rounded-2xl rounded-bl-md border border-white/5">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 h-2 rounded-full bg-[#00f5ff]"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="relative p-4 border-t border-white/5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5ff]/30 transition-colors text-sm"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#00f5ff] to-[#b026ff] flex items-center justify-center disabled:opacity-50 shadow-lg shadow-[#00f5ff]/20"
                >
                  <Send className="w-5 h-5 text-black" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Main Page Component
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </main>
  )
}
