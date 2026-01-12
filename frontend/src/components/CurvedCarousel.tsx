"use client"

import React, { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Receipt, FileText, FileSpreadsheet, Building2, Wallet, Landmark, ScanLine, BrainCircuit, Share2, Printer, Smartphone, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"

// The "Vessify Ecosystem" - Extraction Story
const items = [
    { name: "Receipt Scans", sub: "OCR Extraction", icon: ScanLine, color: "bg-blue-600" },
    { name: "PDF Invoices", sub: "Auto-Parsing", icon: FileText, color: "bg-red-500" },
    { name: "Bank Feeds", sub: "Live Sync", icon: Building2, color: "bg-green-600" },
    { name: "Excel Export", sub: ".XLSX / .CSV", icon: FileSpreadsheet, color: "bg-green-700" },
    { name: "QuickBooks", sub: "Direct Integration", icon: Printer, color: "bg-emerald-600" },
    { name: "Gmail", sub: "Email Parsing", icon: MessageSquare, color: "bg-red-600" },
    { name: "Uber / Lyft", sub: "Ride-Share API", icon: Smartphone, color: "bg-black" },
    { name: "Crypto Wallets", sub: "Chain Analysis", icon: Wallet, color: "bg-indigo-600" },
    { name: "WhatsApp", sub: "Chat Extraction", icon: MessageSquare, color: "bg-green-500" },
    { name: "Amazon", sub: "Order History", icon: ShoppingBagIcon, color: "bg-orange-500" },
    { name: "Stripe", sub: "Payment Data", icon: CreditCardIcon, color: "bg-violet-600" },
    { name: "Expense Reports", sub: "Auto-Generated", icon: FileText, color: "bg-amber-600" },
]

export function CurvedCarousel() {
    const [rotation, setRotation] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const ANGLE_PER_ITEM = 360 / items.length

    /* Auto-rotation removed for control */
    /* useEffect(() => {
        if (isPaused) return
        const interval = setInterval(() => {
            setRotation((prev) => prev - 0.2)
        }, 20)
        return () => clearInterval(interval)
    }, [isPaused]) */

    const handlePrev = () => {
        setRotation((prev) => prev + ANGLE_PER_ITEM)
    }

    const handleNext = () => {
        setRotation((prev) => prev - ANGLE_PER_ITEM)
    }

    return (
        <div
            className="relative w-full py-20 overflow-hidden flex flex-col items-center justify-center perspective-[1000px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

            <div className="mb-12 text-center space-y-4 relative z-20 px-4">
                <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
                    <Share2 className="mr-2 h-3.5 w-3.5" />
                    Universal Compatibility
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="block text-white">Seamlessly Integrates with</span>
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                        Your Entire Stack
                    </span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                    From major banks to niche crypto wallets. Vessify speaks every financial language perfectly.
                </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

            {/* Navigation Arrows */}
            <div className="absolute z-20 top-1/2 -translate-y-1/2 w-full max-w-[900px] px-4 flex justify-between pointer-events-none">
                <button
                    onClick={handlePrev}
                    className="pointer-events-auto h-12 w-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all hover:scale-110 group shadow-xl"
                    aria-label="Previous"
                >
                    <ChevronLeft className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
                </button>
                <button
                    onClick={handleNext}
                    className="pointer-events-auto h-12 w-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all hover:scale-110 group shadow-xl"
                    aria-label="Next"
                >
                    <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
                </button>
            </div>

            {/* 3D Carousel */}
            <div
                ref={containerRef}
                className="relative w-[800px] h-[300px] preserve-3d transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1)"
                style={{ transform: `rotateY(${rotation}deg)` }}
            >
                {items.map((item, index) => {
                    const angle = index * ANGLE_PER_ITEM

                    // Calculate position relative to front (0deg)
                    const currentRotation = (angle + rotation) % 360
                    const normalizedRotation = ((currentRotation + 540) % 360) - 180
                    const distanceFromFront = Math.abs(normalizedRotation)

                    // Spotlight Logic: Only show Front and huge Neighbor fade
                    const isFront = distanceFromFront < 25
                    const isNeighbor = distanceFromFront < 60 && !isFront
                    const isVisible = distanceFromFront < 100 // Hide back completely

                    if (!isVisible) return null // Dont render back clutter

                    return (
                        <div
                            key={index}
                            className="absolute left-1/2 top-1/2 -ml-28 -mt-20 transition-all duration-500 ease-out"
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(450px) scale(${isFront ? 1 : 0.85})`,
                                opacity: isFront ? 1 : isNeighbor ? 0.6 : 0,
                                filter: `blur(${isFront ? 0 : isNeighbor ? 2 : 10}px)`,
                                zIndex: isFront ? 50 : 0,
                                pointerEvents: isFront ? "auto" : "none"
                            }}
                        >
                            {/* Interactive Vault Card */}
                            <div
                                className={cn(
                                    "w-56 h-40 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-2xl border backdrop-blur-xl transition-all duration-300 group cursor-pointer",
                                    isFront
                                        ? "border-white/40 bg-gradient-to-br from-white/15 to-white/5 shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]"
                                        : "border-white/5 bg-gradient-to-br from-white/5 to-white/[0.01]"
                                )}>
                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg mb-1 transition-transform",
                                    isFront ? "scale-110" : "scale-100",
                                    item.color
                                )}>
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <span className={cn("block text-base font-bold text-white tracking-wide transition-colors", isFront ? "text-white" : "text-white/50")}>
                                        {item.name}
                                    </span>
                                    <span className={cn("block text-xs font-medium uppercase tracking-wider mt-1", isFront ? "text-white/70" : "text-white/20")}>
                                        {item.sub}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

function ShoppingBagIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    )
}

function CreditCardIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
    )
}
