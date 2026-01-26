"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"
import { InteractiveGrid } from "./interactive-grid"

/**
 * Hero Section - Premium Tech Aesthetic with Interactive Background
 * 
 * Architecture follows SOLID principles:
 * - SRP: Interactive grid separated to InteractiveGrid component
 * - DRY: Button styles extracted to reusable constants
 * 
 * Accessibility:
 * - WCAG AA compliant contrast: dark text on white background
 * - Semantic HTML: section, h1, ul elements
 * - Canvas is aria-hidden and pointer-events-none
 */

const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
}

// DRY: Reusable button style tokens
const BUTTON_BASE = "px-7 py-3.5 rounded-full font-bold text-sm tracking-wide relative overflow-hidden cursor-pointer transition-all duration-300"
const BUTTON_PRIMARY = `${BUTTON_BASE} bg-[#00FF00] text-[#0a0a0a] flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,0,0.4)] hover:scale-[1.02]`
const BUTTON_SECONDARY = `${BUTTON_BASE} border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white`

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const rawOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const opacity = useSpring(rawOpacity, springConfig)

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const y = useSpring(rawY, springConfig)

  return (
    <section
      id="hero"
      ref={ref}
      aria-label="Sección principal - DevDiaz Labs"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Interactive Canvas Grid Background (z-0) */}
      <InteractiveGrid />

      {/* Main Content Container (z-10 - above canvas) */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-20"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-8">

          {/* Status Badge */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2.5 bg-gray-900 text-white px-5 py-2.5 rounded-full text-xs font-mono tracking-widest"
          >
            <span
              className="w-2 h-2 bg-[#00FF00] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,0,0.6)]"
              aria-hidden="true"
            />
            INNOVACIÓN TECNOLÓGICA
          </motion.div>

          {/* Main Heading - Dark text on light background (WCAG AA) */}
          <motion.h1
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.9]"
          >
            <span className="block text-gray-900">IMPULSA TU</span>
            <span className="block text-[#00DD00] drop-shadow-[0_0_60px_rgba(0,255,0,0.25)]">
              AMBICIÓN
            </span>
          </motion.h1>

          {/* Subtitle - Monospace "Code-Style" for Dev aesthetic */}
          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg md:text-xl lg:text-2xl font-mono font-medium text-gray-600 tracking-tight max-w-2xl leading-relaxed"
          >
            Desarrollo de soluciones que transforman tu día a día.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 pt-6"
          >
            <a href="#services" aria-label="Ver nuestros servicios">
              <motion.button
                className={BUTTON_PRIMARY}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Ver Servicios</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </a>

            <a href="#products" aria-label="Explorar nuestros productos">
              <motion.button
                className={`${BUTTON_SECONDARY} focus-visible:ring-2 focus-visible:ring-[#00FF00] focus-visible:ring-offset-2`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explora Nuestros Productos
              </motion.button>
            </a>
          </motion.div>

          {/* Benefits List */}
          <motion.ul
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8"
            aria-label="Beneficios principales"
          >
            {[
              "Diseño Intuitivo",
              "Resultados ágiles",
              "Innovación Constante",
              "Digitalizamos tu visión"
            ].map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2.5 text-sm font-medium text-gray-600"
              >
                <span
                  className="w-1.5 h-1.5 bg-[#00FF00] rounded-full shadow-[0_0_6px_rgba(0,255,0,0.5)]"
                  aria-hidden="true"
                />
                {benefit}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-3 bg-gray-400 rounded-full"
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
