"use client"

import React from "react"
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="relative w-full border-t border-white/10 bg-black/40 backdrop-blur-xl mt-24">
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold tracking-tight text-white">Vessify</h2>
                        </div>
                        <p className="text-muted-foreground/60 max-w-xs text-sm leading-relaxed">
                            The AI-powered financial extraction engine for modern businesses. Turn chaos into clear, structured data.
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground/60">
                            <li><a href="#" className="hover:text-primary transition-colors">Extraction</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground/60">
                            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground/40">
                        © 2024 Vessify Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground/40">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        </footer>
    )
}
