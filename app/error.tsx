"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to console in development
        console.error("Error page:", error)

        // In production, send to error tracking service
        // Example: Sentry.captureException(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                        <CardTitle>Error del servidor</CardTitle>
                    </div>
                    <CardDescription>
                        Ha ocurrido un error al procesar tu solicitud
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {process.env.NODE_ENV === "development" && (
                        <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm font-mono text-destructive">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={reset}
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
