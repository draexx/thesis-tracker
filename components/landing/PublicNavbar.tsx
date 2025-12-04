"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"

export const PublicNavbar = () => {
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-3"
                    : "bg-transparent py-5"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                        Thesis Track & Compare
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="hidden sm:flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Iniciar Sesión</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Comenzar</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}
