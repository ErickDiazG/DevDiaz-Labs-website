"use client"

import { useEffect, useRef, useCallback } from "react"

/**
 * InteractiveGrid Component - NEURAL NETWORK / CONSTELLATION
 * 
 * OPTIMIZED VERSION for 60 FPS on mid-range devices.
 * 
 * Key optimizations:
 * - Responsive particle count (70/50/25 for desktop/tablet/mobile)
 * - Early break in O(n²) loop using X/Y distance before sqrt
 * - Reduced connection distance to limit line calculations
 * - Proper cleanup on unmount
 */

// ============================================
// CONFIGURATION - CALIBRATED FOR VISUAL DENSITY + PERFORMANCE
// ============================================

// Responsive particle distribution (4 tiers for fine-tuned density)
const PARTICLES_DESKTOP_LARGE = 115    // Desktop Grande >1400px: dense "neural network" look
const PARTICLES_LAPTOP = 75            // Laptop Estándar 1024-1400px: balanced for i5 CPUs
const PARTICLES_TABLET = 45            // Tablet 768-1024px: light
const PARTICLES_MOBILE = 28            // Mobile <768px: minimal (performance priority)

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const LAPTOP_BREAKPOINT = 1400

// Physics (tuned for smoothness)
const MOUSE_RADIUS = 280
const PUSH_STRENGTH = 1.5
const RETURN_FORCE = 0.008
const FRICTION = 0.92
const MAX_VELOCITY = 15

// Connections - REDUCED distance compensates for more particles
// Shorter connections = O(n²) stays manageable even with 115 particles
const CONNECTION_DISTANCE = 110        // Shorter = fewer lines per particle = faster
const LINE_WIDTH_BASE = 1
const LINE_WIDTH_ACTIVE = 2.5

// Colors & Sizes
const NODE_SIZE_BASE = 2.5
const NODE_SIZE_ACTIVE = 6
const COLOR_GRAY = { r: 150, g: 150, b: 150 }
const COLOR_NEON = { r: 0, g: 255, b: 0 }
const BASE_OPACITY = 0.45
const ACTIVE_OPACITY = 1

interface Particle {
    x: number
    y: number
    originX: number
    originY: number
    vx: number
    vy: number
    activation: number
}

// Utility: Lerp for smooth interpolation
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Get responsive particle count based on screen width (4 tiers)
const getParticleCount = (width: number): number => {
    if (width < MOBILE_BREAKPOINT) return PARTICLES_MOBILE      // <768px
    if (width < TABLET_BREAKPOINT) return PARTICLES_TABLET      // 768-1023px
    if (width < LAPTOP_BREAKPOINT) return PARTICLES_LAPTOP      // 1024-1399px
    return PARTICLES_DESKTOP_LARGE                               // ≥1400px
}

export function InteractiveGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const animationFrameRef = useRef<number>(0)
    const dimensionsRef = useRef({ width: 0, height: 0 })
    const isUnmountedRef = useRef(false)

    // Initialize particles with responsive count
    const initializeParticles = useCallback((width: number, height: number) => {
        const count = getParticleCount(width)
        const particles: Particle[] = []

        // Distribute particles randomly across viewport
        for (let i = 0; i < count; i++) {
            const x = Math.random() * width
            const y = Math.random() * height

            particles.push({
                x,
                y,
                originX: x,
                originY: y,
                vx: 0,
                vy: 0,
                activation: 0,
            })
        }

        particlesRef.current = particles
        dimensionsRef.current = { width, height }
    }, [])

    // Resize handler
    const handleResize = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const dpr = window.devicePixelRatio || 1
        const width = window.innerWidth
        const height = window.innerHeight

        canvas.width = width * dpr
        canvas.height = height * dpr
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        const ctx = canvas.getContext("2d")
        if (ctx) ctx.scale(dpr, dpr)

        initializeParticles(width, height)
    }, [initializeParticles])

    // Mouse handlers
    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY }
    }, [])

    const handleMouseLeave = useCallback(() => {
        mouseRef.current = { x: -1000, y: -1000 }
    }, [])

    // Touch support
    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches.length > 0) {
            mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }
    }, [])

    const handleTouchEnd = useCallback(() => {
        mouseRef.current = { x: -1000, y: -1000 }
    }, [])

    // Main animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        const { width, height } = dimensionsRef.current
        const mouse = mouseRef.current
        const particles = particlesRef.current
        const mouseRadiusSq = MOUSE_RADIUS * MOUSE_RADIUS
        const connectionDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE

        // Clear canvas
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, width, height)

        // ========== PHYSICS UPDATE ==========
        for (const p of particles) {
            // Mouse influence
            const dx = mouse.x - p.x
            const dy = mouse.y - p.y
            const distSq = dx * dx + dy * dy

            if (distSq < mouseRadiusSq && distSq > 1) {
                const dist = Math.sqrt(distSq)
                const influence = Math.pow(1 - dist / MOUSE_RADIUS, 2)

                // Repel from mouse
                const angle = Math.atan2(dy, dx)
                const force = influence * PUSH_STRENGTH * (MOUSE_RADIUS / dist) * 0.3
                p.vx -= Math.cos(angle) * force
                p.vy -= Math.sin(angle) * force

                // Update activation
                p.activation = lerp(p.activation, influence, 0.2)
            } else {
                p.activation *= 0.95
            }

            // Spring to origin
            p.vx += (p.originX - p.x) * RETURN_FORCE
            p.vy += (p.originY - p.y) * RETURN_FORCE

            // Friction
            p.vx *= FRICTION
            p.vy *= FRICTION

            // Clamp velocity
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
            if (speed > MAX_VELOCITY) {
                p.vx = (p.vx / speed) * MAX_VELOCITY
                p.vy = (p.vy / speed) * MAX_VELOCITY
            }

            // Update position
            p.x += p.vx
            p.y += p.vy
        }

        // ========== RENDER CONNECTIONS (OPTIMIZED) ==========
        // Early break optimization: check X/Y distance before calculating hypotenuse
        // This avoids expensive Math.sqrt calls for distant particles

        // Reset shadow once for performance
        ctx.shadowBlur = 0

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i]

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j]

                // EARLY BREAK: Check individual axis distance first
                // If X or Y distance already exceeds threshold, skip sqrt calculation
                const dx = p2.x - p1.x
                if (dx > CONNECTION_DISTANCE || dx < -CONNECTION_DISTANCE) continue

                const dy = p2.y - p1.y
                if (dy > CONNECTION_DISTANCE || dy < -CONNECTION_DISTANCE) continue

                const distSq = dx * dx + dy * dy

                if (distSq < connectionDistSq) {
                    const dist = Math.sqrt(distSq)

                    // Opacity based on distance (closer = more visible)
                    const proximityFactor = 1 - dist / CONNECTION_DISTANCE

                    // Check if either particle is activated (near mouse)
                    const jointActivation = Math.max(p1.activation, p2.activation)

                    // Color interpolation
                    const r = Math.round(lerp(COLOR_GRAY.r, COLOR_NEON.r, jointActivation))
                    const g = Math.round(lerp(COLOR_GRAY.g, COLOR_NEON.g, jointActivation))
                    const b = Math.round(lerp(COLOR_GRAY.b, COLOR_NEON.b, jointActivation))

                    // Opacity: base proximity + activation boost
                    const opacity = proximityFactor * lerp(BASE_OPACITY, ACTIVE_OPACITY, jointActivation)

                    // Line width: thicker when active
                    const lineWidth = lerp(LINE_WIDTH_BASE, LINE_WIDTH_ACTIVE, jointActivation)

                    // Draw connection line
                    ctx.beginPath()
                    ctx.moveTo(p1.x, p1.y)
                    ctx.lineTo(p2.x, p2.y)
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
                    ctx.lineWidth = lineWidth

                    // Add glow only for significantly active connections (reduces shadow calculations)
                    if (jointActivation > 0.2) {
                        ctx.shadowColor = `rgba(0, 255, 0, ${jointActivation * 0.7})`
                        ctx.shadowBlur = jointActivation * 15
                        ctx.stroke()
                        ctx.shadowBlur = 0
                    } else {
                        ctx.stroke()
                    }
                }
            }
        }

        // ========== RENDER NODES (OPTIMIZED) ==========
        // Reset shadow state once before loop
        ctx.shadowBlur = 0

        for (const p of particles) {
            const a = Math.min(p.activation, 1)

            // Color
            const r = Math.round(lerp(COLOR_GRAY.r, COLOR_NEON.r, a))
            const g = Math.round(lerp(COLOR_GRAY.g, COLOR_NEON.g, a))
            const b = Math.round(lerp(COLOR_GRAY.b, COLOR_NEON.b, a))
            const opacity = lerp(BASE_OPACITY + 0.15, ACTIVE_OPACITY, a)

            // Dynamic size
            const size = lerp(NODE_SIZE_BASE, NODE_SIZE_ACTIVE, a)

            // Draw node
            ctx.beginPath()
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`

            // Glow effect only for significantly active nodes (performance)
            if (a > 0.15) {
                ctx.shadowColor = `rgba(0, 255, 0, ${a * 0.8})`
                ctx.shadowBlur = a * 18
                ctx.fill()
                ctx.shadowBlur = 0
            } else {
                ctx.fill()
            }
        }

        // Continue animation loop only if not unmounted
        if (!isUnmountedRef.current) {
            animationFrameRef.current = requestAnimationFrame(animate)
        }
    }, [])

    // Setup and cleanup
    useEffect(() => {
        isUnmountedRef.current = false
        handleResize()

        window.addEventListener("resize", handleResize)
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseleave", handleMouseLeave)
        window.addEventListener("touchmove", handleTouchMove, { passive: true })
        window.addEventListener("touchend", handleTouchEnd)

        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            // Mark as unmounted to stop animation loop
            isUnmountedRef.current = true

            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseleave", handleMouseLeave)
            window.removeEventListener("touchmove", handleTouchMove)
            window.removeEventListener("touchend", handleTouchEnd)

            // Cancel any pending animation frame
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [handleResize, handleMouseMove, handleMouseLeave, handleTouchMove, handleTouchEnd, animate])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    )
}
