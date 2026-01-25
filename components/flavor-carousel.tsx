"use client"

import type React from "react"

import { motion, AnimatePresence, useSpring } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Sensu",
    tagline: "Tu diario emocional inteligente",
    description: "Registra tus emociones, visualiza tus patrones y toma el control de tu día a día con estadísticas claras.",
    image: "/images/sensu-mockup.png",
    bgColor: "from-[#00FF00]/20 via-[#00FF00]/10 to-transparent",
    accentColor: "#00FF00",
    tags: ["Inteligencia Emocional", "Monitoreo real-time", "Bienestar mental"],
    status: "available",
  },
  {
    id: 2,
    name: "Gritia",
    tagline: "La evolución del Gym",
    description: "Transforma tu entrenamiento con rutinas inteligentes y análisis de progreso en tiempo real.",
    image: "/images/gritia-app.jpg",
    bgColor: "from-[#FFD700]/20 via-[#FFD700]/10 to-transparent",
    accentColor: "#FFD700",
    tags: ["Rutinas Inteligentes", "Análisis de Progreso"],
    status: "coming-soon",
  },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? -15 : 15,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  }),
}

export function FlavorCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const currentProduct = products[currentIndex]

  const rotateX = useSpring(0, { stiffness: 150, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) / (rect.width / 2)
    const y = (e.clientY - centerY) / (rect.height / 2)
    rotateY.set(x * 5)
    rotateX.set(-y * 5)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const paginate = (newDirection: number) => {
    const newIndex = (currentIndex + newDirection + products.length) % products.length
    setCurrentIndex(newIndex)
    setDirection(newDirection)
  }

  const nextProduct = () => paginate(1)
  const prevProduct = () => paginate(-1)

  return (
    <section id="products" className="relative py-16 bg-[#121212] overflow-hidden">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentProduct.bgColor}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        key={currentProduct.id}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-10"
        >
          <motion.span
            className="font-mono text-[#00FF00] text-sm md:text-base tracking-[0.2em] font-bold"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            NUESTROS PRODUCTOS
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mt-2 overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              ELIGE TU{" "}
            </motion.span>
            <motion.span
              className="inline-block"
              style={{ color: currentProduct.accentColor }}
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.1 }}
            >
              HERRAMIENTA
            </motion.span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="flex items-center justify-center gap-6">
            <motion.button
              onClick={prevProduct}
              className="hidden md:flex w-12 h-12 rounded-full border-2 border-white/20 items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentProduct.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative w-full max-w-3xl"
                style={{ perspective: 1000 }}
              >
                <motion.div
                  className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#121212]/10 shadow-xl"
                  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <motion.div
                      className="relative aspect-[3/4] flex items-center justify-center rounded-2xl overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Image
                        src={currentProduct.image || "/placeholder.svg"}
                        alt={currentProduct.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    <div className="space-y-4">
                      <div>
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-2">
                          {currentProduct.status === "available" ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#00FF00]/20 rounded-full text-xs font-mono text-[#00AA00]">
                              <span className="w-1.5 h-1.5 bg-[#00FF00] rounded-full animate-pulse" />
                              Disponible Ahora
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#FFD700]/20 rounded-full text-xs font-mono text-[#B8860B]">
                              <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full" />
                              Próximamente
                            </span>
                          )}
                        </div>

                        <motion.span
                          className="font-mono text-xs tracking-widest"
                          style={{ color: currentProduct.accentColor }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {currentProduct.tagline.toUpperCase()}
                        </motion.span>
                        <motion.h3
                          className="text-3xl md:text-4xl font-black text-[#121212] tracking-tighter mt-1"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        >
                          {currentProduct.name}
                        </motion.h3>
                      </div>

                      <motion.p
                        className="text-sm text-[#121212]/60 font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {currentProduct.description}
                      </motion.p>

                      <motion.div
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {currentProduct.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#121212]/5 rounded-full text-xs font-mono text-[#121212]/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </motion.div>

                      {currentProduct.status === "available" ? (
                        <motion.button
                          className="px-6 py-3 rounded-full font-bold text-sm tracking-wide w-full md:w-auto relative overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          style={{ backgroundColor: currentProduct.accentColor, color: "#121212" }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <motion.span
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                          <span className="relative z-10">Descargar App</span>
                        </motion.button>
                      ) : (
                        <motion.div
                          className="flex items-center gap-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.div
                            className="w-2 h-2 bg-[#FFD700] rounded-full"
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          />
                          <span className="font-mono text-xs text-[#121212]/60">Lanzamiento próximo...</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <motion.button
              onClick={nextProduct}
              className="hidden md:flex w-12 h-12 rounded-full border-2 border-white/20 items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex md:hidden justify-center gap-4 mt-6">
            <motion.button
              onClick={prevProduct}
              className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={nextProduct}
              className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {products.map((product, index) => (
              <motion.button
                key={product.id}
                onClick={() => {
                  const newDirection = index > currentIndex ? 1 : -1
                  setCurrentIndex(index)
                  setDirection(newDirection)
                }}
                className="h-2 rounded-full transition-all"
                style={{
                  backgroundColor: index === currentIndex ? product.accentColor : "rgba(255,255,255,0.2)",
                }}
                animate={{
                  width: index === currentIndex ? 28 : 10,
                }}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
