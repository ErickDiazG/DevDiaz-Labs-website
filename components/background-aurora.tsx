"use client"

/**
 * BackgroundAurora Component - LIGHT THEME VERSION
 * 
 * A pure CSS-animated aurora background effect for light themes.
 * Separated from Hero for Single Responsibility Principle (SRP).
 * 
 * Features:
 * - Ultra-slow gradient animation (20s+ cycle) for "breathing" effect
 * - GPU-accelerated using transform/opacity only (no reflows)
 * - Layered with technical grid overlay
 * - Designed for white backgrounds with subtle green pastel accents
 */

export function BackgroundAurora() {
    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Base Layer - Pure White */}
            <div className="absolute inset-0 bg-white" />

            {/* Primary Aurora Layer - Subtle pastel green glow */}
            <div
                className="absolute inset-0 opacity-50 animate-aurora"
                style={{
                    background: `
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,255,0,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 30% 80%, rgba(0,220,100,0.05) 0%, transparent 40%),
            radial-gradient(ellipse 50% 40% at 70% 90%, rgba(100,255,150,0.06) 0%, transparent 35%)
          `
                }}
            />

            {/* Secondary Pulse Layer - Top accent */}
            <div
                className="absolute inset-0 opacity-30 animate-aurora-secondary"
                style={{
                    background: `
            radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,255,0,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0,200,80,0.04) 0%, transparent 30%)
          `
                }}
            />

            {/* Soft ambient glow - center focus */}
            <div
                className="absolute inset-0 animate-aurora-pulse"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,0,0.04) 0%, transparent 60%)'
                }}
            />

            {/* Technical Grid Overlay - Green on white */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"
                style={{
                    maskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 40%, transparent 90%)'
                }}
            />

            {/* Subtle vignette for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(255,255,255,0.8) 100%)'
                }}
            />
        </div>
    )
}
