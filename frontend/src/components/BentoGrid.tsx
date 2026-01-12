"use client"

import React from "react"
import { Zap, Lock, Crosshair, FileOutput, ArrowUpRight, Sparkles, Layers } from "lucide-react"

export function BentoGrid() {
    return (
        <section className="py-24 relative">
            {/* Section Header */}
            <div className="text-center space-y-4 mb-16 px-4">
                <div className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-400 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]">
                    <Layers className="mr-2 h-3.5 w-3.5" />
                    Core Capabilities
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="block text-white">Everything you need to</span>
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                        Master Your Finances
                    </span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Enterprise-grade extraction power wrapped in a beautiful, intuitive interface.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full px-4">

                {/* Card 1: Instant Extraction (Large, Top Left) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-[2.5rem] p-10 relative overflow-hidden group border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl transition-all duration-500 hover:border-green-500/30 hover:shadow-[0_0_50px_-10px_rgba(34,197,94,0.15)]">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                        <Zap className="w-80 h-80 text-green-400" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-lg shadow-green-900/20 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="w-7 h-7 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                                    Instant Extraction
                                </h3>
                                <p className="text-muted-foreground/90 text-lg leading-relaxed max-w-md">
                                    Paste any text—SMS, email, or WhatsApp—and watch our AI instantly structure it into clean financial data.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="inline-flex items-center gap-2 text-green-400 font-medium bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                                <Sparkles className="w-4 h-4" />
                                <span>Powered by GPT-4o</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Security (Tall, Top Right) */}
                <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-2 rounded-[2.5rem] p-8 relative overflow-hidden group border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.15)]">
                    <div className="absolute -bottom-10 -right-10 p-10 opacity-5 group-hover:opacity-15 transition-all duration-500 group-hover:scale-110">
                        <Lock className="w-56 h-56 text-blue-400" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                                <Lock className="w-7 h-7 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Bank-Grade Security</h3>
                                <p className="text-muted-foreground/80 leading-relaxed">
                                    AES-256 bit encryption. We support Chase, Amex, and 2,000+ others.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs text-blue-300 font-mono uppercase tracking-wider">Encrypted</span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Accuracy (Standard, Right Middle) */}
                <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 rounded-[2.5rem] p-8 relative overflow-hidden group border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]">
                    <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-15 transition-all duration-500">
                        <Crosshair className="w-40 h-40 text-emerald-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <Crosshair className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">99.9% Accuracy</h3>
                        <p className="text-xs text-emerald-400 font-mono">
                            Confidence Score &gt; 0.98
                        </p>
                    </div>
                </div>

                {/* Card 4: Universal Export (Wide, Bottom) */}
                <a href="#extraction" className="col-span-1 md:col-span-3 lg:col-span-4 row-span-1 rounded-[2.5rem] p-8 relative overflow-hidden group border border-white/10 bg-gradient-to-br from-orange-500/10 to-background backdrop-blur-xl transition-all duration-500 hover:border-orange-500/40 hover:shadow-[0_0_50px_-10px_rgba(249,115,22,0.2)] block cursor-pointer">
                    <div className="absolute top-0 right-0 p-8">
                        <div className="bg-white/10 p-2 rounded-full border border-white/10 group-hover:bg-white/20 group-hover:scale-110 transition-all">
                            <ArrowUpRight className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10 h-full">
                        <div className="w-16 h-16 rounded-3xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-900/20 group-hover:rotate-12 transition-transform duration-500">
                            <FileOutput className="h-8 w-8" />
                        </div>

                        <div className="flex-1">
                            <h4 className="text-2xl font-bold text-white mb-2">
                                Universal Export
                            </h4>
                            <p className="text-muted-foreground/80 max-w-2xl text-lg">
                                One-click export to your favorite tools. Compatible with everything.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                            {["CSV", "PDF", "JSON", "Excel", "QuickBooks"].map((fmt) => (
                                <div key={fmt} className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-orange-200/80 group-hover:border-orange-500/30 group-hover:text-orange-200 transition-colors">
                                    .{fmt}
                                </div>
                            ))}
                        </div>
                    </div>
                </a>
            </div>
        </section>
    )
}
