'use client'

import { useEffect, useRef, useState, Suspense, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ============================================
// 🔧 CONFIGURATION
// ============================================
const CONFIG = {
  name: "Prathamesh Patil",
  title: "AI/ML Engineer",
  email: "prathameshece2022@gmail.com",
  linkedin: "https://www.linkedin.com/in/prathamesh-m-patil-810024229",
  github: "https://github.com/Pratham0145",
  showAvailability: true,
  availabilityText: "Available for opportunities",
}

// Apple-style cinematic camera settings
const CAMERA_SETTINGS = {
  startZ: 0.4,
  endZ: 4.5,
  startY: 1.6,
  endY: 1.0,
  startX: 0,
  endX: 0.3,
  fov: 50,
}

// Model settings
const MODEL_SETTINGS = {
  scale: 2.5,
  faceOffset: 1.5,
}

// Animation settings
const ANIMATION_SETTINGS = {
  lerpFactor: 0.08,
  scrollDuration: 400,
  mobileScrollDuration: 200,
}
// ============================================

// 3D Model Component
function Model({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const { scene: originalScene } = useGLTF('/model.glb') as { scene: THREE.Group }
  const modelRef = useRef<THREE.Group>(null)
  
  const smoothProgress = useRef(0)
  const smoothZ = useRef(CAMERA_SETTINGS.startZ)
  const smoothY = useRef(CAMERA_SETTINGS.startY)
  const smoothX = useRef(CAMERA_SETTINGS.startX)
  
  const clonedScene = useMemo(() => {
    if (!originalScene) return null
    const clone = originalScene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    
    clone.position.x = -center.x
    clone.position.y = -center.y + (size.y / 2)
    clone.position.z = -center.z
    clone.scale.set(MODEL_SETTINGS.scale, MODEL_SETTINGS.scale, MODEL_SETTINGS.scale)
    clone.rotation.y = Math.PI * 0.05
    
    return clone
  }, [originalScene])
  
  useFrame(({ camera }) => {
    const targetProgress = scrollProgress.current
    
    smoothProgress.current = THREE.MathUtils.lerp(
      smoothProgress.current, 
      targetProgress, 
      ANIMATION_SETTINGS.lerpFactor
    )
    
    const progress = smoothProgress.current
    
    const targetZ = THREE.MathUtils.lerp(CAMERA_SETTINGS.startZ, CAMERA_SETTINGS.endZ, progress)
    const targetY = THREE.MathUtils.lerp(CAMERA_SETTINGS.startY, CAMERA_SETTINGS.endY, progress)
    const targetX = THREE.MathUtils.lerp(CAMERA_SETTINGS.startX, CAMERA_SETTINGS.endX, progress)
    
    smoothZ.current = THREE.MathUtils.lerp(smoothZ.current, targetZ, ANIMATION_SETTINGS.lerpFactor * 1.5)
    smoothY.current = THREE.MathUtils.lerp(smoothY.current, targetY, ANIMATION_SETTINGS.lerpFactor * 1.5)
    smoothX.current = THREE.MathUtils.lerp(smoothX.current, targetX, ANIMATION_SETTINGS.lerpFactor * 1.5)
    
    camera.position.x = smoothX.current
    camera.position.y = smoothY.current
    camera.position.z = smoothZ.current
    
    const lookAtY = MODEL_SETTINGS.faceOffset - (progress * 0.5)
    camera.lookAt(0, lookAtY, 0)
    
    if (modelRef.current) {
      const targetRotation = THREE.MathUtils.lerp(Math.PI * 0.05, Math.PI * 0.15, progress)
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        targetRotation,
        ANIMATION_SETTINGS.lerpFactor
      )
    }
  })
  
  if (!clonedScene) return null
  
  return (
    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1} floatingHeight={0.03}>
      <primitive ref={modelRef} object={clonedScene} />
    </Float>
  )
}

// Camera controller
function CameraController() {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(0, CAMERA_SETTINGS.startY, CAMERA_SETTINGS.startZ)
    camera.lookAt(0, MODEL_SETTINGS.faceOffset, 0)
  }, [camera])
  
  return null
}

// 3D Scene Component
function Scene3D({ scrollProgress, isMobile }: { scrollProgress: React.MutableRefObject<number>; isMobile: boolean }) {
  return (
    <Canvas
      shadows={!isMobile}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ 
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      style={{ background: 'transparent', touchAction: 'pan-y' }}
      camera={{ 
        fov: CAMERA_SETTINGS.fov, 
        position: [CAMERA_SETTINGS.startX, CAMERA_SETTINGS.startY, CAMERA_SETTINGS.startZ],
        near: 0.1,
        far: 100
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow={!isMobile} />
      {!isMobile && (
        <>
          <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#00f5ff" />
          <pointLight position={[0, 3, 2]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-2, 2, 3]} intensity={0.4} color="#b026ff" />
        </>
      )}
      <spotLight position={[5, 5, -5]} angle={0.3} penumbra={1} intensity={0.5} color="#00f5ff" />
      <Environment preset={isMobile ? 'apartment' : 'city'} />
      <fog attach="fog" args={['#030308', 3, 15]} />
      <CameraController />
      <Suspense fallback={null}>
        <Model scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  )
}

// Loader
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#030308]">
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-[#00f5ff] text-lg font-mono flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 border-2 border-[#00f5ff] border-t-transparent rounded-full animate-spin" />
        <span>Loading 3D Experience...</span>
      </motion.div>
    </div>
  )
}

// Particles
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 1.5 + Math.random() * 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['#00f5ff', '#b026ff', '#ff2d95', '#39ff14'][Math.floor(Math.random() * 4)],
    duration: 15 + Math.random() * 20,
    delay: Math.random() * -20,
  }))
}

// Mobile detection
function isMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768 || 'ontouchstart' in window
}

// Auto Scroll Button Component for Mobile
function AutoScrollButton({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const [isPressed, setIsPressed] = useState(false)
  const [scrollComplete, setScrollComplete] = useState(false)
  const animationRef = useRef<number | null>(null)
  const isPressedRef = useRef(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const scrollFunctionRef = useRef<() => void>(() => {})
  
  const scrollSpeed = 3 // pixels per frame
  
  // Get the maximum scroll distance
  const getMaxScroll = useCallback(() => {
    if (typeof window === 'undefined') return 1000
    return window.innerHeight * 2
  }, [])
  
  // Scroll function - stored in ref to avoid dependency issues
  useEffect(() => {
    scrollFunctionRef.current = () => {
      const maxScroll = getMaxScroll()
      const currentScroll = window.scrollY
      
      if (currentScroll >= maxScroll - 10) {
        setScrollComplete(true)
        setIsPressed(false)
        isPressedRef.current = false
        return
      }
      
      // Scroll by a small amount
      window.scrollBy(0, scrollSpeed)
      
      // Continue scrolling if still pressed
      if (isPressedRef.current) {
        animationRef.current = requestAnimationFrame(scrollFunctionRef.current)
      }
    }
  }, [getMaxScroll, scrollSpeed])
  
  // Start auto scroll
  const startAutoScroll = useCallback(() => {
    setIsPressed(true)
    isPressedRef.current = true
    setScrollComplete(false)
    
    // Start the animation loop
    animationRef.current = requestAnimationFrame(scrollFunctionRef.current)
  }, [])
  
  // Stop auto scroll
  const stopAutoScroll = useCallback(() => {
    setIsPressed(false)
    isPressedRef.current = false
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])
  
  // Check scroll position
  useEffect(() => {
    const checkScroll = () => {
      const maxScroll = getMaxScroll()
      if (window.scrollY >= maxScroll * 0.9) {
        setScrollComplete(true)
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [getMaxScroll])
  
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        {/* Instruction text */}
        {!scrollComplete && (
          <span className="text-gray-400 text-xs font-medium">
            {isPressed ? 'Release to stop...' : 'Press & hold to explore'}
          </span>
        )}
        
        {/* The button */}
        <motion.button
          ref={buttonRef}
          onTouchStart={(e) => {
            e.preventDefault()
            e.stopPropagation()
            startAutoScroll()
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            e.stopPropagation()
            stopAutoScroll()
          }}
          onTouchCancel={(e) => {
            e.preventDefault()
            stopAutoScroll()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            startAutoScroll()
          }}
          onMouseUp={(e) => {
            e.preventDefault()
            stopAutoScroll()
          }}
          onMouseLeave={stopAutoScroll}
          onContextMenu={(e) => e.preventDefault()}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 touch-none ${
            isPressed 
              ? 'bg-gradient-to-r from-[#00f5ff] to-[#b026ff] scale-110' 
              : 'bg-white/10 border-2 border-[#00f5ff]/50'
          }`}
          whileTap={{ scale: 0.95 }}
          style={{ 
            boxShadow: isPressed 
              ? '0 0 40px rgba(0, 245, 255, 0.5), 0 0 80px rgba(176, 38, 255, 0.3)' 
              : '0 0 20px rgba(0, 245, 255, 0.2)',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          {/* Inner circle with animation */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
            isPressed ? 'bg-black/30' : 'bg-[#00f5ff]/20'
          }`}>
            {isPressed ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <motion.svg
                className="w-6 h-6 text-[#00f5ff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>
            )}
          </div>
          
          {/* Pulse rings when pressed */}
          {isPressed && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#00f5ff]"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#b026ff]"
                animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </>
          )}
        </motion.button>
        
        {/* Scroll complete message */}
        {scrollComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 text-xs font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Scroll complete!
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const availabilityRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const techTagsRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  
  const scrollProgress = useRef(0)
  
  const [particles] = useState(() => generateParticles(typeof window !== 'undefined' && window.innerWidth < 768 ? 15 : 30))
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(() => isMobile())

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 1200)
    const handleResize = () => setIsMobileDevice(isMobile())
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(loadTimer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Native scroll handler for mobile - more reliable than GSAP on Android
  const handleScroll = useCallback(() => {
    if (!heroRef.current) return
    
    // On mobile with fixed hero, use window scrollY directly
    const scrollDistance = isMobileDevice ? window.innerHeight * 2 : window.innerHeight * 4
    const scrolled = window.scrollY
    const progress = Math.min(1, Math.max(0, scrolled / scrollDistance))
    
    scrollProgress.current = progress
    
    // Update UI elements visibility based on progress
    const elements = [
      { ref: availabilityRef, showAt: 0.1 },
      { ref: nameRef, showAt: 0.2 },
      { ref: titleRef, showAt: 0.35 },
      { ref: descRef, showAt: 0.5 },
      { ref: techTagsRef, showAt: 0.65 },
      { ref: buttonsRef, showAt: 0.8 },
    ]
    
    elements.forEach(({ ref, showAt }) => {
      if (ref.current) {
        const opacity = progress >= showAt ? 1 : 0
        const translateY = progress >= showAt ? 0 : 30
        ref.current.style.opacity = String(opacity)
        ref.current.style.transform = `translateY(${translateY}px)`
      }
    })
  }, [isMobileDevice])

  // Setup scroll listener
  useEffect(() => {
    if (!isLoaded) return
    
    // Use native scroll for mobile, GSAP for desktop
    if (isMobileDevice) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial call
      
      return () => window.removeEventListener('scroll', handleScroll)
    } else {
      // GSAP ScrollTrigger for desktop
      const ctx = gsap.context(() => {
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: `+=${ANIMATION_SETTINGS.scrollDuration}%`,
            scrub: 2,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              scrollProgress.current = self.progress
            }
          }
        })

        if (particlesRef.current) {
          gsap.set(particlesRef.current, { scale: 1.5, opacity: 0 })
          heroTimeline.to(particlesRef.current, { scale: 1, opacity: 1, ease: 'none', duration: 1 }, 0)
        }

        const textElements = [
          { ref: availabilityRef, pos: 0.5, y: 30 },
          { ref: nameRef, pos: 0.8, y: 50 },
          { ref: titleRef, pos: 1.1, y: 40 },
          { ref: descRef, pos: 1.4, y: 30 },
          { ref: techTagsRef, pos: 1.6, y: 20 },
          { ref: buttonsRef, pos: 1.9, y: 30 },
        ]

        textElements.forEach(({ ref, pos, y }) => {
          if (ref.current) {
            gsap.set(ref.current, { opacity: 0, y })
            heroTimeline.to(ref.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, pos)
          }
        })
      }, containerRef)

      return () => ctx.revert()
    }
  }, [isLoaded, isMobileDevice, handleScroll])

  return (
    <div ref={containerRef} className="relative bg-[#030308] text-white">
      
      {/* Mobile hero spacer - creates scroll room */}
      {isMobileDevice && <div className="h-[200vh]" />}
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`fixed inset-0 w-full h-screen overflow-hidden ${isMobileDevice ? '' : 'relative'}`}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="depth-overlay absolute inset-0 bg-[#030308] z-30 pointer-events-none opacity-50" />
        
        {/* 3D Canvas */}
        <div ref={canvasRef} className="absolute inset-0 z-10">
          {isLoaded ? (
            <Scene3D scrollProgress={scrollProgress} isMobile={isMobileDevice} />
          ) : (
            <Loader />
          )}
        </div>

        {/* Particles */}
        <div ref={particlesRef} className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(p.id) * 15, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Glowing orbs */}
        <div className="absolute inset-0 z-5 pointer-events-none">
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.3) 0%, transparent 70%)', right: '5%', top: '10%' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(176,38,255,0.3) 0%, transparent 70%)', left: '0%', bottom: '20%' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        {/* Gradient edges */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#030308] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030308] to-transparent" />
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 z-25 flex items-center pointer-events-none">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">
            <div className="ml-auto max-w-xl text-right space-y-4">
              
              <div ref={availabilityRef} className="flex justify-end transition-all duration-500" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {CONFIG.availabilityText}
                </span>
              </div>

              <div ref={nameRef} className="transition-all duration-500" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Hi, I&apos;m<br />
                  <span className="gradient-text">{CONFIG.name}</span>
                </h1>
              </div>

              <div ref={titleRef} className="transition-all duration-500" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#00f5ff] font-mono">
                  {CONFIG.title}
                </h2>
              </div>

              <div ref={descRef} className="transition-all duration-500" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                <p className="text-gray-400 text-sm sm:text-base max-w-md ml-auto">
                  Building intelligent systems with machine learning and AI. 
                  Transforming complex data into actionable insights.
                </p>
              </div>

              <div ref={techTagsRef} className="flex flex-wrap justify-end gap-2 transition-all duration-500" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                {['Python', 'TensorFlow', 'NLP', 'RAG', 'ML'].map((tech) => (
                  <span key={tech} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300 backdrop-blur-sm">
                    {tech}
                  </span>
                ))}
              </div>

              <div ref={buttonsRef} className="flex justify-end gap-3 pt-2 pointer-events-auto transition-all duration-500" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                <motion.a
                  href="#projects"
                  className="group relative px-6 py-2.5 rounded-full overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00f5ff] to-[#b026ff]" />
                  <span className="relative text-black font-semibold flex items-center gap-2 text-sm">
                    View Projects
                    <ArrowIcon className="w-4 h-4" />
                  </span>
                </motion.a>
                <motion.a
                  href="#contact"
                  className="px-6 py-2.5 rounded-full border border-white/20 text-white text-sm backdrop-blur-sm hover:border-[#00f5ff]/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Me
                </motion.a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - Desktop */}
        {!isMobileDevice && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-25">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-gray-500 text-xs">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5"
              >
                <motion.div
                  animate={{ y: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-1.5 rounded-full bg-[#00f5ff]"
                />
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Press and Hold button - Mobile */}
        {isMobileDevice && (
          <AutoScrollButton scrollProgress={scrollProgress} />
        )}
      </section>

      {/* Content sections */}
      <section id="about" className={`relative min-h-screen flex items-center py-24 px-6 bg-[#030308] ${isMobileDevice ? 'mt-[100vh]' : ''}`}>
        <div className="max-w-5xl mx-auto w-full">
          <SectionTitle title="About Me" subtitle="Get to know me" />
          
          <div className="grid lg:grid-cols-2 gap-10 items-center mt-14">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="tech-card p-7 rounded-2xl"
            >
              <p className="text-gray-300 leading-relaxed mb-6 text-base">
                Results-oriented <span className="text-[#00f5ff]">Data Scientist</span> with 3+ years building 
                scalable ML models for customer segmentation, recommendation systems, and conversational AI.
                Currently at <span className="text-[#b026ff]">6D Technologies Ltd</span>.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-400">
                  <LocationIcon className="w-5 h-5 text-[#00f5ff]" />
                  <span>Bengaluru, India</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <EducationIcon className="w-5 h-5 text-[#00f5ff]" />
                  <span>B.E. CGPA: 7.91</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['English', 'Kannada', 'Marathi', 'Hindi'].map((lang) => (
                  <span key={lang} className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-gray-400">
                    {lang}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '3+', label: 'Years Experience' },
                { value: '6+', label: 'Projects' },
                { value: '7', label: 'Team Size' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="tech-card p-6 rounded-xl text-center"
                >
                  <div className="text-4xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="relative min-h-screen flex items-center py-24 px-6 bg-[#030308]">
        <div className="max-w-5xl mx-auto w-full">
          <SectionTitle title="My Stack" subtitle="Technologies I work with" />
          
          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {[
              { title: 'ML & AI', skills: ['Python', 'TensorFlow', 'Scikit-learn', 'Deep Learning', 'NLP'], color: '#00f5ff' },
              { title: 'Data', skills: ['MySQL', 'SingleStoreDB', 'Redis', 'Chroma', 'Pandas'], color: '#b026ff' },
              { title: 'Tools', skills: ['Git', 'Linux', 'N8N', 'Streamlit', 'REST APIs'], color: '#ff2d95' },
            ].map((category, i) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="tech-card p-6 rounded-2xl"
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: category.color }}>
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-gray-400">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="relative min-h-screen flex items-center py-24 px-6 bg-[#030308]">
        <div className="max-w-5xl mx-auto w-full">
          <SectionTitle title="Featured Projects" subtitle="Some things I've built" />
          
          <div className="grid md:grid-cols-2 gap-6 mt-14">
            {[
              { title: 'Customer Segmentation', desc: 'RFM analysis and behavioral pattern recognition for targeted marketing', tags: ['Python', 'Scikit-learn', 'Clustering'], color: '#00f5ff' },
              { title: 'Recommendation Engine', desc: 'Collaborative filtering with real-time APIs for customer segments', tags: ['TensorFlow', 'Matrix Factorization'], color: '#b026ff' },
              { title: 'RAG Chatbot', desc: 'Vector search powered conversational AI for customer management', tags: ['RAG', 'Vector Search', 'NLP'], color: '#ff2d95' },
              { title: 'Text-to-Rule System', desc: 'NLP-powered intent classification for dynamic business rules', tags: ['NLP', 'Automation'], color: '#39ff14' },
            ].map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="group tech-card p-6 rounded-2xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${project.color}15` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00f5ff] transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-500 mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-sm text-gray-600">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative min-h-[70vh] flex items-center py-24 px-6 bg-[#030308]">
        <div className="max-w-3xl mx-auto text-center w-full">
          <SectionTitle title="Let's Connect" subtitle="Have a project in mind?" />
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-14"
          >
            <motion.a
              href={`mailto:${CONFIG.email}`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff] text-black font-semibold text-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,245,255,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <MailIcon className="w-5 h-5" />
              Say Hello
            </motion.a>

            <div className="flex justify-center gap-10 mt-10">
              {[
                { href: CONFIG.github, icon: GithubIcon, label: 'GitHub' },
                { href: CONFIG.linkedin, icon: LinkedInIcon, label: 'LinkedIn' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#00f5ff] transition-colors flex flex-col items-center gap-2"
                  whileHover={{ scale: 1.1, y: -3 }}
                >
                  <social.icon className="w-6 h-6" />
                  <span className="text-xs">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-white/5 bg-[#030308]">
        <div className="max-w-5xl mx-auto text-center text-gray-600">
          <p>Designed & Built by {CONFIG.name}</p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  )
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <h2 className="text-3xl lg:text-5xl font-bold text-white mb-3">
        {title.split(' ').map((word, i) => (
          i === title.split(' ').length - 1 ? 
            <span key={i} className="gradient-text">{word}</span> : 
            <span key={i}>{word} </span>
        ))}
      </h2>
      <p className="text-gray-500">{subtitle}</p>
    </motion.div>
  )
}

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const EducationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
)

// Chat Widget
function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: `Hi! I'm ${CONFIG.name.split(' ')[0]}'s AI assistant. How can I help you today?` }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          context: { name: CONFIG.name, title: CONFIG.title, email: CONFIG.email, linkedin: CONFIG.linkedin, github: CONFIG.github }
        }),
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || "I'm here to help!" }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff] flex items-center justify-center shadow-lg shadow-[#00f5ff]/20"
        whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(0,245,255,0.5)' }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
          >
            <div className="bg-gradient-to-r from-[#0a0a15] to-[#12121a] p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff] flex items-center justify-center">
                  <span className="text-black text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Assistant</h3>
                  <p className="text-xs text-[#00f5ff]">Ask about {CONFIG.name.split(' ')[0]}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a15] h-[calc(100%-140px)] overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-[#00f5ff] to-[#b026ff] text-black rounded-br-md' : 'bg-white/5 text-gray-200 rounded-bl-md border border-white/10'}`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10">
                    <div className="flex gap-1">
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-[#00f5ff] rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-[#b026ff] rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-[#ff2d95] rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="bg-[#0a0a15] p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5ff]/50"
                  disabled={isLoading}
                />
                <motion.button type="submit" disabled={!input.trim() || isLoading} className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b026ff] flex items-center justify-center disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
