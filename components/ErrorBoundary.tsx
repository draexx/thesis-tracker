"use client"

import { Component, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        console.error("ErrorBoundary caught an error:", error, errorInfo)

        // In production, you would send this to an error tracking service
        // Example: Sentry.captureException(error)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-6 w-6" />
                                <CardTitle>Algo salió mal</CardTitle>
                            </div>
                            <CardDescription>
                                Ha ocurrido un error inesperado en la aplicación
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {process.env.NODE_ENV === "development" && this.state.error && (
                                <div className="bg-muted p-3 rounded-md">
                                    <p className="text-sm font-mono text-destructive">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => this.setState({ hasError: false, error: null })}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Intentar de nuevo
                                </Button>
                                <Button
                                    onClick={() => window.location.href = "/"}
                                    className="flex-1"
                                >
                                    Ir al inicio
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}
