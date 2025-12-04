"use client"

import { LogOut, User, Trophy } from "lucide-react"
import { signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

interface NavbarProps {
    userName: string
    userEmail: string
    userRole: string
}

export function Navbar({ userName, userEmail, userRole }: NavbarProps) {
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    async function handleLogout() {
        await signOut({ callbackUrl: "/login" })
    }

    return (
        <nav className="border-b bg-white dark:bg-gray-950 px-6 py-3 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-primary">
                        Thesis Track & Compare
                    </h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">
                        {userRole === "ESTUDIANTE" ? "Dashboard Estudiante" : "Dashboard Asesor"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userEmail}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <a href="/ranking" className="cursor-pointer">
                                    <Trophy className="mr-2 h-4 w-4" />
                                    <span>Ver Ranking</span>
                                </a>
                            </DropdownMenuItem>
                            {/* 
                            <DropdownMenuItem asChild>
                                <a href="/perfil" className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Mi Perfil</span>
                                </a>
                            </DropdownMenuItem>
                            */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}
