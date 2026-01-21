"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Smartphone, Monitor, Ticket } from "lucide-react"

const services = [
  {
    icon: Smartphone,
    title: "Desarrollo de Apps Móviles",
    description: "Transformamos tu idea en una app funcional y potente. Especialistas en desarrollo nativo para el ecosistema Android.",
  },
  {
    icon: Monitor,
    title: "Sitios Web & Landing Pages",
    description: "Dale presencia digital a tu negocio. Creamos páginas web rápidas, modernas y adaptables para que tus clientes te encuentren fácil.",
  },
  {
    icon: Ticket,
    title: "Invitaciones Digitales Interactivas",
    description: "Lleva tu evento al siguiente nivel. Invitaciones web interactivas con mapas, confirmación de asistencia y galerías para tus eventos.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
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

export function ActivationsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section id="services" className="relative py-24 bg-[#0a0a0a] overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-[#00FF00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            className="font-mono text-[#00FF00] text-sm tracking-[0.2em] font-bold inline-block mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            NUESTROS SERVICIOS
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Soluciones Digitales
            <span className="block text-gray-500 mt-2 text-2xl md:text-3xl font-medium">de Alto Impacto</span>
          </h2>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[
            {
              icon: Smartphone,
              title: "Apps Android",
              description: "Desarrollo nativo y publicación en Play Store.",
            },
            {
              icon: Monitor,
              title: "Web & Landing Pages",
              description: "Sitios modernos de alta conversión.",
            },
            {
              icon: Ticket,
              title: "Invitaciones Digitales",
              description: "Invitaciones interactivas con mapas y RSVP.",
            },
          ].map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 min-h-[320px] flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-[#00FF00]/50 hover:shadow-[0_0_30px_rgba(0,255,0,0.15)]"
            >
              {/* Neon Glow element on hover */}
              <div className="absolute inset-0 rounded-3xl bg-[#00FF00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-[#00FF00]/10 flex items-center justify-center group-hover:bg-[#00FF00] transition-colors duration-300"
                  >
                    <service.icon className="w-8 h-8 text-[#00FF00] group-hover:text-black transition-colors duration-300" />
                  </motion.div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-400 text-base leading-relaxed flex-grow">
                  {service.description}
                </p>

                {/* Arrow on hover at bottom */}
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center text-[#00FF00] font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Saber más
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
