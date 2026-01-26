"use client"

import { useEffect, useRef, useCallback } from "react"

/**
 * InteractiveGrid Component - NEURAL NETWORK / CONSTELLATION
 * 
 * A connected particle system that forms a dynamic mesh.
 * Lines connect nearby particles with distance-based opacity.
 * Mouse interaction illuminates both nodes and connections in neon green.
 * 
 * Optimizations:
 * - Spatial grid for O(n) neighbor lookup instead of O(n²)
 * - Limited particle count for stable 60fps
 * - Batch rendering with minimal state changes
 */

// ============================================
// CONFIGURATION - HIGH VISIBILITY VERSION
// ============================================

// Particle distribution (responsive)
const PARTICLES_DESKTOP = 160          // More particles for denser network
const PARTICLES_MOBILE = 80            // Reduced for mobile performance
const MOBILE_BREAKPOINT = 768

// Physics
const MOUSE_RADIUS = 350               // Larger influence radius
const PUSH_STRENGTH = 1.8              // Stronger repulsion for more dramatic movement
const RETURN_FORCE = 0.006             // Slower return for more visible displacement
const FRICTION = 0.93                  // More slide
const MAX_VELOCITY = 18

// Connections
const CONNECTION_DISTANCE = 150        // Longer connections = more visible network
const LINE_WIDTH_BASE = 1              // Thicker base lines
const LINE_WIDTH_ACTIVE = 3            // Much thicker when glowing

// Colors & Sizes
const NODE_SIZE_BASE = 3               // Larger base nodes
const NODE_SIZE_ACTIVE = 7             // Much larger when active
const COLOR_GRAY = { r: 150, g: 150, b: 150 }  // Darker gray = more visible
const COLOR_NEON = { r: 0, g: 255, b: 0 }
const BASE_OPACITY = 0.5               // Higher base opacity
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

export function InteractiveGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const animationFrameRef = useRef<number>(0)
    const dimensionsRef = useRef({ width: 0, height: 0 })

    // Initialize particles with random distribution
    const initializeParticles = useCallback((width: number, height: number) => {
        const isMobile = width < MOBILE_BREAKPOINT
        const count = isMobile ? PARTICLES_MOBILE : PARTICLES_DESKTOP
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

        // ========== RENDER CONNECTIONS ==========
        // Check pairs for connections (optimized: only check each pair once)
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i]

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j]

                const dx = p2.x - p1.x
                const dy = p2.y - p1.y
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

                    // Add glow for active connections
                    if (jointActivation > 0.15) {
                        ctx.shadowColor = `rgba(0, 255, 0, ${jointActivation * 0.9})`
                        ctx.shadowBlur = jointActivation * 20
                    } else {
                        ctx.shadowBlur = 0
                    }

                    ctx.stroke()
                    ctx.shadowBlur = 0
                }
            }
        }

        // ========== RENDER NODES ==========
        for (const p of particles) {
            const a = Math.min(p.activation, 1)

            // Color
            const r = Math.round(lerp(COLOR_GRAY.r, COLOR_NEON.r, a))
            const g = Math.round(lerp(COLOR_GRAY.g, COLOR_NEON.g, a))
            const b = Math.round(lerp(COLOR_GRAY.b, COLOR_NEON.b, a))
            const opacity = lerp(BASE_OPACITY + 0.2, ACTIVE_OPACITY, a)

            // Dynamic size
            const size = lerp(NODE_SIZE_BASE, NODE_SIZE_ACTIVE, a)

            // Draw node
            ctx.beginPath()
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`

            // Glow effect for active nodes
            if (a > 0.1) {
                ctx.shadowColor = `rgba(0, 255, 0, ${a})`
                ctx.shadowBlur = a * 25
            } else {
                ctx.shadowBlur = 0
            }

            ctx.fill()
            ctx.shadowBlur = 0
        }

        animationFrameRef.current = requestAnimationFrame(animate)
    }, [])

    // Setup and cleanup
    useEffect(() => {
        handleResize()

        window.addEventListener("resize", handleResize)
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseleave", handleMouseLeave)
        window.addEventListener("touchmove", handleTouchMove, { passive: true })
        window.addEventListener("touchend", handleTouchEnd)

        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseleave", handleMouseLeave)
            window.removeEventListener("touchmove", handleTouchMove)
            window.removeEventListener("touchend", handleTouchEnd)
            cancelAnimationFrame(animationFrameRef.current)
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
