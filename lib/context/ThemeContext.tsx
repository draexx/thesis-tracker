"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type ThemeMode = "FORMAL" | "GAMIFICACION"

interface ThemeContextType {
    theme: ThemeMode
    toggleTheme: () => void
    isFormal: boolean
    isGamification: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeMode>("FORMAL")

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme-mode") as ThemeMode
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("theme-mode", theme)
        // Update body class for global styles if needed
        document.body.classList.remove("theme-formal", "theme-gamificacion")
        document.body.classList.add(`theme-${theme.toLowerCase()}`)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === "FORMAL" ? "GAMIFICACION" : "FORMAL"))
    }

    const isFormal = theme === "FORMAL"
    const isGamification = theme === "GAMIFICACION"

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isFormal, isGamification }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
