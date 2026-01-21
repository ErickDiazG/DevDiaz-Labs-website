"use client"

import { motion, useInView } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
}

export function Footer() {
  const [isHovering, setIsHovering] = useState(false)
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, margin: "-100px" })

  const footerLinks = [
    {
      title: "Productos",
      links: ["Sensu", "Gritia", "Próximamente"],
    },
    {
      title: "Enlaces",
      links: ["Inicio", "Productos", "Tecnología", "Nosotros"],
    },
    {
      title: "Empresa",
      links: ["Sobre Nosotros", "Carreras", "Blog"],
    },
    {
      title: "Legal",
      links: ["Privacidad", "Términos", "Cookies"],
    },
  ]

  return (
    <footer id="contact" ref={footerRef} className="relative bg-[#121212] pt-24 pb-6 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-[#00FF00]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-[1.1] mb-6">
            <motion.span
              className="block"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              ¿LISTO PARA TRANSFORMAR
            </motion.span>
            <motion.span
              className="block text-[#00FF00]"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              TUS IDEAS?
            </motion.span>
          </h2>

          <motion.p
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-mono leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Llevamos tu proyecto del concepto al código. Cuéntanos qué quieres construir y hagámoslo realidad.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#00FF00] text-black font-bold px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(0,255,0,0.4)] transition-all duration-300 md:text-lg group"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.58 2.062.887 3.193.887h.005c3.181 0 5.768-2.586 5.768-5.766.001-3.181-2.587-5.77-5.768-5.77zm0 13c-1.396 0-2.618-.465-3.666-1.168l-4.14 1.084 1.104-4.032c-.896-1.295-1.393-2.671-1.392-4.116.003-4.288 3.491-7.776 7.781-7.776 4.287 0 7.774 3.488 7.774 7.774 0 4.29-3.488 7.779-7.781 7.779zm4.242-5.816c-.234-.117-1.383-.682-1.597-.76-.215-.078-.371-.117-.527.117-.156.235-.605.761-.741.918-.137.156-.273.176-.507.059-.234-.117-.989-.365-1.884-1.163-.695-.62-1.163-1.385-1.3-1.619-.136-.234-.015-.361.103-.477.106-.104.234-.273.351-.41.117-.137.156-.234.234-.39.078-.157.039-.293-.02-.41-.058-.117-.527-1.269-.722-1.738-.189-.456-.381-.392-.527-.398l-.449-.005c-.156 0-.41.059-.624.293-.215.234-.82 1.259-.001 2.37.525.711 1.012 1.201 1.705 1.705.584.425 1.267.756 1.956.97.689.215 1.344.303 1.948.336.702.038 1.49-.033 2.155-.386.665-.353 1.119-1.002 1.275-1.469.156-.468.156-.867.117-.935-.039-.068-.156-.117-.39-.234z" />
              </svg>
              Cotizar mi Proyecto Ahora
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/60 font-mono text-xs max-w-xl mx-auto leading-relaxed">
            DevDiaz Labs es un estudio de desarrollo de software especializado en crear aplicaciones que transforman la vida de las personas. IA, mobile y más.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-white/10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="font-bold text-white text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((item) => (
                  <li key={item}>
                    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                      <Link
                        href="#"
                        className="text-white/60 hover:text-[#00FF00] font-mono text-xs transition-colors inline-block"
                      >
                        {item}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10 gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="text-xl font-black">
              <span className="text-white">DevDiaz</span>
              <span className="text-[#00FF00]">Labs</span>
            </span>
          </motion.div>

          <p className="text-white/40 font-mono text-xs">© 2026 DevDiaz Labs</p>

          <motion.p
            className="text-white/30 font-mono text-xs cursor-pointer"
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            animate={
              isHovering
                ? {
                  rotate: [0, -5, 5, -5, 5, 0],
                  scale: [1, 1.1, 1],
                  color: "#00FF00",
                }
                : {
                  rotate: 0,
                  scale: 1,
                  color: "rgba(255,255,255,0.3)",
                }
            }
            transition={{ duration: 0.5 }}
          >
            hecho con código
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10rem] md:text-[20rem] font-black text-white/[0.02] pointer-events-none select-none leading-none whitespace-nowrap"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        DevDiaz
      </motion.div>
    </footer>
  )
}
