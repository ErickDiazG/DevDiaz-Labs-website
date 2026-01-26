/**
 * Brand Colors
 * Centralized color constants to eliminate magic numbers and ensure consistency
 */
export const COLORS = {
    PRIMARY: "#00FF00",
    PRIMARY_DARK: "#00AA00",
    SECONDARY: "#FFD700",
    SECONDARY_DARK: "#B8860B",
    BACKGROUND: "#121212",
    BACKGROUND_ALT: "#0a0a0a",
    WHITE: "#FFFFFF",
} as const

/**
 * Animation Configurations
 * Shared spring and timing configurations for Framer Motion
 */
export const ANIMATION = {
    SPRING_CONFIG: { stiffness: 100, damping: 30, restDelta: 0.001 },
    SPRING_FAST: { stiffness: 400, damping: 17 },
    SPRING_MEDIUM: { stiffness: 300, damping: 20 },
    SPRING_GENTLE: { stiffness: 100, damping: 20 },
    EASE_OUT: [0.25, 0.4, 0.25, 1] as const,
    DURATION_FAST: 0.3,
    DURATION_MEDIUM: 0.6,
    DURATION_SLOW: 0.8,
} as const

/**
 * Common Animation Variants
 * Reusable animation variant objects for Framer Motion
 */
export const FADE_UP_VARIANTS = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: delay * 0.1,
            duration: ANIMATION.DURATION_SLOW,
            ease: ANIMATION.EASE_OUT,
        },
    }),
} as const

export const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15,
        },
    },
} as const

export const ITEM_VARIANTS = {
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
} as const

/**
 * External Links
 */
export const EXTERNAL_LINKS = {
    WHATSAPP: "https://wa.me/527824127509",
} as const

/**
 * Footer Navigation Links
 */
export const FOOTER_LINKS = [
    {
        title: "Productos",
        links: ["Sensu", "Próximamente"],
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
] as const
